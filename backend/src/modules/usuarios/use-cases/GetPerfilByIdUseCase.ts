import { IUsuarioRepository } from '../domain/ports/IUsuarioRepository';
import { UsuarioEntity } from '../domain/entities/UsuarioEntity';

export class GetPerfilByIdUseCase {
  constructor(private readonly repo: IUsuarioRepository) {}

  async execute(id: string): Promise<UsuarioEntity | null> {
    return this.repo.getById(id);
  }
}
