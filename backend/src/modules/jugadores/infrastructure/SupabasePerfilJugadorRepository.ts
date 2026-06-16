import type { SupabaseClient } from '@supabase/supabase-js';
import { AppError } from '../../../shared/errors/AppError';
import {
  IPerfilJugadorRepository,
  PerfilJugadorDeportivo,
  UpdatePerfilJugadorDeportivo,
} from '../domain/ports/IPerfilJugadorRepository';

const PERFIL_SELECT =
  'id, user_id, nombre, apellido, posicion, categoria, numero_camiseta, foto_url, fecha_ingreso';

export class SupabasePerfilJugadorRepository
  implements IPerfilJugadorRepository
{
  constructor(private readonly supabase: SupabaseClient<any, any, any>) {}

  async getByUserId(userId: string): Promise<PerfilJugadorDeportivo | null> {
    const { data, error } = await this.supabase
      .from('jugadores')
      .select(PERFIL_SELECT)
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw new AppError(error.message, 500);
    return data ? this.toDomain(data) : null;
  }

  async updateByUserId(
    userId: string,
    data: UpdatePerfilJugadorDeportivo
  ): Promise<PerfilJugadorDeportivo | null> {
    const { data: updated, error } = await this.supabase
      .from('jugadores')
      .update({
        nombre: data.nombre,
        apellido: data.apellido,
        numero_camiseta: data.numeroCamiseta,
        foto_url: data.fotoUrl,
      })
      .eq('user_id', userId)
      .select(PERFIL_SELECT)
      .maybeSingle();

    if (error) throw new AppError(error.message, 500);
    return updated ? this.toDomain(updated) : null;
  }

  private toDomain(row: any): PerfilJugadorDeportivo {
    return {
      id: row.id,
      userId: row.user_id,
      nombre: row.nombre,
      apellido: row.apellido,
      posicion: row.posicion ?? null,
      categoria: row.categoria ?? null,
      numeroCamiseta: row.numero_camiseta ?? null,
      fotoUrl: row.foto_url ?? null,
      fechaIngreso: row.fecha_ingreso ?? null,
    };
  }
}
