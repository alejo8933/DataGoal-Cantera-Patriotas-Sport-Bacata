/**
 * Mapeo de esquemas Zod para validación de solicitudes
 * Importa los esquemas definidos en src/types/domain/ y los expone por recurso
 */

import { z } from 'zod'
import { CreatePlayerSchema } from '@/types/domain/player.schema'
import { CreateMatchSchema } from '@/types/domain/match.schema'
import { CreateTrainingSchema } from '@/types/domain/training.schema'
import { CreateTournamentSchema } from '@/types/domain/tournament.schema'

/**
 * Mapeo de recursos a sus esquemas Zod de creación
 * Permite validar automáticamente el body según el recurso
 */
export const resourceSchemas: Record<string, z.ZodSchema> = {
  jugadores: CreatePlayerSchema,
  partidos: CreateMatchSchema,
  entrenamientos: CreateTrainingSchema,
  torneos: CreateTournamentSchema,

  // Recursos que no tienen esquemas de validación específicos
  // (tabla genérica, sin validación fuerte)
  asistencias: z.record(z.any()),
  audit_logs: z.record(z.any()),
  categorias: z.record(z.any()),
  categorias_maestras: z.record(z.any()),
  convocatoria_jugadores: z.record(z.any()),
  convocatorias: z.record(z.any()),
  estadisticas: z.record(z.any()),
  evaluaciones: z.record(z.any()),
  eventos_partido: z.record(z.any()),
  gastos: z.record(z.any()),
  kpi_definiciones: z.record(z.any()),
  lesiones: z.record(z.any()),
  notificaciones: z.record(z.any()),
  perfiles: z.record(z.any()),
  torneo_equipos: z.record(z.any()),
}

/**
 * Valida el payload contra el esquema del recurso
 * @param resource - El nombre del recurso
 * @param payload - Los datos a validar
 * @returns Los datos validados
 * @throws ZodError si la validación falla
 */
export function validateResourcePayload(resource: string, payload: unknown) {
  const schema = resourceSchemas[resource]
  
  if (!schema) {
    // Si no hay esquema específico, acepta cualquier objeto
    if (typeof payload !== 'object' || payload === null || Array.isArray(payload)) {
      throw new Error('El cuerpo de la solicitud debe ser un objeto JSON válido.')
    }
    return payload
  }

  return schema.parse(payload)
}

/**
 * Obtiene el esquema de un recurso
 * @param resource - El nombre del recurso
 * @returns El esquema Zod del recurso, o undefined si no existe
 */
export function getResourceSchema(resource: string): z.ZodSchema | undefined {
  return resourceSchemas[resource]
}
