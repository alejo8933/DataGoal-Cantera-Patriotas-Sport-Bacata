import { AppError } from '../../../shared/errors/AppError';
import {
  CategoriaMaestraInput,
  ICategoriaRepository,
} from '../domain/ports/ICategoriaRepository';

export interface UpsertCategoriaMaestraCommand {
  id?: string | null;
  nombre: string;
  edades?: string | null;
  modalidad?: string | null;
}

export class UpsertCategoriaMaestraUseCase {
  constructor(private readonly repo: ICategoriaRepository) {}

  async execute(command: UpsertCategoriaMaestraCommand): Promise<{ created: boolean }> {
    if (!command.nombre?.trim()) {
      throw new AppError('El nombre es obligatorio.', 400);
    }

    const input: CategoriaMaestraInput = {
      nombre: command.nombre,
      edades: command.edades ?? null,
      modalidad: command.modalidad ?? null,
    };

    if (command.id) {
      await this.repo.actualizarCategoriaMaestra(command.id, input);
      return { created: false };
    }

    await this.repo.crearCategoriaMaestra(input);
    return { created: true };
  }
}
