import { IEntrenamientoRepository } from '../domain/ports/IEntrenamientoRepository';
import { EntrenamientoEntity } from '../domain/entities/EntrenamientoEntity';
import { CreateEntrenamientoDTO } from '../dtos/EntrenamientoResponseDTO';

export class CreateEntrenamientoUseCase {
  constructor(private readonly repo: IEntrenamientoRepository) {}

  async execute(dto: CreateEntrenamientoDTO): Promise<EntrenamientoEntity> {
    const entity = EntrenamientoEntity.create({
      titulo: dto.titulo,
      fecha: dto.fecha,
      hora: dto.hora ?? null,
      lugar: dto.lugar ?? null,
      categoria: dto.categoria,
      descripcion: dto.descripcion ?? null,
      activo: dto.activo ?? true,
      tipo: dto.tipo ?? null,
      duracion: dto.duracion !== undefined && dto.duracion !== null ? Number(dto.duracion) : null,
      objetivos: dto.objetivos ?? null,
    });

    return this.repo.save(entity);
  }
}
