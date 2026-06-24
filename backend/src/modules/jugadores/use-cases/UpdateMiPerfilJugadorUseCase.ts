import { AppError } from '../../../shared/errors/AppError';
import { IAuthSessionRepository } from '../../usuarios/domain/ports/IAuthSessionRepository';
import { IUsuarioRepository } from '../../usuarios/domain/ports/IUsuarioRepository';
import { DorsalVO } from '../domain/value-objects/DorsalVO';
import { IJugadorAvatarStorage } from '../domain/ports/IJugadorAvatarStorage';
import { IPerfilJugadorRepository } from '../domain/ports/IPerfilJugadorRepository';
import { UpdateMiPerfilJugadorDTO } from '../dtos/UpdateMiPerfilJugadorDTO';

const AVATAR_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const AVATAR_EXTENSIONS: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};
const MAX_AVATAR_SIZE = 5 * 1024 * 1024;

export class UpdateMiPerfilJugadorUseCase {
  constructor(
    private readonly sessionRepo: IAuthSessionRepository,
    private readonly usuarioRepo: IUsuarioRepository,
    private readonly perfilJugadorRepo: IPerfilJugadorRepository,
    private readonly avatarStorage: IJugadorAvatarStorage
  ) {}

  async execute(dto: UpdateMiPerfilJugadorDTO): Promise<string | null> {
    const userId = await this.sessionRepo.getCurrentUserId();
    if (!userId) throw new AppError('Sesion no valida.', 401);

    const nombre = dto.nombre.trim();
    const apellido = dto.apellido.trim();
    if (!nombre || !apellido) {
      throw new AppError('Nombre y apellido son obligatorios.', 400);
    }

    const dorsal = new DorsalVO(dto.numeroCamiseta).value;
    const perfil = await this.usuarioRepo.getById(userId);
    if (!perfil) throw new AppError('Perfil no encontrado.', 404);

    perfil.actualizarPerfil({ nombre, apellido });
    await this.usuarioRepo.update(userId, { nombre, apellido });

    let fotoUrl = dto.fotoUrl;
    if (dto.avatar) {
      if (!AVATAR_TYPES.has(dto.avatar.contentType)) {
        throw new AppError('El avatar debe ser JPG, PNG o WebP.', 400);
      }
      if (dto.avatar.bytes.byteLength > MAX_AVATAR_SIZE) {
        throw new AppError('El avatar no puede superar 5 MB.', 400);
      }
      fotoUrl = await this.avatarStorage.upload(userId, {
        ...dto.avatar,
        extension: AVATAR_EXTENSIONS[dto.avatar.contentType],
      });
    }

    await this.perfilJugadorRepo.updateByUserId(userId, {
      nombre,
      apellido,
      numeroCamiseta: dorsal,
      fotoUrl,
    });

    return fotoUrl;
  }
}
