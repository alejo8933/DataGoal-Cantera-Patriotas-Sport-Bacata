"use client";
import { useState, useTransition, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Calendar, MapPin, Users, X, Send, Save, ChevronDown, ChevronUp } from "lucide-react";
import { guardarConvocatoriaBulk } from "@/lib/entrenador/convocatorias";

type Partido = {
  id: string;
  equipo_local: string;
  equipo_visitante: string;
  fecha: string;
  hora: string;
  lugar: string;
  categoria: string;
  estado: string;
  rival: string;
  torneo: string;
  estado_convocatoria: string;
  convocados_count: number;
};

type Jugador = {
  id: string;
  nombre: string;
  apellido: string;
  posicion: string | null;
  numero_camiseta: number | null;
  activo: boolean;
  categoria: string | null;
  asis: number;
  rend: string;
  forma: string;
  estadoFisico: string;
};

interface Props {
  partidos: Partido[];
  initialPartidoId: string;
  jugadores: Jugador[];
  initialConvocados: string[];
  initialNotas: string;
}

const POSICIONES_MAP: Record<string, string> = {
  "Portero": "Porteros",
  "Defensor Central": "Defensores",
  "Lateral Derecho": "Defensores",
  "Lateral Izquierdo": "Defensores",
  "Mediocampista Defensivo": "Mediocampistas",
  "Mediocampista Central": "Mediocampistas",
  "Mediocampista Ofensivo": "Mediocampistas",
  "Extremo Derecho": "Delanteros",
  "Extremo Izquierdo": "Delanteros",
  "Delantero Centro": "Delanteros",
};

function getGrupoPosicion(posicion: string | null) {
  if (!posicion) return "Otros";
  const posUpper = posicion.toLowerCase();
  if (posUpper.includes("portero")) return "Porteros";
  if (posUpper.includes("defensor") || posUpper.includes("lateral") || posUpper.includes("central")) return "Defensores";
  if (posUpper.includes("mediocampista") || posUpper.includes("volante")) return "Mediocampistas";
  if (posUpper.includes("delantero") || posUpper.includes("extremo") || posUpper.includes("punta")) return "Delanteros";
  return POSICIONES_MAP[posicion] || "Otros";
}

const ORDER = ["Porteros", "Defensores", "Mediocampistas", "Delanteros", "Otros"];

export default function ConvocatoriasPanel({
  partidos,
  initialPartidoId,
  jugadores,
  initialConvocados,
  initialNotas,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [selectedMatch, setSelectedMatch] = useState(initialPartidoId);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set(initialConvocados));
  const [notas, setNotas] = useState(initialNotas);

  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(ORDER));

  const MAX_CONVOCADOS = 18;

  const currentMatch = useMemo(() => partidos.find(p => p.id === selectedMatch), [partidos, selectedMatch]);

  const handleMatchSelect = (id: string) => {
    setSelectedMatch(id);
    startTransition(() => {
      router.push(`/dashboard/entrenador/convocatorias?partidoId=${id}`);
    });
  };

  const toggleJugador = (id: string, isSelect: boolean) => {
    const next = new Set(selectedIds);
    if (isSelect) {
      if (next.size < MAX_CONVOCADOS) {
        next.add(id);
      }
    } else {
      next.delete(id);
    }
    setSelectedIds(next);
  };

  const handleGuardar = (enviar: boolean) => {
    startTransition(async () => {
      await guardarConvocatoriaBulk(selectedMatch, Array.from(selectedIds), notas);
      // Podríamos abrir notificación de éxito
      router.refresh();
      if (enviar) {
        alert("¡Convocatoria enviada a los jugadores!");
      }
    });
  };

  const toggleGroup = (grupo: string) => {
    const next = new Set(expandedGroups);
    if (next.has(grupo)) next.delete(grupo);
    else next.add(grupo);
    setExpandedGroups(next);
  };

  // Group Players
  const groupedPlayers = useMemo(() => {
    const map: Record<string, Jugador[]> = {
      Porteros: [], Defensores: [], Mediocampistas: [], Delanteros: [], Otros: []
    };
    jugadores.forEach(j => {
      const g = getGrupoPosicion(j.posicion);
      if (!map[g]) map[g] = [];
      map[g].push(j);
    });
    return map;
  }, [jugadores]);

  const selectedPlayersCount = selectedIds.size;
  const missingPlayers = MAX_CONVOCADOS - selectedPlayersCount;
  const progressPercent = Math.min((selectedPlayersCount / MAX_CONVOCADOS) * 100, 100);

  // Group Selected Players for Summary
  const groupedSelected = useMemo(() => {
    const map: Record<string, Jugador[]> = {};
    Array.from(selectedIds).forEach(id => {
      const j = jugadores.find(x => x.id === id);
      if (j) {
        const g = getGrupoPosicion(j.posicion);
        if (!map[g]) map[g] = [];
        map[g].push(j);
      }
    });
    return map;
  }, [selectedIds, jugadores]);

  return (
    <div className="flex flex-col gap-6">
      {/* Carrusel de partidos */}
      <div className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x select-none scrollbar-hide">
        {partidos.map((p) => {
          const isSelected = p.id === selectedMatch;
          return (
            <div 
              key={p.id}
              onClick={() => handleMatchSelect(p.id)}
              className={`min-w-[320px] max-w-[320px] snap-center cursor-pointer transition-all border rounded-2xl p-4 shadow-sm flex flex-col gap-1.5 
                ${isSelected ? "border-red-500 bg-red-50/20 ring-1 ring-red-500" : "border-gray-200 bg-white hover:border-red-200"}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded">{p.estado_convocatoria === "Nuevo" ? "Nuevo" : "Borrador"}</span>
                <span className="text-xs font-semibold text-gray-400">{p.categoria ?? "General"}</span>
              </div>
              <h3 className="text-sm font-bold text-gray-900 line-clamp-1 mt-1 font-sans">
                vs {p.rival}
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Calendar className="w-3.5 h-3.5" />
                <span>{new Date(p.fecha).toLocaleDateString('es-CO')} - {p.hora ? p.hora.slice(0,5) : ''}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <MapPin className="w-3.5 h-3.5" />
                <span className="line-clamp-1">{p.torneo}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-medium text-blue-600 mt-1">
                <Users className="w-3.5 h-3.5" />
                <span>{isSelected ? selectedIds.size : p.convocados_count}/{MAX_CONVOCADOS} convocados</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Panel Principal */}
        <div className="flex-1 min-w-0 flex flex-col gap-5">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Selección de Jugadores</h2>
              <p className="text-sm text-gray-500">
                Patriota Sport Bacatá vs {currentMatch?.rival} • {currentMatch ? new Date(currentMatch.fecha).toLocaleDateString() : ""}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <select className="border border-gray-200 text-sm rounded-xl px-3 py-2 outline-none bg-gray-50 text-gray-600">
                <option>Todas las posiciones</option>
              </select>
              <select className="border border-gray-200 text-sm rounded-xl px-3 py-2 outline-none bg-gray-50 text-gray-600">
                <option>Todos</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            {!currentMatch ? (
              <div className="p-8 text-center text-gray-500 text-sm border border-dashed rounded-2xl bg-white/50">
                Seleccione un partido para mostrar la lista de jugadores.
              </div>
            ) : jugadores.length === 0 ? (
              <div className="p-8 text-center text-gray-500 text-sm border border-dashed rounded-2xl bg-white/50">
                No hay jugadores registrados en la categoría del partido.
              </div>
            ) : (
              ORDER.map(grupo => {
                const groupPlayers = groupedPlayers[grupo];
                if (!groupPlayers || groupPlayers.length === 0) return null;
                
                const isExpanded = expandedGroups.has(grupo);
                const convs = groupPlayers.filter(j => selectedIds.has(j.id)).length;

                return (
                  <div key={grupo} className="flex flex-col gap-3">
                    <button 
                      onClick={() => toggleGroup(grupo)}
                      className="flex items-center justify-between bg-white px-5 py-3 rounded-t-xl md:rounded-xl border border-gray-100 shadow-sm transition-colors hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        <h3 className="text-sm font-bold text-gray-900">{grupo}</h3>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full">{groupPlayers.length}</span>
                          <span className="text-xs text-gray-400 font-medium">({convs} conv.)</span>
                        </div>
                      </div>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                    </button>

                    {isExpanded && (
                      <div className="flex flex-col gap-2 -mt-2">
                        {groupPlayers.map(jugador => {
                          const isSelected = selectedIds.has(jugador.id);
                          const isLesionado = jugador.forma === "Lesionado" || jugador.estadoFisico === "Lesionado";
                          const isSuspendido = jugador.forma === "Suspendido" || jugador.estadoFisico === "Suspendido";
                          const isDuda = jugador.forma === "Pendiente" || jugador.forma === "Regular";
                          
                          let statusBg = "bg-green-100 text-green-700";
                          let statusText = "Disponible";
                          if (isLesionado) { statusBg = "bg-red-100 text-red-700"; statusText = "Lesionado"; }
                          else if (isSuspendido) { statusBg = "bg-orange-100 text-orange-700"; statusText = "Suspendido"; }
                          else if (isDuda) { statusBg = "bg-yellow-100 text-yellow-700"; statusText = "Duda"; }

                          return (
                            <label 
                              key={jugador.id} 
                              className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${
                                isSelected ? "border-red-300 bg-red-50/40" : "border-gray-100 bg-white hover:border-gray-200"
                              }`}
                            >
                              <div className="flex items-center gap-4">
                                <input 
                                  type="checkbox" 
                                  className="w-5 h-5 rounded !text-red-600 border-gray-300 focus:ring-red-500 cursor-pointer"
                                  checked={isSelected}
                                  disabled={selectedIds.size >= MAX_CONVOCADOS && !isSelected}
                                  onChange={(e) => toggleJugador(jugador.id, e.target.checked)}
                                />
                                
                                {/* Info Box Num */}
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-sm border
                                    ${isSelected ? "bg-red-100 text-red-700 border-red-200" : "bg-gray-50 text-gray-600 border-gray-100"}`}
                                >
                                  {jugador.numero_camiseta ?? '-'}
                                </div>
                                {/* Info Box Initials */}
                                <div className="w-8 h-8 rounded border border-gray-200 bg-white flex items-center justify-center text-xs font-bold text-gray-900 shadow-sm uppercase tracking-wider hidden sm:flex">
                                  {jugador.nombre[0]}{jugador.apellido[0]}
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-sm font-bold text-gray-900 leading-tight">
                                    {jugador.nombre} {jugador.apellido} <span className="text-green-500 text-[10px]">●</span>
                                  </span>
                                  <span className="text-xs text-gray-500 mt-0.5">{jugador.posicion ?? "Jugador"}</span>
                                </div>
                              </div>

                              <div className="flex items-center gap-6 md:gap-10">
                                {/* Stats */}
                                <div className="hidden sm:flex items-center gap-4 text-center">
                                  <div className="flex flex-col">
                                    <span className="text-[10px] text-gray-400 uppercase font-semibold">Asis.</span>
                                    <span className="text-xs font-bold text-gray-900">{jugador.asis}%</span>
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="text-[10px] text-gray-400 uppercase font-semibold">Rend.</span>
                                    <span className="text-xs font-bold text-gray-900">{jugador.rend}</span>
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="text-[10px] text-gray-400 uppercase font-semibold">Forma</span>
                                    <div className="flex items-center gap-0.5 justify-center mt-1">
                                      <div className={`w-1.5 h-1.5 rounded-full ${jugador.rend >= "7.5" ? "bg-green-500" : "bg-yellow-500"}`}></div>
                                      <div className={`w-1.5 h-1.5 rounded-full ${jugador.rend >= "7.5" ? "bg-green-500" : jugador.rend >= "6.0" ? "bg-yellow-500" : "bg-gray-300"}`}></div>
                                      <div className={`w-1.5 h-1.5 rounded-full ${jugador.rend >= "8.5" ? "bg-green-500" : "bg-gray-300"}`}></div>
                                    </div>
                                  </div>
                                </div>
                                
                                {/* Status */}
                                <div className={`text-xs font-bold px-3 py-1.5 rounded min-w-[85px] text-center ${statusBg}`}>
                                  {statusText}
                                </div>
                              </div>
                            </label>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Panel Derecho de Convocatoria */}
        {currentMatch && (
          <div className="w-full lg:w-[350px] shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-6 flex flex-col gap-6">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
                <Users className="w-5 h-5 text-gray-600" />
                <h3 className="text-base font-bold text-gray-900">Convocatoria</h3>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-bold text-gray-900">{selectedPlayersCount}/{MAX_CONVOCADOS} jugadores</span>
                  <span className="text-xs font-semibold text-red-600">
                    {missingPlayers > 0 ? `Faltan ${missingPlayers}` : "¡Lista completada!"}
                  </span>
                </div>
                {/* Progress Bar */}
                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${selectedPlayersCount === MAX_CONVOCADOS ? "bg-red-600" : "bg-red-500"}`}
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>
              </div>

              {/* Lista Seleccionada Agrupada */}
              <div className="flex flex-col gap-4 overflow-y-auto max-h-[40vh] scrollbar-thin">
                {selectedPlayersCount === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-4">Selecciona jugadores para armar la convocatoria</p>
                ) : (
                  ORDER.map(grupo => {
                    const players = groupedSelected[grupo];
                    if (!players || players.length === 0) return null;
                    return (
                      <div key={`sel-${grupo}`} className="flex flex-col gap-2">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{grupo}</span>
                        {players.map(j => (
                          <div key={j.id} className="flex items-center justify-between group">
                            <span className="text-xs font-semibold text-gray-700">
                              <span className="text-gray-400 font-medium w-4 inline-block">{j.numero_camiseta ?? '-'}</span> 
                              {j.nombre} {j.apellido}
                            </span>
                            <button 
                              onClick={() => toggleJugador(j.id, false)}
                              className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-1"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )
                  })
                )}
              </div>

              <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
                <label className="text-xs font-bold text-gray-700">Notas del entrenador</label>
                <textarea 
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                  placeholder="Instrucciones tácticas o detalles..."
                  className="w-full text-sm border-0 bg-gray-50 bg-gray-50/80 rounded-xl p-3 resize-none h-24 outline-none focus:ring-2 focus:ring-red-100 text-gray-700"
                ></textarea>
              </div>

              <div className="flex flex-col gap-3 mt-2">
                <button 
                  onClick={() => handleGuardar(false)}
                  disabled={isPending || selectedPlayersCount === 0}
                  className="flex items-center justify-center gap-2 w-full py-3 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Guardar Borrador
                </button>
                <button 
                  onClick={() => handleGuardar(true)}
                  disabled={isPending || selectedPlayersCount === 0}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-red-600 hover:bg-red-700 rounded-xl text-sm font-bold text-white transition-colors shadow-sm disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  Enviar Convocatoria
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
