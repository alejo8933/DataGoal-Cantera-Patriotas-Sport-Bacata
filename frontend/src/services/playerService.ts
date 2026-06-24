import { SupabasePlayerRepository } from '@/repositories/supabase/PlayerRepository'
import type { CreatePlayer } from '@/types/domain/player.schema'

const repo = new SupabasePlayerRepository()

export const playerService = {
  getAll:         ()                                         => repo.getAll(),
  getById:        (id: string)                               => repo.getById(id),
  getByCategoria: (categoria: string)                        => repo.getByCategoria(categoria),
  create:         (data: CreatePlayer)                       => repo.create(data),
  update:         (id: string, data: Partial<CreatePlayer>)  => repo.update(id, data),
  delete:         (id: string)                               => repo.delete(id),
}