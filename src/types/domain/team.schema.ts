import { z } from 'zod'

export const TeamPerformanceSchema = z.object({
  id: z.string().uuid(),
  equipo: z.string(),
  categoria: z.string(),
  partidos: z.number().int().min(0).optional(),
  ganados: z.number().int().min(0).optional(),
  empatados: z.number().int().min(0).optional(),
  perdidos: z.number().int().min(0).optional(),
  goles_favor: z.number().int().min(0).optional(),
  goles_contra: z.number().int().min(0).optional(),
  puntos: z.number().int().min(0).optional(),
})

export const CreateTeamPerformanceSchema = TeamPerformanceSchema.omit({ id: true })

export type TeamPerformance = z.infer<typeof TeamPerformanceSchema>
export type CreateTeamPerformance = z.infer<typeof CreateTeamPerformanceSchema>
