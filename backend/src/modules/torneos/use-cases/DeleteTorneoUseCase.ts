import { ITorneoRepository } from '../domain/ports/ITorneoRepository';
import { AppError } from '../../../shared/errors/AppError';

export class DeleteTorneoUseCase {
  constructor(private readonly repo: ITorneoRepository) {}

  async execute(id: string): Promise<void> {
    const existing = await this.repo.getById(id);
    if (!existing) {
      throw new AppError('El torneo que intentas eliminar no existe.', 404);
    }
    return this.repo.delete(id);
  }
}
