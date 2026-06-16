import { z } from 'zod'

export const MatchSchema = z.object({
  id:               z.string().uuid(),
  equipo_local:     z.string(),
  equipo_visitante: z.string(),
  fecha:            z.string(),
  hora:             z.string().nullable().optional(),
  lugar:            z.string().nullable().optional(),
  goles_local:      z.number().int().min(0).nullable().optional(),
  goles_visitante:  z.number().int().min(0).nullable().optional(),
  estado:           z.enum(['programado', 'en_curso', 'finalizado', 'cancelado']),
  categoria:        z.string(),
  descripcion:      z.string().nullable().optional(),
})

export const CreateMatchSchema = MatchSchema.omit({ id: true })

export type Match       = z.infer<typeof MatchSchema>
export type CreateMatch = z.infer<typeof CreateMatchSchema>