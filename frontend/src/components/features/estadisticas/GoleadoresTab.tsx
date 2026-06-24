'use client'

import type { GoleadorResponseDTO } from '@backend/modules/estadisticas/dtos/EstadisticaResponseDTO'

interface GoleadoresTabProps {
  goleadores: GoleadorResponseDTO[]
}

export function GoleadoresTab({ goleadores }: GoleadoresTabProps) {
  if (!goleadores.length) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center text-gray-500">
        No hay goleadores registrados en la temporada actual.
      </div>
    )
  }

  const categorias = Array.from(
    new Set(goleadores.map((g) => g.categoria).filter(Boolean))
  )

  return (
    <div className="space-y-6">
      {categorias.map((categoria) => {
        const jugadores = goleadores.filter((g) => g.categoria === categoria)

        return (
          <div
            key={categoria}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
          >
            <div className="bg-gray-50 px-6 py-3 border-b border-gray-100">
              <span className="font-semibold text-gray-700 text-sm">{categoria}</span>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-gray-400 border-b border-gray-100">
                  <th className="px-6 py-3 text-left">#</th>
                  <th className="px-6 py-3 text-left">Jugador</th>
                  <th className="px-6 py-3 text-center">Goles</th>
                  <th className="px-6 py-3 text-center">Asistencias</th>
                </tr>
              </thead>
              <tbody>
                {jugadores.map((jugador, index) => (
                  <tr
                    key={jugador.id}
                    className="border-t border-gray-50 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-3 text-gray-400">{index + 1}</td>
                    <td className="px-6 py-3 font-medium text-gray-900">
                      {jugador.nombre} {jugador.apellido}
                    </td>
                    <td className="px-6 py-3 text-center font-bold text-red-600">
                      {jugador.goles}
                    </td>
                    <td className="px-6 py-3 text-center text-gray-600">
                      {jugador.asistencias}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      })}
    </div>
  )
}
