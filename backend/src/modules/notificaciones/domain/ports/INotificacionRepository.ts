// Read-model alineado con el shape devuelto hoy por Supabase (select *).
// Se mantiene snake_case para no romper consumidores (paneles y server actions).
export interface NotificacionReadModel {
  id: string;
  user_id: string;
  titulo: string;
  descripcion: string | null;
  tipo: string | null;
  prioridad: string | null;
  leida: boolean;
  created_at: string;
}

export interface EnviarNotificacionInput {
  userIds: string[];
  titulo: string;
  descripcion?: string | null;
  tipo?: string | null;
  prioridad?: string | null;
}

export interface INotificacionRepository {
  getByUserId(userId: string): Promise<NotificacionReadModel[]>;
  marcarLeida(id: string): Promise<void>;
  marcarTodasLeidasDelUsuario(userId: string): Promise<void>;
  delete(id: string): Promise<void>;
  enviarBulk(input: EnviarNotificacionInput): Promise<void>;
}
