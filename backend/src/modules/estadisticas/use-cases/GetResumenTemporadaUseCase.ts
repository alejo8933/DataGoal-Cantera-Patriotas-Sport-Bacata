import {
  EstadisticaEquipo,
  EstadisticasEquipoQuery,
  IEstadisticaRepository,
  ResumenTemporada,
} from '../domain/ports/IEstadisticaRepository';

export class GetResumenTemporadaUseCase {
  constructor(private readonly repo: IEstadisticaRepository) {}

  async execute(query?: EstadisticasEquipoQuery): Promise<ResumenTemporada> {
    const [jugadores, equipos] = await Promise.all([
      this.repo.getEstadisticasJugadores({
        categoria: query?.categoria,
        equipoId: query?.equipoId,
        soloActivos: false,
      }),
      this.repo.getEstadisticasEquipo(query),
    ]);

    const jugadoresActivos = jugadores.filter((jugador) => jugador.activo);
    const totalAsistencia = jugadores.reduce(
      (acc, jugador) => acc + jugador.getPorcentajeAsistenciaEntrenamientos(),
      0
    );

    return {
      totalJugadores: jugadores.length,
      jugadoresActivos: jugadoresActivos.length,
      totalEquipos: equipos.length,
      partidosJugados: this.sumEquipos(equipos, 'partidos'),
      golesFavor: this.sumEquipos(equipos, 'golesFavor'),
      golesContra: this.sumEquipos(equipos, 'golesContra'),
      golesJugadores: jugadores.reduce((acc, jugador) => acc + jugador.goles, 0),
      asistencias: jugadores.reduce(
        (acc, jugador) => acc + jugador.asistencias,
        0
      ),
      tarjetasAmarillas: jugadores.reduce(
        (acc, jugador) => acc + jugador.tarjetasAmarillas,
        0
      ),
      tarjetasRojas: jugadores.reduce(
        (acc, jugador) => acc + jugador.tarjetasRojas,
        0
      ),
      promedioAsistenciaEntrenamientos:
        jugadores.length > 0
          ? Number((totalAsistencia / jugadores.length).toFixed(1))
          : 0,
      goleador:
        [...jugadores].sort((a, b) => b.goles - a.goles)[0] ?? null,
      maximoAsistente:
        [...jugadores].sort((a, b) => b.asistencias - a.asistencias)[0] ??
        null,
      mejorEquipo:
        [...equipos].sort((a, b) => b.puntos - a.puntos)[0] ?? null,
    };
  }

  private sumEquipos(
    equipos: EstadisticaEquipo[],
    field: 'partidos' | 'golesFavor' | 'golesContra'
  ): number {
    return equipos.reduce((acc, equipo) => acc + equipo[field], 0);
  }
}
