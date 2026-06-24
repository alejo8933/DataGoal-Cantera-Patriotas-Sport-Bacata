import { AppError } from '../../../../shared/errors/AppError';

export type RolUsuario = 'admin' | 'entrenador' | 'jugador' | 'auxiliar' | 'coordinador';

export interface UsuarioProps {
  id: string;
  email: string | null;
  nombre: string | null;
  apellido: string | null;
  rol: RolUsuario;
  telefono: string | null;
  fechaNacimiento: string | null;
  posicion: string | null;
  categoria: string | null;
  genero: string | null;
  documento: string | null;
  activo: boolean;
}

const ROLES_PERMITIDOS: RolUsuario[] = ['admin', 'entrenador', 'jugador', 'auxiliar', 'coordinador'];

export class UsuarioEntity {
  private props: UsuarioProps;

  constructor(props: UsuarioProps) {
    this.validate(props);
    this.props = { ...props };
  }

  private validate(props: UsuarioProps): void {
    if (!props.id) throw new AppError('El ID de usuario es obligatorio.', 400);
    if (props.email !== null && !props.email.trim()) throw new AppError('El correo es obligatorio.', 400);
    if (props.nombre !== null && !props.nombre.trim()) throw new AppError('El nombre es obligatorio.', 400);
    if (props.apellido !== null && !props.apellido.trim()) throw new AppError('El apellido es obligatorio.', 400);
    if (!ROLES_PERMITIDOS.includes(props.rol)) {
      throw new AppError('El rol seleccionado no es válido.', 400);
    }
  }

  get id(): string { return this.props.id; }
  get email(): string | null { return this.props.email; }
  get nombre(): string | null { return this.props.nombre; }
  get apellido(): string | null { return this.props.apellido; }
  get rol(): RolUsuario { return this.props.rol; }
  get telefono(): string | null { return this.props.telefono; }
  get fechaNacimiento(): string | null { return this.props.fechaNacimiento; }
  get posicion(): string | null { return this.props.posicion; }
  get categoria(): string | null { return this.props.categoria; }
  get genero(): string | null { return this.props.genero; }
  get documento(): string | null { return this.props.documento; }
  get activo(): boolean { return this.props.activo; }

  getNombreCompleto(): string {
    return `${this.props.nombre ?? ''} ${this.props.apellido ?? ''}`.trim();
  }

  actualizarPerfil(data: Partial<Pick<UsuarioProps, 'nombre' | 'apellido' | 'telefono' | 'genero' | 'documento' | 'fechaNacimiento'>>): void {
    if (data.nombre !== undefined) {
      if (data.nombre !== null && !data.nombre.trim()) throw new AppError('El nombre es obligatorio.', 400);
      this.props.nombre = data.nombre !== null ? data.nombre.trim() : null;
    }
    if (data.apellido !== undefined) {
      if (data.apellido !== null && !data.apellido.trim()) throw new AppError('El apellido es obligatorio.', 400);
      this.props.apellido = data.apellido !== null ? data.apellido.trim() : null;
    }
    if (data.telefono !== undefined) this.props.telefono = data.telefono;
    if (data.genero !== undefined) this.props.genero = data.genero;
    if (data.documento !== undefined) this.props.documento = data.documento;
    if (data.fechaNacimiento !== undefined) this.props.fechaNacimiento = data.fechaNacimiento;
  }

  actualizarPorAdmin(data: Partial<Pick<UsuarioProps, 'nombre' | 'apellido' | 'rol' | 'telefono' | 'fechaNacimiento' | 'posicion' | 'categoria'>>): void {
    if (data.nombre !== undefined) this.props.nombre = data.nombre?.trim() || this.props.nombre;
    if (data.apellido !== undefined) this.props.apellido = data.apellido?.trim() || this.props.apellido;
    if (data.rol !== undefined) {
      if (!ROLES_PERMITIDOS.includes(data.rol)) throw new AppError('El rol seleccionado no es válido.', 400);
      this.props.rol = data.rol;
    }
    if (data.telefono !== undefined) this.props.telefono = data.telefono;
    if (data.fechaNacimiento !== undefined) this.props.fechaNacimiento = data.fechaNacimiento;
    if (data.rol !== undefined || data.posicion !== undefined) {
      const rol = data.rol ?? this.props.rol;
      this.props.posicion = rol === 'jugador' ? (data.posicion ?? this.props.posicion) : null;
    }
    if (data.rol !== undefined || data.categoria !== undefined) {
      const rol = data.rol ?? this.props.rol;
      this.props.categoria = rol !== 'admin' ? (data.categoria ?? this.props.categoria) : null;
    }
  }

  desactivar(): void {
    this.props.activo = false;
  }

  activar(): void {
    this.props.activo = true;
  }

  static create(props: Omit<UsuarioProps, 'activo'> & { activo?: boolean }): UsuarioEntity {
    return new UsuarioEntity({
      ...props,
      activo: props.activo ?? true,
    });
  }

  static isRolValido(rol: string): rol is RolUsuario {
    return ROLES_PERMITIDOS.includes(rol as RolUsuario);
  }

  static getRolesPermitidos(): RolUsuario[] {
    return [...ROLES_PERMITIDOS];
  }
}
