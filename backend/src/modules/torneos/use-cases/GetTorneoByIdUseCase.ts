import { ITorneoRepository } from '../domain/ports/ITorneoRepository';
import { TorneoEntity } from '../domain/entities/TorneoEntity';

export class GetTorneoByIdUseCase {
  constructor(private readonly repo: ITorneoRepository) {}

  async execute(id: string): Promise<TorneoEntity | null> {
    return this.repo.getById(id);
  }
}
