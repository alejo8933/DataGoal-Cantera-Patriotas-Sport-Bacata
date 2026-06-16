'use client'

import { useState } from 'react'

const TABS = ['Eventos del Partido', 'Rendimiento de Jugadores', 'Estadísticas', 'Observaciones']

// Utilidad para extraer íconos según tipo
function getIconoEvento(tipo: string) {
  switch (tipo?.toLowerCase()) {
    case 'gol':
      return (
        <span className="w-5 h-5 rounded-full border-2 border-green-500 bg-green-50 text-green-500 flex items-center justify-center shrink-0">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm4.59-12.42L10 14.17l-2.59-2.58L6 13l4 4 8-8z"/></svg>
        </span>
      )
    case 'tarjeta amarilla':
    case 'tarjeta_amarilla':
    case 'amarilla':
      return (
        <span className="w-4 h-5 bg-yellow-500 rounded-sm shrink-0 shadow-sm border border-yellow-600"></span>
      )
    case 'tarjeta roja':
    case 'tarjeta_roja':
    case 'roja':
      return (
        <span className="w-4 h-5 bg-red-600 rounded-sm shrink-0 shadow-sm border border-red-700"></span>
      )
    case 'asistencia':
      return (
        <span className="w-5 h-5 text-blue-500 flex items-center justify-center shrink-0">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
        </span>
      )
    case 'sustitucion':
    case 'cambio':
      return (
        <span className="w-5 h-5 text-purple-500 flex items-center justify-center shrink-0">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
        </span>
      )
    default:
      return (
        <span className="w-2 h-2 rounded-full bg-gray-400 shrink-0"></span>
      )
  }
}

export default function ResumenClient({ partido, eventos }: { partido: any, eventos: any[] }) {
  const [activeTab, setActiveTab] = useState(TABS[0])

  return (
    <>
      {/* Selector de Pestañas */}
      <div className="flex bg-gray-50 rounded-lg p-1 border border-gray-100 flex-wrap mb-8">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 min-w-[150px] py-3 px-4 text-sm font-semibold rounded-md transition-colors ${
              activeTab === tab
                ? 'bg-white shadow-sm text-gray-900 border border-gray-200/50'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100/50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Contenido de las pestañas */}
      <div className="bg-white rounded-xl">
        {activeTab === 'Eventos del Partido' && (
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-6 px-2">Cronología del Partido</h3>
            
            <div className="flex flex-col gap-3">
              {eventos.length === 0 ? (
                 <div className="text-center py-10 text-gray-400 border-2 border-dashed border-gray-100 rounded-lg">
                    No se han registrado eventos para este partido todavía.
                 </div>
              ) : (
                eventos.map((evt, index) => {
                  const jugador = evt.jugadores;
                  const nombreJugador = jugador ? `${jugador.nombre} ${jugador.apellido}` : evt.equipo?.toUpperCase();
                  
                  return (
                    <div key={evt.id || index} className="flex flex-col sm:flex-row sm:items-center gap-4 bg-white border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-shadow">
                      {/* Minuto e Icono */}
                      <div className="flex items-center gap-4 min-w-[80px]">
                        <span className="font-black text-gray-900 w-8">{evt.minuto}&apos;</span>
                        {getIconoEvento(evt.tipo)}
                      </div>
                      
                      {/* Información Principal */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                          <span className="text-xs font-bold uppercase tracking-wider text-gray-500 bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
                             {evt.tipo?.replace('_', ' ')}
                          </span>
                          <span className="font-bold text-gray-900 text-base">{nombreJugador}</span>
                        </div>
                        {evt.descripcion && (
                          <p className="text-sm text-gray-500 pl-[3px] mt-1 pr-4">{evt.descripcion}</p>
                        )}
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        )}

        {/* Mocks visuales para las otras pestañas requeridos en prototipo */}
        {activeTab === 'Rendimiento de Jugadores' && (
          <div className="text-center py-16 text-gray-400">
             <p>El rendimiento de los jugadores se calcula al finalizar la temporada.</p>
          </div>
        )}
        
        {activeTab === 'Estadísticas' && (
          <div className="text-center py-16 text-gray-400">
             <p>Estadísticas del encuentro no disponibles en este momento.</p>
          </div>
        )}
        
        {activeTab === 'Observaciones' && (
          <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-xl">
             <h4 className="font-bold text-yellow-800 mb-2">Notas del Entrenador</h4>
             <p className="text-sm text-yellow-700 leading-relaxed">
               {partido.descripcion || "No hay observaciones o notas registradas para este partido."}
             </p>
          </div>
        )}

      </div>
    </>
  )
}
