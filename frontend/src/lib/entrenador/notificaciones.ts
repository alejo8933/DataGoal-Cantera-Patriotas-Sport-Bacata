"use server";
import { createClient } from "@/lib/supabase/server";
import { obtenerIdsPorRol } from "@/lib/actions/usuarios.actions";

export async function getNotificaciones() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("notificaciones")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return data ?? [];
}

export async function marcarLeida(id: string) {
  const supabase = await createClient();
  await supabase
    .from("notificaciones")
    .update({ leida: true })
    .eq("id", id);
}

export async function marcarTodasLeidas() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("notificaciones")
    .update({ leida: true })
    .eq("user_id", user.id)
    .eq("leida", false);
}

export async function eliminarNotificacion(id: string) {
  const supabase = await createClient();
  await supabase.from("notificaciones").delete().eq("id", id);
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
  await supabase.from("notificaciones").insert({
    user_id, titulo, descripcion, tipo, prioridad,
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
  const notificationsToInsert = adminIds.map((adminId) => ({
    user_id: adminId,
    titulo,
    descripcion,
    tipo,
    prioridad,
  }));

  await supabase.from("notificaciones").insert(notificationsToInsert);
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
  const notifications = userIds.map((userId) => ({
    user_id: userId,
    titulo,
    descripcion,
    tipo,
    prioridad,
  }));

  const { error: insertError } = await supabase.from('notificaciones').insert(notifications);
  
  if (insertError) {
    return { success: false, error: insertError.message };
  }

  return { success: true, count: userIds.length };
}
