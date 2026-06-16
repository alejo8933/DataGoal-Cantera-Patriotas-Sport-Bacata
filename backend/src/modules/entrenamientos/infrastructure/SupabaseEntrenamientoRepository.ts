import { IEntrenamientoRepository, JugadorAsistencia, AsistenciaBulkInput, ReporteAsistencia, RawAsistencia, AsistenciaJugadorReporte } from '../domain/ports/IEntrenamientoRepository';
import { EntrenamientoEntity, EntrenamientoProps } from '../domain/entities/EntrenamientoEntity';
import { EntrenamientoMapper } from './EntrenamientoMapper';
import { AppError } from '../../../shared/errors/AppError';

export class SupabaseEntrenamientoRepository implements IEntrenamientoRepository {
  constructor(private readonly supabase: any) {}

  async getAll(): Promise<EntrenamientoEntity[]> {
    const { data, error } = await this.supabase
      .from('entrenamientos')
      .select('*')
      .order('fecha', { ascending: false });

    if (error) throw new AppError(error.message, 500);
    return (data || []).map(EntrenamientoMapper.toDomain);
  }

  async getById(id: string): Promise<EntrenamientoEntity | null> {
    const { data, error } = await this.supabase
      .from('entrenamientos')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return EntrenamientoMapper.toDomain(data);
  }

  async getByCategoria(categoria: string): Promise<EntrenamientoEntity[]> {
    const { data, error } = await this.supabase
      .from('entrenamientos')
      .select('*')
      .eq('categoria', categoria)
      .order('fecha', { ascending: false });

    if (error) throw new AppError(error.message, 500);
    return (data || []).map(EntrenamientoMapper.toDomain);
  }

  async save(entrenamiento: EntrenamientoEntity): Promise<EntrenamientoEntity> {
    const raw = EntrenamientoMapper.toPersistence(entrenamiento);
    const { data, error } = await this.supabase
      .from('entrenamientos')
      .insert(raw)
      .select()
      .single();

    if (error) throw new AppError(error.message, 500);
    return EntrenamientoMapper.toDomain(data);
  }

  async update(id: string, data: Partial<Omit<EntrenamientoProps, 'id'>>): Promise<EntrenamientoEntity> {
    const existing = await this.getById(id);
    if (!existing) {
      throw new AppError('El entrenamiento no existe.', 404);
    }

    const updated = new EntrenamientoEntity({
      id: existing.id,
      titulo: data.titulo !== undefined ? data.titulo : existing.titulo,
      fecha: data.fecha !== undefined ? data.fecha : existing.fecha,
      hora: data.hora !== undefined ? data.hora : existing.hora,
      lugar: data.lugar !== undefined ? data.lugar : existing.lugar,
      categoria: data.categoria !== undefined ? data.categoria : existing.categoria,
      descripcion: data.descripcion !== undefined ? data.descripcion : existing.descripcion,
      activo: data.activo !== undefined ? data.activo : existing.activo,
      tipo: data.tipo !== undefined ? data.tipo : existing.tipo,
      duracion: data.duracion !== undefined ? data.duracion : existing.duracion,
      objetivos: data.objetivos !== undefined ? data.objetivos : existing.objetivos,
    });

    const raw = EntrenamientoMapper.toPersistence(updated);
    const { error } = await this.supabase
      .from('entrenamientos')
      .update(raw)
      .eq('id', id);

    if (error) throw new AppError(error.message, 500);
    return updated;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('entrenamientos')
      .delete()
      .eq('id', id);

    if (error) throw new AppError(error.message, 500);
  }

  async getJugadoresConAsistencia(entrenamientoId: string): Promise<JugadorAsistencia[]> {
    const { data: jugadores, error: jError } = await this.supabase
      .from('perfiles')
      .select('id, nombre, apellido, posicion, categoria')
      .eq('rol', 'jugador')
      .eq('activo', true)
      .order('apellido', { ascending: true });

    if (jError) throw new AppError(jError.message, 500);

    const { data: asistencias, error: aError } = await this.supabase
      .from('asistencias')
      .select('jugador_id, presente, excusa, hora_llegada')
      .eq('entrenamiento_id', entrenamientoId);

    if (aError) throw new AppError(aError.message, 500);

    const asistenciaMap = new Map<string, any>((asistencias || []).map((a: any) => [a.jugador_id, a]));

    return (jugadores || []).map((j: any) => {
      const asis = asistenciaMap.get(j.id) as any;
      return {
        id: j.id,
        nombre: j.nombre,
        apellido: j.apellido,
        posicion: j.posicion,
        categoria: j.categoria,
        presente: asis ? asis.presente : null,
        excusa: asis ? (asis.excusa || '') : '',
        hora_llegada: asis ? (asis.hora_llegada || '') : '',
        registrado: !!asis,
      };
    });
  }

  async guardarAsistenciasBulk(entrenamientoId: string, asistencias: AsistenciaBulkInput[]): Promise<void> {
    const payload = asistencias.map(a => ({
      jugador_id: a.jugadorId,
      entrenamiento_id: entrenamientoId,
      presente: a.presente,
      excusa: a.excusa || null,
      hora_llegada: a.horaLlegada || null,
    }));

    const { error } = await this.supabase
      .from('asistencias')
      .upsert(payload, { onConflict: 'jugador_id,entrenamiento_id' });

    if (error) throw new AppError(error.message, 500);
  }

  async getReportesAsistencia(): Promise<ReporteAsistencia[]> {
    const { data: jugadores, error: jError } = await this.supabase
      .from('perfiles')
      .select('id, nombre, apellido, posicion, categoria')
      .eq('rol', 'jugador')
      .eq('activo', true)
      .order('apellido', { ascending: true });

    if (jError) throw new AppError(jError.message, 500);

    const { data: asistencias, error: aError } = await this.supabase
      .from('asistencias')
      .select('jugador_id, presente');

    if (aError) throw new AppError(aError.message, 500);

    const records = asistencias || [];

    return (jugadores || []).map((j: any) => {
      const playerRecords = records.filter((a: any) => a.jugador_id === j.id);
      const total = playerRecords.length;
      const presentes = playerRecords.filter((a: any) => a.presente === true).length;
      const ausentes = total - presentes;
      const porcentaje = total > 0 ? (presentes / total) * 100 : 0;

      return {
        id: j.id,
        nombre: j.nombre,
        apellido: j.apellido,
        posicion: j.posicion,
        categoria: j.categoria,
        totalEntrenamientos: total,
        presentes,
        ausentes,
        porcentajeTotal: porcentaje,
      };
    });
  }

  async getJugadoresRegistradosCount(): Promise<number> {
    const { data, error } = await this.supabase
      .from('jugadores')
      .select('id')
      .eq('activo', true);

    if (error) throw new AppError(error.message, 500);
    return (data || []).length;
  }

  async getAllAsistencias(): Promise<RawAsistencia[]> {
    const { data, error } = await this.supabase
      .from('asistencias')
      .select('entrenamiento_id, jugador_id, presente');

    if (error) throw new AppError(error.message, 500);

    return (data || []).map((a: any) => ({
      entrenamiento_id: a.entrenamiento_id,
      jugador_id: a.jugador_id,
      estado: a.presente ? 'presente' : 'ausente',
    }));
  }

  async getAsistenciasPorJugador(jugadorId: string): Promise<AsistenciaJugadorReporte[]> {
    const { data, error } = await this.supabase
      .from('asistencias')
      .select('id, entrenamiento_id, presente, excusa, hora_llegada')
      .eq('jugador_id', jugadorId);

    if (error) throw new AppError(error.message, 500);
    return data || [];
  }
}
