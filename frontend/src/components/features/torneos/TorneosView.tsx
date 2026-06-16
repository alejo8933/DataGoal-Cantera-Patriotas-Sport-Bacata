'use client'

import { useState } from 'react'
import type { TorneoResponseDTO } from '@backend/modules/torneos/dtos/TorneoResponseDTO'

interface TorneosViewProps {
  torneos: TorneoResponseDTO[]
}

type TabType = 'activos' | 'historial' | 'proximos'

// Emulación determinista basada en el ID para valores UI extra requeridos por el prototipo
function hashId(id: string) {
  let hash = 0
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash)
  }
  return Math.abs(hash)
}

export function TorneosView({ torneos }: TorneosViewProps) {
  const [activeTab, setActiveTab] = useState<TabType>('activos')

  const activos = torneos.filter(t => t.estado === 'en_curso')
  const historial = torneos.filter(t => t.estado === 'finalizado')
  const proximos = torneos.filter(t => t.estado === 'proximo')

  // Helpers visuales
  const getCategoriaColor = (categoria: string) => {
    const catLow = categoria.toLowerCase()
    if (catLow.includes('juvenil') || catLow.includes('17') || catLow.includes('15') || catLow.includes('16') || catLow.includes('20')) {
      return 'bg-blue-100 text-blue-700'
    }
    if (catLow.includes('infantil') || catLow.includes('13') || catLow.includes('11') || catLow.includes('14') || catLow.includes('12')) {
      return 'bg-green-100 text-green-700'
    }
    return 'bg-gray-100 text-gray-700'
  }

  return (
    <div className="w-full">
      {/* Header Centralizado */}
      <div className="text-center mb-10 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Torneos</h1>
        <p className="text-gray-500 text-sm leading-relaxed">
          Conoce todos los torneos en los que participa Escuela Patriota Sport Bacatá en Bogotá: Liga de Bogotá, Torneo Maracana, DBS, Copa Simón Bolívar, Intercolegiados y Copa Distrital.
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-1 mb-8 max-w-4xl mx-auto">
        <div className="flex w-full">
          <button 
            onClick={() => setActiveTab('activos')}
            className={`flex-1 text-center py-2.5 px-4 text-sm font-medium rounded-lg transition-colors ${activeTab === 'activos' ? 'bg-gray-50 text-gray-900' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            Torneos Activos
          </button>
          <button 
            onClick={() => setActiveTab('historial')}
            className={`flex-1 text-center py-2.5 px-4 text-sm font-medium rounded-lg transition-colors ${activeTab === 'historial' ? 'bg-gray-50 text-gray-900' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            Historial
          </button>
          <button 
            onClick={() => setActiveTab('proximos')}
            className={`flex-1 text-center py-2.5 px-4 text-sm font-medium rounded-lg transition-colors ${activeTab === 'proximos' ? 'bg-gray-50 text-gray-900' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            Próximos
          </button>
        </div>
      </div>

      {/* Grid de Torneos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
        
        {/* TAB ACTIVOS */}
        {activeTab === 'activos' && (
          activos.length === 0 ? (
            <div className="col-span-1 lg:col-span-2 text-center text-gray-500 py-12 bg-white rounded-xl border border-gray-100">
              No hay torneos activos correspondientes.
            </div>
          ) : (
            activos.map(t => {
              const hash = hashId(t.id)
              const numEquipos = 8 + (hash % 10) // de 8 a 17 equipos
              const fases = ['Semifinales', `Fecha ${hash % 10 + 1}`, 'Cuartos de final']
              const fase = fases[hash % 3]
              const posiciones = ['Clasificado', `#${(hash % 5) + 1}`, 'En proceso']
              const posicion = posiciones[hash % 3]
              const isPillOrange = fase === 'Semifinales'
              
              return (
                <div key={t.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-bold text-gray-900">{t.nombre}</h3>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${isPillOrange ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
                        {isPillOrange ? 'Semifinales' : 'En curso'}
                      </span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mb-4 ${getCategoriaColor(t.categoria)}`}>
                      {t.categoria || 'General'}
                    </span>
                    <p className="text-gray-500 text-xs leading-relaxed mb-6">
                      {t.descripcion || 'Torneo oficial de escuelas de fútbol de Bogotá organizado para incentivar el talento regional.'}
                    </p>
                    
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center text-xs text-gray-600 gap-2">
                        <span className="text-gray-400">📅</span> {t.fecha_inicio.split('T')[0]} → {t.fecha_fin ? t.fecha_fin.split('T')[0] : 'Indefinido'}
                      </div>
                      <div className="flex items-center text-xs text-gray-600 gap-2">
                        <span className="text-gray-400">👥</span> {numEquipos} equipos
                      </div>
                      <div className="flex items-center text-xs text-gray-600 gap-2">
                        <span className="text-gray-400">🏆</span> {fase}
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3 flex justify-between items-center text-sm border border-gray-100 pt-3 pb-3">
                    <span className="font-semibold text-gray-700 ml-1">Posición Patriotas:</span>
                    <span className="font-bold text-gray-900 bg-gray-200 px-3 py-1 rounded-md text-xs">{posicion}</span>
                  </div>
                </div>
              )
            })
          )
        )}

        {/* TAB HISTORIAL */}
        {activeTab === 'historial' && (
          historial.length === 0 ? (
            <div className="col-span-1 lg:col-span-2 text-center text-gray-500 py-12 bg-white rounded-xl border border-gray-100">
              No hay torneos pasados registrados.
            </div>
          ) : (
            historial.map(t => {
              const hash = hashId(t.id)
              const isCampeon = (t.resultado?.toLowerCase().includes('campeón') || hash % 2 === 0)
              const badgeContent = isCampeon ? '🏆 Campeón' : (t.resultado || 'Subcampeón')
              const anio = t.fecha_fin ? t.fecha_fin.split('-')[0] : '2025'
              const resultadosText = isCampeon 
                ? 'Primer título en la categoría con récord de victorias consecutivas.'
                : 'Llegada brillante a fases definitorias con gran rendimiento táctico.'

              return (
                <div key={t.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-bold text-gray-900">{t.nombre}</h3>
                      <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-gray-100 text-gray-600">
                        Finalizado
                      </span>
                    </div>
                    
                    <div className="flex gap-2 items-center mb-6">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getCategoriaColor(t.categoria)}`}>
                        {t.categoria || 'General'}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isCampeon ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'}`}>
                        {badgeContent}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 mb-6">
                      <div>
                        <span className="block text-xs text-gray-500 mb-1">Resultado:</span>
                        <span className="font-bold text-gray-900 text-sm">{t.resultado || (isCampeon ? 'Campeón' : 'Subcampeón')}</span>
                      </div>
                      <div>
                        <span className="block text-xs text-gray-500 mb-1">Año:</span>
                        <span className="font-bold text-gray-900 text-sm">{anio}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-100 mb-2">
                    <div className="flex gap-2 items-start text-blue-700">
                      <span className="mt-0.5">⭐</span>
                      <div>
                        <span className="font-bold text-sm block mb-0.5">Destacado:</span>
                        <span className="text-xs">{t.descripcion || resultadosText}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          )
        )}

        {/* TAB PRÓXIMOS */}
        {activeTab === 'proximos' && (
          proximos.length === 0 ? (
           <div className="col-span-1 lg:col-span-2 text-center text-gray-500 py-12 bg-white rounded-xl border border-gray-100">
              No hay torneos próximos agendados.
            </div>
          ) : (
            proximos.map(t => {
              const hash = hashId(t.id)
              const clasificaciones = ['Clasificación directa', 'Participación confirmada', 'En proceso de inscripción']
              const laClasificacion = clasificaciones[hash % 3]

              return (
                <div key={t.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-bold text-gray-900">{t.nombre}</h3>
                      <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-blue-50 text-blue-600">
                        Próximo
                      </span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mb-4 ${getCategoriaColor(t.categoria)}`}>
                      {t.categoria || 'General'}
                    </span>
                    <p className="text-gray-500 text-xs leading-relaxed mb-6">
                      {t.descripcion || `Torneo oficial a realizarse próximamente para la categoría ${t.categoria}.`}
                    </p>
                    
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center text-xs text-gray-600 gap-2">
                        <span className="text-gray-400">📅</span> {t.fecha_inicio.split('T')[0]} → {t.fecha_fin ? t.fecha_fin.split('T')[0] : 'Por definir'}
                      </div>
                      <div className="flex items-center text-xs text-gray-600 gap-2">
                        <span className="text-gray-400">🏆</span> Clasificación: {laClasificacion}
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50/50 rounded-lg p-3 flex items-center text-sm border border-green-100 mb-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-3 shrink-0"></div>
                    <span className="font-semibold text-green-700 text-xs">Patriotas clasificado</span>
                  </div>
                </div>
              )
            })
          )
        )}
        
      </div>
    </div>
  )
}
