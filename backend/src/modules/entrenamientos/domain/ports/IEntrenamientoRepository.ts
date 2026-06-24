import { EntrenamientoEntity, EntrenamientoProps } from '../entities/EntrenamientoEntity';

export interface JugadorAsistencia {
  id: string;
  nombre: string;
  apellido: string;
  posicion: string | null;
  categoria: string | null;
  presente: boolean | null;
  excusa: string;
  hora_llegada: string | null;
  registrado: boolean;
}

export interface AsistenciaBulkInput {
  jugadorId: string;
  presente: boolean;
  excusa?: string | null;
  horaLlegada?: string | null;
  notas?: string | null;
}

export interface ReporteAsistencia {
  id: string;
  nombre: string;
  apellido: string;
  posicion: string | null;
  categoria: string | null;
  totalEntrenamientos: number;
  presentes: number;
  ausentes: number;
  porcentajeTotal: number;
}

export interface RawAsistencia {
  entrenamiento_id: string;
  jugador_id: string;
  estado: string;
}

export interface AsistenciaJugadorReporte {
  id: string;
  entrenamiento_id: string;
  presente: boolean;
  excusa: string | null;
  hora_llegada: string | null;
}

export interface IEntrenamientoRepository {
  getAll(): Promise<EntrenamientoEntity[]>;
  getById(id: string): Promise<EntrenamientoEntity | null>;
  getByCategoria(categoria: string): Promise<EntrenamientoEntity[]>;
  save(entrenamiento: EntrenamientoEntity): Promise<EntrenamientoEntity>;
  update(id: string, data: Partial<Omit<EntrenamientoProps, 'id'>>): Promise<EntrenamientoEntity>;
  delete(id: string): Promise<void>;
  
  // Operaciones de asistencia
  getJugadoresConAsistencia(entrenamientoId: string): Promise<JugadorAsistencia[]>;
  guardarAsistenciasBulk(entrenamientoId: string, asistencias: AsistenciaBulkInput[]): Promise<void>;
  getReportesAsistencia(): Promise<ReporteAsistencia[]>;
  getJugadoresRegistradosCount(): Promise<number>;
  getAllAsistencias(): Promise<RawAsistencia[]>;
  getAsistenciasPorJugador(jugadorId: string): Promise<AsistenciaJugadorReporte[]>;
}
