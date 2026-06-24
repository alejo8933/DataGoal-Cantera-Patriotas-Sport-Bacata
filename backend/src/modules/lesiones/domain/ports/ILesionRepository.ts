// Read-model alineado con el shape esperado por la UI legacy:
// snake_case + objeto `jugadores` anidado, conservado para no romper consumidores.
export interface LesionJugadorEmbed {
  nombre: string;
  apellido: string;
  numero_camiseta: number | null;
  posicion: string | null;
  categoria: string | null;
}

export interface LesionReadModel {
  id: string;
  descripcion: string | null;
  estado: string;
  fecha_lesion: string;
  fecha_retorno: string | null;
  jugador_id: string;
  jugadores: LesionJugadorEmbed | null;
}

export interface SaveLesionInput {
  jugadorId: string;
  fechaLesion: string;
  fechaRetorno: string | null;
  estado: string;
  descripcion: string | null;
}

export interface ILesionRepository {
  getAll(): Promise<LesionReadModel[]>;
  getById(id: string): Promise<LesionReadModel | null>;
  save(input: SaveLesionInput): Promise<void>;
  delete(id: string): Promise<void>;
}
