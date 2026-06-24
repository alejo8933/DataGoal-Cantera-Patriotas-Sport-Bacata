import { AppError } from '../../../../shared/errors/AppError';

export interface PartidoProps {
  id: string;
  equipoLocal: string;
  equipoVisitante: string;
  fecha: string;
  hora: string | null;
  lugar: string | null;
  golesLocal: number | null;
  golesVisitante: number | null;
  estado: string;
  categoria: string | null;
  descripcion: string | null;
}

export class PartidoEntity {
  private readonly props: PartidoProps;

  constructor(props: PartidoProps) {
    PartidoEntity.validate(props);
    this.props = { ...props };
  }

  private static validate(props: PartidoProps): void {
    if (!props.equipoLocal.trim() || !props.equipoVisitante.trim()) {
      throw new AppError('Los equipos local y visitante son obligatorios.', 400);
    }

    if (props.equipoLocal.trim() === props.equipoVisitante.trim()) {
      throw new AppError('El equipo Local y el Visitante deben ser distintos.', 400);
    }

    if (!props.fecha.trim()) {
      throw new AppError('La fecha es obligatoria.', 400);
    }

    PartidoEntity.validateGoles(props.golesLocal);
    PartidoEntity.validateGoles(props.golesVisitante);
  }

  private static validateGoles(goles: number | null): void {
    if (goles !== null && (!Number.isInteger(goles) || goles < 0)) {
      throw new AppError('Los goles deben ser numeros enteros no negativos.', 400);
    }
  }

  get id(): string { return this.props.id; }
  get equipoLocal(): string { return this.props.equipoLocal; }
  get equipoVisitante(): string { return this.props.equipoVisitante; }
  get fecha(): string { return this.props.fecha; }
  get hora(): string | null { return this.props.hora; }
  get lugar(): string | null { return this.props.lugar; }
  get golesLocal(): number | null { return this.props.golesLocal; }
  get golesVisitante(): number | null { return this.props.golesVisitante; }
  get estado(): string { return this.props.estado; }
  get categoria(): string | null { return this.props.categoria; }
  get descripcion(): string | null { return this.props.descripcion; }

  estaFinalizado(): boolean {
    const estado = this.props.estado.toLowerCase();
    return estado === 'jugado' || estado === 'finalizado';
  }

  static create(
    props: Omit<PartidoProps, 'id' | 'golesLocal' | 'golesVisitante' | 'estado'> & {
      id?: string;
    }
  ): PartidoEntity {
    return new PartidoEntity({
      ...props,
      id: props.id ?? crypto.randomUUID(),
      golesLocal: null,
      golesVisitante: null,
      estado: 'Programado',
    });
  }
}
