"use server";
import { createClient } from "@/lib/supabase/server";
import { notificarActividadAdmin } from "./notificaciones";

// Tipos de contrato explícitos. Las columnas asis/rend son null hasta que
// el módulo convocatorias tenga un caso de uso de estadísticas conectado.
type PartidoConvocatoria = {
  id: string;
  equipo_local: string;
  equipo_visitante: string;
  fecha: string;
  hora: string | null;
  lugar: string | null;
  categoria: string | null;
  estado: string;
  rival: string;
  torneo: null; // columna no disponible en tabla partidos actualmente
  estado_convocatoria: "Borrador" | "Nuevo";
  convocados_count: number;
};

type JugadorConvocatoria = {
  id: string;
  nombre: string;
  apellido: string;
  posicion: string | null;
  numero_camiseta: number | null;
  activo: boolean;
  categoria: string | null;
  asis: null;         // pendiente: conectar a GetEstadisticasJugadorUseCase
  rend: null;         // pendiente: conectar a GetEstadisticasJugadorUseCase
  forma: string;
  estadoFisico: string;
};

type RespuestaJugadoresConvocatoria = {
  jugadores: JugadorConvocatoria[];
  convocadosIds: string[];
  notas: string;
  convocatoriaId: string | undefined;
};

export async function getPartidosParaConvocatoria(): Promise<PartidoConvocatoria[]> {
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
    const rival = p.equipo_visitante && p.equipo_visitante !== "Patriotas" ? p.equipo_visitante : p.equipo_local;
    const conv = convocatoriasMap.get(p.id);
    return {
      ...p,
      rival,
      torneo: null,
      estado_convocatoria: conv ? "Borrador" : "Nuevo",
      convocados_count: conv?.convocatoria_jugadores?.length ?? 0
    }
  });
}

export async function getJugadoresParaConvocatoria(partidoId: string): Promise<RespuestaJugadoresConvocatoria> {
  const supabase = await createClient();

  // Obtenemos el partido para saber la categoría
  const { data: partido } = await supabase
    .from("partidos")
    .select("id, categoria")
    .eq("id", partidoId)
    .single();

  if (!partido) return { jugadores: [], convocadosIds: [], notas: "", convocatoriaId: undefined };

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

  const jugadoresConStats = jugadoresFiltered.map(j => ({
    ...j,
    asis: null,
    rend: null,
    forma: "Disponible",
    estadoFisico: "Disponible",
  }));

  return {
    jugadores: jugadoresConStats,
    convocadosIds,
    notas,
    convocatoriaId: convocatoria?.id
  };
}

export async function guardarConvocatoriaBulk(partidoId: string, jugadorIds: string[], notas: string): Promise<void> {
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

