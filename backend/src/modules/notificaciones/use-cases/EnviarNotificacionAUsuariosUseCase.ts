import { AppError } from '../../../shared/errors/AppError';
import {
  EnviarNotificacionInput,
  INotificacionRepository,
} from '../domain/ports/INotificacionRepository';

export interface EnviarNotificacionResult {
  enviadas: number;
}

export class EnviarNotificacionAUsuariosUseCase {
  constructor(private readonly repo: INotificacionRepository) {}

  async execute(input: EnviarNotificacionInput): Promise<EnviarNotificacionResult> {
    if (!input.titulo?.trim()) {
      throw new AppError('El título de la notificación es obligatorio.', 400);
    }
    if (!Array.isArray(input.userIds)) {
      throw new AppError('La lista de destinatarios es obligatoria.', 400);
    }

    const destinatariosUnicos = Array.from(
      new Set(input.userIds.filter((id) => id?.trim())),
    );
    if (destinatariosUnicos.length === 0) {
      return { enviadas: 0 };
    }

    await this.repo.enviarBulk({
      userIds: destinatariosUnicos,
      titulo: input.titulo,
      descripcion: input.descripcion ?? null,
      tipo: input.tipo ?? null,
      prioridad: input.prioridad ?? null,
    });

    return { enviadas: destinatariosUnicos.length };
  }
}
