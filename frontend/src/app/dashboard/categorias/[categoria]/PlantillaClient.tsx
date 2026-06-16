'use client'

import { useState } from 'react'

const FILTROS = ['Todos los Jugadores', 'Delanteros', 'Mediocampistas', 'Defensores', 'Porteros']

const ESTADO_COLOR: Record<string, string> = {
  Disponible:    'bg-green-100 text-green-700',
  Recuperación:  'bg-yellow-100 text-yellow-700',
  Lesionado:     'bg-red-100 text-red-700',
}

function getGrupo(posicion: string) {
  if (!posicion) return 'Otro';
  const posL = posicion.toLowerCase();
  if (posL.includes('delantero') || posL.includes('extremo')) return 'Delanteros';
  if (posL.includes('medio') || posL.includes('volante')) return 'Mediocampistas';
  if (posL.includes('defensa') || posL.includes('lateral')) return 'Defensores';
  if (posL.includes('portero') || posL.includes('arquero')) return 'Porteros';
  return 'Otros';
}

function getInitials(nombre: string, apellido: string) {
  return `${nombre?.charAt(0) || ''}${apellido?.charAt(0) || ''}`.toUpperCase() || 'JG';
}

export default function PlantillaClient({ jugadores }: { jugadores: any[] }) {
  const [filtro, setFiltro] = useState('Todos los Jugadores')

  // Mapeamos los jugadores para que tengan la estructura esperada por el UI
  const jugadoresMap = jugadores.map(j => ({
    ...j,
    grupo: getGrupo(j.posicion),
    estado: 'Disponible', // Mock como en prototipo porque db no tiene
    iniciales: getInitials(j.nombre, j.apellido),
    calificacion: (Math.random() * (9 - 6) + 6).toFixed(1) // Mock si no hay en db
  }))

  const jugadoresFiltrados =
    filtro === 'Todos los Jugadores'
      ? jugadoresMap
      : jugadoresMap.filter((j) => j.grupo === filtro)

  return (
    <>
      {/* Filtros */}
      <div className="flex rounded-lg border border-gray-200 overflow-hidden mb-8 flex-wrap">
        {FILTROS.map((f) => (
          <button
            key={f}
            onClick={() => setFiltro(f)}
            className={`flex-1 min-w-fit py-3 px-3 text-sm font-medium transition-colors ${
              filtro === f ? 'bg-gray-800 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Grid de jugadores */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jugadoresFiltrados.map((j) => (
          <div key={j.id} className="rounded-lg border border-gray-200 p-7 flex flex-col gap-4 hover:shadow-md transition-shadow bg-white">

            {/* Header jugador */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                {/* Avatar con iniciales */}
                <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center shrink-0 shadow-sm">
                  <span className="text-white text-sm font-bold">{j.iniciales}</span>
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-base leading-tight break-words pr-2 line-clamp-1">{j.nombre} {j.apellido}</p>
                  <p className="text-xs font-medium text-red-600 bg-red-50 inline-block px-2 py-0.5 rounded-full mt-1 border border-red-100">{j.posicion || 'Sin posición'}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1.5 shrink-0">
                <span className={`rounded-full text-[10px] font-bold px-2.5 py-0.5 uppercase tracking-wider ${ESTADO_COLOR[j.estado]}`}>
                  {j.estado}
                </span>
                <span className="text-xl font-black text-gray-200 pt-1">#{j.numero_camiseta || '0'}</span>
              </div>
            </div>

            {/* Datos físicos (Mocking since no data in DB for this but exist in prototype) */}
            <div className="grid grid-cols-2 gap-2 mt-2">
              {[
                { label: 'Nacionalidad', valor: 'Colombia' },
                { label: 'Edad / Altura', valor: 'N/A' },
              ].map((dato) => (
                <div key={dato.label} className="rounded-md bg-gray-50/80 border border-gray-100 px-3 py-2 text-center">
                  <p className="text-[10px] uppercase tracking-wider font-semibold text-gray-400">{dato.label}</p>
                  <p className="text-xs font-bold text-gray-700 mt-0.5">{dato.valor}</p>
                </div>
              ))}
            </div>

            {/* Calificación + stats */}
            <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
              <div className="flex gap-4">
                <div className="text-center bg-gray-50 rounded-lg px-3 py-2">
                  <p className="text-lg font-bold text-gray-900 leading-none">{j.goles || 0}</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wide font-medium mt-1">Goles</p>
                </div>
                <div className="text-center bg-gray-50 rounded-lg px-3 py-2">
                  <p className="text-lg font-bold text-gray-900 leading-none">{j.asistencias || 0}</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wide font-medium mt-1">Asist.</p>
                </div>
                <div className="text-center bg-gray-50 rounded-lg px-3 py-2">
                  <p className="text-lg font-bold text-gray-900 leading-none">{j.tarjetas_amarillas || 0}</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wide font-medium mt-1">T.A.</p>
                </div>
              </div>
              <div className="text-center">
                <div className="relative">
                  <svg className="w-12 h-12 transform -rotate-90">
                    <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-gray-100" />
                    <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray={125.6} strokeDashoffset={125.6 - (125.6 * parseFloat(j.calificacion)) / 10} className="text-red-600" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-[13px] font-black text-gray-900">{j.calificacion}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Ver Perfil Button */}
            <button className="w-full mt-2 py-2.5 rounded-lg border border-gray-200 text-xs font-bold text-gray-600 bg-white hover:bg-gray-50 hover:text-red-600 transition-colors uppercase tracking-wider">
               Ver Perfil Completo
            </button>
          </div>
        ))}
        {jugadoresFiltrados.length === 0 && (
           <div className="col-span-full py-12 text-center text-gray-500">
              No se encontraron jugadores en este grupo.
           </div>
        )}
      </div>
    </>
  )
}
