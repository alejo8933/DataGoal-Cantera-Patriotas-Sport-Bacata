"use server";
import { createClient } from "@/lib/supabase/server";
import { obtenerIdsPorRol } from "@/lib/actions/usuarios.actions";
import { SupabaseNotificacionRepository } from "@backend/modules/notificaciones/infrastructure/SupabaseNotificacionRepository";
import { GetNotificacionesDelUsuarioUseCase } from "@backend/modules/notificaciones/use-cases/GetNotificacionesDelUsuarioUseCase";
import { EnviarNotificacionAUsuariosUseCase } from "@backend/modules/notificaciones/use-cases/EnviarNotificacionAUsuariosUseCase";

export async function getNotificaciones() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const useCase = new GetNotificacionesDelUsuarioUseCase(
    new SupabaseNotificacionRepository(supabase),
  );
  const rows = await useCase.execute(user.id);
  // Compatibilidad con shape esperado por NotificacionesPanel: tipo y prioridad como string.
  return rows.map((n) => ({
    id: n.id,
    user_id: n.user_id,
    titulo: n.titulo,
    descripcion: n.descripcion,
    tipo: n.tipo ?? '',
    prioridad: n.prioridad ?? '',
    leida: n.leida,
    created_at: n.created_at,
  }));
}

export async function marcarLeida(id: string) {
  const supabase = await createClient();
  const repo = new SupabaseNotificacionRepository(supabase);
  await repo.marcarLeida(id);
}

export async function marcarTodasLeidas() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const repo = new SupabaseNotificacionRepository(supabase);
  await repo.marcarTodasLeidasDelUsuario(user.id);
}

export async function eliminarNotificacion(id: string) {
  const supabase = await createClient();
  const repo = new SupabaseNotificacionRepository(supabase);
  await repo.delete(id);
}

export async function crearNotificacion({
  user_id,
  titulo,
  descripcion,
  tipo = "sistema",
  prioridad = "baja",
}: {
  user_id: string;
  titulo: string;
  descripcion?: string;
  tipo?: string;
  prioridad?: string;
}) {
  const supabase = await createClient();
  const useCase = new EnviarNotificacionAUsuariosUseCase(
    new SupabaseNotificacionRepository(supabase),
  );
  await useCase.execute({
    userIds: [user_id],
    titulo,
    descripcion,
    tipo,
    prioridad,
  });
}

export async function notificarActividadAdmin({
  titulo,
  descripcion,
  tipo = "coach_activity",
  prioridad = "media",
}: {
  titulo: string;
  descripcion?: string;
  tipo?: string;
  prioridad?: string;
}) {
  const adminIds = await obtenerIdsPorRol("admin");
  if (adminIds.length === 0) return;

  const supabase = await createClient();
  const useCase = new EnviarNotificacionAUsuariosUseCase(
    new SupabaseNotificacionRepository(supabase),
  );
  await useCase.execute({
    userIds: adminIds,
    titulo,
    descripcion,
    tipo,
    prioridad,
  });
}

export async function enviarNotificacionMasiva({
  targetRole,
  prioridad,
  tipo = "comunicado",
  titulo,
  descripcion,
}: {
  targetRole: 'all' | 'entrenador' | 'jugador' | 'admin';
  prioridad: string;
  tipo?: string;
  titulo: string;
  descripcion: string;
}) {
  const userIds = await obtenerIdsPorRol(targetRole);
  if (userIds.length === 0) {
    return { success: false, error: 'No se encontraron destinatarios' };
  }

  const supabase = await createClient();
  const useCase = new EnviarNotificacionAUsuariosUseCase(
    new SupabaseNotificacionRepository(supabase),
  );

  try {
    const result = await useCase.execute({
      userIds,
      titulo,
      descripcion,
      tipo,
      prioridad,
    });
    return { success: true, count: result.enviadas };
  } catch (err: any) {
    return { success: false, error: err?.message ?? 'Error al enviar notificaciones' };
  }
}
