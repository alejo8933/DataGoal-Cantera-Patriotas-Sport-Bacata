import {
  INotificacionRepository,
  NotificacionReadModel,
} from '../domain/ports/INotificacionRepository';

export class GetNotificacionesDelUsuarioUseCase {
  constructor(private readonly repo: INotificacionRepository) {}

  async execute(userId: string): Promise<NotificacionReadModel[]> {
    if (!userId?.trim()) return [];
    return this.repo.getByUserId(userId);
  }
}
