import { IAuthSessionRepository } from '../domain/ports/IAuthSessionRepository';
import { IMatrizSeguridadRepository } from '../domain/ports/IMatrizSeguridadRepository';
import { MatrizSeguridadEntity, MatrizCoordenadas } from '../domain/entities/MatrizSeguridadEntity';
import { AppError } from '../../../shared/errors/AppError';

export class GenerarMatrizUsuarioUseCase {
  constructor(
    private readonly sessionRepo: IAuthSessionRepository,
    private readonly matrizRepo: IMatrizSeguridadRepository
  ) {}

  async execute(): Promise<MatrizCoordenadas> {
    const userId = await this.sessionRepo.getCurrentUserId();
    if (!userId) throw new AppError('No estás autenticado.', 401);

    const matriz = MatrizSeguridadEntity.create(userId);
    await this.matrizRepo.upsert(userId, matriz.coordenadas);
    return matriz.coordenadas;
  }
}
