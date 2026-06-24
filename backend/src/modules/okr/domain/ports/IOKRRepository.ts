import { KRProps, ObjetivoOKREntity, TipoOKR } from '../entities/ObjetivoOKREntity';

export interface UpsertObjetivoInput {
  id?: string;
  titulo: string;
  descripcion: string | null;
  tipo: TipoOKR;
  periodo: string | null;
}

export interface AddKRInput {
  objetivoId: string;
  nombre: string;
  valorActual: number;
  valorMeta: number;
  unidad: string;
  kpiSlug: string | null;
}

export interface IOKRRepository {
  getAll(): Promise<ObjetivoOKREntity[]>;
  upsertObjetivo(input: UpsertObjetivoInput): Promise<ObjetivoOKREntity>;
  addKR(input: AddKRInput): Promise<KRProps>;
  delete(objetivoId: string): Promise<void>;
}
