'use client'

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
} from 'recharts'

const rendimientoData = [
  { sem: 'Sem 1', rendimiento: 7.5, asistencia: 85 },
  { sem: 'Sem 2', rendimiento: 8.0, asistencia: 88 },
  { sem: 'Sem 3', rendimiento: 7.8, asistencia: 90 },
  { sem: 'Sem 4', rendimiento: 8.1, asistencia: 87 },
  { sem: 'Sem 5', rendimiento: 8.3, asistencia: 92 },
  { sem: 'Sem 6', rendimiento: 8.2, asistencia: 94 },
]

const perfilData = [
  { habilidad: 'Técnica',  valor: 7.2 },
  { habilidad: 'Táctica',  valor: 8.0 },
  { habilidad: 'Físico',   valor: 7.7 },
  { habilidad: 'Actitud',  valor: 8.5 },
  { habilidad: 'Velocidad',valor: 7.5 },
  { habilidad: 'Colectivo',valor: 8.1 },
]

export default function PanelCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

      {/* Evolución del rendimiento */}
      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-gray-800 mb-1">↗ Evolución del Rendimiento</h2>
        <p className="text-xs text-gray-400 mb-4">Rendimiento y asistencia últimas 6 semanas</p>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={rendimientoData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="sem" tick={{ fontSize: 11 }} />
            <YAxis yAxisId="left" domain={[6, 10]} tick={{ fontSize: 11 }} />
            <YAxis yAxisId="right" orientation="right" domain={[80, 100]} tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line yAxisId="left"  type="monotone" dataKey="rendimiento" stroke="#6366f1" strokeWidth={2} dot={{ r: 4 }} name="Rendimiento" />
            <Line yAxisId="right" type="monotone" dataKey="asistencia"  stroke="#22c55e" strokeWidth={2} dot={{ r: 4 }} strokeDasharray="5 5" name="Asistencia %" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Perfil del equipo radar */}
      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-gray-800 mb-1">🎯 Perfil del Equipo</h2>
        <p className="text-xs text-gray-400 mb-4">Evaluación general Sub-17 · Temporada 2026</p>
        <ResponsiveContainer width="100%" height={200}>
          <RadarChart data={perfilData} cx="50%" cy="50%">
            <PolarGrid />
            <PolarAngleAxis dataKey="habilidad" tick={{ fontSize: 11 }} />
            <Radar name="Equipo" dataKey="valor" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

    </div>
  )
}