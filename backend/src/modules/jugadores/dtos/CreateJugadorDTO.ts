export interface CreateJugadorDTO {
  nombre: string;
  apellido: string;
  posicion: string | null;
  categoriaId: string;
  equipoId: string | null;
  numeroCamiseta: number | null;
}
