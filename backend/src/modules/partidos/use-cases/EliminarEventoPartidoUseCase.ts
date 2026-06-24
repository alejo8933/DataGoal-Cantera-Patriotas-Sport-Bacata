import { AppError } from '../../../shared/errors/AppError';
import { EventoPartidoEntity } from '../domain/entities/EventoPartidoEntity';
import { IEstadisticasEventoRepository } from '../domain/ports/IEstadisticasEventoRepository';
import { IEventoPartidoRepository } from '../domain/ports/IEventoPartidoRepository';

export class EliminarEventoPartidoUseCase {
  constructor(
    private readonly eventosRepo: IEventoPartidoRepository,
    private readonly estadisticasRepo: IEstadisticasEventoRepository
  ) {}

  async execute(id: string): Promise<EventoPartidoEntity> {
    const evento = await this.eventosRepo.getById(id);
    if (!evento) {
      throw new AppError('El evento no existe.', 404);
    }

    await this.estadisticasRepo.aplicarImpacto(
      evento.calcularImpactoEstadistico(-1)
    );

    try {
      await this.eventosRepo.delete(id);
    } catch (error) {
      await this.estadisticasRepo
        .aplicarImpacto(evento.calcularImpactoEstadistico())
        .catch(() => undefined);
      throw error;
    }

    return evento;
  }
}
