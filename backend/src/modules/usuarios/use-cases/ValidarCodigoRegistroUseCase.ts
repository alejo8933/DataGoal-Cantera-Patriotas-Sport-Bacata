import { AppError } from '../../../shared/errors/AppError';

export interface ValidarCodigoConfig {
  codeAdmin?: string;
  codeTrainer?: string;
}

export class ValidarCodigoRegistroUseCase {
  constructor(private readonly config: ValidarCodigoConfig) {}

  execute(rol: string, codigo: string): void {
    if (rol === 'jugador') return;

    if (rol === 'admin') {
      if (codigo === this.config.codeAdmin) return;
      throw new AppError('El código de acceso para Administrador es incorrecto.', 403);
    }

    if (rol === 'entrenador') {
      if (codigo === this.config.codeTrainer) return;
      throw new AppError('El código de acceso para Entrenador es incorrecto.', 403);
    }

    throw new AppError('Rol no válido para validación de código.', 400);
  }
}
