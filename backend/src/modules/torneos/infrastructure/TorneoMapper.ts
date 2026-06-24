import { TorneoEntity } from '../domain/entities/TorneoEntity';
import { TorneoResponseDTO } from '../dtos/TorneoResponseDTO';

export class TorneoMapper {
  static toDomain(row: any): TorneoEntity {
    return new TorneoEntity({
      id: row.id,
      nombre: row.nombre,
      categoria: row.categoria,
      fechaInicio: row.fecha_inicio,
      fechaFin: row.fecha_fin ?? null,
      estado: row.estado,
      descripcion: row.descripcion ?? null,
      logoUrl: row.logo_url ?? null,
      resultado: row.resultado ?? null,
    });
  }

  static toDTO(entity: TorneoEntity): TorneoResponseDTO {
    return {
      id: entity.id,
      nombre: entity.nombre,
      categoria: entity.categoria,
      fecha_inicio: entity.fechaInicio,
      fecha_fin: entity.fechaFin,
      estado: entity.estado,
      descripcion: entity.descripcion,
      logo_url: entity.logoUrl,
      resultado: entity.resultado,
    };
  }

  static toPersistence(entity: TorneoEntity): Record<string, unknown> {
    return {
      id: entity.id,
      nombre: entity.nombre,
      categoria: entity.categoria,
      fecha_inicio: entity.fechaInicio,
      fecha_fin: entity.fechaFin,
      estado: entity.estado,
      descripcion: entity.descripcion,
      logo_url: entity.logoUrl,
      resultado: entity.resultado,
    };
  }
}
