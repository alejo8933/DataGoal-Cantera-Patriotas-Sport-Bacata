import type { Player, CreatePlayer } from '@/types/domain/player.schema'

export interface IPlayerRepository {
  getAll():                                          Promise<Player[]>
  getById(id: string):                               Promise<Player | null>
  getByCategoria(categoria: string):                 Promise<Player[]>
  create(data: CreatePlayer):                        Promise<Player>
  update(id: string, data: Partial<CreatePlayer>):   Promise<Player>
  delete(id: string):                                Promise<void>
}