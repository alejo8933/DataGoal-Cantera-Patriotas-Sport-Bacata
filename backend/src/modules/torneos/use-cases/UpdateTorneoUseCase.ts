import { ITorneoRepository } from '../domain/ports/ITorneoRepository';
import { TorneoEntity, TorneoProps } from '../domain/entities/TorneoEntity';
import { AppError } from '../../../shared/errors/AppError';

export class UpdateTorneoUseCase {
  constructor(private readonly repo: ITorneoRepository) {}

  async execute(id: string, data: Partial<Omit<TorneoProps, 'id'>>): Promise<TorneoEntity> {
    const existing = await this.repo.getById(id);
    if (!existing) {
      throw new AppError('El torneo que intentas actualizar no existe.', 404);
    }

    // Validar combinando los datos existentes y las actualizaciones
    const updatedProps: TorneoProps = {
      id: existing.id,
      nombre: data.nombre !== undefined ? data.nombre : existing.nombre,
      categoria: data.categoria !== undefined ? data.categoria : existing.categoria,
      fechaInicio: data.fechaInicio !== undefined ? data.fechaInicio : existing.fechaInicio,
      fechaFin: data.fechaFin !== undefined ? data.fechaFin : existing.fechaFin,
      estado: data.estado !== undefined ? data.estado : existing.estado,
      descripcion: data.descripcion !== undefined ? data.descripcion : existing.descripcion,
      logoUrl: data.logoUrl !== undefined ? data.logoUrl : existing.logoUrl,
      resultado: data.resultado !== undefined ? data.resultado : existing.resultado,
    };

    // Esto ejecutará las validaciones e invariantes de la entidad
    new TorneoEntity(updatedProps);

    return this.repo.update(id, data);
  }
}
