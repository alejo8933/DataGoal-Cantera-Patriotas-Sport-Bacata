import { RolUsuario } from '../domain/entities/UsuarioEntity';

export type RolRegistro = 'admin' | 'entrenador' | 'jugador';

export interface AuthUserResponseDTO {
  id: string;
  email: string;
  rol: RolUsuario;
  activo: boolean;
}

export interface RegisterUsuarioDTO {
  rol: RolRegistro;
  email: string;
  password: string;
  nombre: string;
  apellido: string;
  telefono: string;
  fechaNacimiento: string;
  posicion?: string;
  categoria?: string;
}
