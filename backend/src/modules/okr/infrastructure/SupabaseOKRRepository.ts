import { AppError } from '../../../shared/errors/AppError';
import {
  KRProps,
  ObjetivoOKREntity,
  TipoOKR,
} from '../domain/entities/ObjetivoOKREntity';
import {
  AddKRInput,
  IOKRRepository,
  UpsertObjetivoInput,
} from '../domain/ports/IOKRRepository';

interface KRRow {
  id: string;
  nombre: string;
  valor_actual: number | null;
  valor_meta: number;
  unidad: string | null;
  kpi_slug: string | null;
}

interface ObjetivoRow {
  id: string;
  titulo: string;
  descripcion: string | null;
  tipo: string;
  periodo: string | null;
  krs?: KRRow[] | null;
}

export class SupabaseOKRRepository implements IOKRRepository {
  constructor(private readonly supabase: any) {}

  async getAll(): Promise<ObjetivoOKREntity[]> {
    const { data, error } = await this.supabase
      .from('okr_objetivos')
      .select('id, titulo, descripcion, tipo, periodo, krs:okr_resultados_clave(*)')
      .order('created_at', { ascending: false });

    if (error) throw new AppError(error.message, 500);

    // Resiliencia: una fila malformada no debe invalidar toda la lista.
    // Se saltan las que no superen la validación de la entidad.
    const result: ObjetivoOKREntity[] = [];
    for (const row of (data ?? []) as ObjetivoRow[]) {
      try {
        result.push(this.rowToEntity(row));
      } catch (err) {
        console.warn('[OKR] Objetivo saltado por data inválida:', row.id, err);
      }
    }
    return result;
  }

  async upsertObjetivo(input: UpsertObjetivoInput): Promise<ObjetivoOKREntity> {
    const payload: Record<string, unknown> = {
      titulo: input.titulo,
      descripcion: input.descripcion,
      tipo: input.tipo,
      periodo: input.periodo,
      updated_at: new Date().toISOString(),
    };
    if (input.id) payload.id = input.id;

    const { data, error } = await this.supabase
      .from('okr_objetivos')
      .upsert(payload)
      .select('id, titulo, descripcion, tipo, periodo')
      .single();

    if (error) throw new AppError(error.message, 500);
    return this.rowToEntity({ ...(data as ObjetivoRow), krs: [] });
  }

  async addKR(input: AddKRInput): Promise<KRProps> {
    const { data, error } = await this.supabase
      .from('okr_resultados_clave')
      .insert({
        objetivo_id: input.objetivoId,
        nombre: input.nombre,
        valor_actual: input.valorActual,
        valor_meta: input.valorMeta,
        unidad: input.unidad,
        kpi_slug: input.kpiSlug,
      })
      .select('id, nombre, valor_actual, valor_meta, unidad, kpi_slug')
      .single();

    if (error) throw new AppError(error.message, 500);
    return this.krRowToProps(data as KRRow);
  }

  async delete(objetivoId: string): Promise<void> {
    const { error } = await this.supabase
      .from('okr_objetivos')
      .delete()
      .eq('id', objetivoId);

    if (error) throw new AppError(error.message, 500);
  }

  private rowToEntity(row: ObjetivoRow): ObjetivoOKREntity {
    return new ObjetivoOKREntity({
      id: row.id,
      titulo: row.titulo,
      descripcion: row.descripcion,
      tipo: this.parseTipo(row.tipo),
      periodo: row.periodo,
      krs: (row.krs ?? []).map((k) => this.krRowToProps(k)),
    });
  }

  private krRowToProps(row: KRRow): KRProps {
    return {
      id: row.id,
      nombre: row.nombre,
      valorActual: row.valor_actual ?? 0,
      valorMeta: row.valor_meta,
      unidad: row.unidad ?? '%',
      kpiSlug: row.kpi_slug,
    };
  }

  private parseTipo(raw: string): TipoOKR {
    if (raw === 'Club' || raw === 'Categoria' || raw === 'Personal') return raw;
    return 'Club';
  }
}
