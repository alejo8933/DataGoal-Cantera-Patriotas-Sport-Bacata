import { UsuarioEntity } from '../domain/entities/UsuarioEntity';
import { UsuarioResponseDTO, PerfilResumenDTO } from '../dtos/UsuarioResponseDTO';

export class UsuarioMapper {
  static toDomain(row: Record<string, unknown>): UsuarioEntity {
    return new UsuarioEntity({
      id: row.id as string,
      email: (row.email as string | null) ?? null,
      nombre: (row.nombre as string | null) ?? null,
      apellido: (row.apellido as string | null) ?? null,
      rol: (row.rol as UsuarioEntity['rol']) ?? 'jugador',
      telefono: (row.telefono as string | null) ?? null,
      fechaNacimiento: (row.fecha_nacimiento as string | null) ?? null,
      posicion: (row.posicion as string | null) ?? null,
      categoria: (row.categoria as string | null) ?? null,
      genero: (row.genero as string | null) ?? null,
      documento: (row.documento as string | null) ?? null,
      activo: (row.activo as boolean) ?? true,
    });
  }

  static toDTO(entity: UsuarioEntity): UsuarioResponseDTO {
    return {
      id: entity.id,
      email: entity.email,
      nombre: entity.nombre,
      apellido: entity.apellido,
      nombreCompleto: entity.getNombreCompleto(),
      rol: entity.rol,
      telefono: entity.telefono,
      fechaNacimiento: entity.fechaNacimiento,
      posicion: entity.posicion,
      categoria: entity.categoria,
      genero: entity.genero,
      documento: entity.documento,
      activo: entity.activo,
    };
  }

  static toResumen(entity: UsuarioEntity): PerfilResumenDTO {
    return {
      rol: entity.rol,
      activo: entity.activo,
      nombre: entity.nombre,
      apellido: entity.apellido,
    };
  }

  static toPersistence(entity: UsuarioEntity): Record<string, unknown> {
    return {
      id: entity.id,
      email: entity.email,
      nombre: entity.nombre,
      apellido: entity.apellido,
      rol: entity.rol,
      telefono: entity.telefono,
      fecha_nacimiento: entity.fechaNacimiento,
      posicion: entity.posicion,
      categoria: entity.categoria,
      genero: entity.genero,
      documento: entity.documento,
      activo: entity.activo,
    };
  }

  static toUpdatePersistence(data: Partial<ReturnType<typeof UsuarioMapper.toPersistence>>): Record<string, unknown> {
    const dbUpdate: Record<string, unknown> = {};
    if (data.nombre !== undefined) dbUpdate.nombre = data.nombre;
    if (data.apellido !== undefined) dbUpdate.apellido = data.apellido;
    if (data.rol !== undefined) dbUpdate.rol = data.rol;
    if (data.telefono !== undefined) dbUpdate.telefono = data.telefono;
    if (data.fecha_nacimiento !== undefined) dbUpdate.fecha_nacimiento = data.fecha_nacimiento;
    if (data.posicion !== undefined) dbUpdate.posicion = data.posicion;
    if (data.categoria !== undefined) dbUpdate.categoria = data.categoria;
    if (data.genero !== undefined) dbUpdate.genero = data.genero;
    if (data.documento !== undefined) dbUpdate.documento = data.documento;
    if (data.activo !== undefined) dbUpdate.activo = data.activo;
    return dbUpdate;
  }
}
