"use server";
import { createClient } from "@/lib/supabase/server";

export async function getEvaluacionesReporte() {
  const supabase = await createClient();

  // Traer todos los jugadores activos
  const { data: jugadores } = await supabase
    .from("jugadores")
    .select("id, nombre, apellido, numero_camiseta, posicion, categoria")
    .eq("activo", true)
    .order("apellido", { ascending: true });

  const { data: evaluaciones } = await supabase
    .from("evaluaciones")
    .select("id, jugador_id, tecnica, fisica, tactica, mental, created_at")
    .order("created_at", { ascending: false });

  const jList = jugadores ?? [];
  const evList = evaluaciones ?? [];

  // Mapeamos los datos de rendimiento para el cliente
  const playersReport = jList.map(j => {
    // Evaluaciones pertenecientes a este jugador (ya están ordenadas de más reciente a más antigua)
    const playerEvs = evList.filter(ev => ev.jugador_id === j.id);
    const count = playerEvs.length;
    const isEvaluated = count > 0;
    
    // Tomamos la última
    const ultima = isEvaluated ? playerEvs[0] : null;

    let tTec = 0, tFis = 0, tTac = 0, tMen = 0, promGlobal = 0;
    if (ultima) {
      tTec = Number(ultima.tecnica) || 0;
      tFis = Number(ultima.fisica) || 0;
      tTac = Number(ultima.tactica) || 0;
      tMen = Number(ultima.mental) || 0;
      promGlobal = (tTec + tFis + tTac + tMen) / 4;
    }

    return {
      id: j.id,
      nombre: j.nombre,
      apellido: j.apellido,
      numero: j.numero_camiseta,
      posicion: j.posicion,
      categoria: j.categoria || "Sin Equipo",
      evaluacionesCount: count,
      ultimaFecha: ultima ? ultima.created_at : null,
      tecnica: tTec,
      fisica: tFis,
      tactica: tTac,
      mental: tMen,
      promedioGeneral: promGlobal
    };
  });

  // Calculamos promedios globales del equipo (sólo en base a los evaluados)
  const evaluados = playersReport.filter(p => p.evaluacionesCount > 0);
  let globalTecnica = 0, globalFisica = 0, globalTactica = 0, globalMental = 0;
  
  if (evaluados.length > 0) {
    globalTecnica = evaluados.reduce((acc, p) => acc + p.tecnica, 0) / evaluados.length;
    globalFisica = evaluados.reduce((acc, p) => acc + p.fisica, 0) / evaluados.length;
    globalTactica = evaluados.reduce((acc, p) => acc + p.tactica, 0) / evaluados.length;
    globalMental = evaluados.reduce((acc, p) => acc + p.mental, 0) / evaluados.length;
  }

  return {
    jugadores: playersReport,
    globals: {
      tecnica: globalTecnica,
      fisica: globalFisica,
      tactica: globalTactica,
      mental: globalMental
    }
  };
}
