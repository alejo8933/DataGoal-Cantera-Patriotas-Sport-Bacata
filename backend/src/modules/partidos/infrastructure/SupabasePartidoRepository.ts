import { AppError } from '../../../shared/errors/AppError';
import { PartidoEntity, PartidoProps } from '../domain/entities/PartidoEntity';
import { IPartidoRepository } from '../domain/ports/IPartidoRepository';
import { PartidoMapper } from './PartidoMapper';

export class SupabasePartidoRepository implements IPartidoRepository {
  constructor(private readonly supabase: any) {}

  async getAll(): Promise<PartidoEntity[]> {
    const { data, error } = await this.supabase
      .from('partidos')
      .select('*')
      .order('fecha', { ascending: false });

    if (error) throw new AppError(error.message, 500);
    return (data ?? []).map(PartidoMapper.toDomain);
  }

  async getActivos(): Promise<PartidoEntity[]> {
    const { data, error } = await this.supabase
      .from('partidos')
      .select('*')
      .neq('estado', 'Cancelado')
      .order('fecha', { ascending: false });

    if (error) throw new AppError(error.message, 500);
    return (data ?? []).map(PartidoMapper.toDomain);
  }

  async getById(id: string): Promise<PartidoEntity | null> {
    const { data, error } = await this.supabase
      .from('partidos')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return null;
    return PartidoMapper.toDomain(data);
  }

  async getByCategoria(categoria: string): Promise<PartidoEntity[]> {
    const { data, error } = await this.supabase
      .from('partidos')
      .select('*')
      .eq('categoria', categoria)
      .order('fecha', { ascending: false });

    if (error) throw new AppError(error.message, 500);
    return (data ?? []).map(PartidoMapper.toDomain);
  }

  async save(partido: PartidoEntity): Promise<PartidoEntity> {
    const { data, error } = await this.supabase
      .from('partidos')
      .insert(PartidoMapper.toPersistence(partido))
      .select()
      .single();

    if (error) throw new AppError(error.message, 500);
    return PartidoMapper.toDomain(data);
  }

  async update(
    id: string,
    data: Partial<Omit<PartidoProps, 'id'>>
  ): Promise<PartidoEntity> {
    const dbUpdate: Record<string, unknown> = {};

    if (data.equipoLocal !== undefined) dbUpdate.equipo_local = data.equipoLocal;
    if (data.equipoVisitante !== undefined) dbUpdate.equipo_visitante = data.equipoVisitante;
    if (data.fecha !== undefined) dbUpdate.fecha = data.fecha;
    if (data.hora !== undefined) dbUpdate.hora = data.hora;
    if (data.lugar !== undefined) dbUpdate.lugar = data.lugar;
    if (data.golesLocal !== undefined) dbUpdate.goles_local = data.golesLocal;
    if (data.golesVisitante !== undefined) dbUpdate.goles_visitante = data.golesVisitante;
    if (data.estado !== undefined) dbUpdate.estado = data.estado;
    if (data.categoria !== undefined) dbUpdate.categoria = data.categoria;
    if (data.descripcion !== undefined) dbUpdate.descripcion = data.descripcion;

    const { data: updated, error } = await this.supabase
      .from('partidos')
      .update(dbUpdate)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new AppError(error.message, 500);
    return PartidoMapper.toDomain(updated);
  }
}
