import { IAuthAdminRepository } from '../domain/ports/IAuthAdminRepository';
import { IUsuarioRepository } from '../domain/ports/IUsuarioRepository';
import { UsuarioEntity } from '../domain/entities/UsuarioEntity';
import { CreateUsuarioDTO } from '../dtos/CreateUsuarioDTO';
import { AppError } from '../../../shared/errors/AppError';

export class CreateUsuarioUseCase {
  constructor(
    private readonly authAdminRepo: IAuthAdminRepository,
    private readonly usuarioRepo: IUsuarioRepository
  ) {}

  async execute(dto: CreateUsuarioDTO): Promise<UsuarioEntity> {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(dto.email)) {
      throw new AppError('Por favor, ingresa un correo electrónico válido.', 400);
    }

    if (!dto.password || dto.password.length < 8) {
      throw new AppError(
        'La contraseña debe tener al menos 8 caracteres para mayor seguridad.',
        400
      );
    }

    if (!UsuarioEntity.isRolValido(dto.rol)) {
      throw new AppError('El rol seleccionado no es válido.', 400);
    }

    if (!dto.nombre.trim() || !dto.apellido.trim()) {
      throw new AppError('Nombre y Apellido son obligatorios.', 400);
    }

    const { id } = await this.authAdminRepo.createUser({
      email: dto.email.trim(),
      password: dto.password,
      rol: dto.rol,
      nombre: dto.nombre.trim(),
      apellido: dto.apellido.trim(),
    });

    const usuario = UsuarioEntity.create({
      id,
      email: dto.email.trim(),
      nombre: dto.nombre.trim(),
      apellido: dto.apellido.trim(),
      rol: dto.rol,
      telefono: dto.telefono ?? null,
      fechaNacimiento: dto.fechaNacimiento ?? null,
      posicion: dto.rol === 'jugador' ? (dto.posicion ?? null) : null,
      categoria: dto.rol !== 'admin' ? (dto.categoria ?? null) : null,
      genero: null,
      documento: null,
    });

    await this.usuarioRepo.upsert(usuario);
    return usuario;
  }
}
