import { IEntrenamientoRepository } from '../domain/ports/IEntrenamientoRepository';
import { EntrenamientoEntity } from '../domain/entities/EntrenamientoEntity';
import { AppError } from '../../../shared/errors/AppError';

export class GetEntrenamientoByIdUseCase {
  constructor(private readonly repo: IEntrenamientoRepository) {}

  async execute(id: string): Promise<EntrenamientoEntity> {
    const entrenamiento = await this.repo.getById(id);
    if (!entrenamiento) {
      throw new AppError('El entrenamiento solicitado no existe.', 404);
    }
    return entrenamiento;
  }
}
