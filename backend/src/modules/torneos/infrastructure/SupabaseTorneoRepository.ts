import { AppError } from '../../../shared/errors/AppError';
import { TorneoEntity, TorneoProps } from '../domain/entities/TorneoEntity';
import { ITorneoRepository } from '../domain/ports/ITorneoRepository';
import { TorneoMapper } from './TorneoMapper';

export class SupabaseTorneoRepository implements ITorneoRepository {
  constructor(private readonly supabase: any) {}

  async getAll(): Promise<TorneoEntity[]> {
    const { data, error } = await this.supabase
      .from('torneos')
      .select('*')
      .order('fecha_inicio', { ascending: false });

    if (error) throw new AppError(error.message, 500);
    return (data ?? []).map(TorneoMapper.toDomain);
  }

  async getById(id: string): Promise<TorneoEntity | null> {
    const { data, error } = await this.supabase
      .from('torneos')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return null;
    return TorneoMapper.toDomain(data);
  }

  async getProximos(): Promise<TorneoEntity[]> {
    const { data, error } = await this.supabase
      .from('torneos')
      .select('*')
      .eq('estado', 'proximo')
      .order('fecha_inicio', { ascending: true });

    if (error) throw new AppError(error.message, 500);
    return (data ?? []).map(TorneoMapper.toDomain);
  }

  async getHistorial(): Promise<TorneoEntity[]> {
    const { data, error } = await this.supabase
      .from('torneos')
      .select('*')
      .eq('estado', 'finalizado')
      .order('fecha_inicio', { ascending: false });

    if (error) throw new AppError(error.message, 500);
    return (data ?? []).map(TorneoMapper.toDomain);
  }

  async save(torneo: TorneoEntity): Promise<TorneoEntity> {
    const { data, error } = await this.supabase
      .from('torneos')
      .insert(TorneoMapper.toPersistence(torneo))
      .select()
      .single();

    if (error) throw new AppError(error.message, 500);
    return TorneoMapper.toDomain(data);
  }

  async update(
    id: string,
    data: Partial<Omit<TorneoProps, 'id'>>
  ): Promise<TorneoEntity> {
    const dbUpdate: Record<string, unknown> = {};

    if (data.nombre !== undefined) dbUpdate.nombre = data.nombre;
    if (data.categoria !== undefined) dbUpdate.categoria = data.categoria;
    if (data.fechaInicio !== undefined) dbUpdate.fecha_inicio = data.fechaInicio;
    if (data.fechaFin !== undefined) dbUpdate.fecha_fin = data.fechaFin;
    if (data.estado !== undefined) dbUpdate.estado = data.estado;
    if (data.descripcion !== undefined) dbUpdate.descripcion = data.descripcion;
    if (data.logoUrl !== undefined) dbUpdate.logo_url = data.logoUrl;
    if (data.resultado !== undefined) dbUpdate.resultado = data.resultado;

    const { data: updated, error } = await this.supabase
      .from('torneos')
      .update(dbUpdate)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new AppError(error.message, 500);
    return TorneoMapper.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('torneos')
      .delete()
      .eq('id', id);

    if (error) throw new AppError(error.message, 500);
  }
}
