import { PartidoEntity } from '../domain/entities/PartidoEntity';
import { PartidoResponseDTO } from '../dtos/PartidoResponseDTO';

export class PartidoMapper {
  static toDomain(row: any): PartidoEntity {
    return new PartidoEntity({
      id: row.id,
      equipoLocal: row.equipo_local,
      equipoVisitante: row.equipo_visitante,
      fecha: row.fecha,
      hora: row.hora ?? null,
      lugar: row.lugar ?? null,
      golesLocal: row.goles_local ?? null,
      golesVisitante: row.goles_visitante ?? null,
      estado: row.estado ?? 'Programado',
      categoria: row.categoria ?? null,
      descripcion: row.descripcion ?? null,
    });
  }

  static toDTO(entity: PartidoEntity): PartidoResponseDTO {
    return {
      id: entity.id,
      equipo_local: entity.equipoLocal,
      equipo_visitante: entity.equipoVisitante,
      fecha: entity.fecha,
      hora: entity.hora,
      lugar: entity.lugar,
      goles_local: entity.golesLocal,
      goles_visitante: entity.golesVisitante,
      estado: entity.estado,
      categoria: entity.categoria,
      descripcion: entity.descripcion,
      torneo: null,
    };
  }

  static toPersistence(entity: PartidoEntity): Record<string, unknown> {
    return {
      id: entity.id,
      equipo_local: entity.equipoLocal,
      equipo_visitante: entity.equipoVisitante,
      fecha: entity.fecha,
      hora: entity.hora,
      lugar: entity.lugar,
      goles_local: entity.golesLocal,
      goles_visitante: entity.golesVisitante,
      estado: entity.estado,
      categoria: entity.categoria,
      descripcion: entity.descripcion,
    };
  }
}
