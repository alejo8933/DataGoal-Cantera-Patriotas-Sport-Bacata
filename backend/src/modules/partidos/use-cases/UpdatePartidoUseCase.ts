import { AppError } from '../../../shared/errors/AppError';
import { PartidoEntity } from '../domain/entities/PartidoEntity';
import { IPartidoRepository } from '../domain/ports/IPartidoRepository';
import { UpdatePartidoDTO } from '../dtos/UpdatePartidoDTO';

export class UpdatePartidoUseCase {
  constructor(private readonly repo: IPartidoRepository) {}

  async execute(id: string, data: UpdatePartidoDTO): Promise<PartidoEntity> {
    const actual = await this.repo.getById(id);
    if (!actual) {
      throw new AppError('El partido no existe.', 404);
    }

    new PartidoEntity({
      id: actual.id,
      equipoLocal: data.equipoLocal ?? actual.equipoLocal,
      equipoVisitante: data.equipoVisitante ?? actual.equipoVisitante,
      fecha: data.fecha ?? actual.fecha,
      hora: data.hora !== undefined ? data.hora : actual.hora,
      lugar: data.lugar !== undefined ? data.lugar : actual.lugar,
      golesLocal: data.golesLocal !== undefined ? data.golesLocal : actual.golesLocal,
      golesVisitante: data.golesVisitante !== undefined ? data.golesVisitante : actual.golesVisitante,
      estado: data.estado ?? actual.estado,
      categoria: data.categoria !== undefined ? data.categoria : actual.categoria,
      descripcion: data.descripcion !== undefined ? data.descripcion : actual.descripcion,
    });

    return this.repo.update(id, data);
  }
}
