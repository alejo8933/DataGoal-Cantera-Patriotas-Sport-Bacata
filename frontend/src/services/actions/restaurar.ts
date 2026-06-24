"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

const TABLAS_PERMITIDAS = [
  'jugadores',
  'rendimiento_equipos',
  'perfiles',
  'partidos',
  'entrenamientos',
] as const

type TablaPermitida = (typeof TABLAS_PERMITIDAS)[number]

export async function restaurarRegistro(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const id = formData.get("id") as string;
  const tabla = formData.get("tabla") as string;
  const path = formData.get("path") as string;

  if (!(TABLAS_PERMITIDAS as readonly string[]).includes(tabla)) return;

  const tablaValidada = tabla as TablaPermitida;

  if (tablaValidada === "partidos") {
    await supabase.from(tablaValidada).update({ estado: "programado" }).eq("id", id);
  } else {
    await supabase.from(tablaValidada).update({ activo: true }).eq("id", id);
  }

  revalidatePath(path);
}