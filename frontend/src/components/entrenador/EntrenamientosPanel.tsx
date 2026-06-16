"use client";
import { useState, useMemo } from "react";
import { Calendar, Clock, MapPin, Users, X, Timer, TrendingUp, Plus, Trash2 } from "lucide-react";
import ModalNuevoEntrenamiento from "./ModalNuevoEntrenamiento";
import { eliminarEntrenamiento } from "@/lib/actions/entrenamientos.actions";

type Entrenamiento = {
  id: string;
  titulo: string;
  tipo: string;
  fecha: string;
  hora: string;
  lugar: string;
  duracion: string;
  categoria: string;
  activo: boolean;
};

type Asistencia = {
  entrenamiento_id: string;
  estado: string;
  jugador_id: string;
};

interface Props {
  entrenamientos: Entrenamiento[];
  asistencias: Asistencia[];
  totalJugadores: number; // Total de jugadores activos para sacar 100%
}

const TIPO_COLOR: Record<string, string> = {
  "Táctico": "bg-blue-100 text-blue-700",
  "Físico":  "bg-orange-100 text-orange-700",
  "Técnico": "bg-green-100 text-green-700",
};

export default function EntrenamientosPanel({ entrenamientos, asistencias, totalJugadores }: Props) {
  const [tab, setTab] = useState<"recientes" | "programados">("recientes");
  const [seleccionado, setSeleccionado] = useState<Entrenamiento | null>(null);
  const [tabDetalle, setTabDetalle] = useState<"objetivos" | "observaciones">("objetivos");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Funciones de cálculo rápido (En vivo)
  const stats = useMemo(() => {
    const today = new Date();
    // Esta Semana = Entrenamientos últimos 7 días
    const estaSemana = entrenamientos.filter(e => {
        const d = new Date(e.fecha);
        const diff = (today.getTime() - d.getTime()) / (1000 * 3600 * 24);
        return diff >= 0 && diff <= 7;
    });

    let asistidosTotal = 0;
    asistencias.forEach(a => {
      if (a.estado === "presente" || a.estado === "tarde") asistidosTotal++;
    });

    const maxPosibles = entrenamientos.length * (totalJugadores || 1);
    const promCálculo = maxPosibles === 0 ? 0 : Math.round((asistidosTotal / maxPosibles) * 100);

    let horasTotal = 0;
    estaSemana.forEach(e => {
        const payloadJSON = e.titulo.split("JSON_DATA:")[1];
        if (payloadJSON) {
           try {
             const data = JSON.parse(payloadJSON);
             horasTotal += (Number(data.duracion) || 90) / 60;
           } catch { horasTotal += 1.5; }
        } else {
           horasTotal += 1.5; // default 90 min
        }
    });

    return {
      estaSemana: estaSemana.length.toString(),
      promedio: `${promCálculo}%`,
      horas: Math.round(horasTotal).toString(),
      rendimiento: promCálculo > 85 ? "8.8" : "7.5", // Simulación del rendimiento en base a asistencia
    };
  }, [entrenamientos, asistencias, totalJugadores]);

  // Parseador de Entrenamientos (decodificar Título + JSON si existe)
  const parseEntrenamiento = (e: Entrenamiento) => {
    let tituloMostrado = e.titulo || "Entrenamiento";
    let tipo = e.tipo || "General";
    let duracion = e.duracion || "90";
    let objetivos = ["Sesión orientada al acondicionamiento general."];
    let observaciones = "Pendiente de revisar.";

    if (e.titulo?.includes("JSON_DATA:")) {
       const parts = e.titulo.split(" | JSON_DATA:");
       tituloMostrado = parts[0];
       try {
         const d = JSON.parse(parts[1]);
         if (d.tipo) tipo = d.tipo;
         if (d.duracion) duracion = d.duracion;
         if (d.objetivos) objetivos = d.objetivos.split("\n");
       } catch (err) {}
    } else {
       // fallback legacy extractions
       if (tituloMostrado.includes("Táctico")) tipo = "Táctico";
       else if (tituloMostrado.includes("Físico")) tipo = "Físico";
       else if (tituloMostrado.includes("Técnico")) tipo = "Técnico";
    }

    // Calcular asistencia de esta sesión
    const sesionAsis = asistencias.filter(a => a.entrenamiento_id === e.id);
    const pres = sesionAsis.filter(a => a.estado === "presente" || a.estado === "tarde").length;
    const max = totalJugadores || 20; // fallback
    const perc = Math.round((pres / max) * 100);

    return {
      ...e,
      tituloReal: tituloMostrado,
      tipoReal: tipo,
      duracionMin: duracion,
      objetivosList: objetivos,
      observacionesReal: observaciones,
      pres,
      max,
      perc: isNaN(perc) ? 0 : perc,
    };
  };

  const procesados = entrenamientos.map(parseEntrenamiento);
  
  // Separamos Pasados (Recientes) y Futuros (Programados)
  const todayStr = new Date().toISOString().split("T")[0];
  const recientes = procesados.filter(e => e.fecha <= todayStr);
  const programados = procesados.filter(e => e.fecha > todayStr);

  const lista = tab === "recientes" ? recientes : programados;

  const STATS_CARDS = [
    { icon: Calendar,   valor: stats.estaSemana, label: "Esta Semana",         sub: "entrenamientos" },
    { icon: Users,      valor: stats.promedio,   label: "Asistencia Promedio", sub: "jugadores" },
    { icon: Timer,      valor: stats.horas,      label: "Horas Totales",       sub: "esta semana" },
    { icon: TrendingUp, valor: stats.rendimiento,label: "Rendimiento",         sub: "promedio" },
  ];

  return (
    <div className="bg-white/50 min-h-[calc(100vh-64px)] pb-12">
      <div className="mx-auto max-w-7xl px-6 py-10">

        {/* Título y Botón Superior */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Entrenamientos</h1>
            <p className="text-sm font-medium text-gray-500 mt-1">
              Gestión de sesiones de entrenamiento y seguimiento del rendimiento
            </p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="shrink-0 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> Nuevo Entrenamiento
          </button>
        </div>

        {/* Stats KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {STATS_CARDS.map((s, i) => (
            <div key={i} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4 text-gray-400">
                <s.icon size={20} strokeWidth={2} className={i === 0 ? "text-blue-500" : i === 1 ? "text-green-500" : i === 2 ? "text-purple-500" : "text-red-500"} />
                <p className="text-xs font-bold uppercase tracking-wider">{s.label}</p>
              </div>
              <p className="text-3xl font-black text-gray-900 mb-0.5">{s.valor}</p>
              <p className="text-xs text-gray-400 font-medium">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Tabs de Vistas */}
        <div className="flex items-center gap-6 mb-6 border-b border-gray-100">
          <button
            onClick={() => setTab("recientes")}
            className={`pb-3 text-sm font-bold transition-all ${
              tab === "recientes" 
              ? "text-gray-900 border-b-2 border-gray-900" 
              : "text-gray-400 hover:text-gray-600"
            }`}
          >
            Entrenamientos Recientes {tab === "recientes" && `(${recientes.length})`}
          </button>
          <button
            onClick={() => setTab("programados")}
            className={`pb-3 text-sm font-bold transition-all ${
              tab === "programados" 
              ? "text-gray-900 border-b-2 border-gray-900" 
              : "text-gray-400 hover:text-gray-600"
            }`}
          >
            Programados {tab === "programados" && `(${programados.length})`}
          </button>
        </div>

        {/* Lista de Tarjetas */}
        {lista.length === 0 ? (
           <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
             <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-gray-300" />
             </div>
             <p className="text-lg font-bold text-gray-900 mb-1">Sin Registros</p>
             <p className="text-gray-400 text-sm">No hay entrenamientos en esta categoría.</p>
           </div>
        ) : (
           <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6">
             {lista.map((e) => (
               <div key={e.id} className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow relative group">
                 <button 
                    onClick={() => {
                       if (confirm("¿Eliminar este entrenamiento?")) eliminarEntrenamiento(e.id);
                    }}
                    className="absolute top-4 right-4 p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full opacity-0 group-hover:opacity-100 transition-all focus:opacity-100"
                 >
                    <Trash2 className="w-4 h-4" />
                 </button>

                 <div className="flex items-start justify-between gap-4 pr-8">
                   <div className="flex flex-col gap-1">
                     <p className="font-bold text-gray-900 leading-tight">{e.tituloReal}</p>
                     <p className="text-xs font-semibold text-gray-400">{e.categoria}</p>
                   </div>
                   <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${TIPO_COLOR[e.tipoReal] ?? "bg-gray-100 text-gray-600"}`}>
                     {e.tipoReal}
                   </span>
                 </div>
   
                 <div className="space-y-2 mt-2">
                   <p className="text-xs font-medium text-gray-500 flex items-center gap-2">
                     <Calendar size={14} className="text-gray-400" /> {e.fecha} · {e.hora}
                   </p>
                   <p className="text-xs font-medium text-gray-500 flex items-center gap-2">
                     <MapPin size={14} className="text-gray-400" /> {e.lugar}
                   </p>
                   <p className="text-xs font-medium text-gray-500 flex items-center gap-2">
                     <Clock size={14} className="text-gray-400" /> {e.duracionMin} minutos
                   </p>
                 </div>

                 {/* Barra de progreso Asistencia */}
                 <div className="mt-4 flex flex-col gap-1.5 pt-4 border-t border-gray-50">
                   <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-900 tracking-wider">ASISTENCIA</span>
                      <span className="text-xs font-black text-gray-900">{e.perc}%</span>
                   </div>
                   <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                     <div className="h-full bg-green-500" style={{ width: `${e.perc}%` }}></div>
                   </div>
                   <p className="text-[10px] text-gray-400 text-right mt-0.5">{e.pres}/{e.max} jugadores</p>
                 </div>
   
                 <button
                   onClick={() => { setSeleccionado(e as any); setTabDetalle("objetivos") }}
                   className="mt-2 w-full rounded-xl border border-gray-200 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:border-gray-300 transition-colors"
                 >
                   Ver Detalles
                 </button>
               </div>
             ))}
           </div>
        )}

      </div>

      {/* Modal de CREACIÓN */}
      {isModalOpen && (
        <ModalNuevoEntrenamiento onClose={() => setIsModalOpen(false)} />
      )}

      {/* Modal de DETALLES */}
      {seleccionado && (() => {
        const sel = parseEntrenamiento(seleccionado);
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden zoom-in-95 animate-in duration-200">
              
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h3 className="text-xl font-bold text-gray-900">{sel.tituloReal}</h3>
                <button
                  onClick={() => setSeleccionado(null)}
                  className="p-2 text-gray-400 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6">
                <div className="flex flex-wrap items-center gap-2 mb-6">
                  <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md ${TIPO_COLOR[sel.tipoReal] ?? "bg-gray-100"}`}>{sel.tipoReal}</span>
                  <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md bg-gray-100 text-gray-600 flex items-center gap-1">
                    <Calendar size={12} /> {sel.fecha}
                  </span>
                  <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md bg-gray-100 text-gray-600 flex items-center gap-1">
                    <Clock size={12} /> {sel.hora} ({sel.duracionMin}m)
                  </span>
                </div>
                
                {/* Tabs Modal Detalle */}
                <div className="flex border-b border-gray-100 mb-6">
                  <button
                    onClick={() => setTabDetalle("objetivos")}
                    className={`pb-3 px-4 text-sm font-bold transition-colors ${
                      tabDetalle === "objetivos" ? "text-red-600 border-b-2 border-red-600" : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    Objetivos
                  </button>
                  <button
                    onClick={() => setTabDetalle("observaciones")}
                    className={`pb-3 px-4 text-sm font-bold transition-colors ${
                      tabDetalle === "observaciones" ? "text-red-600 border-b-2 border-red-600" : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    Observaciones Base
                  </button>
                </div>

                <div className="min-h-[150px] bg-gray-50/50 p-6 rounded-xl border border-gray-100">
                  {tabDetalle === "objetivos" ? (
                    <ol className="list-decimal list-inside space-y-2">
                       {sel.objetivosList.map((obj, i) => (
                          <li key={i} className="text-sm text-gray-700 font-medium">{obj || 'Sin especificar'}</li>
                       ))}
                    </ol>
                  ) : (
                    <p className="text-sm text-gray-700 leading-relaxed font-medium">
                       {sel.observacionesReal || 'El entrenamiento ha sido registrado y cruzado con las asistencias. Pendiente de reporte técnico adicional.'}
                    </p>
                  )}
                </div>

              </div>
              <div className="p-4 border-t border-gray-50 flex justify-end">
                <button onClick={() => setSeleccionado(null)} className="px-5 py-2.5 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-black transition-colors">
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        );
      })()}

    </div>
  );
}
