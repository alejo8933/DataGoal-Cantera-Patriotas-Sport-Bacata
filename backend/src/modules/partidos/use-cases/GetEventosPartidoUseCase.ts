import { EventoPartidoEntity } from '../domain/entities/EventoPartidoEntity';
import { IEventoPartidoRepository } from '../domain/ports/IEventoPartidoRepository';

export class GetEventosPartidoUseCase {
  constructor(private readonly eventosRepo: IEventoPartidoRepository) {}

  execute(partidoId: string): Promise<EventoPartidoEntity[]> {
    return this.eventosRepo.getByPartido(partidoId);
  }
}
