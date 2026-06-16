export interface UpdateMiPerfilDTO {
  nombre: string;
  apellido: string;
  telefono?: string | null;
  genero?: string | null;
  documento?: string | null;
  fechaNacimiento?: string | null;
}

export interface SyncPerfilDTO {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  rol: string;
  telefono?: string | null;
  fechaNacimiento?: string | null;
  posicion?: string | null;
  categoria?: string | null;
}
