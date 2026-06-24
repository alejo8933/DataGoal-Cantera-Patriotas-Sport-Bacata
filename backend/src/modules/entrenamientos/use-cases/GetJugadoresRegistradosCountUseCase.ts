import { IEntrenamientoRepository } from '../domain/ports/IEntrenamientoRepository';

export class GetJugadoresRegistradosCountUseCase {
  constructor(private readonly repo: IEntrenamientoRepository) {}

  async execute(): Promise<number> {
    return this.repo.getJugadoresRegistradosCount();
  }
}
