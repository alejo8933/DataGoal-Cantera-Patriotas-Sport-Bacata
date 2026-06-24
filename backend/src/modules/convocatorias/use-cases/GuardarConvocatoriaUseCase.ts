import { AppError } from '../../../shared/errors/AppError';
import { IConvocatoriaRepository } from '../domain/ports/IConvocatoriaRepository';

export interface GuardarConvocatoriaCommand {
  partidoId: string;
  jugadorIds: string[];
  notas?: string | null;
}

export interface GuardarConvocatoriaResult {
  convocatoriaId: string;
  jugadoresCount: number;
}

export class GuardarConvocatoriaUseCase {
  constructor(private readonly repo: IConvocatoriaRepository) {}

  async execute(command: GuardarConvocatoriaCommand): Promise<GuardarConvocatoriaResult> {
    if (!command.partidoId?.trim()) {
      throw new AppError('El ID del partido es obligatorio.', 400);
    }
    if (!Array.isArray(command.jugadorIds)) {
      throw new AppError('La lista de jugadores es obligatoria.', 400);
    }
    // Defensa contra duplicados dentro del mismo payload.
    const jugadorIdsUnicos = Array.from(new Set(command.jugadorIds.filter((id) => id?.trim())));

    const convocatoriaId = await this.repo.upsertConvocatoria({
      partidoId: command.partidoId,
      jugadorIds: jugadorIdsUnicos,
      notas: command.notas ?? '',
    });

    return {
      convocatoriaId,
      jugadoresCount: jugadorIdsUnicos.length,
    };
  }
}
