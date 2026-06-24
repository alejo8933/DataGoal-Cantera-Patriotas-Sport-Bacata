import { IEntrenamientoRepository, ReporteAsistencia } from '../domain/ports/IEntrenamientoRepository';

export class GetReportesAsistenciaUseCase {
  constructor(private readonly repo: IEntrenamientoRepository) {}

  async execute(): Promise<ReporteAsistencia[]> {
    return this.repo.getReportesAsistencia();
  }
}
