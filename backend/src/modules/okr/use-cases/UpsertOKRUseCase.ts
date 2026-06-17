import { AppError } from '../../../shared/errors/AppError';
import { ObjetivoOKREntity, TipoOKR } from '../domain/entities/ObjetivoOKREntity';
import { IOKRRepository, UpsertObjetivoInput } from '../domain/ports/IOKRRepository';

const TIPOS_VALIDOS: ReadonlyArray<TipoOKR> = ['Club', 'Categoria', 'Personal'];

export interface UpsertOKRCommand {
  id?: string;
  titulo: string;
  descripcion?: string | null;
  tipo: string;
  periodo?: string | null;
}

export class UpsertOKRUseCase {
  constructor(private readonly repo: IOKRRepository) {}

  async execute(command: UpsertOKRCommand): Promise<ObjetivoOKREntity> {
    if (!command.titulo?.trim()) {
      throw new AppError('El título del objetivo es obligatorio.', 400);
    }
    if (!TIPOS_VALIDOS.includes(command.tipo as TipoOKR)) {
      throw new AppError(
        `El tipo debe ser uno de: ${TIPOS_VALIDOS.join(', ')}.`,
        400,
      );
    }

    const input: UpsertObjetivoInput = {
      id: command.id,
      titulo: command.titulo.trim(),
      descripcion: command.descripcion ?? null,
      tipo: command.tipo as TipoOKR,
      periodo: command.periodo ?? null,
    };

    return this.repo.upsertObjetivo(input);
  }
}
