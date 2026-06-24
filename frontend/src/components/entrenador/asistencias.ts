"use server";
import { createClient } from "@/lib/supabase/server";

export async function getEntrenamientos() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("entrenamientos")
    .select("id, titulo, fecha, hora, lugar, categoria, activo")
    .order("fecha", { ascending: false });
  return data ?? [];
}

export async function getEntrenamientoById(id: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("entrenamientos")
    .select("id, titulo, fecha, hora, lugar, categoria")
    .eq("id", id)
    .single();
  return data;
}

export async function getJugadoresConAsistencia(entrenamientoId: string) {
  const supabase = await createClient();

  const { data: jugadores } = await supabase
    .from("jugadores")
    .select("id, nombre, apellido, posicion, categoria, numero_camiseta, foto_url")
    .eq("activo", true)
    .order("apellido", { ascending: true });

  const { data: asistencias } = await supabase
    .from("asistencias")
    .select("jugador_id, presente, excusa, hora_llegada")
    .eq("entrenamiento_id", entrenamientoId);

  const asistenciaMap = new Map(
    (asistencias ?? []).map((a) => [a.jugador_id, a])
  );

  return (jugadores ?? []).map((j) => ({
    ...j,
    presente: asistenciaMap.get(j.id)?.presente ?? null,
    excusa: asistenciaMap.get(j.id)?.excusa ?? "",
    hora_llegada: asistenciaMap.get(j.id)?.hora_llegada ?? "",
    registrado: asistenciaMap.has(j.id),
  }));
}

export async function guardarAsistencia(
  jugadorId: string,
  entrenamientoId: string,
  presente: boolean,
  excusa?: string
) {
  const supabase = await createClient();
  await supabase
    .from("asistencias")
    .upsert(
      {
        jugador_id: jugadorId,
        entrenamiento_id: entrenamientoId,
        presente,
        excusa: excusa ?? null,
      },
      { onConflict: "jugador_id,entrenamiento_id" }
    );
}

export async function getResumenAsistencia(entrenamientoId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("asistencias")
    .select("presente")
    .eq("entrenamiento_id", entrenamientoId);

  const presentes = data?.filter((a) => a.presente).length ?? 0;
  const ausentes = data?.filter((a) => !a.presente).length ?? 0;
  return { presentes, ausentes, total: (data?.length ?? 0) };
}