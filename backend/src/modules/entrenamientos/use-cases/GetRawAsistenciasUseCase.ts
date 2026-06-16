import { IEntrenamientoRepository, RawAsistencia } from '../domain/ports/IEntrenamientoRepository';

export class GetRawAsistenciasUseCase {
  constructor(private readonly repo: IEntrenamientoRepository) {}

  async execute(): Promise<RawAsistencia[]> {
    return this.repo.getAllAsistencias();
  }
}
