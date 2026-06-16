import { AppError } from '../../../shared/errors/AppError';
import { RolUsuario } from '../domain/entities/UsuarioEntity';
import { IUsuarioRepository } from '../domain/ports/IUsuarioRepository';

export type RolDestino = 'all' | 'admin' | 'entrenador' | 'jugador';

export class GetDestinatarioIdsUseCase {
  constructor(private readonly repo: IUsuarioRepository) {}

  async execute(
    solicitante: RolUsuario,
    destino: RolDestino
  ): Promise<string[]> {
    const entrenadorPuedeNotificarAdmins =
      solicitante === 'entrenador' && destino === 'admin';

    if (solicitante !== 'admin' && !entrenadorPuedeNotificarAdmins) {
      throw new AppError('No tienes permisos para obtener destinatarios.', 403);
    }

    const usuarios =
      destino === 'all'
        ? await this.repo.getAll()
        : await this.repo.getByRol(destino);

    return usuarios
      .filter((usuario) => usuario.activo)
      .map((usuario) => usuario.id);
  }
}
