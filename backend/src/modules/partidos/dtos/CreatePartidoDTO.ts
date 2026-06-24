export interface CreatePartidoDTO {
  equipoLocal: string;
  equipoVisitante: string;
  fecha: string;
  hora: string | null;
  lugar: string | null;
  categoria: string | null;
  descripcion: string | null;
}
