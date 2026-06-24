import { AppError } from '../../../../shared/errors/AppError';
import { DorsalVO } from '../value-objects/DorsalVO';

export interface JugadorProps {
  id: string;
  nombre: string;
  apellido: string;
  posicion: string | null;
  categoriaId: string;
  equipoId: string | null;
  numeroCamiseta: number | null;
  goles: number;
  asistencias: number;
  tarjetasAmarillas: number;
  tarjetasRojas: number;
  activo: boolean;
}

export class JugadorEntity {
  private props: JugadorProps;

  constructor(props: JugadorProps) {
    this.validate(props);
    this.props = { ...props };
  }

  private validate(props: JugadorProps): void {
    if (!props.nombre.trim()) throw new AppError('El nombre es obligatorio.', 400);
    if (!props.apellido.trim()) throw new AppError('El apellido es obligatorio.', 400);
    if (!props.categoriaId) throw new AppError('La categoría es obligatoria.', 400);

    // Validar el número de camiseta a través del Value Object
    new DorsalVO(props.numeroCamiseta);

    if (props.goles < 0) throw new AppError('Los goles no pueden ser negativos.', 400);
    if (props.asistencias < 0) throw new AppError('Las asistencias no pueden ser negativas.', 400);
    if (props.tarjetasAmarillas < 0) throw new AppError('Las tarjetas amarillas no pueden ser negativas.', 400);
    if (props.tarjetasRojas < 0) throw new AppError('Las tarjetas rojas no pueden ser negativas.', 400);
  }

  // Getters
  get id(): string { return this.props.id; }
  get nombre(): string { return this.props.nombre; }
  get apellido(): string { return this.props.apellido; }
  get posicion(): string | null { return this.props.posicion; }
  get categoriaId(): string { return this.props.categoriaId; }
  get equipoId(): string | null { return this.props.equipoId; }
  get numeroCamiseta(): number | null { return this.props.numeroCamiseta; }
  get goles(): number { return this.props.goles; }
  get asistencias(): number { return this.props.asistencias; }
  get tarjetasAmarillas(): number { return this.props.tarjetasAmarillas; }
  get tarjetasRojas(): number { return this.props.tarjetasRojas; }
  get activo(): boolean { return this.props.activo; }

  // Métodos de comportamiento de dominio
  getNombreCompleto(): string {
    return `${this.props.nombre} ${this.props.apellido}`;
  }

  actualizarGoles(cantidad: number): void {
    if (cantidad < 0) throw new AppError('No se pueden restar goles.', 400);
    this.props.goles = cantidad;
  }

  actualizarAsistencias(cantidad: number): void {
    if (cantidad < 0) throw new AppError('No se pueden restar asistencias.', 400);
    this.props.asistencias = cantidad;
  }

  actualizarTarjetas(amarillas: number, rojas: number): void {
    if (amarillas < 0 || rojas < 0) throw new AppError('Las tarjetas no pueden ser negativas.', 400);
    this.props.tarjetasAmarillas = amarillas;
    this.props.tarjetasRojas = rojas;
  }

  trasladarACategoria(categoriaId: string): void {
    if (!categoriaId) throw new AppError('La nueva categoría es obligatoria.', 400);
    this.props.categoriaId = categoriaId;
  }

  desactivar(): void {
    this.props.activo = false;
  }

  activar(): void {
    this.props.activo = true;
  }

  // Factory Method para creación
  static create(props: Omit<JugadorProps, 'id' | 'goles' | 'asistencias' | 'tarjetasAmarillas' | 'tarjetasRojas' | 'activo'> & { id?: string }): JugadorEntity {
    return new JugadorEntity({
      id: props.id || crypto.randomUUID(),
      nombre: props.nombre,
      apellido: props.apellido,
      posicion: props.posicion,
      categoriaId: props.categoriaId,
      equipoId: props.equipoId,
      numeroCamiseta: props.numeroCamiseta,
      goles: 0,
      asistencias: 0,
      tarjetasAmarillas: 0,
      tarjetasRojas: 0,
      activo: true
    });
  }
}
