export interface JugadorResponseDTO {
  id: string;
  nombre: string;
  apellido: string;
  nombreCompleto: string;
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
