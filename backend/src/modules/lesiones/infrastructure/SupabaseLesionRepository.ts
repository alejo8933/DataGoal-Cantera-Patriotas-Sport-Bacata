import { AppError } from '../../../shared/errors/AppError';
import {
  ILesionRepository,
  LesionReadModel,
  SaveLesionInput,
} from '../domain/ports/ILesionRepository';

const SELECT_LESION =
  'id, descripcion, estado, fecha_lesion, fecha_retorno, jugador_id, jugadores(nombre, apellido, numero_camiseta, posicion, categoria)';

export class SupabaseLesionRepository implements ILesionRepository {
  constructor(private readonly supabase: any) {}

  async getAll(): Promise<LesionReadModel[]> {
    const { data, error } = await this.supabase
      .from('lesiones')
      .select(SELECT_LESION)
      .order('fecha_lesion', { ascending: false });

    if (error) throw new AppError(error.message, 500);
    return (data ?? []) as LesionReadModel[];
  }

  async getById(id: string): Promise<LesionReadModel | null> {
    const { data, error } = await this.supabase
      .from('lesiones')
      .select(SELECT_LESION)
      .eq('id', id)
      .maybeSingle();

    if (error) throw new AppError(error.message, 500);
    return (data ?? null) as LesionReadModel | null;
  }

  async save(input: SaveLesionInput): Promise<void> {
    const { error } = await this.supabase.from('lesiones').insert({
      jugador_id: input.jugadorId,
      fecha_lesion: input.fechaLesion,
      fecha_retorno: input.fechaRetorno,
      estado: input.estado,
      descripcion: input.descripcion,
    });
    if (error) throw new AppError(error.message, 500);
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase.from('lesiones').delete().eq('id', id);
    if (error) throw new AppError(error.message, 500);
  }
}
