import { IAuthSessionRepository } from '../domain/ports/IAuthSessionRepository';
import { AppError } from '../../../shared/errors/AppError';

export class SupabaseAuthSessionRepository implements IAuthSessionRepository {
  constructor(
    private readonly supabase: {
      auth: {
        getUser: () => Promise<{ data: { user: { id: string } | null } }>;
        updateUser: (params: { password: string }) => Promise<{ error: { message: string } | null }>;
      };
    }
  ) {}

  async getCurrentUserId(): Promise<string | null> {
    const { data: { user } } = await this.supabase.auth.getUser();
    return user?.id ?? null;
  }

  async updatePassword(password: string): Promise<void> {
    const { error } = await this.supabase.auth.updateUser({ password });
    if (error) throw new AppError(error.message, 400);
  }
}
