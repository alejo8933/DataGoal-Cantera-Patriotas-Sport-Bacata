import { AppError } from '../../../shared/errors/AppError';
import { JugadorEntity } from '../../jugadores/domain/entities/JugadorEntity';
import { IJugadorRepository } from '../../jugadores/domain/ports/IJugadorRepository';
import { IPartidoRepository } from '../../partidos/domain/ports/IPartidoRepository';
import { IConvocatoriaRepository } from '../domain/ports/IConvocatoriaRepository';

export interface JugadoresParaConvocatoriaResult {
  jugadores: JugadorEntity[];
  convocadosIds: string[];
  notas: string;
  convocatoriaId: string | undefined;
}

export class GetJugadoresParaConvocatoriaUseCase {
  constructor(
    private readonly partidoRepo: IPartidoRepository,
    private readonly jugadorRepo: IJugadorRepository,
    private readonly convocatoriaRepo: IConvocatoriaRepository,
  ) {}

  async execute(partidoId: string): Promise<JugadoresParaConvocatoriaResult> {
    if (!partidoId?.trim()) {
      throw new AppError('El ID del partido es obligatorio.', 400);
    }

    const partido = await this.partidoRepo.getById(partidoId);
    if (!partido) {
      return { jugadores: [], convocadosIds: [], notas: '', convocatoriaId: undefined };
    }

    const categoria = partido.categoria;
    const jugadoresFuente =
      categoria && categoria !== 'Todos'
        ? await this.jugadorRepo.getByCategoria(categoria)
        : await this.jugadorRepo.getAll();

    const jugadores = jugadoresFuente.filter((j) => j.activo);

    const convocatoria = await this.convocatoriaRepo.getByPartidoId(partidoId);

    return {
      jugadores,
      convocadosIds: convocatoria?.convocadosIds ?? [],
      notas: convocatoria?.notas ?? '',
      convocatoriaId: convocatoria?.id,
    };
  }
}
