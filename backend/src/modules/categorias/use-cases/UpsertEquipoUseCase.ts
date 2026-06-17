import { AppError } from '../../../shared/errors/AppError';
import { EquipoInput, ICategoriaRepository } from '../domain/ports/ICategoriaRepository';

export interface UpsertEquipoCommand {
  id?: string | null;
  equipo: string;
  tecnicoId?: string | null;
  sede?: string | null;
  fundacion?: number | null;
  categoriaId: string;
  color?: string | null;
  horario?: string | null;
}

export class UpsertEquipoUseCase {
  constructor(private readonly repo: ICategoriaRepository) {}

  async execute(command: UpsertEquipoCommand): Promise<{ created: boolean }> {
    if (!command.equipo?.trim()) {
      throw new AppError('El nombre del equipo es obligatorio.', 400);
    }
    if (!command.categoriaId?.trim()) {
      throw new AppError('La categoría maestra es obligatoria.', 400);
    }

    const input: EquipoInput = {
      equipo: command.equipo,
      tecnicoId: command.tecnicoId ?? null,
      sede: command.sede || 'Sede Principal',
      fundacion: command.fundacion || 2024,
      categoriaId: command.categoriaId,
      color: command.color ?? null,
      horario: command.horario ?? null,
    };

    if (command.id) {
      await this.repo.actualizarEquipo(command.id, input);
      return { created: false };
    }

    const yaExiste = await this.repo.existeEquipoEnCategoria(command.equipo, command.categoriaId);
    if (yaExiste) {
      throw new AppError('Ya existe este equipo en la categoría seleccionada.', 409);
    }

    await this.repo.crearEquipo(input);
    return { created: true };
  }
}
