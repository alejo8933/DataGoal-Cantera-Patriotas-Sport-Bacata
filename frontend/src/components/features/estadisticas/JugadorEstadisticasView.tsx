'use client'

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import type { EstadisticaResponseDTO } from '@backend/modules/estadisticas/dtos/EstadisticaResponseDTO'

interface JugadorEstadisticasViewProps {
  estadistica: EstadisticaResponseDTO | null
}

export function JugadorEstadisticasView({ estadistica }: JugadorEstadisticasViewProps) {
  if (!estadistica) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center text-gray-500 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Sin perfil de jugador</h1>
          <p className="text-sm">
            No encontramos un jugador vinculado a tu cuenta. Contacta al administrador de la
            escuela.
          </p>
        </div>
      </div>
    )
  }

  const ev = estadistica.ultima_evaluacion
  const radarData = ev
    ? [
        { subject: 'Técnica', A: (ev.tecnica ?? 0) * 10 },
        { subject: 'Física', A: (ev.fisica ?? 0) * 10 },
        { subject: 'Táctica', A: (ev.tactica ?? 0) * 10 },
        { subject: 'Mental', A: (ev.mental ?? 0) * 10 },
      ]
    : []

  const logros = [
    estadistica.porcentaje_asistencia_entrenamientos >= 90 && {
      icon: '⭐',
      label: 'Compromiso destacado',
      sub: `${estadistica.porcentaje_asistencia_entrenamientos}% de asistencia a entrenamientos`,
    },
    estadistica.goles >= 5 && {
      icon: '🔥',
      label: 'Goleador',
      sub: `${estadistica.goles} goles en la temporada`,
    },
    (estadistica.promedio_evaluacion ?? 0) >= 8 && {
      icon: '🛡️',
      label: 'Alto rendimiento',
      sub: `Promedio de evaluación: ${estadistica.promedio_evaluacion}`,
    },
  ].filter(Boolean) as { icon: string; label: string; sub: string }[]

  return (
    <div className="mx-auto max-w-7xl px-6 py-8 space-y-10">
      <div className="animate-in fade-in slide-in-from-top duration-700">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">
          📊 Rendimiento y Estadísticas
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Análisis detallado de tu progreso técnico y físico en la escuela.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span className="w-2 h-8 bg-red-500 rounded-full" />
              Evaluación Técnica
            </h2>
            {radarData.length > 0 ? (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
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
                    <Tooltip />
                    <Radar
                      name={estadistica.nombre_completo}
                      dataKey="A"
                      stroke="#EF4444"
                      fill="#EF4444"
                      fillOpacity={0.4}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-gray-400 text-sm py-10 text-center">
                Aún no tienes evaluaciones registradas por el profesor.
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
                Última Evaluación
              </h3>
              {ev ? (
                <div className="space-y-4">
                  {[
                    { label: 'Técnica', val: ev.tecnica, color: 'bg-blue-500' },
                    { label: 'Física', val: ev.fisica, color: 'bg-green-500' },
                    { label: 'Táctica', val: ev.tactica, color: 'bg-purple-500' },
                    { label: 'Mental', val: ev.mental, color: 'bg-orange-500' },
                  ].map((stat) => (
                    <div key={stat.label}>
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span>{stat.label}</span>
                        <span>{stat.val ?? '—'}/10</span>
                      </div>
                      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${stat.color}`}
                          style={{ width: `${(stat.val ?? 0) * 10}%` }}
                        />
                      </div>
                    </div>
                  ))}
                  {ev.created_at && (
                    <p className="text-[10px] text-gray-400 mt-4 italic border-t pt-4">
                      Fecha: {new Date(ev.created_at).toLocaleDateString()}
                    </p>
                  )}
                </div>
              ) : (
                <div className="py-10 text-center">
                  <p className="text-gray-400 text-sm">
                    Aún no tienes evaluaciones registradas por el profesor.
                  </p>
                </div>
              )}
            </div>

            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
              <div className="absolute -right-4 -bottom-4 opacity-10">
                <span className="text-9xl italic font-black">DG</span>
              </div>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">
                Records Personales
              </h3>
              <div className="flex items-center justify-around text-center">
                <div>
                  <p className="text-4xl font-black text-red-500">{estadistica.goles}</p>
                  <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest mt-1">
                    Goles
                  </p>
                </div>
                <div className="w-px h-12 bg-white/10" />
                <div>
                  <p className="text-4xl font-black text-blue-400">{estadistica.asistencias}</p>
                  <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest mt-1">
                    Asistencias
                  </p>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-white/5 grid grid-cols-2 gap-4 text-center text-sm">
                <div>
                  <p className="font-bold">{estadistica.partidos_jugados}</p>
                  <p className="text-white/50 text-xs">Partidos</p>
                </div>
                <div>
                  <p className="font-bold">{estadistica.porcentaje_asistencia_entrenamientos}%</p>
                  <p className="text-white/50 text-xs">Asistencia</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="text-base font-bold text-gray-800 mb-4">🏆 Logros Obtenidos</h2>
            {logros.length > 0 ? (
              <div className="space-y-4">
                {logros.map((logro) => (
                  <div
                    key={logro.label}
                    className="flex items-center gap-3 p-3 rounded-xl border border-gray-50 bg-gray-50/30"
                  >
                    <span className="text-xl">{logro.icon}</span>
                    <div>
                      <p className="text-xs font-bold text-gray-800">{logro.label}</p>
                      <p className="text-[10px] text-gray-400">{logro.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">
                Sigue entrenando para desbloquear logros con tus estadísticas reales.
              </p>
            )}
          </div>

          <div className="rounded-2xl bg-blue-600 p-6 text-white shadow-lg relative overflow-hidden group">
            <h3 className="text-sm font-bold opacity-80 uppercase tracking-widest mb-2">
              Consejo Técnico
            </h3>
            <p className="text-sm font-medium leading-relaxed italic relative z-10">
              &quot;La disciplina del entrenamiento hoy es tu ventaja táctica el día del partido.
              No descuides el trabajo físico después de la sesión.&quot;
            </p>
            <div className="absolute right-2 bottom-2 text-white/10 text-6xl group-hover:rotate-12 transition-transform">
              ⚽
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
