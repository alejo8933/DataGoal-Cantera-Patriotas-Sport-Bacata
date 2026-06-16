import { IEntrenamientoRepository, AsistenciaBulkInput } from '../domain/ports/IEntrenamientoRepository';

export class GuardarAsistenciasBulkUseCase {
  constructor(private readonly repo: IEntrenamientoRepository) {}

  async execute(entrenamientoId: string, asistencias: AsistenciaBulkInput[]): Promise<void> {
    return this.repo.guardarAsistenciasBulk(entrenamientoId, asistencias);
  }
}
