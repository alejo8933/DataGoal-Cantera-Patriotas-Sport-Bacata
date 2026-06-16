import { IAuthSessionRepository } from '../../usuarios/domain/ports/IAuthSessionRepository';
import { IUsuarioRepository } from '../../usuarios/domain/ports/IUsuarioRepository';
import { UsuarioEntity } from '../../usuarios/domain/entities/UsuarioEntity';
import {
  IPerfilJugadorRepository,
  PerfilJugadorDeportivo,
} from '../domain/ports/IPerfilJugadorRepository';

export interface MiPerfilJugador {
  perfil: UsuarioEntity;
  jugador: PerfilJugadorDeportivo | null;
}

export class GetMiPerfilJugadorUseCase {
  constructor(
    private readonly sessionRepo: IAuthSessionRepository,
    private readonly usuarioRepo: IUsuarioRepository,
    private readonly perfilJugadorRepo: IPerfilJugadorRepository
  ) {}

  async execute(): Promise<MiPerfilJugador | null> {
    const userId = await this.sessionRepo.getCurrentUserId();
    if (!userId) return null;

    const [perfil, jugador] = await Promise.all([
      this.usuarioRepo.getById(userId),
      this.perfilJugadorRepo.getByUserId(userId),
    ]);

    return perfil ? { perfil, jugador } : null;
  }
}
