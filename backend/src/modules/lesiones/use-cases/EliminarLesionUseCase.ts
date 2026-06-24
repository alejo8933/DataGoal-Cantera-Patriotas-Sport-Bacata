import { AppError } from '../../../shared/errors/AppError';
import { ILesionRepository, LesionJugadorEmbed } from '../domain/ports/ILesionRepository';

export interface EliminarLesionResult {
  eliminada: boolean;
  jugador: LesionJugadorEmbed | null;
}

export class EliminarLesionUseCase {
  constructor(private readonly repo: ILesionRepository) {}

  async execute(id: string): Promise<EliminarLesionResult> {
    if (!id?.trim()) {
      throw new AppError('El ID de la lesión es obligatorio.', 400);
    }

    const lesion = await this.repo.getById(id);
    if (!lesion) {
      return { eliminada: false, jugador: null };
    }

    await this.repo.delete(id);
    return { eliminada: true, jugador: lesion.jugadores };
  }
}
