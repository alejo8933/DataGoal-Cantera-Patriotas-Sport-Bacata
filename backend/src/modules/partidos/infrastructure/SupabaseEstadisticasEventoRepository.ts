import { AppError } from '../../../shared/errors/AppError';
import { ImpactoEstadisticoEvento } from '../domain/entities/EventoPartidoEntity';
import { IEstadisticasEventoRepository } from '../domain/ports/IEstadisticasEventoRepository';

interface MarcadorPartido {
  goles_local: number | null;
  goles_visitante: number | null;
}

interface EstadisticasJugador {
  goles: number | null;
  tarjetas_amarillas: number | null;
  tarjetas_rojas: number | null;
}

export class SupabaseEstadisticasEventoRepository
  implements IEstadisticasEventoRepository
{
  constructor(private readonly supabase: any) {}

  async aplicarImpacto(impacto: ImpactoEstadisticoEvento): Promise<void> {
    const cambiaMarcador =
      impacto.golesLocal !== 0 || impacto.golesVisitante !== 0;
    const cambiaJugador =
      Boolean(impacto.jugadorId) &&
      (impacto.golesJugador !== 0 ||
        impacto.tarjetasAmarillas !== 0 ||
        impacto.tarjetasRojas !== 0);

    if (!cambiaMarcador && !cambiaJugador) return;

    const marcadorAnterior = cambiaMarcador
      ? await this.getMarcador(impacto.partidoId)
      : null;
    const jugadorAnterior = cambiaJugador && impacto.jugadorId
      ? await this.getEstadisticasJugador(impacto.jugadorId)
      : null;

    if (marcadorAnterior) {
      await this.updateMarcador(impacto.partidoId, {
        goles_local: this.aplicarDelta(
          marcadorAnterior.goles_local,
          impacto.golesLocal
        ),
        goles_visitante: this.aplicarDelta(
          marcadorAnterior.goles_visitante,
          impacto.golesVisitante
        ),
      });
    }

    if (jugadorAnterior && impacto.jugadorId) {
      try {
        await this.updateEstadisticasJugador(impacto.jugadorId, {
          goles: this.aplicarDelta(
            jugadorAnterior.goles,
            impacto.golesJugador
          ),
          tarjetas_amarillas: this.aplicarDelta(
            jugadorAnterior.tarjetas_amarillas,
            impacto.tarjetasAmarillas
          ),
          tarjetas_rojas: this.aplicarDelta(
            jugadorAnterior.tarjetas_rojas,
            impacto.tarjetasRojas
          ),
        });
      } catch (error) {
        if (marcadorAnterior) {
          await this.updateMarcador(
            impacto.partidoId,
            marcadorAnterior
          ).catch(() => undefined);
        }
        throw error;
      }
    }
  }

  private aplicarDelta(actual: number | null, delta: number): number {
    return Math.max(0, (actual ?? 0) + delta);
  }

  private async getMarcador(partidoId: string): Promise<MarcadorPartido> {
    const { data, error } = await this.supabase
      .from('partidos')
      .select('goles_local, goles_visitante')
      .eq('id', partidoId)
      .single();

    if (error || !data) {
      throw new AppError(error?.message ?? 'El partido no existe.', 500);
    }
    return data;
  }

  private async getEstadisticasJugador(
    jugadorId: string
  ): Promise<EstadisticasJugador> {
    const { data, error } = await this.supabase
      .from('jugadores')
      .select('goles, tarjetas_amarillas, tarjetas_rojas')
      .eq('id', jugadorId)
      .single();

    if (error || !data) {
      throw new AppError(error?.message ?? 'El jugador no existe.', 500);
    }
    return data;
  }

  private async updateMarcador(
    partidoId: string,
    marcador: MarcadorPartido
  ): Promise<void> {
    const { error } = await this.supabase
      .from('partidos')
      .update(marcador)
      .eq('id', partidoId);

    if (error) throw new AppError(error.message, 500);
  }

  private async updateEstadisticasJugador(
    jugadorId: string,
    estadisticas: EstadisticasJugador
  ): Promise<void> {
    const { error } = await this.supabase
      .from('jugadores')
      .update(estadisticas)
      .eq('id', jugadorId);

    if (error) throw new AppError(error.message, 500);
  }
}
