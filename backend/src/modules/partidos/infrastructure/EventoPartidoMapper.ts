import {
  EquipoEventoPartido,
  EventoPartidoEntity,
  JugadorEventoResumen,
  TipoEventoPartido,
} from '../domain/entities/EventoPartidoEntity';
import { EventoPartidoResponseDTO } from '../dtos/EventoPartidoResponseDTO';

export class EventoPartidoMapper {
  static toDomain(row: any): EventoPartidoEntity {
    const jugadorRow = Array.isArray(row.jugadores)
      ? row.jugadores[0] ?? null
      : row.jugadores ?? null;

    const jugador: JugadorEventoResumen | null = jugadorRow
      ? {
          id: jugadorRow.id,
          nombre: jugadorRow.nombre,
          apellido: jugadorRow.apellido,
          numeroCamiseta: jugadorRow.numero_camiseta ?? null,
        }
      : null;

    return new EventoPartidoEntity({
      id: row.id,
      partidoId: row.partido_id,
      jugadorId: row.jugador_id ?? jugador?.id ?? null,
      minuto: row.minuto,
      tipo: row.tipo as TipoEventoPartido,
      equipo: row.equipo as EquipoEventoPartido,
      descripcion: row.descripcion ?? null,
      createdAt: row.created_at ?? null,
      jugador,
    });
  }

  static toDTO(entity: EventoPartidoEntity): EventoPartidoResponseDTO {
    return {
      id: entity.id,
      partido_id: entity.partidoId,
      jugador_id: entity.jugadorId,
      minuto: entity.minuto,
      tipo: entity.tipo,
      equipo: entity.equipo,
      descripcion: entity.descripcion,
      created_at: entity.createdAt,
      jugadores: entity.jugador
        ? {
            id: entity.jugador.id,
            nombre: entity.jugador.nombre,
            apellido: entity.jugador.apellido,
            numero_camiseta: entity.jugador.numeroCamiseta,
          }
        : null,
    };
  }

  static toPersistence(entity: EventoPartidoEntity): Record<string, unknown> {
    return {
      id: entity.id,
      partido_id: entity.partidoId,
      jugador_id: entity.jugadorId,
      minuto: entity.minuto,
      tipo: entity.tipo,
      equipo: entity.equipo,
      descripcion: entity.descripcion,
    };
  }
}
