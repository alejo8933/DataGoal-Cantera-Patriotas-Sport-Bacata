'use client'

import type { EstadisticaEquipoResponseDTO } from '@backend/modules/estadisticas/dtos/EstadisticaResponseDTO'

interface TablaPosicionesTabProps {
  equipos: EstadisticaEquipoResponseDTO[]
}

export function TablaPosicionesTab({ equipos }: TablaPosicionesTabProps) {
  if (!equipos.length) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center text-gray-500">
        No hay datos de tabla de posiciones disponibles.
      </div>
    )
  }

  const tabla = [...equipos].sort((a, b) => b.puntos - a.puntos)

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
          <tr>
            <th className="px-4 py-3 text-left">#</th>
            <th className="px-4 py-3 text-left">Equipo</th>
            <th className="px-4 py-3 text-left">Categoría</th>
            <th className="px-4 py-3 text-center">PJ</th>
            <th className="px-4 py-3 text-center">G</th>
            <th className="px-4 py-3 text-center">E</th>
            <th className="px-4 py-3 text-center">P</th>
            <th className="px-4 py-3 text-center">GF</th>
            <th className="px-4 py-3 text-center">GC</th>
            <th className="px-4 py-3 text-center">DG</th>
            <th className="px-4 py-3 text-center">Pts</th>
          </tr>
        </thead>
        <tbody>
          {tabla.map((equipo, index) => (
            <tr
              key={equipo.id}
              className="border-t border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <td className="px-4 py-3 text-gray-400">{index + 1}</td>
              <td className="px-4 py-3 font-medium text-gray-900">{equipo.equipo}</td>
              <td className="px-4 py-3 text-gray-600">{equipo.categoria}</td>
              <td className="px-4 py-3 text-center">{equipo.partidos}</td>
              <td className="px-4 py-3 text-center">{equipo.ganados}</td>
              <td className="px-4 py-3 text-center">{equipo.empatados}</td>
              <td className="px-4 py-3 text-center">{equipo.perdidos}</td>
              <td className="px-4 py-3 text-center">{equipo.goles_favor}</td>
              <td className="px-4 py-3 text-center">{equipo.goles_contra}</td>
              <td className="px-4 py-3 text-center font-medium">
                {equipo.diferencia_goles > 0 ? '+' : ''}
                {equipo.diferencia_goles}
              </td>
              <td className="px-4 py-3 text-center font-bold text-red-600">
                {equipo.puntos}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
