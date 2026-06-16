import { PartidoEntity, PartidoProps } from '../entities/PartidoEntity';

export interface IPartidoRepository {
  getAll(): Promise<PartidoEntity[]>;
  getActivos(): Promise<PartidoEntity[]>;
  getById(id: string): Promise<PartidoEntity | null>;
  getByCategoria(categoria: string): Promise<PartidoEntity[]>;
  save(partido: PartidoEntity): Promise<PartidoEntity>;
  update(id: string, data: Partial<Omit<PartidoProps, 'id'>>): Promise<PartidoEntity>;
}
