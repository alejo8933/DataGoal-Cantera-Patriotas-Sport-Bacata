import { ITorneoRepository } from '../domain/ports/ITorneoRepository';
import { TorneoEntity, TorneoProps } from '../domain/entities/TorneoEntity';

export class CreateTorneoUseCase {
  constructor(private readonly repo: ITorneoRepository) {}

  async execute(props: Omit<TorneoProps, 'id'>): Promise<TorneoEntity> {
    const torneo = TorneoEntity.create(props);
    return this.repo.save(torneo);
  }
}
