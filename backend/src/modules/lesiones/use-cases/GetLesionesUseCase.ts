import { ILesionRepository, LesionReadModel } from '../domain/ports/ILesionRepository';

export class GetLesionesUseCase {
  constructor(private readonly repo: ILesionRepository) {}

  execute(): Promise<LesionReadModel[]> {
    return this.repo.getAll();
  }
}
