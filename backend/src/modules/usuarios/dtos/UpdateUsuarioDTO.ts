import { RolUsuario } from '../domain/entities/UsuarioEntity';

export interface UpdateUsuarioDTO {
  nombre?: string | null;
  apellido?: string | null;
  rol: RolUsuario;
  telefono?: string | null;
  fechaNacimiento?: string | null;
  posicion?: string | null;
  categoria?: string | null;
}
