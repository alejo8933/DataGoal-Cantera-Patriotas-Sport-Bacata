export interface EventoPartidoResponseDTO {
  id: string;
  partido_id: string;
  jugador_id: string | null;
  minuto: number;
  tipo: string;
  equipo: string;
  descripcion: string | null;
  created_at: string | null;
  jugadores: {
    id: string;
    nombre: string;
    apellido: string;
    numero_camiseta: number | null;
  } | null;
}
