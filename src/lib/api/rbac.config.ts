/**
 * Configuración de Control de Acceso Basado en Roles (RBAC)
 * Define qué roles pueden realizar qué operaciones en cada recurso
 */

export type UserRole = 'admin' | 'entrenador' | 'jugador'

export type Operation = 'list' | 'get' | 'create' | 'update' | 'delete'

/**
 * Define los permisos por rol para cada operación
 * Si un recurso no está en esta configuración, se usa la configuración por defecto
 */
export const rolePermissions: Record<UserRole, Set<Operation>> = {
  admin: new Set(['list', 'get', 'create', 'update', 'delete']),
  entrenador: new Set(['list', 'get', 'create', 'update']),
  jugador: new Set(['list', 'get']),
}

/**
 * Permisos específicos por recurso y rol
 * Sobrescribe los permisos generales cuando es necesario
 */
export const resourceRolePermissions: Record<string, Record<UserRole, Set<Operation>>> = {
  // Solo admins pueden crear, actualizar y eliminar entrenamientos
  entrenamientos: {
    admin: new Set(['list', 'get', 'create', 'update', 'delete']),
    entrenador: new Set(['list', 'get', 'create', 'update']),
    jugador: new Set(['list', 'get']),
  },
  
  // Solo admins pueden gestionar jugadores completamente
  jugadores: {
    admin: new Set(['list', 'get', 'create', 'update', 'delete']),
    entrenador: new Set(['list', 'get']),
    jugador: new Set(['get']), // Solo pueden ver sus propios datos
  },

  // Admins y entrenadores pueden gestionar partidos
  partidos: {
    admin: new Set(['list', 'get', 'create', 'update', 'delete']),
    entrenador: new Set(['list', 'get', 'create', 'update']),
    jugador: new Set(['list', 'get']),
  },

  // Todos pueden ver categorías, solo admins pueden modificar
  categorias: {
    admin: new Set(['list', 'get', 'create', 'update', 'delete']),
    entrenador: new Set(['list', 'get']),
    jugador: new Set(['list', 'get']),
  },

  // Admins y entrenadores pueden registrar asistencias
  asistencias: {
    admin: new Set(['list', 'get', 'create', 'update', 'delete']),
    entrenador: new Set(['list', 'get', 'create', 'update']),
    jugador: new Set(['list', 'get']),
  },

  // Admins y entrenadores pueden registrar eventos
  eventos_partido: {
    admin: new Set(['list', 'get', 'create', 'update', 'delete']),
    entrenador: new Set(['list', 'get', 'create', 'update']),
    jugador: new Set(['list', 'get']),
  },

  // Admins pueden ver audit logs, nadie más
  audit_logs: {
    admin: new Set(['list', 'get']),
    entrenador: new Set([]),
    jugador: new Set([]),
  },

  // Admins pueden gestionar perfiles
  perfiles: {
    admin: new Set(['list', 'get', 'create', 'update', 'delete']),
    entrenador: new Set([]),
    jugador: new Set([]),
  },
}

/**
 * Obtiene los permisos de un rol para una operación
 * @param role - El rol del usuario
 * @param resource - El recurso a acceder
 * @param operation - La operación a realizar
 * @returns true si el rol puede realizar la operación
 */
export function canPerformOperation(
  role: UserRole,
  resource: string,
  operation: Operation
): boolean {
  // Primero verifica permisos específicos del recurso
  if (resourceRolePermissions[resource]) {
    const permissions = resourceRolePermissions[resource][role]
    return permissions ? permissions.has(operation) : false
  }

  // Si no hay permisos específicos, usa los permisos generales del rol
  return rolePermissions[role].has(operation)
}
