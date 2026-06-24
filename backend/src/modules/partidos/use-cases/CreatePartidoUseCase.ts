import { PartidoEntity } from '../domain/entities/PartidoEntity';
import { IPartidoRepository } from '../domain/ports/IPartidoRepository';
import { CreatePartidoDTO } from '../dtos/CreatePartidoDTO';

export class CreatePartidoUseCase {
  constructor(private readonly repo: IPartidoRepository) {}

  async execute(dto: CreatePartidoDTO): Promise<PartidoEntity> {
    const partido = PartidoEntity.create(dto);
    return this.repo.save(partido);
  }
}
