// Temporary compatibility contract for existing UI consumers.
export interface PartidoResponseDTO {
  id: string;
  equipo_local: string;
  equipo_visitante: string;
  fecha: string;
  hora: string | null;
  lugar: string | null;
  goles_local: number | null;
  goles_visitante: number | null;
  estado: string;
  categoria: string | null;
  descripcion: string | null;
  torneo: string | null;
}
