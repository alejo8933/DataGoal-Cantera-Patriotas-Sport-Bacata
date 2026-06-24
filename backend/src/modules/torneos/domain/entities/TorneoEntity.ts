import { AppError } from '../../../../shared/errors/AppError';

export interface TorneoProps {
  id: string;
  nombre: string;
  categoria: string;
  fechaInicio: string;
  fechaFin: string | null;
  estado: 'proximo' | 'en_curso' | 'finalizado';
  descripcion: string | null;
  logoUrl: string | null;
  resultado: string | null;
}

export class TorneoEntity {
  private readonly props: TorneoProps;

  constructor(props: TorneoProps) {
    TorneoEntity.validate(props);
    this.props = { ...props };
  }

  private static validate(props: TorneoProps): void {
    if (!props.nombre.trim()) {
      throw new AppError('El nombre del torneo es obligatorio.', 400);
    }
    if (!props.categoria.trim()) {
      throw new AppError('La categoría del torneo es obligatoria.', 400);
    }
    if (!['proximo', 'en_curso', 'finalizado'].includes(props.estado)) {
      throw new AppError('El estado del torneo no es válido.', 400);
    }
    if (!props.fechaInicio.trim()) {
      throw new AppError('La fecha de inicio es obligatoria.', 400);
    }

    if (props.fechaFin && props.fechaInicio) {
      const inicio = new Date(props.fechaInicio);
      const fin = new Date(props.fechaFin);
      if (fin < inicio) {
        throw new AppError('La fecha de fin no puede ser anterior a la fecha de inicio.', 400);
      }
    }
  }

  get id(): string { return this.props.id; }
  get nombre(): string { return this.props.nombre; }
  get categoria(): string { return this.props.categoria; }
  get fechaInicio(): string { return this.props.fechaInicio; }
  get fechaFin(): string | null { return this.props.fechaFin; }
  get estado(): 'proximo' | 'en_curso' | 'finalizado' { return this.props.estado; }
  get descripcion(): string | null { return this.props.descripcion; }
  get logoUrl(): string | null { return this.props.logoUrl; }
  get resultado(): string | null { return this.props.resultado; }

  static create(
    props: Omit<TorneoProps, 'id'> & { id?: string }
  ): TorneoEntity {
    return new TorneoEntity({
      ...props,
      id: props.id ?? crypto.randomUUID(),
    });
  }
}
