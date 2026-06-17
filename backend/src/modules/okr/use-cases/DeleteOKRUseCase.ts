import { AppError } from '../../../shared/errors/AppError';
import { IOKRRepository } from '../domain/ports/IOKRRepository';

export class DeleteOKRUseCase {
  constructor(private readonly repo: IOKRRepository) {}

  async execute(id: string): Promise<void> {
    if (!id?.trim()) {
      throw new AppError('El ID del objetivo es obligatorio.', 400);
    }
    await this.repo.delete(id);
  }
}
