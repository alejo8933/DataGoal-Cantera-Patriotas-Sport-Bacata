import {
  EquipoEventoPartido,
  TipoEventoPartido,
} from '../domain/entities/EventoPartidoEntity';

export interface CreateEventoPartidoDTO {
  partidoId: string;
  jugadorId: string | null;
  minuto: number;
  tipo: TipoEventoPartido;
  equipo: EquipoEventoPartido;
  descripcion: string | null;
}
