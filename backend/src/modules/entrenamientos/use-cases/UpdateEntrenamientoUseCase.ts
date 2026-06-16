import { IEntrenamientoRepository } from '../domain/ports/IEntrenamientoRepository';
import { EntrenamientoEntity, EntrenamientoProps } from '../domain/entities/EntrenamientoEntity';

export class UpdateEntrenamientoUseCase {
  constructor(private readonly repo: IEntrenamientoRepository) {}

  async execute(id: string, data: Partial<Omit<EntrenamientoProps, 'id'>>): Promise<EntrenamientoEntity> {
    return this.repo.update(id, data);
  }
}
