"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { notificarActividadAdmin } from "./notificaciones";
import { SupabaseLesionRepository } from "@backend/modules/lesiones/infrastructure/SupabaseLesionRepository";
import { GetLesionesUseCase } from "@backend/modules/lesiones/use-cases/GetLesionesUseCase";
import { RegistrarLesionUseCase } from "@backend/modules/lesiones/use-cases/RegistrarLesionUseCase";
import { EliminarLesionUseCase } from "@backend/modules/lesiones/use-cases/EliminarLesionUseCase";

export async function getLesiones() {
  const supabase = await createClient();
  const useCase = new GetLesionesUseCase(new SupabaseLesionRepository(supabase));
  return useCase.execute();
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

  const useCase = new RegistrarLesionUseCase(new SupabaseLesionRepository(supabase));
  await useCase.execute({
    jugadorId: jugador_id,
    fechaLesion: fecha_lesion,
    fechaRetorno: retorno_estimado || null,
    descripcion: compendio,
    estado: "activo",
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

  const useCase = new EliminarLesionUseCase(new SupabaseLesionRepository(supabase));
  const { eliminada, jugador } = await useCase.execute(id);

  if (eliminada && jugador) {
    await notificarActividadAdmin({
      titulo: 'Lesión Eliminada',
      descripcion: `Se ha eliminado el reporte de lesión del jugador ${jugador.nombre} ${jugador.apellido}.`,
      tipo: 'lesion_eliminada'
    });
  }

  revalidatePath("/dashboard/entrenador/lesiones");
}
