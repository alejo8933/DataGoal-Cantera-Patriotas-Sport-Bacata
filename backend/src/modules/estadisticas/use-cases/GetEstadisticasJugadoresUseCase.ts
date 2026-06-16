import { EstadisticaEntity } from '../domain/entities/EstadisticaEntity';
import {
  EstadisticasJugadorQuery,
  IEstadisticaRepository,
} from '../domain/ports/IEstadisticaRepository';

export class GetEstadisticasJugadoresUseCase {
  constructor(private readonly repo: IEstadisticaRepository) {}

  async execute(
    query?: EstadisticasJugadorQuery
  ): Promise<EstadisticaEntity[]> {
    return this.repo.getEstadisticasJugadores(query);
  }
}
