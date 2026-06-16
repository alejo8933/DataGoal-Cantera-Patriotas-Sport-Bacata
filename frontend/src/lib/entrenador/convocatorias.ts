"use server";
import { createClient } from "@/lib/supabase/server";
import { notificarActividadAdmin } from "./notificaciones";

export async function getPartidosParaConvocatoria() {
  const supabase = await createClient();
  
  // Obtenemos los partidos
  const { data: partidos } = await supabase
    .from("partidos")
    .select("id, equipo_local, equipo_visitante, fecha, hora, lugar, categoria, estado")
    .order("fecha", { ascending: true }); // Ordenados por más próximos primero

  if (!partidos) return [];

  // Obtenemos las convocatorias existentes para saber los counts
  const { data: convocatorias } = await supabase
    .from("convocatorias")
    .select("id, partido_id, convocatoria_jugadores(jugador_id)");

  const convocatoriasMap = new Map((convocatorias ?? []).map(c => [c.partido_id, c]));

  return partidos.map((p) => {
    // Simulamos un torneo o campeonato si no lo hay en DB
    const rival = p.equipo_visitante && p.equipo_visitante !== "Patriotas" ? p.equipo_visitante : p.equipo_local;
    const conv = convocatoriasMap.get(p.id);
    return {
      ...p,
      rival,
      torneo: "Liga de Bogotá", // Placeholder
      estado_convocatoria: conv ? "Borrador" : "Nuevo",
      convocados_count: conv?.convocatoria_jugadores?.length ?? 0
    }
  });
}

export async function getJugadoresParaConvocatoria(partidoId: string) {
  const supabase = await createClient();

  // Obtenemos el partido para saber la categoría
  const { data: partido } = await supabase
    .from("partidos")
    .select("id, categoria")
    .eq("id", partidoId)
    .single();

  if (!partido) return { jugadores: [], convocadosIds: [], notas: "" };

  const { data: jugadoresDb } = await supabase
    .from("jugadores")
    .select("id, nombre, apellido, posicion, numero_camiseta, activo, categoria")
    .eq("activo", true)
    // Opcional: filtrar por categoría. Si partido.categoria es nulo, trae todos.
    // .eq("categoria", partido.categoria) <-- Comentado para no romper si la data es imperfecta, pero lo filtraremos en el cliente
    .order("apellido", { ascending: true });

  const jugadoresFiltered = (jugadoresDb ?? []).filter(j => 
    !partido.categoria || j.categoria === partido.categoria || partido.categoria === "Todos"
  );

  // Obtener la convocatoria actual si la hay
  const { data: convocatoria } = await supabase
    .from("convocatorias")
    .select("id, notas, convocatoria_jugadores(jugador_id)")
    .eq("partido_id", partidoId)
    .single();

  const convocadosIds = (convocatoria?.convocatoria_jugadores ?? []).map((cj: any) => cj.jugador_id);
  const notas = convocatoria?.notas ?? "";

  // Agregamos stats falsos provisionales y calculamos Asistencia real si queremos
  // Por ahora Mockeamos Rend, Forma y Estado para coincidir con el frontend
  const jugadoresConStats = jugadoresFiltered.map(j => {
    // Calculo mock de asistencia alta
    const randomAsis = Math.floor(Math.random() * 20) + 80; 
    const randomRend = (Math.random() * 3 + 6.5).toFixed(1);

    return {
      ...j,
      asis: randomAsis,
      rend: randomRend,
      forma: ["Buena", "Regular", "Pendiente"][Math.floor(Math.random() * 3)],
      estadoFisico: "Disponible" // Simulado
    };
  });

  return {
    jugadores: jugadoresConStats,
    convocadosIds,
    notas,
    convocatoriaId: convocatoria?.id
  };
}

export async function guardarConvocatoriaBulk(partidoId: string, jugadorIds: string[], notas: string) {
  const supabase = await createClient();

  // Verificar si ya existe
  const { data: existente } = await supabase
    .from("convocatorias")
    .select("id")
    .eq("partido_id", partidoId)
    .single();

  let convId = existente?.id;

  if (!convId) {
    const { data: nueva } = await supabase
      .from("convocatorias")
      .insert({ partido_id: partidoId, fecha: new Date().toISOString() })
      .select("id")
      .single();
    if (nueva) convId = nueva.id;
  } else {
    // Si queremos habilitar notas después, se puede hacer acá
  }

  if (!convId) throw new Error("No se pudo crear/recuperar la convocatoria");

  // Borrar previas listadas e insertar nuevas (replace)
  await supabase.from("convocatoria_jugadores").delete().eq("convocatoria_id", convId);

  if (jugadorIds.length > 0) {
    const payload = jugadorIds.map(jid => ({
      convocatoria_id: convId,
      jugador_id: jid
    }));
    await supabase.from("convocatoria_jugadores").insert(payload);
  }

  // Notificar al administrador
  const { data: partido } = await supabase
    .from("partidos")
    .select("equipo_local, equipo_visitante, fecha")
    .eq("id", partidoId)
    .single();

  await notificarActividadAdmin({
    titulo: 'Convocatoria Registrada',
    descripcion: `Se ha registrado una nueva convocatoria para el partido ${partido?.equipo_local} vs ${partido?.equipo_visitante}. ${jugadorIds.length} jugadores convocados.`,
    tipo: 'convocatoria'
  });
}

