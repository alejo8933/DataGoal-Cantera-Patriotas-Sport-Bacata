import { IEntrenamientoRepository } from '../domain/ports/IEntrenamientoRepository';

export class DeleteEntrenamientoUseCase {
  constructor(private readonly repo: IEntrenamientoRepository) {}

  async execute(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
