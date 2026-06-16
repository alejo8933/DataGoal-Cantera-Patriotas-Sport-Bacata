import { IUsuarioRepository } from '../domain/ports/IUsuarioRepository';
import { UsuarioEntity } from '../domain/entities/UsuarioEntity';
import { UpdateUsuarioDTO } from '../dtos/UpdateUsuarioDTO';
import { AppError } from '../../../shared/errors/AppError';

export class UpdateUsuarioUseCase {
  constructor(private readonly repo: IUsuarioRepository) {}

  async execute(id: string, dto: UpdateUsuarioDTO): Promise<UsuarioEntity> {
    if (!id || !dto.rol) {
      throw new AppError('ID y Rol son obligatorios.', 400);
    }

    if (dto.telefono && (!/^\d+$/.test(dto.telefono) || dto.telefono.length < 7 || dto.telefono.length > 15)) {
      throw new AppError('El teléfono debe contener solo números (entre 7 y 15 dígitos).', 400);
    }

    const existente = await this.repo.getById(id);
    if (!existente) {
      throw new AppError('Usuario no encontrado.', 404);
    }

    existente.actualizarPorAdmin({
      nombre: dto.nombre ?? undefined,
      apellido: dto.apellido ?? undefined,
      rol: dto.rol,
      telefono: dto.telefono ?? null,
      fechaNacimiento: dto.fechaNacimiento ?? null,
      posicion: dto.posicion ?? null,
      categoria: dto.categoria ?? null,
    });

    return this.repo.update(id, {
      nombre: existente.nombre,
      apellido: existente.apellido,
      rol: existente.rol,
      telefono: existente.telefono,
      fechaNacimiento: existente.fechaNacimiento,
      posicion: existente.posicion,
      categoria: existente.categoria,
      activo: true,
    });
  }
}
