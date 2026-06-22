import { createClient } from '@/lib/supabase/server'
import { getResourceConfig, type ResourceConfig } from './resourceConfig'

export class ApiError extends Error {
  status: number

  constructor(message: string, status = 400) {
    super(message)
    this.status = status
  }
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

export async function requireAuthenticatedUser() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data.user) {
    throw new ApiError('No autorizado. Inicia sesión para acceder a esta API.', 401)
  }

  return data.user
}

export async function listResource(resource: string, searchParams: URLSearchParams) {
  const config = getResourceConfig(resource)
  if (!config) {
    throw new ApiError(`Recurso desconocido: ${resource}`, 404)
  }
  if (!config.operations.list) {
    throw new ApiError(`Listado no permitido para el recurso: ${resource}`, 403)
  }

  const supabase = await createClient()
  const query = buildQuery(config, supabase, searchParams)
  const { data, error } = await query
  if (error) {
    throw new ApiError(error.message, 500)
  }
  return data ?? []
}

export async function getResourceById(resource: string, id: string) {
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

  const supabase = await createClient()
  const { data, error } = await supabase.from(config.tableName).select('*').eq('id', id).maybeSingle()
  if (error) {
    throw new ApiError(error.message, 500)
  }
  return data
}

export async function createResource(resource: string, payload: unknown) {
  const config = getResourceConfig(resource)
  if (!config) {
    throw new ApiError(`Recurso desconocido: ${resource}`, 404)
  }
  if (!config.operations.create) {
    throw new ApiError(`Creación no permitida para el recurso: ${resource}`, 403)
  }

  const record = sanitizePayload(payload, config.writableColumns)
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

export async function updateResource(resource: string, id: string, payload: unknown) {
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

  const record = sanitizePayload(payload, config.writableColumns)
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

export async function deleteResource(resource: string, id: string) {
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

  const supabase = await createClient()
  const { error } = await supabase.from(config.tableName).delete().eq('id', id)
  if (error) {
    throw new ApiError(error.message, 400)
  }

  return { success: true }
}
