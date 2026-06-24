import { RolUsuario } from '../domain/entities/UsuarioEntity';

export interface UsuarioResponseDTO {
  id: string;
  email: string | null;
  nombre: string | null;
  apellido: string | null;
  nombreCompleto: string;
  rol: RolUsuario;
  telefono: string | null;
  fechaNacimiento: string | null;
  posicion: string | null;
  categoria: string | null;
  genero: string | null;
  documento: string | null;
  activo: boolean;
}

export interface PerfilResumenDTO {
  rol: RolUsuario;
  activo: boolean;
  nombre: string | null;
  apellido: string | null;
}
