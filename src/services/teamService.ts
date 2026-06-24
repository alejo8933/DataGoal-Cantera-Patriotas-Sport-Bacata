import { SupabaseTeamRepository } from '@/repositories/supabase/SupabaseTeamRepository'
import type { ITeamRepository } from '@/repositories/ITeamRepository'

const repo: ITeamRepository = new SupabaseTeamRepository()

export const teamService = {
  getAll: () => repo.getAll(),
  getById: (id: string) => repo.getById(id),
  create: (data: any) => repo.create(data),
  update: (id: string, data: any) => repo.update(id, data),
  delete: (id: string) => repo.delete(id),
}
