import { IJugadorRepository } from '../domain/ports/IJugadorRepository';
import { JugadorEntity, JugadorProps } from '../domain/entities/JugadorEntity';
import { JugadorMapper } from './JugadorMapper';
import { AppError } from '../../../shared/errors/AppError';

export class SupabaseJugadorRepository implements IJugadorRepository {
  constructor(private readonly supabase: any) {}

  async getAll(): Promise<JugadorEntity[]> {
    const { data, error } = await this.supabase
      .from('jugadores')
      .select('*')
      .order('apellido', { ascending: true });
      
    if (error) throw new AppError(error.message, 500);
    return (data || []).map(JugadorMapper.toDomain);
  }

  async getById(id: string): Promise<JugadorEntity | null> {
    const { data, error } = await this.supabase
      .from('jugadores')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return JugadorMapper.toDomain(data);
  }

  async getByCategoria(categoriaId: string): Promise<JugadorEntity[]> {
    // Para admitir tanto uuid como nombres en esquemas legacy
    const queryField = categoriaId.length === 36 ? 'categoria_id' : 'categoria';
    const { data, error } = await this.supabase
      .from('jugadores')
      .select('*')
      .eq(queryField, categoriaId)
      .order('apellido', { ascending: true });

    if (error) throw new AppError(error.message, 500);
    return (data || []).map(JugadorMapper.toDomain);
  }

  async findByNombreCompleto(nombre: string, apellido: string): Promise<JugadorEntity | null> {
    const { data, error } = await this.supabase
      .from('jugadores')
      .select('*')
      .eq('nombre', nombre)
      .eq('apellido', apellido)
      .eq('activo', true)
      .single();

    if (error || !data) return null;
    return JugadorMapper.toDomain(data);
  }

  async save(jugador: JugadorEntity): Promise<JugadorEntity> {
    const raw = JugadorMapper.toPersistence(jugador);
    const { data, error } = await this.supabase
      .from('jugadores')
      .insert(raw)
      .select()
      .single();

    if (error) throw new AppError(error.message, 500);
    return JugadorMapper.toDomain(data);
  }

  async update(id: string, data: Partial<JugadorProps>): Promise<JugadorEntity> {
    const dbUpdate: any = {};
    if (data.nombre !== undefined) dbUpdate.nombre = data.nombre;
    if (data.apellido !== undefined) dbUpdate.apellido = data.apellido;
    if (data.posicion !== undefined) dbUpdate.posicion = data.posicion;
    if (data.categoriaId !== undefined) dbUpdate.categoria_id = data.categoriaId;
    if (data.equipoId !== undefined) dbUpdate.equipo_id = data.equipoId;
    if (data.numeroCamiseta !== undefined) dbUpdate.numero_camiseta = data.numeroCamiseta;
    if (data.goles !== undefined) dbUpdate.goles = data.goles;
    if (data.asistencias !== undefined) dbUpdate.asistencias = data.asistencias;
    if (data.tarjetasAmarillas !== undefined) dbUpdate.tarjetas_amarillas = data.tarjetasAmarillas;
    if (data.tarjetasRojas !== undefined) dbUpdate.tarjetas_rojas = data.tarjetasRojas;
    if (data.activo !== undefined) dbUpdate.activo = data.activo;

    const { data: updatedData, error } = await this.supabase
      .from('jugadores')
      .update(dbUpdate)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new AppError(error.message, 500);
    return JugadorMapper.toDomain(updatedData);
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('jugadores')
      .delete()
      .eq('id', id);

    if (error) throw new AppError(error.message, 500);
  }
}
