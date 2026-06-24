import { AppError } from '../../../../shared/errors/AppError';

export type TipoOKR = 'Club' | 'Categoria' | 'Personal';

const TIPOS_VALIDOS: ReadonlyArray<TipoOKR> = ['Club', 'Categoria', 'Personal'];

export interface KRProps {
  id: string;
  nombre: string;
  valorActual: number;
  valorMeta: number;
  unidad: string;
  kpiSlug: string | null;
}

export interface ObjetivoOKRProps {
  id: string;
  titulo: string;
  descripcion: string | null;
  tipo: TipoOKR;
  periodo: string | null;
  krs: KRProps[];
}

export class ObjetivoOKREntity {
  private readonly props: ObjetivoOKRProps;

  constructor(props: ObjetivoOKRProps) {
    ObjetivoOKREntity.validateObjetivo(props);
    props.krs.forEach(ObjetivoOKREntity.validateKR);
    this.props = { ...props, krs: props.krs.map((k) => ({ ...k })) };
  }

  private static validateObjetivo(props: ObjetivoOKRProps): void {
    if (!props.titulo?.trim()) {
      throw new AppError('El título del objetivo es obligatorio.', 400);
    }
    if (!TIPOS_VALIDOS.includes(props.tipo)) {
      throw new AppError(
        `El tipo debe ser uno de: ${TIPOS_VALIDOS.join(', ')}.`,
        400,
      );
    }
  }

  private static validateKR(kr: KRProps): void {
    if (!kr.nombre?.trim()) {
      throw new AppError('El nombre del resultado clave es obligatorio.', 400);
    }
    if (!kr.unidad?.trim()) {
      throw new AppError('La unidad del resultado clave es obligatoria.', 400);
    }
    if (!Number.isFinite(kr.valorMeta) || kr.valorMeta <= 0) {
      throw new AppError('El valor meta debe ser mayor que cero.', 400);
    }
    if (!Number.isFinite(kr.valorActual) || kr.valorActual < 0) {
      throw new AppError('El valor actual no puede ser negativo.', 400);
    }
  }

  static validateKRInput(kr: KRProps): void {
    ObjetivoOKREntity.validateKR(kr);
  }

  get id(): string { return this.props.id; }
  get titulo(): string { return this.props.titulo; }
  get descripcion(): string | null { return this.props.descripcion; }
  get tipo(): TipoOKR { return this.props.tipo; }
  get periodo(): string | null { return this.props.periodo; }
  get krs(): ReadonlyArray<KRProps> { return this.props.krs; }

  // Promedio de progreso de los KRs en porcentaje entero [0..100+].
  // Vive en la entidad para que cualquier consumidor (UI, REST, jobs)
  // calcule lo mismo sin duplicar la fórmula.
  getProgresoPromedio(): number {
    if (this.props.krs.length === 0) return 0;
    const suma = this.props.krs.reduce(
      (acc, kr) => acc + kr.valorActual / kr.valorMeta,
      0,
    );
    return Math.round((suma / this.props.krs.length) * 100);
  }
}
