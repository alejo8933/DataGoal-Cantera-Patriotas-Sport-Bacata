export interface EntrenamientoResponseDTO {
  id: string;
  titulo: string;
  fecha: string;
  hora: string | null;
  lugar: string | null;
  categoria: string;
  descripcion: string | null;
  activo: boolean;
  tipo: string | null;
  duracion: number | null;
  objetivos: string | null;
}

export interface CreateEntrenamientoDTO {
  titulo: string;
  fecha: string;
  hora?: string | null;
  lugar?: string | null;
  categoria: string;
  descripcion?: string | null;
  activo?: boolean;
  tipo?: string | null;
  duracion?: number | null;
  objetivos?: string | null;
}

export interface JugadorAsistenciaDTO {
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

export interface ReporteAsistenciaDTO {
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
