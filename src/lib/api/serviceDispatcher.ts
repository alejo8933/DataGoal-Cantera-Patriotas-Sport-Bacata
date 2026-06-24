/**
 * Dispatcher de servicios - Factory Pattern
 * Mapea recursos a sus servicios de negocio correspondientes
 * Permite que la API REST genérica llame a la lógica de negocio específica de cada módulo
 */

import { playerService } from '@/services/playerService'
import { matchService } from '@/services/matchService'
import { trainingService } from '@/services/trainingService'
import { tournamentService } from '@/services/tournamentService'
import { teamService } from '@/services/teamService'
import { eventService } from '@/services/eventService'
import { statisticsService } from '@/services/statisticsService'

export type ResourceService = {
  getAll?: (params?: any) => Promise<any[]>
  getById?: (id: string) => Promise<any>
  create?: (data: any) => Promise<any>
  update?: (id: string, data: any) => Promise<any>
  delete?: (id: string) => Promise<any>
}

/**
 * Mapeo de recursos a sus servicios de negocio
 * Cuando la API REST recibe una solicitud para un recurso, busca aquí el servicio correspondiente
 * 
 * Nota: estadisticas está excluida porque statisticsService solo tiene métodos de lectura (getGoalscorers, getTeamPerformance)
 * y no tiene operaciones CRUD completas. Será manejada directamente por acceso a Supabase.
 */
export const serviceDispatcher: Record<string, ResourceService> = {
  // Servicios de dominio con CRUD completo
  jugadores: playerService,
  partidos: matchService,
  entrenamientos: trainingService,
  torneos: tournamentService,
  rendimiento_equipos: teamService,
  eventos_partido: eventService,
  estadisticas: statisticsService,

  // Recursos sin servicio específico (serán manejados directamente por Supabase en resourceService.ts)
  // Estos incluyen: asistencias, audit_logs, categorias, convocatorias, evaluaciones, estadisticas, etc.
}

/**
 * Obtiene el servicio para un recurso
 * @param resource - El nombre del recurso
 * @returns El servicio si existe, undefined si debe usarse el acceso directo a Supabase
 */
export function getServiceForResource(resource: string): ResourceService | undefined {
  return serviceDispatcher[resource]
}

/**
 * Verifica si un recurso tiene un servicio de negocio específico
 * @param resource - El nombre del recurso
 * @returns true si el recurso tiene un servicio, false si debe usarse acceso directo a Supabase
 */
export function hasService(resource: string): boolean {
  return !!serviceDispatcher[resource]
}
