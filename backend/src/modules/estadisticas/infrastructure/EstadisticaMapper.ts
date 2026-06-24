import {
  EstadisticaEntity,
  EvaluacionEstadistica,
} from '../domain/entities/EstadisticaEntity';
import {
  EstadisticaEquipo,
  GolPorMes,
  ResumenTemporada,
} from '../domain/ports/IEstadisticaRepository';
import {
  EstadisticaEquipoResponseDTO,
  EstadisticaResponseDTO,
  GolPorMesResponseDTO,
  GoleadorResponseDTO,
  ResumenTemporadaResponseDTO,
} from '../dtos/EstadisticaResponseDTO';

export interface EstadisticaExtras {
  partidosJugados?: number;
  entrenamientosRegistrados?: number;
  entrenamientosPresentes?: number;
  ultimaEvaluacion?: EvaluacionEstadistica | null;
}

export class EstadisticaMapper {
  static toDomain(row: any, extras: EstadisticaExtras = {}): EstadisticaEntity {
    const categoria = this.getRelationValue(row.categorias_maestras, 'nombre')
      ?? row.categoria_nombre
      ?? row.categoria
      ?? row.categoria_id
      ?? null;

    const equipo = this.getRelationValue(row.rendimiento_equipos, 'equipo')
      ?? row.equipo
      ?? null;

    return new EstadisticaEntity({
      id: row.id,
      jugadorId: row.id,
      nombre: row.nombre,
      apellido: row.apellido,
      posicion: row.posicion ?? null,
      categoria,
      equipoId: row.equipo_id ?? null,
      equipo,
      numeroCamiseta: row.numero_camiseta ?? null,
      fotoUrl: row.foto_url ?? null,
      goles: this.toNumber(row.goles),
      asistencias: this.toNumber(row.asistencias),
      tarjetasAmarillas: this.toNumber(row.tarjetas_amarillas),
      tarjetasRojas: this.toNumber(row.tarjetas_rojas),
      partidosJugados: extras.partidosJugados ?? 0,
      entrenamientosRegistrados: extras.entrenamientosRegistrados ?? 0,
      entrenamientosPresentes: extras.entrenamientosPresentes ?? 0,
      activo: row.activo ?? true,
      ultimaEvaluacion: extras.ultimaEvaluacion ?? null,
    });
  }

  static toDTO(entity: EstadisticaEntity): EstadisticaResponseDTO {
    const promedioEvaluacion = entity.getPromedioEvaluacion();

    return {
      id: entity.id,
      jugador_id: entity.jugadorId,
      nombre: entity.nombre,
      apellido: entity.apellido,
      nombre_completo: entity.getNombreCompleto(),
      posicion: entity.posicion,
      categoria: entity.categoria ?? '',
      equipo_id: entity.equipoId,
      equipo: entity.equipo,
      numero_camiseta: entity.numeroCamiseta,
      foto_url: entity.fotoUrl,
      goles: entity.goles,
      asistencias: entity.asistencias,
      tarjetas_amarillas: entity.tarjetasAmarillas,
      tarjetas_rojas: entity.tarjetasRojas,
      partidos_jugados: entity.partidosJugados,
      entrenamientos_registrados: entity.entrenamientosRegistrados,
      entrenamientos_presentes: entity.entrenamientosPresentes,
      porcentaje_asistencia_entrenamientos:
        entity.getPorcentajeAsistenciaEntrenamientos(),
      promedio_goles_por_partido: entity.getPromedioGolesPorPartido(),
      promedio_evaluacion: promedioEvaluacion,
      activo: entity.activo,
      ultima_evaluacion: entity.ultimaEvaluacion
        ? {
            tecnica: entity.ultimaEvaluacion.tecnica,
            fisica: entity.ultimaEvaluacion.fisica,
            tactica: entity.ultimaEvaluacion.tactica,
            mental: entity.ultimaEvaluacion.mental,
            promedio: promedioEvaluacion,
            created_at: entity.ultimaEvaluacion.createdAt,
          }
        : null,
    };
  }

  static toGoleadorDTO(entity: EstadisticaEntity): GoleadorResponseDTO {
    return {
      id: entity.id,
      nombre: entity.nombre,
      apellido: entity.apellido,
      categoria: entity.categoria ?? '',
      goles: entity.goles,
      asistencias: entity.asistencias,
      foto_url: entity.fotoUrl,
    };
  }

  static toEquipoDomain(row: any): EstadisticaEquipo {
    return {
      id: row.id,
      equipo: row.equipo ?? row.nombre ?? 'Equipo',
      categoria:
        this.getRelationValue(row.categorias_maestras, 'nombre')
        ?? row.categoria
        ?? row.categoria_id
        ?? null,
      partidos: this.toNumber(row.partidos),
      ganados: this.toNumber(row.ganados),
      empatados: this.toNumber(row.empatados),
      perdidos: this.toNumber(row.perdidos),
      golesFavor: this.toNumber(row.goles_favor),
      golesContra: this.toNumber(row.goles_contra),
      puntos: this.toNumber(row.puntos),
    };
  }

  static toEquipoDTO(
    equipo: EstadisticaEquipo
  ): EstadisticaEquipoResponseDTO {
    const diferenciaGoles = equipo.golesFavor - equipo.golesContra;
    const efectividad =
      equipo.partidos > 0
        ? Number(((equipo.ganados / equipo.partidos) * 100).toFixed(1))
        : 0;

    return {
      id: equipo.id,
      equipo: equipo.equipo,
      categoria: equipo.categoria ?? '',
      partidos: equipo.partidos,
      ganados: equipo.ganados,
      empatados: equipo.empatados,
      perdidos: equipo.perdidos,
      goles_favor: equipo.golesFavor,
      goles_contra: equipo.golesContra,
      puntos: equipo.puntos,
      diferencia_goles: diferenciaGoles,
      efectividad,
    };
  }

  static toGolPorMesDTO(golPorMes: GolPorMes): GolPorMesResponseDTO {
    const meses = [
      'Ene',
      'Feb',
      'Mar',
      'Abr',
      'May',
      'Jun',
      'Jul',
      'Ago',
      'Sep',
      'Oct',
      'Nov',
      'Dic',
    ];

    return {
      periodo: golPorMes.periodo,
      anio: golPorMes.anio,
      mes: golPorMes.mes,
      etiqueta: `${meses[golPorMes.mes - 1] ?? golPorMes.mes} ${golPorMes.anio}`,
      goles: golPorMes.goles,
    };
  }

  static toResumenDTO(
    resumen: ResumenTemporada
  ): ResumenTemporadaResponseDTO {
    return {
      total_jugadores: resumen.totalJugadores,
      jugadores_activos: resumen.jugadoresActivos,
      total_equipos: resumen.totalEquipos,
      partidos_jugados: resumen.partidosJugados,
      goles_favor: resumen.golesFavor,
      goles_contra: resumen.golesContra,
      diferencia_goles: resumen.golesFavor - resumen.golesContra,
      goles_jugadores: resumen.golesJugadores,
      asistencias: resumen.asistencias,
      tarjetas_amarillas: resumen.tarjetasAmarillas,
      tarjetas_rojas: resumen.tarjetasRojas,
      promedio_asistencia_entrenamientos:
        resumen.promedioAsistenciaEntrenamientos,
      goleador: resumen.goleador ? this.toDTO(resumen.goleador) : null,
      maximo_asistente: resumen.maximoAsistente
        ? this.toDTO(resumen.maximoAsistente)
        : null,
      mejor_equipo: resumen.mejorEquipo
        ? this.toEquipoDTO(resumen.mejorEquipo)
        : null,
    };
  }

  private static toNumber(value: unknown): number {
    return typeof value === 'number' && Number.isFinite(value) ? value : 0;
  }

  private static getRelationValue(
    relation: any,
    field: string
  ): string | null {
    const row = Array.isArray(relation) ? relation[0] : relation;
    return row?.[field] ?? null;
  }
}
