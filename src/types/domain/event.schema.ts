import { z } from 'zod'

export const EventSchema = z.object({
  id: z.string().uuid(),
  partido_id: z.string(),
  jugador_id: z.string().nullable().optional(),
  minuto: z.number().int().min(0).optional(),
  tipo: z.enum(['gol', 'amarilla', 'roja', 'otro']),
  equipo: z.string().optional(),
  descripcion: z.string().nullable().optional(),
  created_at: z.string().optional(),
})

export const CreateEventSchema = EventSchema.omit({ id: true })

export type Event = z.infer<typeof EventSchema>
export type CreateEvent = z.infer<typeof CreateEventSchema>
