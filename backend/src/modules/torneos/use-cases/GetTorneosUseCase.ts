import { ITorneoRepository } from '../domain/ports/ITorneoRepository';
import { TorneoEntity } from '../domain/entities/TorneoEntity';

export interface GetTorneosQuery {
  estado?: 'proximo' | 'en_curso' | 'finalizado';
}

export class GetTorneosUseCase {
  constructor(private readonly repo: ITorneoRepository) {}

  async execute(query: GetTorneosQuery = {}): Promise<TorneoEntity[]> {
    if (query.estado === 'proximo') {
      return this.repo.getProximos();
    }
    if (query.estado === 'finalizado') {
      return this.repo.getHistorial();
    }
    return this.repo.getAll();
  }
}
