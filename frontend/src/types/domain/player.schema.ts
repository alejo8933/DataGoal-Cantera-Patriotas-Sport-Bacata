import { z } from 'zod'

export const PlayerSchema = z.object({
  id:                 z.string().uuid(),
  nombre:             z.string().min(1).max(100),
  apellido:           z.string().min(1).max(100),
  posicion:           z.string(),
  categoria:          z.string(),
  numero_camiseta:    z.number().int().min(0).nullable().optional(),
  goles:              z.number().int().min(0).default(0),
  asistencias:        z.number().int().min(0).default(0),
  tarjetas_amarillas: z.number().int().min(0).default(0),
  tarjetas_rojas:     z.number().int().min(0).default(0),
  foto_url:           z.string().url().nullable().optional(),
})

export const CreatePlayerSchema = PlayerSchema.omit({ id: true })

export type Player       = z.infer<typeof PlayerSchema>
export type CreatePlayer = z.infer<typeof CreatePlayerSchema>