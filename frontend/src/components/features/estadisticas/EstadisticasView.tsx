'use client'

import { useState } from 'react'
import Link from 'next/link'
import type {
  EstadisticaEquipoResponseDTO,
  GolPorMesResponseDTO,
  GoleadorResponseDTO,
} from 'datagoal-backend/modules/estadisticas/dtos/EstadisticaResponseDTO'
import { StatCard } from './StatCard'
import { EstadisticasEquipoTab } from './EstadisticasEquipoTab'
import { GoleadoresTab } from './GoleadoresTab'
import { RendimientoGrupalTab } from './RendimientoGrupalTab'
import { TablaPosicionesTab } from './TablaPosicionesTab'
import { Activity } from 'lucide-react'

interface EstadisticasViewProps {
  rendimientoList: EstadisticaEquipoResponseDTO[]
  goleadoresList: GoleadorResponseDTO[]
  golesPorMes: GolPorMesResponseDTO[]
  showAnalisisIndividualLink?: boolean
}

type TabId = 'equipo' | 'goleadores' | 'grupal' | 'tabla'

export function EstadisticasView({
  rendimientoList,
  goleadoresList,
  golesPorMes,
  showAnalisisIndividualLink = true,
}: EstadisticasViewProps) {
  const [activeTab, setActiveTab] = useState<TabId>('equipo')

  const rendimiento = rendimientoList.length > 0 ? rendimientoList[0] : null
  const posicion =
    rendimiento && rendimientoList.length > 0
      ? rendimientoList.findIndex((e) => e.id === rendimiento.id) + 1
      : null

  const diferenciaGoles = rendimiento?.diferencia_goles ?? 0
  const winRate =
    rendimiento && rendimiento.partidos > 0
      ? rendimiento.efectividad.toFixed(1)
      : '0.0'

  return (
    <div className="w-full">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            Estadísticas
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            Análisis detallado del rendimiento de Escuela Patriota Sport Bacatá en la temporada actual.
          </p>
        </div>
        {showAnalisisIndividualLink && (
          <Link
            href="/dashboard/estadisticas/individual"
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-2"
          >
            <Activity size={18} />
            Análisis Individual
          </Link>
        )}
      </div>

      {rendimiento && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Posición"
            value={
              posicion ? (
                <span>#{posicion}</span>
              ) : (
                <span className="text-gray-400">—</span>
              )
            }
            subtitle={rendimiento.categoria || rendimiento.equipo}
          />
          <StatCard
            title="Puntos"
            value={rendimiento.puntos}
            subtitle={`en ${rendimiento.partidos} partidos`}
          />
          <StatCard
            title="Goles"
            value={`${rendimiento.goles_favor} - ${rendimiento.goles_contra}`}
            subtitle={`Diferencia: ${diferenciaGoles > 0 ? '+' : ''}${diferenciaGoles}`}
          />
          <StatCard
            title="Efectividad"
            value={`${winRate}%`}
            subtitle="de victorias"
          />
        </div>
      )}

      <div className="bg-white rounded-t-xl mb-6 shadow-sm border border-gray-100 p-1">
        <div className="flex flex-wrap lg:flex-nowrap w-full">
          {[
            { id: 'equipo' as const, label: 'Estadísticas del Equipo' },
            { id: 'goleadores' as const, label: 'Goleadores' },
            { id: 'grupal' as const, label: 'Rendimiento Grupal' },
            { id: 'tabla' as const, label: 'Tabla de Posiciones' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 text-center py-3 px-4 text-sm font-medium rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-red-50 text-red-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        {activeTab === 'equipo' && (
          <EstadisticasEquipoTab
            rendimiento={rendimiento}
            golesPorMes={golesPorMes}
          />
        )}
        {activeTab === 'goleadores' && (
          <GoleadoresTab goleadores={goleadoresList} />
        )}
        {activeTab === 'grupal' && (
          <RendimientoGrupalTab equipos={rendimientoList} />
        )}
        {activeTab === 'tabla' && (
          <TablaPosicionesTab equipos={rendimientoList} />
        )}
      </div>
    </div>
  )
}
