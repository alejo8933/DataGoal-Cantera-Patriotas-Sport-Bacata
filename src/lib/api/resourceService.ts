import { createClient } from '@/lib/supabase/server'
import { getUserProfile } from '@/services/actions/auth'
import { getResourceConfig, type ResourceConfig } from './resourceConfig'
import { canPerformOperation, type UserRole } from './rbac.config'
import { validateResourcePayload } from './schemas'
import { getServiceForResource } from './serviceDispatcher'
import { z } from 'zod'

export class ApiError extends Error {
  status: number

  constructor(message: string, status = 400) {
    super(message)
    this.status = status
  }
}

export interface AuthenticatedUser {
  id: string
  email: string
  rol: UserRole
  activo: boolean
}

const ID_PATTERN = /^[a-zA-Z0-9_-]+$/

function validateId(id: string) {
  return typeof id === 'string' && id.length > 0 && ID_PATTERN.test(id)
}

function buildQuery<T extends ResourceConfig>(config: T, supabase: ReturnType<typeof createClient>, params: URLSearchParams) {
  let query = supabase.from(config.tableName).select('*')

  for (const [name, value] of params.entries()) {
    if (name === 'limit' || name === 'offset' || name === 'orderBy' || name === 'sort') {
      continue
    }
    if (!config.columns.includes(name)) {
      continue
    }
    query = query.eq(name, value)
  }

  if (params.has('orderBy') && config.columns.includes(params.get('orderBy') || '')) {
    query = query.order(params.get('orderBy') || config.defaultOrder?.column || 'id', {
      ascending: params.get('sort') !== 'desc',
    })
  } else if (config.defaultOrder) {
    query = query.order(config.defaultOrder.column, { ascending: config.defaultOrder.ascending })
  }

  const limit = params.get('limit')
  const offset = params.get('offset')
  if (limit) {
    const limitValue = Number(limit)
    const offsetValue = Number(offset ?? 0)
    if (!Number.isNaN(limitValue) && limitValue >= 0 && !Number.isNaN(offsetValue) && offsetValue >= 0) {
      query = query.range(offsetValue, offsetValue + limitValue - 1)
    }
  }

  return query
}

function sanitizePayload(payload: unknown, allowedColumns: string[]) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    throw new ApiError('El cuerpo de la petición debe ser un objeto JSON válido.', 400)
  }

  return Object.entries(payload).reduce<Record<string, unknown>>((acc, [key, value]) => {
    if (allowedColumns.includes(key)) {
      acc[key] = value
    }
    return acc
  }, {})
}

export async function requireAuthenticatedUser(): Promise<AuthenticatedUser> {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data.user) {
    throw new ApiError('No autorizado. Inicia sesión para acceder a esta API.', 401)
  }

  // Obtiene el perfil del usuario con su rol
  const profile = await getUserProfile(data.user.id)
  
  return {
    id: data.user.id,
    email: data.user.email || '',
    rol: (profile?.rol || 'jugador') as UserRole,
    activo: profile?.activo ?? true,
  }
}

/**
 * Obtiene el usuario autenticado con su rol y verifica que tiene permiso para la operación
 * @param resource - El recurso que intenta acceder
 * @param operation - La operación que intenta realizar
 * @returns El usuario autenticado con su rol
 * @throws ApiError si no está autenticado o no tiene permiso
 */
export async function requireAuthenticatedUserWithRole(
  resource: string,
  operation: 'list' | 'get' | 'create' | 'update' | 'delete'
): Promise<AuthenticatedUser> {
  const user = await requireAuthenticatedUser()

  // Verifica que el usuario está activo
  if (!user.activo) {
    throw new ApiError('Tu usuario ha sido desactivado. Contacta al administrador.', 403)
  }

  // Verifica RBAC
  if (!canPerformOperation(user.rol, resource, operation)) {
    throw new ApiError(
      `No tienes permiso para ${operation} este recurso. Rol: ${user.rol}`,
      403
    )
  }

  return user
}

export async function listResource(resource: string, searchParams: URLSearchParams, user: AuthenticatedUser) {
  const config = getResourceConfig(resource)
  if (!config) {
    throw new ApiError(`Recurso desconocido: ${resource}`, 404)
  }
  if (!config.operations.list) {
    throw new ApiError(`Listado no permitido para el recurso: ${resource}`, 403)
  }

  // Intenta usar el servicio de negocio si existe
  const service = getServiceForResource(resource)
  if (service?.getAll) {
    try {
      return await service.getAll()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error en el servicio'
      throw new ApiError(message, 500)
    }
  }

  // Fallback: acceso directo a Supabase
  const supabase = await createClient()
  const query = buildQuery(config, supabase, searchParams)
  const { data, error } = await query
  if (error) {
    throw new ApiError(error.message, 500)
  }
  return data ?? []
}

export async function getResourceById(resource: string, id: string, user: AuthenticatedUser) {
  if (!validateId(id)) {
    throw new ApiError('El identificador proporcionado no es válido.', 400)
  }

  const config = getResourceConfig(resource)
  if (!config) {
    throw new ApiError(`Recurso desconocido: ${resource}`, 404)
  }
  if (!config.operations.get) {
    throw new ApiError(`Acceso no permitido para el recurso: ${resource}`, 403)
  }

  // Intenta usar el servicio de negocio si existe
  const service = getServiceForResource(resource)
  if (service?.getById) {
    try {
      return await service.getById(id)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error en el servicio'
      throw new ApiError(message, 500)
    }
  }

  // Fallback: acceso directo a Supabase
  const supabase = await createClient()
  const { data, error } = await supabase.from(config.tableName).select('*').eq('id', id).maybeSingle()
  if (error) {
    throw new ApiError(error.message, 500)
  }
  return data
}

export async function createResource(resource: string, payload: unknown, user: AuthenticatedUser) {
  const config = getResourceConfig(resource)
  if (!config) {
    throw new ApiError(`Recurso desconocido: ${resource}`, 404)
  }
  if (!config.operations.create) {
    throw new ApiError(`Creación no permitida para el recurso: ${resource}`, 403)
  }

  // Valida el payload contra el esquema Zod del recurso
  let validatedData: any
  try {
    validatedData = validateResourcePayload(resource, payload)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const message = error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('; ')
      throw new ApiError(`Validación fallida: ${message}`, 400)
    }
    throw new ApiError(error instanceof Error ? error.message : 'Error en validación', 400)
  }

  // Intenta usar el servicio de negocio si existe
  const service = getServiceForResource(resource)
  if (service?.create) {
    try {
      return await service.create(validatedData)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error en el servicio'
      throw new ApiError(message, 500)
    }
  }

  // Fallback: acceso directo a Supabase con campos permitidos
  const record = sanitizePayload(validatedData, config.writableColumns)
  if (Object.keys(record).length === 0) {
    throw new ApiError('No se han proporcionado campos válidos para crear el recurso.', 400)
  }

  const supabase = await createClient()
  const { data, error } = await supabase.from(config.tableName).insert(record).select().single()
  if (error) {
    throw new ApiError(error.message, 400)
  }

  return data
}

export async function updateResource(resource: string, id: string, payload: unknown, user: AuthenticatedUser) {
  if (!validateId(id)) {
    throw new ApiError('El identificador proporcionado no es válido.', 400)
  }

  const config = getResourceConfig(resource)
  if (!config) {
    throw new ApiError(`Recurso desconocido: ${resource}`, 404)
  }
  if (!config.operations.update) {
    throw new ApiError(`Actualización no permitida para el recurso: ${resource}`, 403)
  }

  // Valida el payload contra el esquema Zod del recurso
  let validatedData: any
  try {
    // Para updates, reutilizamos el esquema pero lo hacemos parcial
    validatedData = validateResourcePayload(resource, payload)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const message = error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('; ')
      throw new ApiError(`Validación fallida: ${message}`, 400)
    }
    throw new ApiError(error instanceof Error ? error.message : 'Error en validación', 400)
  }

  // Intenta usar el servicio de negocio si existe
  const service = getServiceForResource(resource)
  if (service?.update) {
    try {
      return await service.update(id, validatedData)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error en el servicio'
      throw new ApiError(message, 500)
    }
  }

  // Fallback: acceso directo a Supabase
  const record = sanitizePayload(validatedData, config.writableColumns)
  if (Object.keys(record).length === 0) {
    throw new ApiError('No se han proporcionado campos válidos para actualizar el recurso.', 400)
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from(config.tableName)
    .update(record)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw new ApiError(error.message, 400)
  }

  return data
}

export async function deleteResource(resource: string, id: string, user: AuthenticatedUser) {
  if (!validateId(id)) {
    throw new ApiError('El identificador proporcionado no es válido.', 400)
  }

  const config = getResourceConfig(resource)
  if (!config) {
    throw new ApiError(`Recurso desconocido: ${resource}`, 404)
  }
  if (!config.operations.delete) {
    throw new ApiError(`Eliminación no permitida para el recurso: ${resource}`, 403)
  }

  // Intenta usar el servicio de negocio si existe
  const service = getServiceForResource(resource)
  if (service?.delete) {
    try {
      await service.delete(id)
      return { success: true }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error en el servicio'
      throw new ApiError(message, 500)
    }
  }

  // Fallback: acceso directo a Supabase
  const supabase = await createClient()
  const { error } = await supabase.from(config.tableName).delete().eq('id', id)
  if (error) {
    throw new ApiError(error.message, 400)
  }

  return { success: true }
}
