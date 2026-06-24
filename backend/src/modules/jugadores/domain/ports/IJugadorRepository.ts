import { JugadorEntity, JugadorProps } from '../entities/JugadorEntity';

export interface IJugadorRepository {
  getAll(): Promise<JugadorEntity[]>;
  getById(id: string): Promise<JugadorEntity | null>;
  getByCategoria(categoriaId: string): Promise<JugadorEntity[]>;
  findByNombreCompleto(nombre: string, apellido: string): Promise<JugadorEntity | null>;
  save(jugador: JugadorEntity): Promise<JugadorEntity>;
  update(id: string, data: Partial<JugadorProps>): Promise<JugadorEntity>;
  delete(id: string): Promise<void>;
}
