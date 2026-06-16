import { AppError } from '../../../shared/errors/AppError';
import { EventoPartidoEntity } from '../domain/entities/EventoPartidoEntity';
import { IEventoPartidoRepository } from '../domain/ports/IEventoPartidoRepository';
import { EventoPartidoMapper } from './EventoPartidoMapper';

const EVENTO_SELECT = `
  id, partido_id, jugador_id, minuto, tipo, equipo, descripcion, created_at,
  jugadores (id, nombre, apellido, numero_camiseta)
`;

export class SupabaseEventoPartidoRepository
  implements IEventoPartidoRepository
{
  constructor(private readonly supabase: any) {}

  async getByPartido(partidoId: string): Promise<EventoPartidoEntity[]> {
    const { data, error } = await this.supabase
      .from('eventos_partido')
      .select(EVENTO_SELECT)
      .eq('partido_id', partidoId)
      .order('minuto', { ascending: true });

    if (error) throw new AppError(error.message, 500);
    return (data ?? []).map(EventoPartidoMapper.toDomain);
  }

  async getById(id: string): Promise<EventoPartidoEntity | null> {
    const { data, error } = await this.supabase
      .from('eventos_partido')
      .select(EVENTO_SELECT)
      .eq('id', id)
      .single();

    if (error || !data) return null;
    return EventoPartidoMapper.toDomain(data);
  }

  async save(evento: EventoPartidoEntity): Promise<EventoPartidoEntity> {
    const { data, error } = await this.supabase
      .from('eventos_partido')
      .insert(EventoPartidoMapper.toPersistence(evento))
      .select(EVENTO_SELECT)
      .single();

    if (error) throw new AppError(error.message, 500);
    return EventoPartidoMapper.toDomain(data);
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('eventos_partido')
      .delete()
      .eq('id', id);

    if (error) throw new AppError(error.message, 500);
  }
}
