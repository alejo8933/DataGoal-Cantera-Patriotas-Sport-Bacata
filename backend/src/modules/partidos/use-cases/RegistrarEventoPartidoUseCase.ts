import { AppError } from '../../../shared/errors/AppError';
import { EventoPartidoEntity } from '../domain/entities/EventoPartidoEntity';
import { IEstadisticasEventoRepository } from '../domain/ports/IEstadisticasEventoRepository';
import { IEventoPartidoRepository } from '../domain/ports/IEventoPartidoRepository';
import { IPartidoRepository } from '../domain/ports/IPartidoRepository';
import { CreateEventoPartidoDTO } from '../dtos/CreateEventoPartidoDTO';

export class RegistrarEventoPartidoUseCase {
  constructor(
    private readonly partidosRepo: IPartidoRepository,
    private readonly eventosRepo: IEventoPartidoRepository,
    private readonly estadisticasRepo: IEstadisticasEventoRepository
  ) {}

  async execute(dto: CreateEventoPartidoDTO): Promise<EventoPartidoEntity> {
    const partido = await this.partidosRepo.getById(dto.partidoId);
    if (!partido) {
      throw new AppError('El partido no existe.', 404);
    }

    const evento = EventoPartidoEntity.create(dto);
    const guardado = await this.eventosRepo.save(evento);

    try {
      await this.estadisticasRepo.aplicarImpacto(
        guardado.calcularImpactoEstadistico()
      );
    } catch (error) {
      await this.eventosRepo.delete(guardado.id).catch(() => undefined);
      throw error;
    }

    return guardado;
  }
}
