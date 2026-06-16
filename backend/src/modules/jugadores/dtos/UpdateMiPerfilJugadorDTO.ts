export interface UpdateMiPerfilJugadorDTO {
  nombre: string;
  apellido: string;
  numeroCamiseta: number | null;
  fotoUrl: string | null;
  avatar?: {
    bytes: Uint8Array;
    contentType: string;
  };
}
