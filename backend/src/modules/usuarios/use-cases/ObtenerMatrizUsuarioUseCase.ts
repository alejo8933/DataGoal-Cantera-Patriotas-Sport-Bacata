import { IAuthSessionRepository } from '../domain/ports/IAuthSessionRepository';
import { IMatrizSeguridadRepository } from '../domain/ports/IMatrizSeguridadRepository';
import { MatrizCoordenadas } from '../domain/entities/MatrizSeguridadEntity';
import { AppError } from '../../../shared/errors/AppError';

export class ObtenerMatrizUsuarioUseCase {
  constructor(
    private readonly sessionRepo: IAuthSessionRepository,
    private readonly matrizRepo: IMatrizSeguridadRepository
  ) {}

  async execute(): Promise<MatrizCoordenadas> {
    const userId = await this.sessionRepo.getCurrentUserId();
    if (!userId) throw new AppError('No estás autenticado.', 401);

    const matriz = await this.matrizRepo.getByPerfilId(userId);
    if (!matriz) {
      throw new AppError('No tienes una matriz de seguridad activa.', 404);
    }

    return matriz;
  }
}
