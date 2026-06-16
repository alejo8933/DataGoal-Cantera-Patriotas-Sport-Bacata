"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { notificarActividadAdmin } from "./notificaciones";

export async function getLesiones() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("lesiones")
    .select("id, descripcion, estado, fecha_lesion, fecha_retorno, jugador_id, jugadores(nombre, apellido, numero_camiseta, posicion, categoria)")
    .order("fecha_lesion", { ascending: false });
  return data ?? [];
}

export async function getJugadoresParaLesiones() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("jugadores")
    .select("id, nombre, apellido, numero_camiseta, posicion, categoria")
    .eq("activo", true)
    .order("apellido", { ascending: true });
  return data ?? [];
}

export async function registrarLesion(formData: FormData) {
  const supabase = await createClient();

  const jugador_id = formData.get("jugador_id") as string;
  const tipo_lesion = formData.get("tipo_lesion") as string;
  const zona_afectada = formData.get("zona_afectada") as string;
  const gravedad = formData.get("gravedad") as string;
  const fecha_lesion = formData.get("fecha_lesion") as string;
  const retorno_estimado = formData.get("retorno_estimado") as string;
  const mecanismo = formData.get("mecanismo") as string;
  const tratamiento = formData.get("tratamiento") as string;
  const notas = formData.get("notas") as string;
  const restricciones = formData.get("restricciones") as string; // ignoradas por ahora / concatenadas
  
  // Guardamos todo el compendio del form en la base de datos dentro del campo descripcion
  const compendio = JSON.stringify({
    tipo: tipo_lesion,
    zona: zona_afectada,
    gravedad: gravedad,
    mecanismo: mecanismo,
    tratamiento: tratamiento,
    notas: notas,
    restricciones: restricciones
  });

  await supabase.from("lesiones").insert({
    jugador_id,
    fecha_lesion,
    fecha_retorno: retorno_estimado,
    estado: "activo",
    descripcion: compendio
  });

  revalidatePath("/dashboard/entrenador/lesiones");

  // Notificar al administrador
  const { data: jugador } = await supabase
    .from("jugadores")
    .select("nombre, apellido")
    .eq("id", jugador_id)
    .single();

  await notificarActividadAdmin({
    titulo: 'Nueva Lesión Registrada',
    descripcion: `Se ha registrado una nueva lesión para el jugador ${jugador?.nombre} ${jugador?.apellido}. Estado: Activo.`,
    tipo: 'lesion',
    prioridad: 'alta'
  });
}


export async function eliminarLesion(id: string) {
  const supabase = await createClient();
  
  // Obtener info antes de borrar para notificar
  const { data: lesion } = await supabase
    .from("lesiones")
    .select("jugador_id, descripcion, jugadores(nombre, apellido)")
    .eq("id", id)
    .single();

  await supabase.from("lesiones").delete().eq("id", id);
  
  if (lesion && lesion.jugadores) {
    const j = lesion.jugadores as unknown as { nombre: string; apellido: string };
    await notificarActividadAdmin({
      titulo: 'Lesión Eliminada',
      descripcion: `Se ha eliminado el reporte de lesión del jugador ${j.nombre} ${j.apellido}.`,
      tipo: 'lesion_eliminada'
    });
  }

  revalidatePath("/dashboard/entrenador/lesiones");
}
