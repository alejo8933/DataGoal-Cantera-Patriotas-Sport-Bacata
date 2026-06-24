import { AppError } from '../../../../shared/errors/AppError';

export type TipoEventoPartido =
  | 'gol'
  | 'tarjeta_amarilla'
  | 'tarjeta_roja'
  | 'cambio';

export type EquipoEventoPartido = 'local' | 'visitante';

export interface JugadorEventoResumen {
  id: string;
  nombre: string;
  apellido: string;
  numeroCamiseta: number | null;
}

export interface EventoPartidoProps {
  id: string;
  partidoId: string;
  jugadorId: string | null;
  minuto: number;
  tipo: TipoEventoPartido;
  equipo: EquipoEventoPartido;
  descripcion: string | null;
  createdAt: string | null;
  jugador: JugadorEventoResumen | null;
}

export interface ImpactoEstadisticoEvento {
  partidoId: string;
  jugadorId: string | null;
  golesLocal: number;
  golesVisitante: number;
  golesJugador: number;
  tarjetasAmarillas: number;
  tarjetasRojas: number;
}

export class EventoPartidoEntity {
  private readonly props: EventoPartidoProps;

  constructor(props: EventoPartidoProps) {
    EventoPartidoEntity.validate(props);
    this.props = { ...props };
  }

  private static validate(props: EventoPartidoProps): void {
    if (!props.partidoId) {
      throw new AppError('El partido es obligatorio.', 400);
    }

    if (!Number.isInteger(props.minuto) || props.minuto < 0) {
      throw new AppError('El minuto debe ser un entero no negativo.', 400);
    }

    const tipos: TipoEventoPartido[] = [
      'gol',
      'tarjeta_amarilla',
      'tarjeta_roja',
      'cambio',
    ];
    if (!tipos.includes(props.tipo)) {
      throw new AppError('El tipo de evento no es valido.', 400);
    }

    if (props.equipo !== 'local' && props.equipo !== 'visitante') {
      throw new AppError('El equipo del evento no es valido.', 400);
    }
  }

  get id(): string { return this.props.id; }
  get partidoId(): string { return this.props.partidoId; }
  get jugadorId(): string | null { return this.props.jugadorId; }
  get minuto(): number { return this.props.minuto; }
  get tipo(): TipoEventoPartido { return this.props.tipo; }
  get equipo(): EquipoEventoPartido { return this.props.equipo; }
  get descripcion(): string | null { return this.props.descripcion; }
  get createdAt(): string | null { return this.props.createdAt; }
  get jugador(): JugadorEventoResumen | null { return this.props.jugador; }

  calcularImpactoEstadistico(factor: 1 | -1 = 1): ImpactoEstadisticoEvento {
    const esGol = this.props.tipo === 'gol';

    return {
      partidoId: this.props.partidoId,
      jugadorId: this.props.jugadorId,
      golesLocal: esGol && this.props.equipo === 'local' ? factor : 0,
      golesVisitante: esGol && this.props.equipo === 'visitante' ? factor : 0,
      golesJugador: esGol && this.props.jugadorId ? factor : 0,
      tarjetasAmarillas:
        this.props.tipo === 'tarjeta_amarilla' && this.props.jugadorId ? factor : 0,
      tarjetasRojas:
        this.props.tipo === 'tarjeta_roja' && this.props.jugadorId ? factor : 0,
    };
  }

  static create(
    props: Omit<EventoPartidoProps, 'id' | 'createdAt' | 'jugador'> & {
      id?: string;
    }
  ): EventoPartidoEntity {
    return new EventoPartidoEntity({
      ...props,
      id: props.id ?? crypto.randomUUID(),
      createdAt: null,
      jugador: null,
    });
  }
}
