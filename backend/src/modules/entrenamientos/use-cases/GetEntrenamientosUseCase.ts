import { IEntrenamientoRepository } from '../domain/ports/IEntrenamientoRepository';
import { EntrenamientoEntity } from '../domain/entities/EntrenamientoEntity';

export interface GetEntrenamientosQuery {
  categoria?: string;
}

export class GetEntrenamientosUseCase {
  constructor(private readonly repo: IEntrenamientoRepository) {}

  async execute(query?: GetEntrenamientosQuery): Promise<EntrenamientoEntity[]> {
    if (query?.categoria) {
      return this.repo.getByCategoria(query.categoria);
    }
    return this.repo.getAll();
  }
}
