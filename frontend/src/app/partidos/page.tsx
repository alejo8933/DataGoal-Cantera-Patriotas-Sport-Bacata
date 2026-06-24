'use client'

import { useState } from 'react'
import { Calendar, Clock, MapPin, Users, X } from 'lucide-react'

const PROXIMOS = [
  {
    id: '1',
    torneo: 'Liga de Bogotá',
    categoria: 'Sub-17',
    estado: 'Próximo',
    local: 'Escuela Patriota Sport Bacatá',
    visitante: 'Academia Los Millonarios',
    fecha: '2026-04-05',
    hora: '15:00',
    lugar: 'Cancha Sintética Bacatá',
    arbitro: 'Por confirmar',
    notas: 'Partido de ida de cuartos de final.',
  },
  {
    id: '2',
    torneo: 'Torneo Maracaná',
    categoria: 'Sub-15',
    estado: 'Próximo',
    local: 'Escuela Santa Fe',
    visitante: 'Escuela Patriota Sport Bacatá',
    fecha: '2026-04-12',
    hora: '18:00',
    lugar: 'Parque Timiza',
    arbitro: 'Por confirmar',
    notas: 'Jornada 6 de la fase de grupos.',
  },
  {
    id: '3',
    torneo: 'Torneo DBS',
    categoria: 'Sub-13',
    estado: 'Próximo',
    local: 'Escuela Patriota Sport Bacatá',
    visitante: 'Academia Nacional',
    fecha: '2026-04-19',
    hora: '10:00',
    lugar: 'Cancha Sintética Bacatá',
    arbitro: 'Por confirmar',
    notas: 'Último partido de la fase clasificatoria.',
  },
]

const RESULTADOS = [
  {
    id: '4',
    torneo: 'Liga de Bogotá',
    categoria: 'Sub-17',
    estado: 'Finalizado',
    local: 'Escuela Patriota Sport Bacatá',
    visitante: 'Escuela Equidad',
    golesLocal: 3,
    golesVisitante: 1,
    resultado: 'Victoria',
    fecha: '2026-03-22',
    hora: '14:00',
    lugar: 'Cancha Sintética Bacatá',
    arbitro: 'Luis Pérez',
    notas: 'Victoria que consolidó el segundo lugar en la liga.',
  },
  {
    id: '5',
    torneo: 'Torneo DBS',
    categoria: 'Sub-15',
    estado: 'Finalizado',
    local: 'Academia Chicó',
    visitante: 'Escuela Patriota Sport Bacatá',
    golesLocal: 0,
    golesVisitante: 3,
    resultado: 'Victoria',
    fecha: '2026-03-15',
    hora: '16:00',
    lugar: 'Estadio Metropolitano',
    arbitro: 'Carlos Ruiz',
    notas: 'Victoria en final del Torneo DBS Sub-15.',
  },
  {
    id: '6',
    torneo: 'Torneo Maracana',
    categoria: 'Sub-13',
    estado: 'Finalizado',
    local: 'Escuela Patriota Sport Bacatá',
    visitante: 'Formativa La Sabana',
    golesLocal: 2,
    golesVisitante: 2,
    resultado: 'Empate',
    fecha: '2026-03-08',
    hora: '10:00',
    lugar: 'Cancha Sintética Bacatá',
    arbitro: 'Mario Torres',
    notas: 'Empate en partido de la fase de grupos.',
  },
]

type Partido = typeof PROXIMOS[0] & {
  golesLocal?: number
  golesVisitante?: number
  resultado?: string
}

const resultadoColor: Record<string, string> = {
  Victoria: 'text-green-600',
  Empate:   'text-yellow-600',
  Derrota:  'text-red-600',
}

export default function PartidosPage() {
  const [tab,          setTab]          = useState<'proximos' | 'resultados'>('proximos')
  const [seleccionado, setSeleccionado] = useState<Partido | null>(null)

  const lista = tab === 'proximos' ? PROXIMOS : RESULTADOS

  return (
    <div className="bg-white min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-10">

        {/* Título */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Partidos</h1>
          <p className="text-gray-500 mt-2 max-w-xl mx-auto text-sm">
            Mantente al día con todos los partidos de Escuela Patriota Sport Bacatá en los torneos de Bogotá. Resultados y próximos encuentros de todas las categorías.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex rounded-lg border border-gray-200 overflow-hidden mb-8">
          <button
            onClick={() => setTab('proximos')}
            className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
              tab === 'proximos'
                ? 'bg-gray-800 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Próximos Partidos
          </button>
          <button
            onClick={() => setTab('resultados')}
            className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
              tab === 'resultados'
                ? 'bg-gray-800 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Resultados Recientes
          </button>
        </div>

        {/* Tarjetas */}
        <div className="grid md:grid-cols-3 gap-4 mb-10">
          {lista.map((p) => {
            const partido = p as Partido
            return (
              <div key={partido.id} className="rounded-lg border border-gray-200 p-4 flex flex-col gap-3">

                {/* Header tarjeta */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{partido.torneo}</span>
                  <div className="flex gap-2">
                    <span className="rounded-full bg-purple-100 text-purple-700 text-xs px-2 py-0.5 font-medium">
                      {partido.categoria}
                    </span>
                    <span className={`rounded-full text-xs px-2 py-0.5 font-medium ${
                      partido.estado === 'Próximo'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {partido.estado}
                    </span>
                  </div>
                </div>

                {/* Equipos */}
                <div className="flex items-center justify-between gap-2 py-2">
                  <span className="text-sm font-semibold text-gray-900 text-center flex-1">{partido.local}</span>

                  {partido.golesLocal !== undefined ? (
                    <div className="text-center">
                      <p className="text-2xl font-bold text-red-600">
                        {partido.golesLocal} - {partido.golesVisitante}
                      </p>
                      <p className={`text-xs font-semibold ${resultadoColor[partido.resultado ?? ''] ?? 'text-gray-500'}`}>
                        {partido.resultado}
                      </p>
                    </div>
                  ) : (
                    <span className="text-lg font-bold text-gray-400">VS</span>
                  )}

                  <span className="text-sm font-semibold text-gray-900 text-center flex-1">{partido.visitante}</span>
                </div>

                {/* Info */}
                <div className="space-y-1">
                  <p className="text-xs text-gray-500 flex items-center gap-1.5">
                    <Calendar size={12} /> {partido.fecha}
                  </p>
                  {partido.hora && (
                    <p className="text-xs text-gray-500 flex items-center gap-1.5">
                      <Clock size={12} /> {partido.hora}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 flex items-center gap-1.5">
                    <MapPin size={12} /> {partido.lugar}
                  </p>
                </div>

                {/* Botón */}
                <button
                  onClick={() => setSeleccionado(partido)}
                  className="mt-auto w-full rounded-md border border-gray-200 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center gap-1"
                >
                  {tab === 'proximos' ? 'Ver Detalles' : 'Ver Resumen'} →
                </button>
              </div>
            )
          })}
        </div>

        {/* Cancha Principal */}
        <div className="rounded-lg border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <MapPin size={16} className="text-gray-400" />
            Cancha Principal — Parque Timiza
          </h2>
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div>
              <p className="font-semibold text-gray-700 mb-2">Información General</p>
              <p className="text-gray-500">Ubicación: Kennedy, Bogotá D.C.</p>
              <p className="text-gray-500">Superficie: Cancha sintética</p>
              <p className="text-gray-500">Alumbrado: Disponible</p>
            </div>
            <div>
              <p className="font-semibold text-gray-700 mb-2 flex items-center gap-1">
                <Users size={14} /> Capacidad
              </p>
              <p className="text-gray-500">300 espectadores</p>
              <p className="text-gray-500">Graderías: General</p>
              <p className="text-gray-500">Acceso para todos</p>
            </div>
            <div>
              <p className="font-semibold text-gray-700 mb-2">Servicios</p>
              <p className="text-gray-500">• Camerinos</p>
              <p className="text-gray-500">• Zona de calentamiento</p>
              <p className="text-gray-500">• Zona de comidas</p>
              <p className="text-gray-500">• Parqueadero</p>
            </div>
          </div>
        </div>

      </div>

      {/* Modal */}
      {seleccionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative">
            <button
              onClick={() => setSeleccionado(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {seleccionado.local} vs {seleccionado.visitante}
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Torneo</span>
                <span className="font-medium">{seleccionado.torneo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Categoría</span>
                <span className="font-medium">{seleccionado.categoria}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Fecha</span>
                <span className="font-medium">{seleccionado.fecha} · {seleccionado.hora}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Lugar</span>
                <span className="font-medium">{seleccionado.lugar}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Árbitro</span>
                <span className="font-medium">{seleccionado.arbitro}</span>
              </div>
              {seleccionado.golesLocal !== undefined && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Resultado</span>
                  <span className="font-bold text-red-600">
                    {seleccionado.golesLocal} - {seleccionado.golesVisitante}
                  </span>
                </div>
              )}
              <div className="pt-2 border-t border-gray-100">
                <p className="text-gray-500 text-xs">Notas</p>
                <p className="mt-1 text-gray-700">{seleccionado.notas}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}