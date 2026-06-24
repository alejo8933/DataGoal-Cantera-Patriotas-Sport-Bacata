import { IUsuarioRepository } from '../domain/ports/IUsuarioRepository';
import { UsuarioEntity } from '../domain/entities/UsuarioEntity';
import { UpdateMiPerfilDTO } from '../dtos/UpdateMiPerfilDTO';
import { AppError } from '../../../shared/errors/AppError';

export class UpdateMiPerfilUseCase {
  constructor(private readonly repo: IUsuarioRepository) {}

  async execute(userId: string, dto: UpdateMiPerfilDTO): Promise<UsuarioEntity> {
    if (!userId) {
      throw new AppError('Sesión no válida.', 401);
    }

    if (!dto.nombre.trim() || !dto.apellido.trim()) {
      throw new AppError('Nombre y Apellido son obligatorios.', 400);
    }

    const existente = await this.repo.getById(userId);
    if (!existente) {
      throw new AppError('Perfil no encontrado.', 404);
    }

    existente.actualizarPerfil({
      nombre: dto.nombre.trim(),
      apellido: dto.apellido.trim(),
      telefono: dto.telefono ?? null,
      genero: dto.genero ?? null,
      documento: dto.documento ?? null,
      fechaNacimiento: dto.fechaNacimiento ?? null,
    });

    return this.repo.update(userId, {
      nombre: existente.nombre,
      apellido: existente.apellido,
      telefono: existente.telefono,
      genero: existente.genero,
      documento: existente.documento,
      fechaNacimiento: existente.fechaNacimiento,
    });
  }
}
