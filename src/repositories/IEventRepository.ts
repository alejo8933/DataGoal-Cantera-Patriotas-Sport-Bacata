export interface IEventRepository {
  createEvent(event: any): Promise<any>
  insertGoal(partidoId: string, jugadorId: string, minuto: number, equipo: string): Promise<any>
  insertCard(partidoId: string, jugadorId: string, minuto: number, tipo: 'amarilla' | 'roja', equipo: string): Promise<any>
}
