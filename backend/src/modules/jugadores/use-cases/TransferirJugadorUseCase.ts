import { IJugadorRepository } from '../domain/ports/IJugadorRepository';
import { JugadorEntity } from '../domain/entities/JugadorEntity';
import { AppError } from '../../../shared/errors/AppError';

export class TransferirJugadorUseCase {
  constructor(private readonly repo: IJugadorRepository) {}

  async execute(id: string, nuevaCategoriaId: string): Promise<JugadorEntity> {
    const jugador = await this.repo.getById(id);
    if (!jugador) {
      throw new AppError('El jugador no existe.', 404);
    }
    
    jugador.trasladarACategoria(nuevaCategoriaId);
    
    return this.repo.update(id, { categoriaId: nuevaCategoriaId });
  }
}
