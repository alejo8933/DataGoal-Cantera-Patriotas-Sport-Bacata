import { AppError } from '../../../shared/errors/AppError';
import {
  ConvocatoriaReadModel,
  IConvocatoriaRepository,
  UpsertConvocatoriaInput,
} from '../domain/ports/IConvocatoriaRepository';

interface ConvocatoriaRow {
  id: string;
  notas: string | null;
  convocatoria_jugadores: { jugador_id: string }[] | null;
}

export class SupabaseConvocatoriaRepository implements IConvocatoriaRepository {
  constructor(private readonly supabase: any) {}

  async getByPartidoId(partidoId: string): Promise<ConvocatoriaReadModel | null> {
    if (!partidoId?.trim()) {
      throw new AppError('El ID del partido es obligatorio.', 400);
    }

    const { data, error } = await this.supabase
      .from('convocatorias')
      .select('id, notas, convocatoria_jugadores(jugador_id)')
      .eq('partido_id', partidoId)
      .maybeSingle();

    if (error) throw new AppError(error.message, 500);
    if (!data) return null;

    const row = data as ConvocatoriaRow;
    return {
      id: row.id,
      notas: row.notas ?? '',
      convocadosIds: (row.convocatoria_jugadores ?? []).map((cj) => cj.jugador_id),
    };
  }

  async upsertConvocatoria(input: UpsertConvocatoriaInput): Promise<string> {
    const { partidoId, jugadorIds, notas } = input;

    const { data: existente, error: lookupError } = await this.supabase
      .from('convocatorias')
      .select('id')
      .eq('partido_id', partidoId)
      .maybeSingle();
    if (lookupError) throw new AppError(lookupError.message, 500);

    let convId: string | undefined = existente?.id;

    if (!convId) {
      const { data: nueva, error: insertError } = await this.supabase
        .from('convocatorias')
        .insert({
          partido_id: partidoId,
          fecha: new Date().toISOString(),
          notas,
        })
        .select('id')
        .single();
      if (insertError) throw new AppError(insertError.message, 500);
      convId = nueva.id as string;
    } else {
      const { error: updateError } = await this.supabase
        .from('convocatorias')
        .update({ notas })
        .eq('id', convId);
      if (updateError) throw new AppError(updateError.message, 500);
    }

    if (!convId) {
      throw new AppError('No se pudo crear o recuperar la convocatoria.', 500);
    }

    const { error: deleteError } = await this.supabase
      .from('convocatoria_jugadores')
      .delete()
      .eq('convocatoria_id', convId);
    if (deleteError) throw new AppError(deleteError.message, 500);

    if (jugadorIds.length > 0) {
      const payload = jugadorIds.map((jid) => ({
        convocatoria_id: convId,
        jugador_id: jid,
      }));
      const { error: insertJugadoresError } = await this.supabase
        .from('convocatoria_jugadores')
        .insert(payload);
      if (insertJugadoresError) throw new AppError(insertJugadoresError.message, 500);
    }

    return convId;
  }
}
