import type { SupabaseClient } from '@supabase/supabase-js';
import { AppError } from '../../../shared/errors/AppError';
import {
  EstadisticaEntity,
  EvaluacionEstadistica,
} from '../domain/entities/EstadisticaEntity';
import {
  EstadisticaEquipo,
  EstadisticasEquipoQuery,
  EstadisticasJugadorQuery,
  GolPorMes,
  IEstadisticaRepository,
} from '../domain/ports/IEstadisticaRepository';
import { EstadisticaMapper } from './EstadisticaMapper';

interface AsistenciaAggregate {
  total: number;
  presentes: number;
}

export class SupabaseEstadisticaRepository implements IEstadisticaRepository {
  private readonly jugadoresSelect =
    '*, categorias_maestras(nombre), rendimiento_equipos(equipo)';

  constructor(private readonly supabase: SupabaseClient<any, any, any>) {}

  async getEstadisticasJugador(
    jugadorId: string
  ): Promise<EstadisticaEntity | null> {
    const { data, error } = await this.supabase
      .from('jugadores')
      .select(this.jugadoresSelect)
      .eq('id', jugadorId)
      .maybeSingle();

    if (error) throw new AppError(error.message, 500);
    if (!data) return null;

    const [entity] = await this.hidratarJugadores([data]);
    return entity ?? null;
  }

  async getEstadisticasJugadorByUserId(
    userId: string
  ): Promise<EstadisticaEntity | null> {
    const { data, error } = await this.supabase
      .from('jugadores')
      .select(this.jugadoresSelect)
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw new AppError(error.message, 500);
    if (!data) return null;

    const [entity] = await this.hidratarJugadores([data]);
    return entity ?? null;
  }

  async getEstadisticasJugadores(
    query?: EstadisticasJugadorQuery
  ): Promise<EstadisticaEntity[]> {
    let request = this.supabase
      .from('jugadores')
      .select(this.jugadoresSelect)
      .order('apellido', { ascending: true });

    if (query?.categoria) {
      const field = this.looksLikeUuid(query.categoria)
        ? 'categoria_id'
        : 'categoria';
      request = request.eq(field, query.categoria);
    }

    if (query?.equipoId) {
      request = request.eq('equipo_id', query.equipoId);
    }

    if (query?.soloActivos) {
      request = request.eq('activo', true);
    }

    if (query?.limit) {
      request = request.limit(query.limit);
    }

    const { data, error } = await request;

    if (error) throw new AppError(error.message, 500);
    return this.hidratarJugadores(data ?? []);
  }

  async getGoleadores(limit = 20): Promise<EstadisticaEntity[]> {
    const { data, error } = await this.supabase
      .from('jugadores')
      .select(this.jugadoresSelect)
      .gt('goles', 0)
      .order('goles', { ascending: false })
      .limit(limit);

    if (error) throw new AppError(error.message, 500);
    return this.hidratarJugadores(data ?? []);
  }

  async getEstadisticasEquipo(
    query?: EstadisticasEquipoQuery
  ): Promise<EstadisticaEquipo[]> {
    let request = this.supabase
      .from('rendimiento_equipos')
      .select('*')
      .order('puntos', { ascending: false });

    if (query?.equipoId) {
      request = request.eq('id', query.equipoId);
    }

    if (query?.categoria) {
      request = request.eq('categoria', query.categoria);
    }

    const { data, error } = await request;

    if (error) throw new AppError(error.message, 500);
    return (data ?? []).map((row: any) =>
      EstadisticaMapper.toEquipoDomain(row)
    );
  }

  async getGolesPorMes(
    query?: Pick<EstadisticasEquipoQuery, 'categoria'>
  ): Promise<GolPorMes[]> {
    let request = this.supabase
      .from('eventos_partido')
      .select('partido_id, partidos!inner(fecha, categoria)')
      .eq('tipo', 'gol');

    if (query?.categoria) {
      request = request.eq('partidos.categoria', query.categoria);
    }

    const { data, error } = await request;
    if (error) throw new AppError(error.message, 500);

    const golesPorPeriodo = new Map<string, GolPorMes>();

    for (const row of data ?? []) {
      const partido = Array.isArray(row.partidos)
        ? row.partidos[0]
        : row.partidos;
      const fecha = typeof partido?.fecha === 'string' ? partido.fecha : '';
      const match = /^(\d{4})-(\d{2})/.exec(fecha);
      if (!match) continue;

      const periodo = `${match[1]}-${match[2]}`;
      const actual = golesPorPeriodo.get(periodo);

      golesPorPeriodo.set(periodo, {
        periodo,
        anio: Number(match[1]),
        mes: Number(match[2]),
        goles: (actual?.goles ?? 0) + 1,
      });
    }

    return [...golesPorPeriodo.values()].sort((a, b) =>
      a.periodo.localeCompare(b.periodo)
    );
  }

  private async hidratarJugadores(rows: any[]): Promise<EstadisticaEntity[]> {
    const ids = rows
      .map((row) => row.id)
      .filter((id): id is string => typeof id === 'string' && id.length > 0);

    const [partidos, asistencias, evaluaciones] = await Promise.all([
      this.getPartidosPorJugador(ids),
      this.getAsistenciasPorJugador(ids),
      this.getUltimaEvaluacionPorJugador(ids),
    ]);

    return rows.map((row) => {
      const asistencia = asistencias.get(row.id);

      return EstadisticaMapper.toDomain(row, {
        partidosJugados: partidos.get(row.id) ?? 0,
        entrenamientosRegistrados: asistencia?.total ?? 0,
        entrenamientosPresentes: asistencia?.presentes ?? 0,
        ultimaEvaluacion: evaluaciones.get(row.id) ?? null,
      });
    });
  }

  private async getPartidosPorJugador(
    jugadorIds: string[]
  ): Promise<Map<string, number>> {
    const result = new Map<string, Set<string>>();
    if (jugadorIds.length === 0) return new Map();

    const { data, error } = await this.supabase
      .from('eventos_partido')
      .select('jugador_id, partido_id')
      .in('jugador_id', jugadorIds);

    if (error) throw new AppError(error.message, 500);

    for (const row of data ?? []) {
      if (!row.jugador_id || !row.partido_id) continue;
      const partidos = result.get(row.jugador_id) ?? new Set<string>();
      partidos.add(row.partido_id);
      result.set(row.jugador_id, partidos);
    }

    return new Map(
      [...result.entries()].map(([jugadorId, partidos]) => [
        jugadorId,
        partidos.size,
      ])
    );
  }

  private async getAsistenciasPorJugador(
    jugadorIds: string[]
  ): Promise<Map<string, AsistenciaAggregate>> {
    const result = new Map<string, AsistenciaAggregate>();
    if (jugadorIds.length === 0) return result;

    const { data, error } = await this.supabase
      .from('asistencias')
      .select('jugador_id, presente')
      .in('jugador_id', jugadorIds);

    if (error) throw new AppError(error.message, 500);

    for (const row of data ?? []) {
      if (!row.jugador_id) continue;

      const current = result.get(row.jugador_id) ?? {
        total: 0,
        presentes: 0,
      };

      current.total += 1;
      if (row.presente) current.presentes += 1;
      result.set(row.jugador_id, current);
    }

    return result;
  }

  private async getUltimaEvaluacionPorJugador(
    jugadorIds: string[]
  ): Promise<Map<string, EvaluacionEstadistica>> {
    const result = new Map<string, EvaluacionEstadistica>();
    if (jugadorIds.length === 0) return result;

    const { data, error } = await this.supabase
      .from('evaluaciones')
      .select('jugador_id, tecnica, fisica, tactica, mental, created_at')
      .in('jugador_id', jugadorIds)
      .order('created_at', { ascending: false });

    if (error) throw new AppError(error.message, 500);

    for (const row of data ?? []) {
      if (!row.jugador_id || result.has(row.jugador_id)) continue;

      result.set(row.jugador_id, {
        tecnica: this.toNullableScore(row.tecnica),
        fisica: this.toNullableScore(row.fisica),
        tactica: this.toNullableScore(row.tactica),
        mental: this.toNullableScore(row.mental),
        createdAt: row.created_at ?? null,
      });
    }

    return result;
  }

  private toNullableScore(value: unknown): number | null {
    return typeof value === 'number' && Number.isFinite(value) ? value : null;
  }

  private looksLikeUuid(value: string): boolean {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      value
    );
  }
}
