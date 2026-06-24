import { AppError } from '../../../shared/errors/AppError';
import { ILesionRepository } from '../domain/ports/ILesionRepository';

export interface RegistrarLesionCommand {
  jugadorId: string;
  fechaLesion: string;
  fechaRetorno?: string | null;
  descripcion?: string | null;
  estado?: string;
}

export class RegistrarLesionUseCase {
  constructor(private readonly repo: ILesionRepository) {}

  async execute(command: RegistrarLesionCommand): Promise<void> {
    if (!command.jugadorId?.trim()) {
      throw new AppError('El ID del jugador es obligatorio.', 400);
    }
    if (!command.fechaLesion?.trim()) {
      throw new AppError('La fecha de la lesión es obligatoria.', 400);
    }

    await this.repo.save({
      jugadorId: command.jugadorId,
      fechaLesion: command.fechaLesion,
      fechaRetorno: command.fechaRetorno ?? null,
      estado: command.estado?.trim() || 'activo',
      descripcion: command.descripcion ?? null,
    });
  }
}
