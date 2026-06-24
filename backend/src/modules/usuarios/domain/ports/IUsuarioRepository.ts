import { UsuarioEntity, UsuarioProps } from '../entities/UsuarioEntity';

export interface IUsuarioRepository {
  getAll(): Promise<UsuarioEntity[]>;
  getById(id: string): Promise<UsuarioEntity | null>;
  getByRol(rol: string): Promise<UsuarioEntity[]>;
  getInactivos(): Promise<UsuarioEntity[]>;
  count(): Promise<number>;
  upsert(usuario: UsuarioEntity): Promise<void>;
  update(id: string, data: Partial<UsuarioProps>): Promise<UsuarioEntity>;
}
