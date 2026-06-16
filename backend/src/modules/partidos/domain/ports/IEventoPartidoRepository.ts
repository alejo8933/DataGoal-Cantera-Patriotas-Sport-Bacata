import { EventoPartidoEntity } from '../entities/EventoPartidoEntity';

export interface IEventoPartidoRepository {
  getByPartido(partidoId: string): Promise<EventoPartidoEntity[]>;
  getById(id: string): Promise<EventoPartidoEntity | null>;
  save(evento: EventoPartidoEntity): Promise<EventoPartidoEntity>;
  delete(id: string): Promise<void>;
}
