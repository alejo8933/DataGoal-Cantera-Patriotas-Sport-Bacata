export interface EvaluacionEstadisticaDTO {
  tecnica: number | null;
  fisica: number | null;
  tactica: number | null;
  mental: number | null;
  promedio: number | null;
  created_at: string | null;
}

export interface EstadisticaResponseDTO {
  id: string;
  jugador_id: string;
  nombre: string;
  apellido: string;
  nombre_completo: string;
  posicion: string | null;
  categoria: string;
  equipo_id: string | null;
  equipo: string | null;
  numero_camiseta: number | null;
  foto_url: string | null;
  goles: number;
  asistencias: number;
  tarjetas_amarillas: number;
  tarjetas_rojas: number;
  partidos_jugados: number;
  entrenamientos_registrados: number;
  entrenamientos_presentes: number;
  porcentaje_asistencia_entrenamientos: number;
  promedio_goles_por_partido: number;
  promedio_evaluacion: number | null;
  activo: boolean;
  ultima_evaluacion: EvaluacionEstadisticaDTO | null;
}

export interface GoleadorResponseDTO {
  id: string;
  nombre: string;
  apellido: string;
  categoria: string;
  goles: number;
  asistencias: number;
  foto_url?: string | null;
}

export interface EstadisticaEquipoResponseDTO {
  id: string;
  equipo: string;
  categoria: string;
  partidos: number;
  ganados: number;
  empatados: number;
  perdidos: number;
  goles_favor: number;
  goles_contra: number;
  puntos: number;
  diferencia_goles: number;
  efectividad: number;
}

export interface GolPorMesResponseDTO {
  periodo: string;
  anio: number;
  mes: number;
  etiqueta: string;
  goles: number;
}

export interface ResumenTemporadaResponseDTO {
  total_jugadores: number;
  jugadores_activos: number;
  total_equipos: number;
  partidos_jugados: number;
  goles_favor: number;
  goles_contra: number;
  diferencia_goles: number;
  goles_jugadores: number;
  asistencias: number;
  tarjetas_amarillas: number;
  tarjetas_rojas: number;
  promedio_asistencia_entrenamientos: number;
  goleador: EstadisticaResponseDTO | null;
  maximo_asistente: EstadisticaResponseDTO | null;
  mejor_equipo: EstadisticaEquipoResponseDTO | null;
}
