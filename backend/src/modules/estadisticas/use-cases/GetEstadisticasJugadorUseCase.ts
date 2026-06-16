import { AppError } from '../../../shared/errors/AppError';
import { EstadisticaEntity } from '../domain/entities/EstadisticaEntity';
import { IEstadisticaRepository } from '../domain/ports/IEstadisticaRepository';

export class GetEstadisticasJugadorUseCase {
  constructor(private readonly repo: IEstadisticaRepository) {}

  async execute(jugadorId: string): Promise<EstadisticaEntity | null> {
    if (!jugadorId?.trim()) {
      throw new AppError('El ID del jugador es obligatorio.', 400);
    }

    return this.repo.getEstadisticasJugador(jugadorId);
  }
}
