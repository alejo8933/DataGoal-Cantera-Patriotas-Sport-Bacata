import { IEntrenamientoRepository, JugadorAsistencia } from '../domain/ports/IEntrenamientoRepository';

export class GetJugadoresConAsistenciaUseCase {
  constructor(private readonly repo: IEntrenamientoRepository) {}

  async execute(entrenamientoId: string): Promise<JugadorAsistencia[]> {
    return this.repo.getJugadoresConAsistencia(entrenamientoId);
  }
}
