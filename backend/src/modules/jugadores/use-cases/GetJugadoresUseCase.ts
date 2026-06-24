import { IJugadorRepository } from '../domain/ports/IJugadorRepository';
import { JugadorEntity } from '../domain/entities/JugadorEntity';

export class GetJugadoresUseCase {
  constructor(private readonly repo: IJugadorRepository) {}

  async execute(categoriaId?: string): Promise<JugadorEntity[]> {
    if (categoriaId) {
      return this.repo.getByCategoria(categoriaId);
    }
    return this.repo.getAll();
  }
}
