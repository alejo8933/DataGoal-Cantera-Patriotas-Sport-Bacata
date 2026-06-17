import { AppError } from '../../../shared/errors/AppError';
import { IFacturaRepository } from '../domain/ports/IFacturaRepository';

export class SupabaseFacturaRepository implements IFacturaRepository {
  constructor(private readonly supabase: any) {}

  async getEstados(): Promise<string[]> {
    const { data, error } = await this.supabase
      .from('facturas')
      .select('estado');

    if (error) throw new AppError(error.message, 500);
    return (data ?? []).map((row: { estado: string | null }) => row.estado ?? '');
  }
}
