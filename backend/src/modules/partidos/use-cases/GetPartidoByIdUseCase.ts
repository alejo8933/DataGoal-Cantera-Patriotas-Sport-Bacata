import { PartidoEntity } from '../domain/entities/PartidoEntity';
import { IPartidoRepository } from '../domain/ports/IPartidoRepository';

export class GetPartidoByIdUseCase {
  constructor(private readonly repo: IPartidoRepository) {}

  execute(id: string): Promise<PartidoEntity | null> {
    return this.repo.getById(id);
  }
}
