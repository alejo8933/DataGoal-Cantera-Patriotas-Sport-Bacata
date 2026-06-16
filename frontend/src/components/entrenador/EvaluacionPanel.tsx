"use client";
import { useState, useMemo } from "react";
import { Search, TrendingUp } from "lucide-react";

export type PlayerEvalData = {
  id: string;
  nombre: string;
  apellido: string;
  numero: number | null;
  posicion: string | null;
  categoria: string;
  evaluacionesCount: number;
  ultimaFecha: string | null;
  tecnica: number;
  fisica: number;
  tactica: number;
  mental: number;
  promedioGeneral: number;
};

type Globals = {
  tecnica: number;
  fisica: number;
  tactica: number;
  mental: number;
};

interface Props {
  jugadores: PlayerEvalData[];
  globals: Globals;
}

export default function EvaluacionPanel({ jugadores, globals }: Props) {
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("Todas");
  
  // Extraemos las categorías únicas de los jugadores reales
  const categorias = Array.from(new Set(jugadores.map(j => j.categoria))).sort();

  const filtered = jugadores.filter(j => {
    if (selectedCat !== "Todas" && j.categoria !== selectedCat) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      if (!`${j.nombre} ${j.apellido}`.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const getStatus = (prom: number) => {
    if (prom >= 8.5) return { text: "Sobresaliente", bg: "bg-green-100 text-green-700" };
    if (prom >= 7.0) return { text: "Bueno", bg: "bg-blue-100 text-blue-700" };
    if (prom > 0) return { text: "Regular", bg: "bg-yellow-100 text-yellow-700" };
    return { text: "Sin calificar", bg: "bg-gray-100 text-gray-600" };
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "--";
    const d = new Date(dateString);
    return d.toLocaleDateString("es-CO", { month: "short", year: "numeric" }).replace('.', '');
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Buscar jugador..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-sm"
          />
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={selectedCat}
            onChange={e => setSelectedCat(e.target.value)}
            className="border border-gray-200 bg-gray-50 text-gray-600 text-sm rounded-xl px-4 py-2.5 outline-none min-w-[140px]"
          >
            <option value="Todas">Todas</option>
            {categorias.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select className="border border-gray-200 bg-gray-50 text-gray-600 text-sm rounded-xl px-4 py-2.5 outline-none w-[120px]">
            <option>Todas</option>
          </select>
        </div>
      </div>

      {/* Promedios Globales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Técnica */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col justify-center">
          <span className="w-fit mb-4 text-[11px] font-bold px-2 py-1 bg-blue-50 text-blue-600 rounded">Técnica</span>
          <div>
            <h3 className="text-3xl font-bold text-gray-900">{globals.tecnica.toFixed(1)}</h3>
            <p className="text-sm text-gray-400 font-medium mt-1">promedio equipo</p>
          </div>
        </div>
        
        {/* Física */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col justify-center">
          <span className="w-fit mb-4 text-[11px] font-bold px-2 py-1 bg-red-50 text-red-600 rounded">Física</span>
          <div>
            <h3 className="text-3xl font-bold text-gray-900">{globals.fisica.toFixed(1)}</h3>
            <p className="text-sm text-gray-400 font-medium mt-1">promedio equipo</p>
          </div>
        </div>
        
        {/* Táctica */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col justify-center">
          <span className="w-fit mb-4 text-[11px] font-bold px-2 py-1 bg-green-50 text-green-600 rounded">Táctica</span>
          <div>
            <h3 className="text-3xl font-bold text-gray-900">{globals.tactica.toFixed(1)}</h3>
            <p className="text-sm text-gray-400 font-medium mt-1">promedio equipo</p>
          </div>
        </div>
        
        {/* Mental */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col justify-center">
          <span className="w-fit mb-4 text-[11px] font-bold px-2 py-1 bg-purple-50 text-purple-600 rounded">Mental</span>
          <div>
            <h3 className="text-3xl font-bold text-gray-900">{globals.mental.toFixed(1)}</h3>
            <p className="text-sm text-gray-400 font-medium mt-1">promedio equipo</p>
          </div>
        </div>
      </div>

      {/* Grid de Jugadores */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.map(j => {
          const status = getStatus(j.promedioGeneral);
          const hasEvals = j.evaluacionesCount > 0;
          return (
            <div key={j.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-5 hover:shadow-md transition-shadow">
              
              <div className="flex items-start gap-4">
                <div className="relative shrink-0">
                  <div className="w-12 h-12 rounded-full border border-gray-200 bg-gray-50 flex items-center justify-center text-sm font-bold text-gray-900 shadow-sm uppercase tracking-wider">
                    {j.nombre[0]}{j.apellido[0]}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px] font-bold border-2 border-white shadow-sm">
                    {j.numero ?? '-'}
                  </div>
                </div>
                
                <div className="flex flex-col flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-gray-900 truncate flex items-center gap-1.5 flex-wrap">
                    {j.nombre} {j.apellido} 
                    {hasEvals && j.promedioGeneral > 8.0 && <TrendingUp className="w-3.5 h-3.5 text-green-500 shrink-0" />}
                    {hasEvals && j.promedioGeneral < 6.0 && <TrendingUp className="w-3.5 h-3.5 text-red-500 shrink-0 rotate-180" />}
                  </h4>
                  <p className="text-xs text-gray-400 truncate mt-0.5">{j.posicion ?? 'Jugador'} - {j.categoria}</p>
                  
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${status.bg}`}>
                      {status.text}
                    </span>
                    {hasEvals && (
                      <span className="text-sm font-bold text-gray-900">{j.promedioGeneral.toFixed(1)}/10</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Stats Detalle */}
              {hasEvals ? (
                <div className="grid grid-cols-2 gap-x-6 gap-y-3 px-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-blue-600">Técnica</span>
                    <span className="text-xs font-bold text-gray-500">{j.tecnica.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-red-600">Física</span>
                    <span className="text-xs font-bold text-gray-500">{j.fisica.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-green-600">Táctica</span>
                    <span className="text-xs font-bold text-gray-500">{j.tactica.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-purple-600">Mental</span>
                    <span className="text-xs font-bold text-gray-500">{j.mental.toFixed(1)}</span>
                  </div>
                </div>
              ) : (
                <div className="py-5 text-center bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                  <p className="text-xs text-gray-400">Sin datos de evaluación</p>
                </div>
              )}

              {/* Footer */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wide">
                  {j.evaluacionesCount} evaluación{j.evaluacionesCount !== 1 ? 'es' : ''} • Última: {formatDate(j.ultimaFecha)}
                </span>
              </div>

            </div>
          )
        })}
        {filtered.length === 0 && (
          <div className="col-span-1 lg:col-span-2 xl:col-span-3 text-center py-16 bg-white rounded-2xl border border-gray-100">
             <p className="text-gray-500 text-sm">No se encontraron jugadores que coincidan.</p>
          </div>
        )}
      </div>

    </div>
  );
}
