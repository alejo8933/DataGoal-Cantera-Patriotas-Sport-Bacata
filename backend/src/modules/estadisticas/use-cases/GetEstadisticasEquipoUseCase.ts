import {
  EstadisticaEquipo,
  EstadisticasEquipoQuery,
  IEstadisticaRepository,
} from '../domain/ports/IEstadisticaRepository';

export class GetEstadisticasEquipoUseCase {
  constructor(private readonly repo: IEstadisticaRepository) {}

  async execute(
    query?: EstadisticasEquipoQuery
  ): Promise<EstadisticaEquipo[]> {
    return this.repo.getEstadisticasEquipo(query);
  }
}
