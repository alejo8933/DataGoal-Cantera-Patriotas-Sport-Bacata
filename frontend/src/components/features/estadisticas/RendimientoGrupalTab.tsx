'use client'

import type { EstadisticaEquipoResponseDTO } from '@backend/modules/estadisticas/dtos/EstadisticaResponseDTO'

interface RendimientoGrupalTabProps {
  equipos: EstadisticaEquipoResponseDTO[]
}

export function RendimientoGrupalTab({ equipos }: RendimientoGrupalTabProps) {
  if (!equipos.length) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center text-gray-500">
        No hay datos de rendimiento grupal disponibles.
      </div>
    )
  }

  const totalPartidos = equipos.reduce((acc, e) => acc + e.partidos, 0)
  const totalGanados = equipos.reduce((acc, e) => acc + e.ganados, 0)
  const totalGolesFavor = equipos.reduce((acc, e) => acc + e.goles_favor, 0)
  const totalGolesContra = equipos.reduce((acc, e) => acc + e.goles_contra, 0)
  const efectividadPromedio =
    equipos.length > 0
      ? (
          equipos.reduce((acc, e) => acc + e.efectividad, 0) / equipos.length
        ).toFixed(1)
      : '0.0'

  const mejorEquipo = [...equipos].sort((a, b) => b.puntos - a.puntos)[0]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <p className="text-sm text-gray-500 mb-1">Equipos registrados</p>
          <p className="text-3xl font-bold text-gray-900">{equipos.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <p className="text-sm text-gray-500 mb-1">Partidos jugados</p>
          <p className="text-3xl font-bold text-gray-900">{totalPartidos}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <p className="text-sm text-gray-500 mb-1">Goles a favor / contra</p>
          <p className="text-3xl font-bold text-gray-900">
            {totalGolesFavor} - {totalGolesContra}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <p className="text-sm text-gray-500 mb-1">Efectividad promedio</p>
          <p className="text-3xl font-bold text-gray-900">{efectividadPromedio}%</p>
        </div>
      </div>

      {mejorEquipo && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-gray-900 font-medium mb-4">Mejor rendimiento del grupo</h3>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xl font-bold text-gray-900">{mejorEquipo.equipo}</p>
              <p className="text-sm text-gray-500">{mejorEquipo.categoria}</p>
            </div>
            <div className="flex gap-8 text-center">
              <div>
                <p className="text-2xl font-bold text-red-600">{mejorEquipo.puntos}</p>
                <p className="text-xs text-gray-500">Puntos</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{totalGanados}</p>
                <p className="text-xs text-gray-500">Victorias totales</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{mejorEquipo.efectividad}%</p>
                <p className="text-xs text-gray-500">Efectividad</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
