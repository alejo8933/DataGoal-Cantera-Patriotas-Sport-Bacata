import { IUsuarioRepository } from '../domain/ports/IUsuarioRepository';

export class GetPerfilesCountUseCase {
  constructor(private readonly repo: IUsuarioRepository) {}

  async execute(): Promise<number> {
    return this.repo.count();
  }
}
