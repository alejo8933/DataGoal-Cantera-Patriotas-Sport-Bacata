"use client";
import { useState, useMemo, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Plus } from "lucide-react";
import ModalRegistrarEvento from "./ModalRegistrarEvento";
import { eliminarEventoPartido } from "@/lib/actions/partidos.actions";

// Tipos extraídos para uso Client Side
type Partido = {
  id: string;
  equipo_local: string;
  equipo_visitante: string;
  fecha: string;
  hora: string | null;
  lugar: string | null;
  estado: string;
  goles_local: number | null;
  goles_visitante: number | null;
};

type Evento = {
  id: string;
  minuto: number;
  tipo: string;
  equipo: string;
  descripcion: string | null;
  created_at: string | null;
  jugadores: {
    id: string;
    nombre: string;
    apellido: string;
    numero_camiseta: number | null;
  } | null;
};

type Jugador = {
  id: string;
  nombre: string;
  apellido: string;
  numero_camiseta: number | null;
  posicion: string | null;
};

interface Props {
  partidos: Partido[];
  partidoId: string;
  eventos: Evento[];
  jugadores: Jugador[];
}

export default function EventosPartidoPanel({ partidos, partidoId, eventos, jugadores }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [minutoInput, setMinutoInput] = useState("45");

  const p = partidos.find(x => x.id === partidoId);

  // KPIs
  const kpis = useMemo(() => {
    let amarillas = 0, rojas = 0, cambios = 0;
    eventos.forEach(ev => {
      if (ev.tipo === "tarjeta_amarilla") amarillas++;
      if (ev.tipo === "tarjeta_roja") rojas++;
      if (ev.tipo === "cambio") cambios++;
    });
    // Los goles los tomamos del partido directamente (o sumando los eventos si prefieres)
    const goles = (p?.goles_local || 0) + (p?.goles_visitante || 0);
    return { goles, amarillas, rojas, cambios };
  }, [eventos, p]);

  const handleMatchSelect = (id: string) => {
    startTransition(() => {
      router.push(`/dashboard/entrenador/partidos?partidoId=${id}`);
    });
  };

  const handleEliminarEvento = (id: string) => {
    if (confirm("¿Estás seguro de eliminar este evento?")) {
      const fd = new FormData();
      fd.append("id", id);
      fd.append("partido_id", partidoId);
      startTransition(async () => {
        await eliminarEventoPartido(fd);
      });
    }
  };

  const renderIcon = (tipo: string) => {
    if (tipo === "gol") return <span className="text-sm">⚽</span>;
    if (tipo === "tarjeta_amarilla") return <span className="text-sm">🟨</span>;
    if (tipo === "tarjeta_roja") return <span className="text-sm">🟥</span>;
    if (tipo === "cambio") return <span className="text-sm">🔄</span>;
    return <span>⏺</span>;
  };

  const renderBadge = (tipo: string) => {
    if (tipo === "gol") return <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1.5">{renderIcon(tipo)} Gol</span>;
    if (tipo === "tarjeta_amarilla") return <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1.5">{renderIcon(tipo)} T. Amarilla</span>;
    if (tipo === "tarjeta_roja") return <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1.5">{renderIcon(tipo)} T. Roja</span>;
    if (tipo === "cambio") return <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1.5">{renderIcon(tipo)} Cambio</span>;
    return <span className="bg-gray-100 text-gray-700 text-xs font-bold px-2 py-0.5 rounded-full">{tipo}</span>;
  };

  if (!p) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
         <p className="text-gray-400">Selecciona o crea un partido primero.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Registro de Eventos</h1>
          <p className="text-sm text-gray-500 mt-0.5">Registra eventos en tiempo real durante los partidos</p>
        </div>
        <div className="flex items-center gap-2">
          <select 
            value={partidoId}
            onChange={(e) => handleMatchSelect(e.target.value)}
            disabled={isPending}
            className="px-4 py-2 bg-gray-50 border border-gray-200 text-sm font-semibold text-gray-700 rounded-xl outline-none focus:border-red-500 w-full lg:w-[350px]"
          >
            {partidos.map((x) => (
              <option key={x.id} value={x.id}>
                {x.equipo_local} vs {x.equipo_visitante} • {new Date(x.fecha).toLocaleDateString()}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tarjeta del Partido Global */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        {/* Superior: Info del Marcador */}
        <div className="p-6 flex flex-col md:flex-row justify-between items-center gap-6 border-b border-gray-50">
          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-1">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">
              {p.equipo_local} <span className="text-gray-400 mx-2 text-lg">vs</span> {p.equipo_visitante}
            </h2>
            <p className="text-sm text-gray-400">
              {p.fecha} • {p.hora ? p.hora.slice(0,5) : ''} • {p.lugar || 'Lugar por definir'}
            </p>
          </div>
          
          <div className="flex flex-col items-center justify-center shrink-0 min-w-[120px]">
             <div className="text-4xl font-black text-gray-900 tracking-wider">
               {p.goles_local ?? 0} - {p.goles_visitante ?? 0}
             </div>
             <div className="mt-2 bg-red-600 text-white text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
               En Curso
             </div>
          </div>
        </div>

        {/* Inferior: KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-50 py-4 bg-gray-50/30">
          <div className="flex flex-col items-center justify-center py-2">
            <span className="text-2xl font-bold text-green-600">{kpis.goles}</span>
            <span className="text-xs text-gray-400 font-medium mt-1">Goles</span>
          </div>
          <div className="flex flex-col items-center justify-center py-2">
            <span className="text-2xl font-bold text-yellow-500">{kpis.amarillas}</span>
            <span className="text-xs text-gray-400 font-medium mt-1">T. Amarillas</span>
          </div>
          <div className="flex flex-col items-center justify-center py-2">
            <span className="text-2xl font-bold text-red-500">{kpis.rojas}</span>
            <span className="text-xs text-gray-400 font-medium mt-1">T. Rojas</span>
          </div>
          <div className="flex flex-col items-center justify-center py-2">
            <span className="text-2xl font-bold text-blue-500">{kpis.cambios}</span>
            <span className="text-xs text-gray-400 font-medium mt-1">Cambios</span>
          </div>
        </div>
      </div>

      {/* Caja de Control */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4">
        <div className="flex items-center gap-2 text-gray-800 font-bold border-b border-gray-50 pb-3">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          Control del Partido
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <label className="text-sm font-bold text-gray-700">Minuto actual:</label>
            <input 
              type="text" 
              value={minutoInput}
              onChange={(e) => setMinutoInput(e.target.value)}
              className="w-16 px-3 py-2 text-center text-sm font-bold bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-red-500" 
            />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> Registrar Evento
          </button>
        </div>
      </div>

      {/* Tabla de Eventos */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 overflow-hidden">
        <h3 className="text-lg font-bold text-gray-900 leading-tight">Eventos del Partido</h3>
        <p className="text-xs text-gray-400 mt-0.5 mb-5">Cronología de todos los eventos registrados</p>
        
        {eventos.length === 0 ? (
          <div className="text-center py-10 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
             <p className="text-gray-400 text-sm">No hay eventos para mostrar.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
             <table className="w-full text-sm">
                <thead>
                   <tr className="border-b border-gray-100 text-left">
                     <th className="py-3 px-2 text-gray-400 text-xs font-bold uppercase tracking-wider w-16">Minuto</th>
                     <th className="py-3 px-2 text-gray-400 text-xs font-bold uppercase tracking-wider w-40">Evento</th>
                     <th className="py-3 px-2 text-gray-400 text-xs font-bold uppercase tracking-wider">Jugador</th>
                     <th className="py-3 px-2 text-gray-400 text-xs font-bold uppercase tracking-wider">Equipo</th>
                     <th className="py-3 px-2 text-gray-400 text-xs font-bold uppercase tracking-wider">Descripción</th>
                     <th className="py-3 px-2 text-gray-400 text-xs font-bold uppercase tracking-wider text-center">Acciones</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                   {eventos.map(ev => (
                      <tr key={ev.id} className="hover:bg-gray-50/50 transition-colors">
                         <td className="py-4 px-2 font-bold text-gray-900">{ev.minuto}'</td>
                         <td className="py-4 px-2">
                           {renderBadge(ev.tipo)}
                         </td>
                         <td className="py-4 px-2">
                           <div className="flex flex-col">
                             <span className="font-bold text-gray-800">
                               {ev.jugadores ? `${ev.jugadores.nombre} ${ev.jugadores.apellido}` : 'Desconocido'}
                             </span>
                           </div>
                         </td>
                         <td className="py-4 px-2">
                           <span className={`text-[10px] font-bold uppercase tracking-widest ${ev.equipo === 'local' ? 'text-gray-600' : 'text-blue-600'}`}>
                              {ev.equipo}
                           </span>
                         </td>
                         <td className="py-4 px-2 text-gray-500 font-medium truncate max-w-xs text-xs">
                           {ev.descripcion || '—'}
                         </td>
                         <td className="py-4 px-2 text-center">
                           <button onClick={() => handleEliminarEvento(ev.id)} className="p-1.5 text-gray-300 hover:text-red-500 transition border border-gray-100 rounded-lg hover:border-red-100 hover:bg-red-50 inline-flex items-center justify-center">
                             <Trash2 className="w-3.5 h-3.5" />
                           </button>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <ModalRegistrarEvento 
           partidoId={partidoId}
           minuto={minutoInput}
           jugadores={jugadores}
           onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
