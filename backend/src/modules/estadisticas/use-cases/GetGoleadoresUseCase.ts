import { EstadisticaEntity } from '../domain/entities/EstadisticaEntity';
import { IEstadisticaRepository } from '../domain/ports/IEstadisticaRepository';

export class GetGoleadoresUseCase {
  constructor(private readonly repo: IEstadisticaRepository) {}

  async execute(limit = 20): Promise<EstadisticaEntity[]> {
    return this.repo.getGoleadores(limit);
  }
}
