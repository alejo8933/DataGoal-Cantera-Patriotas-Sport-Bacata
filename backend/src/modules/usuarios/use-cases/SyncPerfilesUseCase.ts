import { IAuthAdminRepository } from '../domain/ports/IAuthAdminRepository';
import { IUsuarioRepository } from '../domain/ports/IUsuarioRepository';
import { UsuarioEntity } from '../domain/entities/UsuarioEntity';
import { AppError } from '../../../shared/errors/AppError';

export class SyncPerfilesUseCase {
  constructor(
    private readonly authAdminRepo: IAuthAdminRepository,
    private readonly usuarioRepo: IUsuarioRepository
  ) {}

  async execute(): Promise<{ sincronizados: number; errores: string[] }> {
    const authUsers = await this.authAdminRepo.listUsers();
    const errores: string[] = [];

    for (const u of authUsers) {
      const metadata = u.metadata;
      const rol = typeof metadata.rol === 'string' && UsuarioEntity.isRolValido(metadata.rol)
        ? metadata.rol
        : 'jugador';

      const usuario = UsuarioEntity.create({
        id: u.id,
        email: u.email,
        nombre: (metadata.nombre as string) || u.email?.split('@')[0] || 'Usuario',
        apellido: (metadata.apellido as string) || '',
        rol,
        telefono: (metadata.telefono as string | null) ?? null,
        fechaNacimiento: (metadata.fecha_nacimiento as string | null) ?? null,
        posicion: (metadata.posicion as string | null) ?? null,
        categoria: (metadata.categoria as string | null) ?? null,
        genero: null,
        documento: null,
      });

      try {
        await this.usuarioRepo.upsert(usuario);
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Error desconocido';
        errores.push(`${u.email}: ${msg}`);
      }
    }

    if (errores.length > 0 && errores.length === authUsers.length) {
      throw new AppError('Todos los registros fallaron: ' + errores[0], 500);
    }

    return { sincronizados: authUsers.length, errores };
  }
}
