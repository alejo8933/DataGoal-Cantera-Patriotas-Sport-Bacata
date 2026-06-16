export interface UpdatePartidoDTO {
  equipoLocal?: string;
  equipoVisitante?: string;
  fecha?: string;
  hora?: string | null;
  lugar?: string | null;
  golesLocal?: number | null;
  golesVisitante?: number | null;
  estado?: string;
  categoria?: string | null;
  descripcion?: string | null;
}
