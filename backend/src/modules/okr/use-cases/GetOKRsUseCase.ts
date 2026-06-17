import { ObjetivoOKREntity } from '../domain/entities/ObjetivoOKREntity';
import { IOKRRepository } from '../domain/ports/IOKRRepository';

export class GetOKRsUseCase {
  constructor(private readonly repo: IOKRRepository) {}

  execute(): Promise<ObjetivoOKREntity[]> {
    return this.repo.getAll();
  }
}
