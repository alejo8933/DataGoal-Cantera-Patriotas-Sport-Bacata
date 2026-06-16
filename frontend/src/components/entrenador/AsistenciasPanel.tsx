"use client";
import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { guardarAsistenciasBulk } from "@/lib/actions/entrenamientos.actions";
import { Save, Clock, Loader2, Check, Search, UserCheck, UserX, AlertCircle, Users, Calendar, TrendingUp } from "lucide-react";
import Image from "next/image";

type Jugador = {
  id: string;
  nombre: string;
  apellido: string;
  posicion: string | null;
  categoria: string | null;
  numero_camiseta?: number | null;
  foto_url?: string | null;
  presente: boolean | null;
  excusa: string;
  hora_llegada: string | null;
  registrado: boolean;
};

type Entrenamiento = {
  id: string;
  titulo: string;
  fecha: string;
  hora: string;
  lugar: string;
  categoria: string;
  activo: boolean;
};

type ReporteAsistencia = {
  id: string;
  nombre: string;
  apellido: string;
  posicion: string | null;
  categoria: string | null;
  numero_camiseta?: number | null;
  totalEntrenamientos: number;
  presentes: number;
  ausentes: number;
  porcentajeTotal: number;
};

interface Props {
  entrenamientos: Entrenamiento[];
  initialEntrenamientoId: string;
  jugadores: Jugador[];
  reportes: ReporteAsistencia[];
}

export default function AsistenciasPanel({
  entrenamientos,
  initialEntrenamientoId,
  jugadores,
  reportes,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [activeTab, setActiveTab] = useState<"registrar" | "reportes" | "estadisticas">("registrar");

  // Filtros Registrar
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedEquipo, setSelectedEquipo] = useState("Todos los equipos");
  const [selectedEntrenamiento, setSelectedEntrenamiento] = useState(initialEntrenamientoId);

  // Filtros Reportes
  const [searchJugador, setSearchJugador] = useState("");

  // Estados locales para la tabla de edición
  const [asistencias, setAsistencias] = useState<Record<string, { presente: boolean; horaLlegada: string; excusa: string; notas: string }>>({});

  useEffect(() => {
    // Inicializar el estado de asistencias cuando cambian los jugadores
    const newState: typeof asistencias = {};
    jugadores.forEach((j) => {
      newState[j.id] = {
        presente: j.presente ?? true,
        horaLlegada: j.hora_llegada ?? "",
        excusa: j.excusa ?? "",
        notas: "", 
      };
    });
    setAsistencias(newState);
  }, [jugadores]);

  const handleEntrenamientoChange = (id: string) => {
    setSelectedEntrenamiento(id);
    if (!id) {
       router.push("/dashboard/entrenador/asistencias");
    } else {
       router.push(`/dashboard/entrenador/asistencias?entrenamientoId=${id}`);
    }
  };

  const handleGuardar = async () => {
    if (!selectedEntrenamiento) return;
    
    startTransition(async () => {
      const payload = Object.entries(asistencias).map(([jugadorId, data]) => ({
        jugadorId,
        presente: data.presente,
        excusa: data.excusa,
        notas: data.notas,
        horaLlegada: data.horaLlegada,
      }));

      await guardarAsistenciasBulk(selectedEntrenamiento, payload);
      router.refresh();
    });
  };

  const currentEntrenamiento = entrenamientos.find(e => e.id === selectedEntrenamiento);

  const filteredReportes = reportes.filter(r => 
    `${r.nombre} ${r.apellido}`.toLowerCase().includes(searchJugador.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Pestañas */}
      <div className="flex items-center gap-6 border-b border-gray-200 pb-2">
        <button 
          onClick={() => setActiveTab("registrar")}
          className={`text-sm pb-2 -mb-[9px] ${
            activeTab === "registrar" 
              ? "font-semibold text-gray-900 border-b-2 border-red-600" 
              : "font-medium text-gray-500 hover:text-gray-700"
          }`}
        >
          Registrar Asistencia
        </button>
        <button
          onClick={() => setActiveTab("reportes")}
          className={`text-sm pb-2 -mb-[9px] ${
            activeTab === "reportes" 
              ? "font-semibold text-gray-900 border-b-2 border-red-600" 
              : "font-medium text-gray-500 hover:text-gray-700"
          }`}
        >
          Reportes
        </button>
        <button 
          onClick={() => setActiveTab("estadisticas")}
          className={`text-sm pb-2 -mb-[9px] ${
            activeTab === "estadisticas" 
              ? "font-semibold text-gray-900 border-b-2 border-red-600" 
              : "font-medium text-gray-500 hover:text-gray-700"
          }`}
        >
          Estadísticas
        </button>
      </div>

      {activeTab === "registrar" && (
        <>
          {/* Selectores */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4">
            <div>
              <h2 className="text-base font-semibold text-gray-900">Seleccionar Entrenamiento</h2>
              <p className="text-sm text-gray-500">Elige el entrenamiento para registrar la asistencia</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-700">Fecha</label>
                <div className="relative">
                  <input 
                    type="date" 
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-gray-600 pl-10"
                  />
                  <Clock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-700">Equipo</label>
                <select 
                  value={selectedEquipo}
                  onChange={(e) => setSelectedEquipo(e.target.value)}
                  className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-gray-600 bg-gray-50/50"
                >
                  <option>Todos los equipos</option>
                  <option>Sub-10</option>
                  <option>Sub-13</option>
                  <option>Sub-17</option>
                  <option>Sub-20</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-700">Entrenamiento</label>
                <select
                  value={selectedEntrenamiento}
                  onChange={(e) => handleEntrenamientoChange(e.target.value)}
                  className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-gray-600 bg-gray-50/50"
                >
                  <option value="">Seleccione un entrenamiento...</option>
                  {entrenamientos.map(e => (
                    <option key={e.id} value={e.id}>{e.titulo} - {e.fecha}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {selectedEntrenamiento && currentEntrenamiento ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
              {/* Cabecera del Panel */}
              <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/30">
                <div>
                  <h3 className="text-base font-bold text-gray-900">{currentEntrenamiento.titulo}</h3>
                  <p className="text-sm text-gray-500">
                    {currentEntrenamiento.categoria} • {currentEntrenamiento.fecha} • {currentEntrenamiento.hora.slice(0, 5)} • {currentEntrenamiento.lugar}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                    Completado
                  </span>
                  <button 
                    onClick={handleGuardar}
                    disabled={isPending}
                    className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-2 rounded-xl flex items-center gap-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Guardar Asistencia
                  </button>
                </div>
              </div>

              {/* Tabla de Jugadores */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="px-5 py-4 text-xs font-semibold text-gray-900 w-1/4">Jugador</th>
                      <th className="px-5 py-4 text-xs font-semibold text-gray-900 w-[100px]">Presente</th>
                      <th className="px-5 py-4 text-xs font-semibold text-gray-900">Hora de Llegada</th>
                      <th className="px-5 py-4 text-xs font-semibold text-gray-900 w-[200px]">Excusa</th>
                      <th className="px-5 py-4 text-xs font-semibold text-gray-900 w-[200px]">Notas</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {jugadores
                      .filter(j => selectedEquipo === "Todos los equipos" || j.categoria === selectedEquipo)
                      .map((jugador) => {
                      const estado = asistencias[jugador.id];
                      if (!estado) return null;

                      return (
                        <tr key={jugador.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-3">
                              <div className="flex flex-col">
                                <span className="text-sm font-bold text-gray-900 leading-tight">
                                  {jugador.nombre} {jugador.apellido}
                                </span>
                                <span className="text-xs text-gray-500 mt-0.5">
                                  #{jugador.numero_camiseta ?? '--'} • {jugador.posicion ?? 'Jugador'}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Toggle iOS-style */}
                          <td className="px-5 py-3">
                            <button
                              onClick={() => setAsistencias(prev => ({
                                ...prev, 
                                [jugador.id]: { ...prev[jugador.id], presente: !prev[jugador.id].presente }
                              }))}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${
                                estado.presente ? 'bg-red-600' : 'bg-gray-200'
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  estado.presente ? 'translate-x-6' : 'translate-x-1'
                                }`}
                              />
                            </button>
                          </td>

                          {/* Hora Llegada */}
                          <td className="px-5 py-3">
                            <div className="relative max-w-[120px]">
                              <input 
                                type="time" 
                                className={`w-full text-sm font-medium border rounded-xl px-3 py-1.5 outline-none transition-colors ${
                                  estado.presente 
                                    ? 'bg-gray-50 border-gray-200 text-gray-700' 
                                    : 'bg-gray-100 border-transparent text-gray-400 opacity-50 cursor-not-allowed'
                                }`}
                                disabled={!estado.presente}
                                value={estado.horaLlegada}
                                onChange={(e) => setAsistencias(prev => ({
                                  ...prev, 
                                  [jugador.id]: { ...prev[jugador.id], horaLlegada: e.target.value }
                                }))}
                              />
                            </div>
                          </td>

                          {/* Excusa */}
                          <td className="px-5 py-3">
                            <input
                              type="text"
                              placeholder={estado.presente ? "" : "Motivo de ausencia"}
                              disabled={estado.presente}
                              value={estado.excusa}
                              onChange={(e) => setAsistencias(prev => ({
                                ...prev, 
                                [jugador.id]: { ...prev[jugador.id], excusa: e.target.value }
                              }))}
                              className={`w-full text-sm border rounded-xl px-3 py-1.5 outline-none transition-colors ${
                                !estado.presente 
                                  ? 'bg-gray-50 border-gray-200 text-gray-700 focus:border-red-500' 
                                  : 'bg-gray-100 border-transparent text-gray-400 opacity-50 cursor-not-allowed'
                              }`}
                            />
                          </td>

                          {/* Notas */}
                          <td className="px-5 py-3">
                            <input
                              type="text"
                              placeholder="Observaciones"
                              value={estado.notas}
                              onChange={(e) => setAsistencias(prev => ({
                                ...prev, 
                                [jugador.id]: { ...prev[jugador.id], notas: e.target.value }
                              }))}
                              className="w-full text-sm bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-gray-700 outline-none focus:border-red-500 transition-colors"
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {jugadores.filter(j => selectedEquipo === "Todos los equipos" || j.categoria === selectedEquipo).length === 0 && (
                  <div className="p-10 text-center text-gray-500 text-sm">
                    No hay jugadores registrados activos en este entrenamiento para la categoría seleccionada.
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white/50 border border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center p-12 text-center">
              <Clock className="w-10 h-10 text-gray-300 mb-3" />
              <h3 className="text-gray-900 font-semibold mb-1">Ningún entrenamiento seleccionado</h3>
              <p className="text-gray-500 text-sm">Por favor selecciona un entrenamiento en la barra superior para registrar la asistencia.</p>
            </div>
          )}
        </>
      )}

      {activeTab === "reportes" && (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-6">
          <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Reportes de Asistencia</h2>
              <p className="text-sm text-gray-500">Consulta el historial de asistencia por jugador</p>
            </div>
            
            {/* Buscador, sin botón Exportar */}
            <div className="relative mt-4 md:mt-0 max-w-sm w-full md:w-[350px]">
              <input 
                type="text"
                placeholder="Buscar jugador..."
                value={searchJugador}
                onChange={(e) => setSearchJugador(e.target.value)}
                className="w-full bg-gray-50/50 border border-gray-200 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 pl-10 transition-colors"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-5 py-4 text-xs font-semibold text-gray-900 w-1/4">Jugador</th>
                  <th className="px-5 py-4 text-xs font-semibold text-gray-900">Equipo</th>
                  <th className="px-5 py-4 text-xs font-semibold text-gray-900">Entrenamientos</th>
                  <th className="px-5 py-4 text-xs font-semibold text-gray-900">Presentes</th>
                  <th className="px-5 py-4 text-xs font-semibold text-gray-900">Ausentes</th>
                  <th className="px-5 py-4 text-xs font-semibold text-gray-900">% Asistencia</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredReportes.map((reporte) => {
                  const percentString = reporte.porcentajeTotal.toFixed(1) + "%";
                  const isPerfect = reporte.porcentajeTotal >= 90;
                  const isBad = reporte.porcentajeTotal < 50;
                  return (
                    <tr key={reporte.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-gray-900">
                            {reporte.nombre} {reporte.apellido}
                          </span>
                          <span className="text-xs text-gray-500 mt-0.5">
                            #{reporte.numero_camiseta ?? '--'} • {reporte.posicion ?? 'Jugador'}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-700">
                        {reporte.categoria ?? 'Sin Equipo'}
                      </td>
                      <td className="px-5 py-3 text-sm font-semibold text-blue-600">
                        {reporte.totalEntrenamientos}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-1.5 text-sm text-green-600 font-medium">
                          <UserCheck className="w-4 h-4" />
                          {reporte.presentes}
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-1.5 text-sm text-red-600 font-medium">
                          <UserX className="w-4 h-4" />
                          {reporte.ausentes}
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-1.5 text-sm font-semibold">
                          <span className={`${isPerfect ? "text-green-600" : isBad ? "text-red-600" : "text-gray-700"}`}>
                            {percentString}
                          </span>
                          {isBad && <AlertCircle className="w-3.5 h-3.5 text-red-600" />}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {filteredReportes.length === 0 && (
              <div className="p-10 text-center text-gray-500 text-sm">
                No se encontraron jugadores que coincidan con la búsqueda.
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "estadisticas" && (() => {
        // --- 1. Cálculos de Estadísticas ---
        const totalJugadores = reportes.length;
        const totalEntrenamientos = entrenamientos.length;
        const totalAsistencias = reportes.reduce((acc, r) => acc + r.presentes, 0);
        const esperadasGenerales = reportes.reduce((acc, r) => acc + r.totalEntrenamientos, 0);
        const porcentajePromedio = esperadasGenerales > 0 
          ? (totalAsistencias / esperadasGenerales) * 100 
          : 0;

        // Equipos únicos
        const categoriasUnicas = Array.from(new Set(reportes.map(r => r.categoria).filter(Boolean))) as string[];
        const statsEquipos = categoriasUnicas.map(cat => {
          const players = reportes.filter(r => r.categoria === cat);
          const numEntrenamientos = entrenamientos.filter(e => e.categoria === cat).length;
          const asisEsperadas = players.length * numEntrenamientos;
          const asisReales = players.reduce((acc, r) => acc + r.presentes, 0);
          const tasa = asisEsperadas > 0 ? (asisReales / asisEsperadas) * 100 : 0;
          return { nombre: cat, jugadores: players.length, entrenamientos: numEntrenamientos, asisEsperadas, asisReales, tasa };
        });

        return (
          <div className="flex flex-col gap-6">
            {/* KPIs Generales */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex items-start gap-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Total Jugadores</p>
                  <p className="text-2xl font-bold text-gray-900 mt-0.5">{totalJugadores}</p>
                </div>
              </div>
              <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex items-start gap-4">
                <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Entrenamientos</p>
                  <p className="text-2xl font-bold text-gray-900 mt-0.5">{totalEntrenamientos}</p>
                </div>
              </div>
              <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex items-start gap-4">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Asistencias</p>
                  <p className="text-2xl font-bold text-gray-900 mt-0.5">{totalAsistencias}</p>
                </div>
              </div>
              <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex items-start gap-4">
                <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">% Promedio</p>
                  <p className="text-2xl font-bold text-gray-900 mt-0.5">{porcentajePromedio.toFixed(1)}%</p>
                </div>
              </div>
            </div>

            {/* Tarjetas de Equipos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {statsEquipos.map((team, idx) => (
                <div key={idx} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-5">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{team.nombre}</h3>
                    <p className="text-sm text-gray-500">Estadísticas de asistencia del equipo</p>
                  </div>
                  
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between text-sm py-1">
                      <span className="text-gray-600 font-medium">Jugadores:</span>
                      <span className="font-bold text-gray-900">{team.jugadores}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm py-1">
                      <span className="text-gray-600 font-medium">Entrenamientos:</span>
                      <span className="font-bold text-gray-900">{team.entrenamientos}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm py-1">
                      <span className="text-gray-600 font-medium">Asistencias esperadas:</span>
                      <span className="font-bold text-gray-900">{team.asisEsperadas}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm py-1">
                      <span className="text-gray-600 font-medium">Asistencias reales:</span>
                      <span className="font-bold text-gray-900">{team.asisReales}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm pt-3 mt-1 border-t border-gray-100">
                      <span className="text-gray-600 font-medium">Tasa de asistencia:</span>
                      <span className={`px-2 py-1 rounded text-xs font-bold text-white ${
                        team.tasa >= 80 ? "bg-green-500" : team.tasa >= 50 ? "bg-yellow-500" : "bg-red-500"
                      }`}>
                        {team.tasa.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })()}
    </div>
  );
}