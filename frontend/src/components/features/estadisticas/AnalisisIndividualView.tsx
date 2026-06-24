'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts'
import type { EstadisticaResponseDTO } from 'datagoal-backend/modules/estadisticas/dtos/EstadisticaResponseDTO'

interface AnalisisIndividualViewProps {
  estadisticas: EstadisticaResponseDTO[]
  categoriasDisponibles: string[]
}

type TabType = 'general' | 'rendimiento' | 'comparacion' | 'analisis'

export function AnalisisIndividualView({
  estadisticas,
  categoriasDisponibles,
}: AnalisisIndividualViewProps) {
  const [selectedCategoria, setSelectedCategoria] = useState<string>(
    categoriasDisponibles[0] || 'Todas'
  )
  const [activeTab, setActiveTab] = useState<TabType>('general')

  const jugadoresCategoria = useMemo(() => {
    if (selectedCategoria === 'Todas') return estadisticas
    return estadisticas.filter((j) => j.categoria === selectedCategoria)
  }, [estadisticas, selectedCategoria])

  const chartData = useMemo(
    () =>
      jugadoresCategoria.map((j) => ({
        ...j,
        nombreCorto: j.nombre,
      })),
    [jugadoresCategoria]
  )

  const [compJug1, setCompJug1] = useState<string>('')
  const [compJug2, setCompJug2] = useState<string>('')
  const [analisisJugador, setAnalisisJugador] = useState<string>('')

  useEffect(() => {
    setCompJug1('')
    setCompJug2('')
    setAnalisisJugador('')
  }, [selectedCategoria])

  const maxGoleador = [...chartData].sort((a, b) => b.goles - a.goles)[0]
  const maxAsistencias = [...chartData].sort((a, b) => b.asistencias - a.asistencias)[0]
  const mejorCalificacion = [...chartData]
    .filter((j) => j.promedio_evaluacion !== null)
    .sort((a, b) => (b.promedio_evaluacion ?? 0) - (a.promedio_evaluacion ?? 0))[0]
  const mejorAsistencia = [...chartData].sort(
    (a, b) => b.porcentaje_asistencia_entrenamientos - a.porcentaje_asistencia_entrenamientos
  )[0]

  return (
    <div className="w-full">
      <div className="mb-6">
        <Link
          href="/dashboard/estadisticas"
          className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1.5 mb-4"
        >
          ← Volver a Estadísticas
        </Link>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Análisis Individual de Jugadores
            </h1>
            <p className="text-gray-500 mt-1 text-sm">
              Rendimiento detallado y estadísticas personalizadas por jugador
            </p>
          </div>

          <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm flex items-center gap-3">
            <span className="text-sm font-medium text-gray-500">Categoría:</span>
            <select
              value={selectedCategoria}
              onChange={(e) => setSelectedCategoria(e.target.value)}
              className="text-sm font-semibold text-gray-900 border-none outline-none focus:ring-0 cursor-pointer bg-transparent"
            >
              <option value="Todas">Todas las Categorías</option>
              {categoriasDisponibles.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-1 mb-6">
        <div className="flex flex-wrap lg:flex-nowrap w-full">
          {(
            [
              { id: 'general', label: 'Vista General' },
              { id: 'rendimiento', label: 'Rendimiento' },
              { id: 'comparacion', label: 'Comparación' },
              { id: 'analisis', label: 'Análisis Individual' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 text-center py-2.5 px-4 text-sm font-medium rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-gray-50 text-gray-900'
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {chartData.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center text-gray-500">
          No hay jugadores registrados en esta categoría para analizar.
        </div>
      ) : (
        <>
          {activeTab === 'general' && (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center gap-2 text-red-600 font-medium text-sm mb-4">
                    <span>⚽</span> Máximo Goleador
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {maxGoleador?.nombre_completo || 'N/A'}
                  </h3>
                  <p className="text-gray-500 text-sm">{maxGoleador?.goles || 0} goles</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center gap-2 text-blue-600 font-medium text-sm mb-4">
                    <span>📈</span> Más Asistencias
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {maxAsistencias?.nombre_completo || 'N/A'}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    {maxAsistencias?.asistencias || 0} asistencias
                  </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center gap-2 text-green-600 font-medium text-sm mb-4">
                    <span>⭐</span> Mejor Calificación
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {mejorCalificacion?.nombre_completo || 'N/A'}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    {mejorCalificacion?.promedio_evaluacion ?? '—'} promedio
                  </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center gap-2 text-purple-600 font-medium text-sm mb-4">
                    <span>⏱</span> Mejor Asistencia
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {mejorAsistencia?.nombre_completo || 'N/A'}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    {mejorAsistencia?.porcentaje_asistencia_entrenamientos ?? 0}% entrenamientos
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-gray-900 font-medium mb-6">Goles vs Asistencias</h3>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={chartData}
                        margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis
                          dataKey="nombreCorto"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: '#6B7280', fontSize: 12 }}
                          dy={10}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: '#6B7280', fontSize: 12 }}
                        />
                        <Tooltip
                          contentStyle={{
                            borderRadius: '8px',
                            border: 'none',
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                          }}
                          cursor={{ fill: '#F3F4F6' }}
                        />
                        <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                        <Bar
                          dataKey="goles"
                          name="Goles"
                          fill="#EF4444"
                          radius={[4, 4, 0, 0]}
                          maxBarSize={40}
                        />
                        <Bar
                          dataKey="asistencias"
                          name="Asistencias"
                          fill="#3B82F6"
                          radius={[4, 4, 0, 0]}
                          maxBarSize={40}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-gray-900 font-medium mb-6">
                    Calificación vs Asistencia a Entrenamientos
                  </h3>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={chartData}
                        margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis
                          dataKey="nombreCorto"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: '#6B7280', fontSize: 12 }}
                          dy={10}
                        />
                        <YAxis
                          yAxisId="left"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: '#6B7280', fontSize: 12 }}
                          domain={[0, 10]}
                        />
                        <YAxis
                          yAxisId="right"
                          orientation="right"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: '#6B7280', fontSize: 12 }}
                          domain={[0, 100]}
                        />
                        <Tooltip
                          contentStyle={{
                            borderRadius: '8px',
                            border: 'none',
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                          }}
                        />
                        <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                        <Line
                          yAxisId="left"
                          type="monotone"
                          dataKey="promedio_evaluacion"
                          name="Calificación (0-10)"
                          stroke="#10B981"
                          strokeWidth={3}
                          dot={{ r: 4, fill: '#10B981', strokeWidth: 2, stroke: '#fff' }}
                          activeDot={{ r: 6 }}
                        />
                        <Line
                          yAxisId="right"
                          type="monotone"
                          dataKey="porcentaje_asistencia_entrenamientos"
                          name="Asistencia (%)"
                          stroke="#8B5CF6"
                          strokeWidth={3}
                          dot={{ r: 4, fill: '#8B5CF6', strokeWidth: 2, stroke: '#fff' }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'rendimiento' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {chartData.map((j) => (
                <div
                  key={j.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex gap-3 items-center">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-700">
                        {j.nombre.charAt(0)}
                        {j.apellido.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">{j.nombre_completo}</h4>
                        <span className="text-[10px] font-semibold tracking-wide px-2 py-0.5 rounded bg-red-50 text-red-600 block w-fit mt-1">
                          {j.posicion || 'Jugador'}
                        </span>
                      </div>
                    </div>
                    <div className="text-xl font-bold text-blue-600">
                      {j.promedio_evaluacion ?? '—'}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-y-4 mb-6 text-center">
                    <div>
                      <div className="text-lg font-bold text-red-600">{j.goles}</div>
                      <div className="text-xs text-gray-500">Goles</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-blue-600">{j.asistencias}</div>
                      <div className="text-xs text-gray-500">Asistencias</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-green-600">{j.partidos_jugados}</div>
                      <div className="text-xs text-gray-500">Partidos</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-purple-600">
                        {j.promedio_goles_por_partido}
                      </div>
                      <div className="text-xs text-gray-500">Goles/Partido</div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-gray-600">Asistencia Entrenamientos</span>
                      <span className="font-semibold text-gray-900">
                        {j.porcentaje_asistencia_entrenamientos}%
                      </span>
                    </div>
                    <div className="w-full bg-red-100 rounded-full h-1.5">
                      <div
                        className="bg-red-600 h-1.5 rounded-full"
                        style={{ width: `${j.porcentaje_asistencia_entrenamientos}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <span className="text-sm font-medium text-gray-500">Estado:</span>
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        j.activo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {j.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'comparacion' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <h3 className="text-gray-900 font-medium mb-4">Comparación de Jugadores</h3>
              <div className="flex gap-4 mb-8">
                <select
                  value={compJug1}
                  onChange={(e) => setCompJug1(e.target.value)}
                  className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full sm:w-auto p-2.5"
                >
                  <option value="">Seleccionar jugador 1</option>
                  {chartData.map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.nombre_completo}
                    </option>
                  ))}
                </select>
                <select
                  value={compJug2}
                  onChange={(e) => setCompJug2(e.target.value)}
                  className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full sm:w-auto p-2.5"
                >
                  <option value="">Seleccionar jugador 2</option>
                  {chartData.map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.nombre_completo}
                    </option>
                  ))}
                </select>
              </div>

              {compJug1 && compJug2 ? (
                (() => {
                  const p1 = chartData.find((j) => j.id === compJug1)
                  const p2 = chartData.find((j) => j.id === compJug2)
                  if (!p1 || !p2) return null

                  const rows = [
                    { label: 'Goles', v1: p1.goles, v2: p2.goles },
                    { label: 'Asistencias', v1: p1.asistencias, v2: p2.asistencias },
                    {
                      label: 'Calificación Promedio',
                      v1: p1.promedio_evaluacion ?? '—',
                      v2: p2.promedio_evaluacion ?? '—',
                    },
                    {
                      label: 'Asistencia Entrenamientos (%)',
                      v1: p1.porcentaje_asistencia_entrenamientos,
                      v2: p2.porcentaje_asistencia_entrenamientos,
                    },
                    { label: 'Partidos Jugados', v1: p1.partidos_jugados, v2: p2.partidos_jugados },
                  ]

                  return (
                    <div className="grid grid-cols-3 gap-0 text-center items-center border-t border-gray-100 pt-6 mt-4">
                      <div className="pb-4">
                        <h4 className="font-bold text-gray-900 mb-6 text-left">
                          {p1.nombre_completo}
                        </h4>
                        {rows.map((r) => (
                          <div key={r.label} className="font-bold text-gray-900 text-left py-2">
                            {r.v1}
                          </div>
                        ))}
                      </div>
                      <div className="pb-4 border-l border-r border-gray-100 px-4">
                        <h4 className="font-bold text-gray-900 mb-6 opacity-0">vs</h4>
                        {rows.map((r) => (
                          <div key={r.label} className="text-gray-500 text-sm py-2">
                            {r.label}
                          </div>
                        ))}
                      </div>
                      <div className="pb-4">
                        <h4 className="font-bold text-gray-900 mb-6 text-right">
                          {p2.nombre_completo}
                        </h4>
                        {rows.map((r) => (
                          <div key={r.label} className="font-bold text-gray-900 text-right py-2">
                            {r.v2}
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })()
              ) : (
                <div className="text-center text-gray-400 py-12">
                  Por favor, selecciona dos jugadores para comparar.
                </div>
              )}
            </div>
          )}

          {activeTab === 'analisis' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <h3 className="text-gray-900 font-medium mb-4">Análisis Individual Detallado</h3>
              <select
                value={analisisJugador}
                onChange={(e) => setAnalisisJugador(e.target.value)}
                className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full sm:w-1/4 p-2.5 mb-8"
              >
                <option value="">Seleccionar jugador</option>
                {chartData.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.nombre_completo}
                  </option>
                ))}
              </select>

              {analisisJugador ? (
                (() => {
                  const j = chartData.find((x) => x.id === analisisJugador)
                  if (!j) return null

                  const ev = j.ultima_evaluacion
                  const radarData = ev
                    ? [
                        { subject: 'Técnica', A: (ev.tecnica ?? 0) * 10 },
                        { subject: 'Física', A: (ev.fisica ?? 0) * 10 },
                        { subject: 'Táctica', A: (ev.tactica ?? 0) * 10 },
                        { subject: 'Mental', A: (ev.mental ?? 0) * 10 },
                      ]
                    : []

                  return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      <div>
                        <h4 className="font-bold text-gray-800 border-b border-gray-100 pb-2 mb-6">
                          Perfil del Jugador - {j.nombre_completo}
                        </h4>

                        <div className="grid grid-cols-2 gap-y-6 mb-8">
                          <div>
                            <span className="text-xs text-gray-500 block mb-1">Posición:</span>
                            <span className="font-semibold text-gray-900">
                              {j.posicion || 'Jugador'}
                            </span>
                          </div>
                          <div>
                            <span className="text-xs text-gray-500 block mb-1">Categoría:</span>
                            <span className="font-semibold text-gray-900">{j.categoria}</span>
                          </div>
                          <div>
                            <span className="text-xs text-gray-500 block mb-1">Partidos Jugados:</span>
                            <span className="font-semibold text-gray-900">{j.partidos_jugados}</span>
                          </div>
                          <div>
                            <span className="text-xs text-gray-500 block mb-1">Tarjetas:</span>
                            <span className="font-semibold text-gray-900">
                              {j.tarjetas_amarillas}A / {j.tarjetas_rojas}R
                            </span>
                          </div>
                        </div>

                        <h4 className="font-bold text-gray-800 border-b border-gray-100 pb-2 mb-6">
                          Evaluación de Rendimiento
                        </h4>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-600">
                              Promedio goles por partido:
                            </span>
                            <span className="text-sm font-bold text-gray-900">
                              {j.promedio_goles_por_partido}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-600">
                              Asistencia entrenamientos:
                            </span>
                            <span className="text-sm font-bold text-green-600">
                              {j.porcentaje_asistencia_entrenamientos}%
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-600">
                              Promedio evaluación:
                            </span>
                            <span className="text-sm font-bold text-green-600">
                              {j.promedio_evaluacion ?? 'Sin evaluación'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-bold text-gray-800 text-center mb-4">
                          Radar de Evaluación
                        </h4>
                        {radarData.length > 0 ? (
                          <div className="w-full h-[350px]">
                            <ResponsiveContainer width="100%" height="100%">
                              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                                <PolarGrid stroke="#E5E7EB" />
                                <PolarAngleAxis
                                  dataKey="subject"
                                  tick={{ fill: '#6B7280', fontSize: 12 }}
                                />
                                <PolarRadiusAxis
                                  angle={30}
                                  domain={[0, 100]}
                                  tick={false}
                                  axisLine={false}
                                />
                                <Tooltip
                                  contentStyle={{
                                    borderRadius: '8px',
                                    border: 'none',
                                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                  }}
                                />
                                <Radar
                                  name={j.nombre_completo}
                                  dataKey="A"
                                  stroke="#3B82F6"
                                  fill="#3B82F6"
                                  fillOpacity={0.5}
                                />
                              </RadarChart>
                            </ResponsiveContainer>
                          </div>
                        ) : (
                          <div className="text-center text-gray-400 py-12">
                            Este jugador aún no tiene evaluaciones registradas.
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })()
              ) : (
                <div className="text-center text-gray-400 py-12">
                  Por favor, selecciona un jugador para analizar su rendimiento.
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
