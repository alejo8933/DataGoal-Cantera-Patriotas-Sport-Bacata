import { EntrenamientoEntity } from '../domain/entities/EntrenamientoEntity';
import { EntrenamientoResponseDTO } from '../dtos/EntrenamientoResponseDTO';

export class EntrenamientoMapper {
  static toDomain(raw: any): EntrenamientoEntity {
    if (!raw) return null as any;

    let tituloReal = raw.titulo || '';
    let tipo: string | null = null;
    let duracion: number | null = null;
    let objetivos: string | null = null;

    if (raw.titulo && raw.titulo.includes(' | JSON_DATA:')) {
      const parts = raw.titulo.split(' | JSON_DATA:');
      tituloReal = parts[0];
      try {
        const metadata = JSON.parse(parts[1]);
        tipo = metadata.tipo || null;
        duracion = metadata.duracion ? Number(metadata.duracion) : null;
        objetivos = metadata.objetivos || null;
      } catch (e) {
        console.error('Error parsing JSON_DATA metadata from title', e);
      }
    } else {
      // Fallback legacy behavior
      if (tituloReal.includes('Táctico')) tipo = 'Táctico';
      else if (tituloReal.includes('Físico')) tipo = 'Físico';
      else if (tituloReal.includes('Técnico')) tipo = 'Técnico';
    }

    return new EntrenamientoEntity({
      id: raw.id,
      titulo: tituloReal,
      fecha: raw.fecha,
      hora: raw.hora,
      lugar: raw.lugar,
      categoria: raw.categoria,
      descripcion: raw.descripcion,
      activo: raw.activo ?? true,
      tipo,
      duracion,
      objetivos,
    });
  }

  static toPersistence(entity: EntrenamientoEntity): any {
    let tituloPersistido = entity.titulo;
    if (entity.tipo || entity.duracion || entity.objetivos) {
      const metadata = {
        tipo: entity.tipo,
        duracion: entity.duracion,
        objetivos: entity.objetivos,
      };
      tituloPersistido = `${entity.titulo} | JSON_DATA:${JSON.stringify(metadata)}`;
    }

    return {
      id: entity.id,
      titulo: tituloPersistido,
      fecha: entity.fecha,
      hora: entity.hora,
      lugar: entity.lugar,
      categoria: entity.categoria,
      descripcion: entity.descripcion,
      activo: entity.activo,
    };
  }

  static toDTO(entity: EntrenamientoEntity): EntrenamientoResponseDTO {
    const serializedTitle = entity.tipo || entity.duracion || entity.objetivos
      ? `${entity.titulo} | JSON_DATA:${JSON.stringify({ tipo: entity.tipo, duracion: entity.duracion, objetivos: entity.objetivos })}`
      : entity.titulo;

    return {
      id: entity.id,
      titulo: serializedTitle,
      fecha: entity.fecha,
      hora: entity.hora,
      lugar: entity.lugar,
      categoria: entity.categoria,
      descripcion: entity.descripcion,
      activo: entity.activo,
      tipo: entity.tipo,
      duracion: entity.duracion,
      objetivos: entity.objetivos,
    };
  }
}
