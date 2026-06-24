import { createClient } from '@/lib/supabase/server'
import type { ITeamRepository } from '@/repositories/ITeamRepository'

export class SupabaseTeamRepository implements ITeamRepository {
  async getAll() {
    const supabase = await createClient()
    const { data, error } = await supabase.from('rendimiento_equipos').select('*')
    if (error) throw new Error(error.message)
    return data ?? []
  }

  async getById(id: string) {
    const supabase = await createClient()
    const { data, error } = await supabase.from('rendimiento_equipos').select('*').eq('id', id).maybeSingle()
    if (error) throw new Error(error.message)
    return data
  }

  async create(data: any) {
    const supabase = await createClient()
    const { data: res, error } = await supabase.from('rendimiento_equipos').insert(data).select().single()
    if (error) throw new Error(error.message)
    return res
  }

  async update(id: string, data: any) {
    const supabase = await createClient()
    const { data: res, error } = await supabase.from('rendimiento_equipos').update(data).eq('id', id).select().single()
    if (error) throw new Error(error.message)
    return res
  }

  async delete(id: string) {
    const supabase = await createClient()
    const { error } = await supabase.from('rendimiento_equipos').delete().eq('id', id)
    if (error) throw new Error(error.message)
  }
}
