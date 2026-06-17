import { AppError } from '../../../shared/errors/AppError';
import { KRProps, ObjetivoOKREntity } from '../domain/entities/ObjetivoOKREntity';
import { AddKRInput, IOKRRepository } from '../domain/ports/IOKRRepository';

export interface AddKRCommand {
  objetivoId: string;
  nombre: string;
  valorActual?: number;
  valorMeta: number;
  unidad?: string;
  kpiSlug?: string | null;
}

export class AddKRUseCase {
  constructor(private readonly repo: IOKRRepository) {}

  async execute(command: AddKRCommand): Promise<KRProps> {
    if (!command.objetivoId?.trim()) {
      throw new AppError('El ID del objetivo es obligatorio.', 400);
    }

    const candidate: KRProps = {
      id: 'pending',
      nombre: command.nombre,
      valorActual: command.valorActual ?? 0,
      valorMeta: command.valorMeta,
      unidad: command.unidad?.trim() || '%',
      kpiSlug: command.kpiSlug ?? null,
    };

    // Reutiliza la validación de la entidad agregada para mantener invariantes consistentes.
    ObjetivoOKREntity.validateKRInput(candidate);

    const input: AddKRInput = {
      objetivoId: command.objetivoId,
      nombre: candidate.nombre,
      valorActual: candidate.valorActual,
      valorMeta: candidate.valorMeta,
      unidad: candidate.unidad,
      kpiSlug: candidate.kpiSlug,
    };

    return this.repo.addKR(input);
  }
}
