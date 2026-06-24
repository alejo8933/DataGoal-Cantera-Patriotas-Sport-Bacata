export interface ITeamRepository {
  getAll(): Promise<any[]>
  getById(id: string): Promise<any | null>
  create(data: any): Promise<any>
  update(id: string, data: any): Promise<any>
  delete(id: string): Promise<void>
}
