import { PartidoEntity } from '../domain/entities/PartidoEntity';
import { IPartidoRepository } from '../domain/ports/IPartidoRepository';

export interface GetPartidosQuery {
  categoria?: string;
  incluirCancelados?: boolean;
}

export class GetPartidosUseCase {
  constructor(private readonly repo: IPartidoRepository) {}

  async execute(query: GetPartidosQuery = {}): Promise<PartidoEntity[]> {
    if (query.categoria) {
      return this.repo.getByCategoria(query.categoria);
    }

    return query.incluirCancelados === false
      ? this.repo.getActivos()
      : this.repo.getAll();
  }
}
