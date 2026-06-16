import { IJugadorRepository } from '../domain/ports/IJugadorRepository';
import { AppError } from '../../../shared/errors/AppError';

export class DeleteJugadorUseCase {
  constructor(private readonly repo: IJugadorRepository) {}

  async execute(id: string): Promise<void> {
    const jugador = await this.repo.getById(id);
    if (!jugador) {
      throw new AppError('El jugador no existe.', 404);
    }
    return this.repo.delete(id);
  }
}
