import { SupabasePlayerRepository } from '@/repositories/supabase/PlayerRepository'
import { createClient } from '@/lib/supabase/server'

export const getPlayerServiceServer = async () => {
  const supabaseServer = await createClient()
  const repo = new SupabasePlayerRepository(supabaseServer)
  
  return {
    getAll:         () => repo.getAll(),
    getById:        (id: string) => repo.getById(id),
    getByCategoria: (categoria: string) => repo.getByCategoria(categoria),
    create:         (datos: any) => repo.create(datos),
    update:         (id: string, datos: any) => repo.update(id, datos),
    delete:         (id: string) => repo.delete(id),
  }
}
