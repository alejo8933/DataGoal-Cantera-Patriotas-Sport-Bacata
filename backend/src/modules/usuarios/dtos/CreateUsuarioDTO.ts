import { RolUsuario } from '../domain/entities/UsuarioEntity';

export interface CreateUsuarioDTO {
  email: string;
  password: string;
  rol: RolUsuario;
  nombre: string;
  apellido: string;
  telefono?: string | null;
  fechaNacimiento?: string | null;
  posicion?: string | null;
  categoria?: string | null;
}
