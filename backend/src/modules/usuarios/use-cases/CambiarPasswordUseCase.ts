import { IAuthSessionRepository } from '../domain/ports/IAuthSessionRepository';
import { AppError } from '../../../shared/errors/AppError';

export class CambiarPasswordUseCase {
  constructor(private readonly sessionRepo: IAuthSessionRepository) {}

  async execute(password: string, confirmPassword: string): Promise<void> {
    if (!password || !confirmPassword) {
      throw new AppError('Todos los campos son obligatorios.', 400);
    }

    if (password.length < 6) {
      throw new AppError('La contraseña debe tener al menos 6 caracteres.', 400);
    }

    if (password !== confirmPassword) {
      throw new AppError('Las contraseñas no coinciden.', 400);
    }

    await this.sessionRepo.updatePassword(password);
  }
}
