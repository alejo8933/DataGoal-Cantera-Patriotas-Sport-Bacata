import { IUsuarioRepository } from '../domain/ports/IUsuarioRepository';
import { UsuarioEntity } from '../domain/entities/UsuarioEntity';

export class GetPerfilesByRolUseCase {
  constructor(private readonly repo: IUsuarioRepository) {}

  async execute(rol: string): Promise<UsuarioEntity[]> {
    return this.repo.getByRol(rol);
  }
}
