export interface PerfilJugadorDeportivo {
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

export interface UpdatePerfilJugadorDeportivo {
  nombre: string;
  apellido: string;
  numeroCamiseta: number | null;
  fotoUrl: string | null;
}

export interface IPerfilJugadorRepository {
  getByUserId(userId: string): Promise<PerfilJugadorDeportivo | null>;
  updateByUserId(
    userId: string,
    data: UpdatePerfilJugadorDeportivo
  ): Promise<PerfilJugadorDeportivo | null>;
}
