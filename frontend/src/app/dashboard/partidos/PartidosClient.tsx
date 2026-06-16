'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Calendar, MapPin, Clock } from 'lucide-react'

// Utilidad para extraer el resultado (Victoria/Empate/Derrota)
function getResultadoTexto(golesLocal: number | null, golesVisitante: number | null, equipoEsLocal: boolean) {
  if (golesLocal === null || golesVisitante === null) return ''
  if (golesLocal === golesVisitante) return 'Empate'
  if (equipoEsLocal) {
    return golesLocal > golesVisitante ? 'Victoria' : 'Derrota'
  } else {
    return golesVisitante > golesLocal ? 'Victoria' : 'Derrota'
  }
}

export default function PartidosClient({ partidos }: { partidos: any[] }) {
  const [tab, setTab] = useState<'proximos' | 'recientes'>('proximos')

  // Filtramos próximos o recientes según el tab y un estimado del campo 'estado' o fecha.
  // Como asumo que existe "estado" = "jugado" o "finalizado", lo usamos:
  const proximos = partidos.filter(p => !p.estado || p.estado.toLowerCase() !== 'jugado' && p.estado.toLowerCase() !== 'finalizado')
  const recientes = partidos.filter(p => p.estado && (p.estado.toLowerCase() === 'jugado' || p.estado.toLowerCase() === 'finalizado'))

  const listadoActual = tab === 'proximos' ? proximos : recientes

  return (
    <>
      {/* Tabs */}
      <div className="flex bg-gray-50 rounded-lg p-1 border border-gray-100 mb-8 max-w-3xl mx-auto hidden sm:flex">
        <button
          onClick={() => setTab('proximos')}
          className={`flex-1 py-2.5 text-sm font-semibold rounded-md transition-colors ${
            tab === 'proximos' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100/50'
          }`}
        >
          Próximos Partidos
        </button>
        <button
          onClick={() => setTab('recientes')}
          className={`flex-1 py-2.5 text-sm font-semibold rounded-md transition-colors ${
            tab === 'recientes' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100/50'
          }`}
        >
          Resultados Recientes
        </button>
      </div>

      <div className="sm:hidden mb-6 flex rounded-lg border border-gray-200 overflow-hidden">
         <button
            onClick={() => setTab('proximos')}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider ${tab === 'proximos' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-500'}`}
         >
            Próximos
         </button>
         <button
            onClick={() => setTab('recientes')}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider ${tab === 'recientes' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-500'}`}
         >
            Recientes
         </button>
      </div>

      {/* Grid de tarjetas */}
      <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6 mb-12">
        {listadoActual.map((p) => {
           const esLocal = p.equipo_local?.toLowerCase().includes('bacatá') || p.equipo_local?.toLowerCase().includes('patriota')
           const resultado = getResultadoTexto(p.goles_local, p.goles_visitante, !!esLocal)
           
           return (
          <div key={p.id} className="rounded-xl border border-gray-200 bg-white flex flex-col hover:shadow-md transition-shadow">
            
            {/* Header del card */}
            <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider font-bold text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                {p.torneo || 'Liga de Bogotá'}
              </span>
              <div className="flex gap-2">
                <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100">
                  {p.categoria || 'Sub-17'}
                </span>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                  tab === 'proximos' 
                    ? 'text-blue-700 bg-blue-50 border-blue-100' 
                    : 'text-green-700 bg-green-50 border-green-100'
                }`}>
                  {tab === 'proximos' ? 'Próximo' : 'Finalizado'}
                </span>
              </div>
            </div>

            {/* Equipos / Marcador */}
            <div className="p-6 flex-grow flex flex-col justify-center min-h-[140px]">
              {tab === 'proximos' ? (
                // Vista Próximos
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 text-center">
                    <p className="font-bold text-gray-900 leading-tight">{p.equipo_local}</p>
                  </div>
                  <div className="shrink-0 text-xl font-black text-gray-300">VS</div>
                  <div className="flex-1 text-center">
                    <p className="font-bold text-gray-900 leading-tight">{p.equipo_visitante}</p>
                  </div>
                </div>
              ) : (
                // Vista Resultados
                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1 text-right">
                    <p className="font-bold text-gray-900 leading-tight text-sm sm:text-base">{p.equipo_local}</p>
                  </div>
                  <div className="shrink-0 text-center px-4">
                     <p className="text-3xl font-black text-red-600 flex items-center gap-3">
                        <span>{p.goles_local ?? 0}</span>
                        <span className="text-gray-300 text-lg">-</span>
                        <span>{p.goles_visitante ?? 0}</span>
                     </p>
                     <p className={`text-[10px] uppercase font-bold tracking-widest mt-1 ${
                        resultado === 'Victoria' ? 'text-green-600' :
                        resultado === 'Derrota' ? 'text-red-500' : 'text-yellow-600'
                     }`}>
                        {resultado}
                     </p>
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-bold text-gray-900 leading-tight text-sm sm:text-base">{p.equipo_visitante}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Tiempos y lugar */}
            <div className="px-6 pb-5 flex flex-col gap-1.5 border-t border-gray-50 pt-5 mt-auto bg-gray-50/50">
               <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar size={14} className="text-gray-400" />
                  <span>{new Date(p.fecha).toLocaleDateString() || 'Por definir'}</span>
               </div>
               <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock size={14} className="text-gray-400" />
                  <span>{p.hora || 'Por definir'}</span>
               </div>
               <div className="flex items-center gap-2 text-sm text-gray-500">
                  <MapPin size={14} className="text-gray-400" />
                  <span>{p.lugar || 'Cancha Sintética Bacatá'}</span>
               </div>
            </div>

            {/* Botón Acción */}
            <div className="p-4 border-t border-gray-100 bg-white rounded-b-xl">
               <Link href={`/dashboard/partidos/${p.id}`} className="flex justify-center w-full py-2.5 rounded-lg border-2 border-gray-900 bg-white text-gray-900 font-bold hover:bg-gray-900 hover:text-white transition-colors text-sm">
                 {tab === 'proximos' ? 'Ver Detalles' : 'Ver Resumen'}
               </Link>
            </div>
          </div>
        )})}

        {listadoActual.length === 0 && (
           <div className="col-span-full py-16 text-center text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
              No se encontraron partidos para la categoría seleccionada.
           </div>
        )}
      </div>

      {/* Información Estática Parque Timiza */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 sm:p-8">
         <div className="flex items-center gap-2 mb-6">
            <MapPin className="text-gray-800" size={20} />
            <h3 className="text-lg font-bold text-gray-900">Cancha Principal — Parque Timiza</h3>
         </div>
         <div className="grid md:grid-cols-3 gap-8 text-sm">
            <div>
               <h4 className="font-bold text-gray-900 mb-3 text-base">Información General</h4>
               <ul className="space-y-2 text-gray-500">
                  <li><span className="font-medium text-gray-700">Ubicación:</span> Kennedy, Bogotá D.C.</li>
                  <li><span className="font-medium text-gray-700">Superficie:</span> Cancha sintética</li>
                  <li><span className="font-medium text-gray-700">Alumbrado:</span> Disponible</li>
               </ul>
            </div>
            <div>
               <h4 className="font-bold text-gray-900 mb-3 text-base">Capacidad</h4>
               <ul className="space-y-2 text-gray-500">
                  <li className="flex items-center gap-2"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg> 300 espectadores</li>
                  <li><span className="font-medium text-gray-700">Graderías:</span> General</li>
                  <li><span className="font-medium text-gray-700">Acceso:</span> Para todos</li>
               </ul>
            </div>
            <div>
               <h4 className="font-bold text-gray-900 mb-3 text-base">Servicios</h4>
               <ul className="space-y-2 text-gray-500 list-disc pl-5">
                  <li>Camerinos masculinos y femeninos</li>
                  <li>Zona de calentamiento</li>
                  <li>Zona de comidas rápida</li>
                  <li>Parqueadero cubierto</li>
               </ul>
            </div>
         </div>
      </div>
    </>
  )
}
