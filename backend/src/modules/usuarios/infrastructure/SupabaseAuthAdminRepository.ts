import {
  AuthUserRecord,
  CreateAuthUserInput,
  IAuthAdminRepository,
} from '../domain/ports/IAuthAdminRepository';
import { AppError } from '../../../shared/errors/AppError';

export class SupabaseAuthAdminRepository implements IAuthAdminRepository {
  constructor(private readonly supabaseAdmin: { auth: { admin: any } }) {}

  async createUser(input: CreateAuthUserInput): Promise<{ id: string }> {
    const { data, error } = await this.supabaseAdmin.auth.admin.createUser({
      email: input.email,
      password: input.password,
      email_confirm: true,
      user_metadata: {
        rol: input.rol,
        nombre: input.nombre,
        apellido: input.apellido,
      },
    });

    if (error || !data.user) {
      throw new AppError(
        'Error creando la identidad: ' + (error?.message || 'Fallo desconocido'),
        500
      );
    }

    return { id: data.user.id };
  }

  async listUsers(): Promise<AuthUserRecord[]> {
    const { data, error } = await this.supabaseAdmin.auth.admin.listUsers();

    if (error) {
      throw new AppError(
        'No se pudo acceder a la lista de usuarios de Auth: ' + error.message,
        500
      );
    }

    return (data.users ?? []).map((u: { id: string; email?: string; user_metadata?: Record<string, unknown> }) => ({
      id: u.id,
      email: u.email ?? '',
      metadata: u.user_metadata ?? {},
    }));
  }
}
