import { AppError } from '../../../../shared/errors/AppError';

export interface EntrenamientoProps {
  id: string;
  titulo: string;
  fecha: string;
  hora: string | null;
  lugar: string | null;
  categoria: string;
  descripcion: string | null;
  activo: boolean;
  // Metadatos extra decodificados
  tipo: string | null;
  duracion: number | null; // en minutos
  objetivos: string | null;
}

export class EntrenamientoEntity {
  private readonly props: EntrenamientoProps;

  constructor(props: EntrenamientoProps) {
    EntrenamientoEntity.validate(props);
    this.props = { ...props };
  }

  private static validate(props: EntrenamientoProps): void {
    if (!props.titulo.trim()) {
      throw new AppError('El título del entrenamiento es obligatorio.', 400);
    }
    if (!props.fecha.trim()) {
      throw new AppError('La fecha del entrenamiento es obligatoria.', 400);
    }
    if (!props.categoria.trim()) {
      throw new AppError('La categoría del entrenamiento es obligatoria.', 400);
    }
    if (props.duracion !== null && props.duracion <= 0) {
      throw new AppError('La duración debe ser un número positivo.', 400);
    }
  }

  get id(): string { return this.props.id; }
  get titulo(): string { return this.props.titulo; }
  get fecha(): string { return this.props.fecha; }
  get hora(): string | null { return this.props.hora; }
  get lugar(): string | null { return this.props.lugar; }
  get categoria(): string { return this.props.categoria; }
  get descripcion(): string | null { return this.props.descripcion; }
  get activo(): boolean { return this.props.activo; }
  get tipo(): string | null { return this.props.tipo; }
  get duracion(): number | null { return this.props.duracion; }
  get objetivos(): string | null { return this.props.objetivos; }

  static create(
    props: Omit<EntrenamientoProps, 'id'> & { id?: string }
  ): EntrenamientoEntity {
    return new EntrenamientoEntity({
      ...props,
      id: props.id ?? crypto.randomUUID(),
    });
  }
}
