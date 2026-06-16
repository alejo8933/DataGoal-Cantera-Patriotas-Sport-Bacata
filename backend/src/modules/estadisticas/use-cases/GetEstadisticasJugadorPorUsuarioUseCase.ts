import { AppError } from '../../../shared/errors/AppError';
import { EstadisticaEntity } from '../domain/entities/EstadisticaEntity';
import { IEstadisticaRepository } from '../domain/ports/IEstadisticaRepository';

export class GetEstadisticasJugadorPorUsuarioUseCase {
  constructor(private readonly repo: IEstadisticaRepository) {}

  async execute(userId: string): Promise<EstadisticaEntity | null> {
    if (!userId?.trim()) {
      throw new AppError('El ID del usuario es obligatorio.', 400);
    }

    return this.repo.getEstadisticasJugadorByUserId(userId);
  }
}
