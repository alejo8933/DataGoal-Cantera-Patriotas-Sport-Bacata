import { createClient } from '@/lib/supabase/server'
import type { IEventRepository } from '@/repositories/IEventRepository'

export class SupabaseEventRepository implements IEventRepository {
  async createEvent(event: any) {
    const supabase = await createClient()
    const { data, error } = await supabase.from('eventos_partido').insert(event).select().single()
    if (error) throw new Error(error.message)
    return data
  }

  async insertGoal(partidoId: string, jugadorId: string, minuto: number, equipo: string) {
    return this.createEvent({ partido_id: partidoId, jugador_id: jugadorId, minuto, tipo: 'gol', equipo })
  }

  async insertCard(partidoId: string, jugadorId: string, minuto: number, tipo: 'amarilla' | 'roja', equipo: string) {
    return this.createEvent({ partido_id: partidoId, jugador_id: jugadorId, minuto, tipo: tipo === 'amarilla' ? 'amarilla' : 'roja', equipo })
  }
}
