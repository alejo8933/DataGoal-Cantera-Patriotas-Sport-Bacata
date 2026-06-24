import { IAuthSessionRepository } from '../domain/ports/IAuthSessionRepository';
import { IMatrizSeguridadRepository } from '../domain/ports/IMatrizSeguridadRepository';
import { MatrizSeguridadEntity, MatrizCoordenadas } from '../domain/entities/MatrizSeguridadEntity';
import { AppError } from '../../../shared/errors/AppError';

export class ValidarRetoMatrizUseCase {
  constructor(
    private readonly sessionRepo: IAuthSessionRepository,
    private readonly matrizRepo: IMatrizSeguridadRepository
  ) {}

  async execute(reto: MatrizCoordenadas): Promise<void> {
    const userId = await this.sessionRepo.getCurrentUserId();
    if (!userId) throw new AppError('No estás autenticado.', 401);

    const coordenadas = await this.matrizRepo.getByPerfilId(userId);
    if (!coordenadas) {
      throw new AppError('No se encontró la matriz de seguridad.', 404);
    }

    const matriz = new MatrizSeguridadEntity(userId, coordenadas, new Date());
    if (!matriz.validarReto(reto)) {
      throw new AppError('Las coordenadas ingresadas son incorrectas.', 403);
    }
  }
}
