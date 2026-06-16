import { UsuarioResponseDTO } from '../../usuarios/dtos/UsuarioResponseDTO';

export interface PerfilJugadorDeportivoResponseDTO {
  id: string;
  userId: string;
  nombre: string;
  apellido: string;
  posicion: string | null;
  categoria: string | null;
  numeroCamiseta: number | null;
  fotoUrl: string | null;
  fechaIngreso: string | null;
}

export interface MiPerfilJugadorResponseDTO {
  perfil: UsuarioResponseDTO;
  jugador: PerfilJugadorDeportivoResponseDTO | null;
}
