import { JugadorEntity } from '../domain/entities/JugadorEntity';
import { JugadorResponseDTO } from '../dtos/JugadorResponseDTO';

export class JugadorMapper {
  static toDomain(row: any): JugadorEntity {
    return new JugadorEntity({
      id: row.id,
      nombre: row.nombre,
      apellido: row.apellido,
      posicion: row.posicion,
      categoriaId: row.categoria_id || row.categoria, // Mapeo flexible
      equipoId: row.equipo_id,
      numeroCamiseta: row.numero_camiseta,
      goles: row.goles ?? 0,
      asistencias: row.asistencias ?? 0,
      tarjetasAmarillas: row.tarjetas_amarillas ?? 0,
      tarjetasRojas: row.tarjetas_rojas ?? 0,
      activo: row.activo ?? true,
    });
  }

  static toDTO(entity: JugadorEntity): JugadorResponseDTO {
    return {
      id: entity.id,
      nombre: entity.nombre,
      apellido: entity.apellido,
      nombreCompleto: entity.getNombreCompleto(),
      posicion: entity.posicion,
      categoriaId: entity.categoriaId,
      equipoId: entity.equipoId,
      numeroCamiseta: entity.numeroCamiseta,
      goles: entity.goles,
      asistencias: entity.asistencias,
      tarjetasAmarillas: entity.tarjetasAmarillas,
      tarjetasRojas: entity.tarjetasRojas,
      activo: entity.activo,
    };
  }

  static toPersistence(entity: JugadorEntity): any {
    return {
      id: entity.id,
      nombre: entity.nombre,
      apellido: entity.apellido,
      posicion: entity.posicion,
      categoria_id: entity.categoriaId,
      equipo_id: entity.equipoId,
      numero_camiseta: entity.numeroCamiseta,
      goles: entity.goles,
      asistencias: entity.asistencias,
      tarjetas_amarillas: entity.tarjetasAmarillas,
      tarjetas_rojas: entity.tarjetasRojas,
      activo: entity.activo,
    };
  }
}
