import { AppError } from '../../../shared/errors/AppError';
import {
  EnviarNotificacionInput,
  INotificacionRepository,
  NotificacionReadModel,
} from '../domain/ports/INotificacionRepository';

export class SupabaseNotificacionRepository implements INotificacionRepository {
  constructor(private readonly supabase: any) {}

  async getByUserId(userId: string): Promise<NotificacionReadModel[]> {
    const { data, error } = await this.supabase
      .from('notificaciones')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw new AppError(error.message, 500);
    return (data ?? []) as NotificacionReadModel[];
  }

  async marcarLeida(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('notificaciones')
      .update({ leida: true })
      .eq('id', id);
    if (error) throw new AppError(error.message, 500);
  }

  async marcarTodasLeidasDelUsuario(userId: string): Promise<void> {
    const { error } = await this.supabase
      .from('notificaciones')
      .update({ leida: true })
      .eq('user_id', userId)
      .eq('leida', false);
    if (error) throw new AppError(error.message, 500);
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('notificaciones')
      .delete()
      .eq('id', id);
    if (error) throw new AppError(error.message, 500);
  }

  async enviarBulk(input: EnviarNotificacionInput): Promise<void> {
    if (input.userIds.length === 0) return;

    const rows = input.userIds.map((userId) => ({
      user_id: userId,
      titulo: input.titulo,
      descripcion: input.descripcion ?? null,
      tipo: input.tipo ?? null,
      prioridad: input.prioridad ?? null,
    }));

    const { error } = await this.supabase.from('notificaciones').insert(rows);
    if (error) throw new AppError(error.message, 500);
  }
}
