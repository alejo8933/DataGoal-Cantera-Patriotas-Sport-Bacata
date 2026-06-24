import { AppError } from '../../../../shared/errors/AppError';

export interface EvaluacionEstadistica {
  tecnica: number | null;
  fisica: number | null;
  tactica: number | null;
  mental: number | null;
  createdAt: string | null;
}

export interface EstadisticaProps {
  id: string;
  jugadorId: string;
  nombre: string;
  apellido: string;
  posicion: string | null;
  categoria: string | null;
  equipoId: string | null;
  equipo: string | null;
  numeroCamiseta: number | null;
  fotoUrl: string | null;
  goles: number;
  asistencias: number;
  tarjetasAmarillas: number;
  tarjetasRojas: number;
  partidosJugados: number;
  entrenamientosRegistrados: number;
  entrenamientosPresentes: number;
  activo: boolean;
  ultimaEvaluacion: EvaluacionEstadistica | null;
}

export class EstadisticaEntity {
  private readonly props: EstadisticaProps;

  constructor(props: EstadisticaProps) {
    this.validate(props);
    this.props = { ...props };
  }

  private validate(props: EstadisticaProps): void {
    if (!props.id) throw new AppError('La estadistica requiere un ID.', 400);
    if (!props.jugadorId) throw new AppError('El jugador es obligatorio.', 400);
    if (!props.nombre.trim()) throw new AppError('El nombre del jugador es obligatorio.', 400);
    if (!props.apellido.trim()) throw new AppError('El apellido del jugador es obligatorio.', 400);

    this.validateNonNegativeInteger(props.goles, 'Los goles');
    this.validateNonNegativeInteger(props.asistencias, 'Las asistencias');
    this.validateNonNegativeInteger(props.tarjetasAmarillas, 'Las tarjetas amarillas');
    this.validateNonNegativeInteger(props.tarjetasRojas, 'Las tarjetas rojas');
    this.validateNonNegativeInteger(props.partidosJugados, 'Los partidos jugados');
    this.validateNonNegativeInteger(
      props.entrenamientosRegistrados,
      'Los entrenamientos registrados'
    );
    this.validateNonNegativeInteger(
      props.entrenamientosPresentes,
      'Los entrenamientos presentes'
    );

    if (props.entrenamientosPresentes > props.entrenamientosRegistrados) {
      throw new AppError(
        'Las asistencias presentes no pueden superar los entrenamientos registrados.',
        400
      );
    }

    if (
      props.numeroCamiseta !== null &&
      (!Number.isInteger(props.numeroCamiseta) || props.numeroCamiseta < 0)
    ) {
      throw new AppError('El numero de camiseta debe ser un entero no negativo.', 400);
    }

    if (props.ultimaEvaluacion) {
      this.validateEvaluationScore(props.ultimaEvaluacion.tecnica, 'tecnica');
      this.validateEvaluationScore(props.ultimaEvaluacion.fisica, 'fisica');
      this.validateEvaluationScore(props.ultimaEvaluacion.tactica, 'tactica');
      this.validateEvaluationScore(props.ultimaEvaluacion.mental, 'mental');
    }
  }

  private validateNonNegativeInteger(value: number, field: string): void {
    if (!Number.isInteger(value) || value < 0) {
      throw new AppError(`${field} deben ser enteros no negativos.`, 400);
    }
  }

  private validateEvaluationScore(value: number | null, field: string): void {
    if (value !== null && (value < 0 || value > 10)) {
      throw new AppError(`La evaluacion ${field} debe estar entre 0 y 10.`, 400);
    }
  }

  get id(): string { return this.props.id; }
  get jugadorId(): string { return this.props.jugadorId; }
  get nombre(): string { return this.props.nombre; }
  get apellido(): string { return this.props.apellido; }
  get posicion(): string | null { return this.props.posicion; }
  get categoria(): string | null { return this.props.categoria; }
  get equipoId(): string | null { return this.props.equipoId; }
  get equipo(): string | null { return this.props.equipo; }
  get numeroCamiseta(): number | null { return this.props.numeroCamiseta; }
  get fotoUrl(): string | null { return this.props.fotoUrl; }
  get goles(): number { return this.props.goles; }
  get asistencias(): number { return this.props.asistencias; }
  get tarjetasAmarillas(): number { return this.props.tarjetasAmarillas; }
  get tarjetasRojas(): number { return this.props.tarjetasRojas; }
  get partidosJugados(): number { return this.props.partidosJugados; }
  get entrenamientosRegistrados(): number { return this.props.entrenamientosRegistrados; }
  get entrenamientosPresentes(): number { return this.props.entrenamientosPresentes; }
  get activo(): boolean { return this.props.activo; }
  get ultimaEvaluacion(): EvaluacionEstadistica | null { return this.props.ultimaEvaluacion; }

  getNombreCompleto(): string {
    return `${this.props.nombre} ${this.props.apellido}`;
  }

  getParticipacionesGol(): number {
    return this.props.goles + this.props.asistencias;
  }

  getPorcentajeAsistenciaEntrenamientos(): number {
    if (this.props.entrenamientosRegistrados === 0) return 0;
    return Number(
      (
        (this.props.entrenamientosPresentes /
          this.props.entrenamientosRegistrados) *
        100
      ).toFixed(1)
    );
  }

  getPromedioGolesPorPartido(): number {
    if (this.props.partidosJugados === 0) return 0;
    return Number((this.props.goles / this.props.partidosJugados).toFixed(2));
  }

  getPromedioEvaluacion(): number | null {
    if (!this.props.ultimaEvaluacion) return null;

    const scores = [
      this.props.ultimaEvaluacion.tecnica,
      this.props.ultimaEvaluacion.fisica,
      this.props.ultimaEvaluacion.tactica,
      this.props.ultimaEvaluacion.mental,
    ].filter((score): score is number => score !== null);

    if (scores.length === 0) return null;

    const total = scores.reduce((acc, score) => acc + score, 0);
    return Number((total / scores.length).toFixed(1));
  }
}
