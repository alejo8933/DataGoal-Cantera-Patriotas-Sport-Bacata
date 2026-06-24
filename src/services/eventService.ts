import { SupabaseEventRepository } from '@/repositories/supabase/SupabaseEventRepository'
import type { IEventRepository } from '@/repositories/IEventRepository'

const repo: IEventRepository = new SupabaseEventRepository()

export const eventService = {
  createEvent: (data: any) => repo.createEvent(data),
  insertGoal: (partidoId: string, jugadorId: string, minuto: number, equipo: string) => repo.insertGoal(partidoId, jugadorId, minuto, equipo),
  insertCard: (partidoId: string, jugadorId: string, minuto: number, tipo: 'amarilla' | 'roja', equipo: string) => repo.insertCard(partidoId, jugadorId, minuto, tipo, equipo),
}
