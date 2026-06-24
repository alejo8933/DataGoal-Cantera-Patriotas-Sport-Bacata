'use client'

import type {
  EstadisticaEquipoResponseDTO,
  GolPorMesResponseDTO,
} from 'datagoal-backend/modules/estadisticas/dtos/EstadisticaResponseDTO'
import {
  CartesianGrid,
  Line,
  LineChart,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts'

interface EstadisticasEquipoTabProps {
  rendimiento: EstadisticaEquipoResponseDTO | null
  golesPorMes: GolPorMesResponseDTO[]
}

const COLORS = {
  victorias: '#10B981',
  empates: '#F59E0B',
  derrotas: '#EF4444',
}

export function EstadisticasEquipoTab({
  rendimiento,
  golesPorMes,
}: EstadisticasEquipoTabProps) {
  if (!rendimiento) {
    return (
      <div className="p-8 text-center text-gray-500">
        No hay datos de rendimiento disponibles.
      </div>
    )
  }

  const { ganados, empatados, perdidos, partidos, goles_favor } = rendimiento

  const pieData = [
    { name: 'Victorias', value: ganados, color: COLORS.victorias },
    { name: 'Empates', value: empatados, color: COLORS.empates },
    { name: 'Derrotas', value: perdidos, color: COLORS.derrotas },
  ]

  const dataAvailable = partidos > 0
  const winRate = dataAvailable ? ((ganados / partidos) * 100).toFixed(1) : '0.0'
  const drawRate = dataAvailable ? ((empatados / partidos) * 100).toFixed(1) : '0.0'
  const lossRate = dataAvailable ? ((perdidos / partidos) * 100).toFixed(1) : '0.0'
  const avgGoals = dataAvailable ? (goles_favor / partidos).toFixed(1) : '0.0'

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-gray-900 font-medium mb-6">Distribución de Resultados</h3>
          <div className="h-64 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`${value ?? 0} partidos`, '']}
                  contentStyle={{
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute bottom-0 w-full flex justify-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#10B981]" />
                Victorias: {ganados}
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#F59E0B]" />
                Empates: {empatados}
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#EF4444]" />
                Derrotas: {perdidos}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-gray-900 font-medium mb-6">Goles por Mes</h3>
          {golesPorMes.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={golesPorMes}
                  margin={{ top: 5, right: 20, bottom: 5, left: -20 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#E5E7EB"
                  />
                  <XAxis
                    dataKey="etiqueta"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis
                    allowDecimals={false}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                  />
                  <Tooltip
                    formatter={(value) => [`${value ?? 0} goles`, 'Total']}
                    contentStyle={{
                      borderRadius: '8px',
                      border: 'none',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="goles"
                    stroke="#3B82F6"
                    strokeWidth={3}
                    dot={{
                      r: 4,
                      fill: '#3B82F6',
                      strokeWidth: 2,
                      stroke: '#fff',
                    }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-center text-gray-500 px-6">
              <p className="text-sm">
                No hay goles registrados con fecha de partido para construir la serie mensual.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-gray-900 font-medium mb-6">Estadísticas Detalladas</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-900 font-medium text-sm">Victorias</span>
              <span className="text-gray-900 font-semibold">{ganados}</span>
            </div>
            <div className="w-full bg-red-100 rounded-full h-2.5 overflow-hidden mb-1">
              <div
                className="bg-red-600 h-2.5 rounded-full"
                style={{ width: `${winRate}%` }}
              />
            </div>
            <span className="text-xs text-gray-500">{winRate}%</span>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-900 font-medium text-sm">Empates</span>
              <span className="text-gray-900 font-semibold">{empatados}</span>
            </div>
            <div className="w-full bg-red-100 rounded-full h-2.5 overflow-hidden mb-1">
              <div
                className="bg-red-600 h-2.5 rounded-full"
                style={{ width: `${drawRate}%` }}
              />
            </div>
            <span className="text-xs text-gray-500">{drawRate}%</span>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-900 font-medium text-sm">Derrotas</span>
              <span className="text-gray-900 font-semibold">{perdidos}</span>
            </div>
            <div className="w-full bg-red-100 rounded-full h-2.5 overflow-hidden mb-1">
              <div
                className="bg-red-600 h-2.5 rounded-full"
                style={{ width: `${lossRate}%` }}
              />
            </div>
            <span className="text-xs text-gray-500">{lossRate}%</span>
          </div>

          <div className="pt-1">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-900 font-medium text-sm">Promedio de Goles</span>
              <span className="text-gray-900 font-bold">{avgGoals}</span>
            </div>
            <span className="text-xs text-gray-500">Por partido</span>
          </div>
        </div>
      </div>
    </div>
  )
}
