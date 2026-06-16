import {
  EstadisticasEquipoQuery,
  GolPorMes,
  IEstadisticaRepository,
} from '../domain/ports/IEstadisticaRepository';

export class GetGolesPorMesUseCase {
  constructor(private readonly repo: IEstadisticaRepository) {}

  async execute(
    query?: Pick<EstadisticasEquipoQuery, 'categoria'>
  ): Promise<GolPorMes[]> {
    return this.repo.getGolesPorMes(query);
  }
}
