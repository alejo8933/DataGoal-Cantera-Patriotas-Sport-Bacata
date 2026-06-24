"use client";
import { useState, useTransition } from "react";
import { Plus, Trash2, Activity, HeartPulse, CheckCircle2, Users } from "lucide-react";
import ModalRegistrarLesion from "./ModalRegistrarLesion";
import { eliminarLesion } from "@/lib/entrenador/lesiones";

type Jugador = {
  id: string;
  nombre: string;
  apellido: string;
  numero_camiseta: number | null;
  posicion: string | null;
  categoria: string | null;
};

type Lesion = {
  id: string;
  descripcion: string;
  estado: string;
  fecha_lesion: string | null;
  fecha_retorno: string | null;
  jugador_id: string;
  jugadores: any; // Blindado para build Vercel
};

interface Props {
  lesiones: Lesion[];
  jugadores: Jugador[];
}

export default function LesionesPanel({ lesiones, jugadores }: Props) {
  const [activeTab, setActiveTab] = useState("Todas");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const activas = lesiones.filter(l => l.estado === 'activo');
  const enRecuperacion = lesiones.filter(l => l.estado === 'en_recuperacion');
  
  // Asumiendo recuperados mes como los que estado recuperado en los ultimos 30 dias (por simplicidad aquí lo listaremos todo lo que sea 'recuperado')
  const recuperados = lesiones.filter(l => l.estado === 'recuperado' || (l.estado !== 'activo' && l.estado !== 'en_recuperacion'));
  
  // Total jugadores afectados: IDs unicos
  const idsAfectados = new Set(lesiones.filter(l => l.estado === 'activo' || l.estado === 'en_recuperacion').map(l => l.jugador_id));
  
  const getFilteredLesiones = () => {
    if (activeTab === "Activas") return activas;
    if (activeTab === "Recuperando") return enRecuperacion;
    if (activeTab === "Recuperados") return recuperados;
    return lesiones;
  };

  const handleEliminar = (id: string) => {
    if (confirm("¿Estás seguro de eliminar este registro de lesión?")) {
      startTransition(async () => {
        await eliminarLesion(id);
      });
    }
  };

  const decodeCompendio = (str: string) => {
    try {
      return JSON.parse(str);
    } catch {
      return { gravedad: "Leve", tipo: "Lesión", zona: "" }; // fallback si no era JSON
    }
  };

  const getDaysDiff = (start: string, end: string) => {
    const s = new Date(start);
    const e = new Date(end);
    const ms = e.getTime() - s.getTime();
    return Math.ceil(ms / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <HeartPulse className="w-6 h-6 text-red-600" />
            Gestión de Lesiones
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Control médico y recuperación de jugadores</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Registrar Lesión
        </button>
      </div>

      {/* Tarjetas KPI Superiores */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <div className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center mb-4">
            <Activity className="w-4 h-4" />
          </div>
          <h3 className="text-3xl font-bold text-gray-900">{activas.length}</h3>
          <p className="text-xs text-gray-400 font-medium mt-1">Lesiones Activas</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center mb-4">
            <Activity className="w-4 h-4" />
          </div>
          <h3 className="text-3xl font-bold text-gray-900">{enRecuperacion.length}</h3>
          <p className="text-xs text-gray-400 font-medium mt-1">En Recuperación</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <div className="w-8 h-8 rounded-lg bg-green-50 text-green-500 flex items-center justify-center mb-4">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <h3 className="text-3xl font-bold text-gray-900">{recuperados.length}</h3>
          <p className="text-xs text-gray-400 font-medium mt-1">Recuperados (Total)</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center mb-4">
            <Users className="w-4 h-4" />
          </div>
          <h3 className="text-3xl font-bold text-gray-900">{idsAfectados.size}</h3>
          <p className="text-xs text-gray-400 font-medium mt-1">Total Jugadores Afectados</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100 gap-6 mt-4">
        {["Todas", "Activas", "Recuperando", "Recuperados"].map((tab) => {
          let count = lesiones.length;
          if (tab === "Activas") count = activas.length;
          if (tab === "Recuperando") count = enRecuperacion.length;
          if (tab === "Recuperados") count = recuperados.length;
          
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-bold transition-all ${
                activeTab === tab 
                ? "text-gray-900 border-b-2 border-gray-900" 
                : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab} ({count})
            </button>
          )
        })}
      </div>

      {/* Grid List */}
      <div className="flex flex-col gap-4">
        {getFilteredLesiones().length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
             <p className="text-gray-400 text-sm">No hay registros para esta categoría.</p>
          </div>
        ) : (
          getFilteredLesiones().map(l => {
            const j = Array.isArray(l.jugadores) ? l.jugadores[0] : l.jugadores;
            const comp = decodeCompendio(l.descripcion);
            const grav = comp.gravedad || "Leve";
            const tipoZonaDesc = comp.tipo && comp.zona ? `${comp.tipo} en ${comp.zona}` : l.descripcion;
            
            // Determinar colores según estado y gravedad (acercandonos lo más posible al Figma)
            let borderLine = "border-l-4 border-l-red-500"; // Default activo
            let gravBadge = "bg-yellow-100 text-yellow-700"; // Leve
            let stBadge = "bg-red-50 text-red-600"; // Activo
            let stLabel = "Activo";

            if (grav === "Moderada") gravBadge = "bg-orange-100 text-orange-700";
            if (grav === "Grave") gravBadge = "bg-red-100 text-red-700";

            if (l.estado === "en_recuperacion") {
              borderLine = "border-l-4 border-l-orange-400";
              stBadge = "bg-orange-50 text-orange-600";
              stLabel = "Recuperando";
            } else if (l.estado === "recuperado") {
              borderLine = "border-l-4 border-l-yellow-400"; // Según Figma usa amarillo para el recuperado con línea izq
              stBadge = "bg-green-100 text-green-700";
              stLabel = "Recuperado";
            }

            // Calculo progeso barra
            let progress = 0;
            let timeText = "";
            let remainingText = "";

            if (l.fecha_lesion && l.fecha_retorno) {
              const total = getDaysDiff(l.fecha_lesion, l.fecha_retorno);
              const elapsed = getDaysDiff(l.fecha_lesion, new Date().toISOString());
              
              if (l.estado === "recuperado") {
                progress = 100;
                timeText = "Recuperación completada";
              } else {
                if (elapsed >= total) progress = 100; // Atrasado
                else if (elapsed < 0) progress = 0; 
                else progress = (elapsed / total) * 100;

                timeText = `Recuperación: ${Math.max(0, elapsed)}/${total} días`;
                
                const rest = total - elapsed;
                if (rest > 0) remainingText = `${rest} días restantes`;
                else remainingText = "Tiempo vencido";
              }
            }

            return (
              <div key={l.id} className={`bg-white rounded-xl border border-gray-100 shadow-sm p-5 pr-6 transition-all hover:shadow-md ${borderLine} flex items-stretch gap-6`}>
                
                {/* Iniciales */}
                <div className="w-12 h-12 rounded-full border border-gray-100 bg-gray-50 flex items-center justify-center text-sm font-bold text-gray-900 shadow-sm uppercase shrink-0 self-center">
                  {j?.nombre?.[0]}{j?.apellido?.[0]}
                </div>

                {/* Main Content */}
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-gray-900">
                      <span className="text-gray-400 mr-1">#{j?.numero_camiseta}</span> 
                      {j?.nombre} {j?.apellido}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${gravBadge}`}>{grav}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 ${stBadge}`}>
                      {l.estado === "recuperado" ? <CheckCircle2 className="w-3 h-3" /> : <Activity className="w-3 h-3" />}
                      {stLabel}
                    </span>
                  </div>
                  
                  <p className="text-xs text-gray-600 mb-2 truncate">
                    <span className="font-semibold text-gray-800">{tipoZonaDesc}</span> • {j?.posicion} {j?.categoria ? `· ${j.categoria}` : ''}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-gray-500 mb-1.5">
                    <span>{l.estado === "recuperado" ? timeText : timeText}</span>
                    {l.estado !== "recuperado" && remainingText && (
                      <span className="text-gray-400">{remainingText}</span>
                    )}
                  </div>
                  
                  {l.estado !== "recuperado" && (
                     <div className="h-1.5 w-full bg-red-100 rounded-full overflow-hidden">
                       <div className="h-full bg-red-600 transition-all duration-500" style={{ width: `${progress}%` }}></div>
                     </div>
                  )}
                  {l.estado === "recuperado" && (
                    <div className="text-[11px] text-green-600 font-medium flex items-center gap-1 mt-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Retornó el {l.fecha_retorno}
                    </div>
                  )}
                </div>

                {/* Fechas y Status */}
                <div className="flex flex-col items-end gap-1 shrink-0 ml-4 border-l border-gray-100 pl-6 justify-center">
                   <div className="text-right">
                     <p className="text-[10px] text-gray-400 uppercase font-bold">Lesión</p>
                     <p className="text-xs text-gray-800 font-semibold">{l.fecha_lesion}</p>
                   </div>
                   <div className="text-right mt-1">
                     <p className="text-[10px] text-gray-400 uppercase font-bold">Retorno</p>
                     <p className="text-xs text-gray-800 font-semibold">{l.fecha_retorno}</p>
                   </div>
                   <button 
                     onClick={() => handleEliminar(l.id)} 
                     disabled={isPending}
                     className="mt-2 text-gray-300 hover:text-red-500 transition-colors p-1"
                   >
                     <Trash2 className="w-3.5 h-3.5" />
                   </button>
                </div>
              </div>
            )
          })
        )}
      </div>

      {isModalOpen && (
        <ModalRegistrarLesion 
           jugadores={jugadores}
           onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
