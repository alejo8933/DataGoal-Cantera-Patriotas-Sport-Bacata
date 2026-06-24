import { AppError } from '../../../shared/errors/AppError';
import {
  CategoriaMaestraInput,
  CategoriaMaestraSelectorItem,
  EquipoInput,
  EquipoSelectorItem,
  ICategoriaRepository,
} from '../domain/ports/ICategoriaRepository';

export class SupabaseCategoriaRepository implements ICategoriaRepository {
  constructor(private readonly supabase: any) {}

  async existeEquipoEnCategoria(equipo: string, categoriaId: string): Promise<boolean> {
    const { data, error } = await this.supabase
      .from('rendimiento_equipos')
      .select('id')
      .eq('equipo', equipo)
      .eq('categoria_id', categoriaId)
      .maybeSingle();

    if (error) throw new AppError(error.message, 500);
    return !!data;
  }

  async crearEquipo(input: EquipoInput): Promise<void> {
    const { error } = await this.supabase.from('rendimiento_equipos').insert([
      {
        equipo: input.equipo,
        tecnico_id: input.tecnicoId,
        sede: input.sede,
        fundacion: input.fundacion,
        categoria_id: input.categoriaId,
        color: input.color,
        horario: input.horario,
      },
    ]);
    if (error) throw new AppError(error.message, 500);
  }

  async actualizarEquipo(id: string, input: EquipoInput): Promise<void> {
    const { error } = await this.supabase
      .from('rendimiento_equipos')
      .update({
        equipo: input.equipo,
        tecnico_id: input.tecnicoId,
        sede: input.sede,
        fundacion: input.fundacion,
        categoria_id: input.categoriaId,
        color: input.color,
        horario: input.horario,
      })
      .eq('id', id);
    if (error) throw new AppError(error.message, 500);
  }

  async crearCategoriaMaestra(input: CategoriaMaestraInput): Promise<void> {
    const { error } = await this.supabase
      .from('categorias_maestras')
      .insert([
        { nombre: input.nombre, edades: input.edades, modalidad: input.modalidad },
      ]);
    if (error) throw new AppError(error.message, 500);
  }

  async actualizarCategoriaMaestra(id: string, input: CategoriaMaestraInput): Promise<void> {
    const { error } = await this.supabase
      .from('categorias_maestras')
      .update({ nombre: input.nombre, edades: input.edades, modalidad: input.modalidad })
      .eq('id', id);
    if (error) throw new AppError(error.message, 500);
  }

  async getCategoriasMaestrasActivasParaSelector(): Promise<CategoriaMaestraSelectorItem[]> {
    const { data, error } = await this.supabase
      .from('categorias_maestras')
      .select('id, nombre')
      .eq('activo', true);
    if (error) throw new AppError(error.message, 500);
    return (data ?? []) as CategoriaMaestraSelectorItem[];
  }

  async getEquiposActivosParaSelector(): Promise<EquipoSelectorItem[]> {
    const { data, error } = await this.supabase
      .from('rendimiento_equipos')
      .select('id, equipo, categoria_id')
      .eq('activo', true);
    if (error) throw new AppError(error.message, 500);
    return (data ?? []) as EquipoSelectorItem[];
  }
}
