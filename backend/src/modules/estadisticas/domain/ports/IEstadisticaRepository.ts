import { EstadisticaEntity } from '../entities/EstadisticaEntity';

export interface EstadisticasJugadorQuery {
  categoria?: string;
  equipoId?: string;
  soloActivos?: boolean;
  limit?: number;
}

export interface EstadisticasEquipoQuery {
  categoria?: string;
  equipoId?: string;
}

export interface EstadisticaEquipo {
  id: string;
  equipo: string;
  categoria: string | null;
  partidos: number;
  ganados: number;
  empatados: number;
  perdidos: number;
  golesFavor: number;
  golesContra: number;
  puntos: number;
}

export interface GolPorMes {
  periodo: string;
  anio: number;
  mes: number;
  goles: number;
}

export interface ResumenTemporada {
  totalJugadores: number;
  jugadoresActivos: number;
  totalEquipos: number;
  partidosJugados: number;
  golesFavor: number;
  golesContra: number;
  golesJugadores: number;
  asistencias: number;
  tarjetasAmarillas: number;
  tarjetasRojas: number;
  promedioAsistenciaEntrenamientos: number;
  goleador: EstadisticaEntity | null;
  maximoAsistente: EstadisticaEntity | null;
  mejorEquipo: EstadisticaEquipo | null;
}

export interface IEstadisticaRepository {
  getEstadisticasJugador(jugadorId: string): Promise<EstadisticaEntity | null>;
  getEstadisticasJugadorByUserId(userId: string): Promise<EstadisticaEntity | null>;
  getEstadisticasJugadores(
    query?: EstadisticasJugadorQuery
  ): Promise<EstadisticaEntity[]>;
  getGoleadores(limit?: number): Promise<EstadisticaEntity[]>;
  getEstadisticasEquipo(
    query?: EstadisticasEquipoQuery
  ): Promise<EstadisticaEquipo[]>;
  getGolesPorMes(
    query?: Pick<EstadisticasEquipoQuery, 'categoria'>
  ): Promise<GolPorMes[]>;
}
