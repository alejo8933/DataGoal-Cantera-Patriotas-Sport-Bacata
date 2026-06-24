import { IUsuarioRepository } from '../domain/ports/IUsuarioRepository';
import { UsuarioEntity } from '../domain/entities/UsuarioEntity';

export class GetPerfilesUseCase {
  constructor(private readonly repo: IUsuarioRepository) {}

  async execute(onlyInactivos = false): Promise<UsuarioEntity[]> {
    if (onlyInactivos) {
      return this.repo.getInactivos();
    }
    return this.repo.getAll();
  }
}
