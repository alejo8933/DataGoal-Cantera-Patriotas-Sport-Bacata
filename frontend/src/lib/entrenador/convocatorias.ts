"use server";
import { createClient } from "@/lib/supabase/server";
import { notificarActividadAdmin } from "./notificaciones";
import { SupabasePartidoRepository } from "datagoal-backend/modules/partidos/infrastructure/SupabasePartidoRepository";
import { SupabaseJugadorRepository } from "datagoal-backend/modules/jugadores/infrastructure/SupabaseJugadorRepository";
import { SupabaseConvocatoriaRepository } from "datagoal-backend/modules/convocatorias/infrastructure/SupabaseConvocatoriaRepository";
import { GetJugadoresParaConvocatoriaUseCase } from "datagoal-backend/modules/convocatorias/use-cases/GetJugadoresParaConvocatoriaUseCase";
import { GuardarConvocatoriaUseCase } from "datagoal-backend/modules/convocatorias/use-cases/GuardarConvocatoriaUseCase";
import { GetPartidoByIdUseCase } from "datagoal-backend/modules/partidos/use-cases/GetPartidoByIdUseCase";

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

  const useCase = new GetJugadoresParaConvocatoriaUseCase(
    new SupabasePartidoRepository(supabase),
    new SupabaseJugadorRepository(supabase),
    new SupabaseConvocatoriaRepository(supabase),
  );

  const result = await useCase.execute(partidoId);

  const jugadoresOrdenados = [...result.jugadores].sort((a, b) =>
    a.apellido.localeCompare(b.apellido),
  );

  return {
    jugadores: jugadoresOrdenados.map((j) => ({
      id: j.id,
      nombre: j.nombre,
      apellido: j.apellido,
      posicion: j.posicion,
      numero_camiseta: j.numeroCamiseta,
      activo: j.activo,
      categoria: j.categoriaId,
      asis: null,
      rend: null,
      forma: "Disponible",
      estadoFisico: "Disponible",
    })),
    convocadosIds: result.convocadosIds,
    notas: result.notas,
    convocatoriaId: result.convocatoriaId,
  };
}

export async function guardarConvocatoriaBulk(partidoId: string, jugadorIds: string[], notas: string): Promise<void> {
  const supabase = await createClient();

  const guardarUseCase = new GuardarConvocatoriaUseCase(
    new SupabaseConvocatoriaRepository(supabase),
  );
  const { jugadoresCount } = await guardarUseCase.execute({ partidoId, jugadorIds, notas });

  // Notificación al admin: orquestación externa, no es dominio de convocatorias.
  const partidoUseCase = new GetPartidoByIdUseCase(new SupabasePartidoRepository(supabase));
  const partido = await partidoUseCase.execute(partidoId);

  const local = partido?.equipoLocal ?? '?';
  const visitante = partido?.equipoVisitante ?? '?';

  await notificarActividadAdmin({
    titulo: 'Convocatoria Registrada',
    descripcion: `Se ha registrado una nueva convocatoria para el partido ${local} vs ${visitante}. ${jugadoresCount} jugadores convocados.`,
    tipo: 'convocatoria',
  });
}

