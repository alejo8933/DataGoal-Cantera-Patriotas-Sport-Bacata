"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function restaurarRegistro(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const id = formData.get("id") as string;
  const tabla = formData.get("tabla") as string;
  const path = formData.get("path") as string;

  if (tabla === "partidos") {
    await supabase.from(tabla).update({ estado: "programado" }).eq("id", id);
  } else {
    await supabase.from(tabla).update({ activo: true }).eq("id", id);
  }

  revalidatePath(path);
}