import { IUsuarioRepository } from '../domain/ports/IUsuarioRepository';
import { UsuarioEntity } from '../domain/entities/UsuarioEntity';
import { SyncPerfilDTO } from '../dtos/UpdateMiPerfilDTO';
import { AppError } from '../../../shared/errors/AppError';

export class SyncUserProfileUseCase {
  constructor(private readonly repo: IUsuarioRepository) {}

  async execute(dto: SyncPerfilDTO): Promise<void> {
    if (!dto.id || !dto.email) {
      throw new AppError('Datos de perfil incompletos.', 400);
    }

    const rol = UsuarioEntity.isRolValido(dto.rol) ? dto.rol : 'jugador';

    const usuario = UsuarioEntity.create({
      id: dto.id,
      email: dto.email,
      nombre: dto.nombre,
      apellido: dto.apellido,
      rol,
      telefono: dto.telefono ?? null,
      fechaNacimiento: dto.fechaNacimiento ?? null,
      posicion: dto.posicion ?? null,
      categoria: dto.categoria ?? null,
      genero: null,
      documento: null,
    });

    await this.repo.upsert(usuario);
  }
}
