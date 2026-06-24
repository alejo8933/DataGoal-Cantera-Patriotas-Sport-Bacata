import { IEntrenamientoRepository, AsistenciaJugadorReporte } from '../domain/ports/IEntrenamientoRepository';

export class GetAsistenciasPorJugadorUseCase {
  constructor(private readonly repo: IEntrenamientoRepository) {}

  async execute(jugadorId: string): Promise<AsistenciaJugadorReporte[]> {
    return this.repo.getAsistenciasPorJugador(jugadorId);
  }
}
