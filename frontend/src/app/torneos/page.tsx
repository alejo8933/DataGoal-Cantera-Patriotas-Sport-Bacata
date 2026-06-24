'use client'

import { useState } from 'react'
import { Calendar, Users, Trophy } from 'lucide-react'

// ── PALMARÉS ─────────────────────────────────────────────────
const PALMARES = [
  { icon: '🏆', titulo: 'Títulos Liga de Bogotá', valor: '3', sub: 'Sub-17, Sub-15'          },
  { icon: '🏆', titulo: 'Torneos DBS y Maracana',  valor: '5', sub: 'DBS Sub-15, Maracana Sub-17' },
  { icon: '⭐', titulo: 'Copas y Torneos',          valor: '4', sub: 'Copa Distrital, Intercolegiados' },
]

// ── TORNEOS ACTIVOS ───────────────────────────────────────────
const ACTIVOS = [
  {
    id: '1',
    nombre: 'Liga de Bogotá Sub-17',
    estado: 'En curso',
    categoria: 'Juvenil',
    descripcion: 'Torneo oficial de escuelas de fútbol de Bogotá. Organizado por la Federación de Fútbol de Bogotá para la categoría Sub-17.',
    fechaInicio: '2026-01-15',
    fechaFin: '2026-06-20',
    equipos: 12,
    fase: 'Fecha 8',
    posicion: '#2',
  },
  {
    id: '2',
    nombre: 'Torneo Maracana 2026',
    estado: 'Semifinales',
    categoria: 'Juvenil',
    descripcion: 'Copa de eliminación directa organizada en el Parque Maracana de Bogotá para categorías juveniles.',
    fechaInicio: '2026-02-10',
    fechaFin: '2026-05-30',
    equipos: 16,
    fase: 'Semifinales',
    posicion: 'Clasificado',
  },
  {
    id: '3',
    nombre: 'Torneo DBS Sub-15',
    estado: 'En curso',
    categoria: 'Infantil',
    descripcion: 'Campeonato Deportivo Bogotá Sur (DBS) para categorías infantiles. Uno de los torneos más importantes de la zona sur.',
    fechaInicio: '2026-01-20',
    fechaFin: '2026-05-15',
    equipos: 10,
    fase: 'Fecha 6',
    posicion: '#1',
  },
  {
    id: '4',
    nombre: 'Copa Distrital Sub-13',
    estado: 'En curso',
    categoria: 'Infantil',
    descripcion: 'Copa Distrital de Bogotá organizada por el IDRD para la categoría Sub-13. Participan los mejores equipos de la ciudad.',
    fechaInicio: '2026-02-01',
    fechaFin: '2026-06-30',
    equipos: 14,
    fase: 'Fase de Grupos',
    posicion: '#3',
  },
]

// ── HISTORIAL ─────────────────────────────────────────────────
const HISTORIAL = [
  {
    id: '1',
    nombre: 'Liga de Bogotá Sub-17 2025-I',
    estado: 'Finalizado',
    categoria: 'Juvenil',
    resultado: 'Campeón',
    anio: '2025',
    destacado: 'Primer título en la categoría Sub-17, con récord de 9 victorias consecutivas.',
    esCampeon: true,
  },
  {
    id: '2',
    nombre: 'Torneo DBS Sub-15 2025',
    estado: 'Finalizado',
    categoria: 'Infantil',
    resultado: 'Campeón',
    anio: '2025',
    destacado: 'Título invicto con 12 victorias y sólo 1 empate en toda la competencia.',
    esCampeon: true,
  },
  {
    id: '3',
    nombre: 'Copa Simón Bolívar Sub-13 2025',
    estado: 'Finalizado',
    categoria: 'Infantil',
    resultado: '3° lugar',
    anio: '2025',
    destacado: 'Primera participación en la Copa Simón Bolívar. Semifinalistas.',
    esCampeon: false,
  },
  {
    id: '4',
    nombre: 'Torneo Maracana Sub-15 2025',
    estado: 'Finalizado',
    categoria: 'Juvenil',
    resultado: 'Subcampeón',
    anio: '2025',
    destacado: 'Final reñida, perdida por penales ante Academia Los Millonarios.',
    esCampeon: false,
  },
  {
    id: '5',
    nombre: 'Torneo Intercolegiados 2025',
    estado: 'Finalizado',
    categoria: 'Juvenil',
    resultado: 'Campeón',
    anio: '2025',
    destacado: 'Victoria 2-0 en la final. Mejor torneo de fútbol 7 de la ciudad.',
    esCampeon: true,
  },
]

// ── PRÓXIMOS ──────────────────────────────────────────────────
const PROXIMOS = [
  {
    id: '1',
    nombre: 'Copa Distrital Sub-11 2026',
    estado: 'Próximo',
    categoria: 'Infantil',
    descripcion: 'Copa Distrital de Bogotá para la categoría Sub-11.',
    fechaInicio: '2026-05-15',
    fechaFin: '2026-09-30',
    clasificacion: 'Clasificación directa',
  },
  {
    id: '2',
    nombre: 'Torneo Intercolegiados 2026',
    estado: 'Próximo',
    categoria: 'Juvenil',
    descripcion: 'Torneo intercolegiados de Bogotá para jóvenes deportistas de categorías Sub-15 y Sub-17.',
    fechaInicio: '2026-06-10',
    fechaFin: '2026-08-05',
    clasificacion: 'Participación confirmada',
  },
  {
    id: '3',
    nombre: 'Copa Simón Bolívar Sub-17 2026',
    estado: 'Próximo',
    categoria: 'Juvenil',
    descripcion: 'Copa tradicional de Bogotá para la categoría Sub-17.',
    fechaInicio: '2026-07-01',
    fechaFin: '2026-11-30',
    clasificacion: 'En proceso de inscripción',
  },
]

export default function TorneosPage() {
  const [tab, setTab] = useState<'activos' | 'historial' | 'proximos'>('activos')

  return (
    <div className="bg-white min-h-screen">
      <div className="mx-auto max-w-7xl px-6 py-10">

        {/* Título */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Torneos</h1>
          <p className="text-base text-gray-500 mt-2">
            Conoce todos los torneos en los que participa Escuela Patriota Sport Bacatá en Bogotá: Liga de Bogotá, Torneo Maracana, DBS, Copa Simón Bolívar, Intercolegiados y Copa Distrital.
          </p>
        </div>

        {/* Palmarés */}
        <div className="grid grid-cols-3 gap-5 mb-8">
          {PALMARES.map((p) => (
            <div key={p.titulo} className="rounded-lg border border-gray-200 p-7 text-center">
              <div className="text-3xl mb-2">{p.icon}</div>
              <p className="text-3xl font-bold text-gray-900">{p.valor}</p>
              <p className="text-sm font-medium text-gray-600 mt-1">{p.titulo}</p>
              <p className="text-xs text-gray-400 mt-0.5">{p.sub}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex rounded-lg border border-gray-200 overflow-hidden mb-8">
          {[
            { key: 'activos',   label: 'Torneos Activos' },
            { key: 'historial', label: 'Historial'       },
            { key: 'proximos',  label: 'Próximos'        },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key as typeof tab)}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                tab === t.key ? 'bg-gray-800 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── TORNEOS ACTIVOS ── */}
        {tab === 'activos' && (
          <div className="grid md:grid-cols-2 gap-6">
            {ACTIVOS.map((t) => (
              <div key={t.id} className="rounded-lg border border-gray-200 p-7 flex flex-col gap-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-bold text-gray-900 text-base">{t.nombre}</p>
                    <p className="text-sm text-gray-500 mt-0.5">{t.categoria}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-green-100 text-green-700 text-xs font-medium px-3 py-1">
                    {t.estado}
                  </span>
                </div>

                <p className="text-sm text-gray-500">{t.descripcion}</p>

                <div className="space-y-1.5">
                  <p className="text-sm text-gray-500 flex items-center gap-2">
                    <Calendar size={14} /> {t.fechaInicio} → {t.fechaFin}
                  </p>
                  <p className="text-sm text-gray-500 flex items-center gap-2">
                    <Users size={14} /> {t.equipos} equipos
                  </p>
                  <p className="text-sm text-gray-500 flex items-center gap-2">
                    <Trophy size={14} /> {t.fase}
                  </p>
                </div>

                <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-sm text-gray-500">Posición Patriotas</span>
                  <span className="font-bold text-gray-900 text-lg">{t.posicion}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── HISTORIAL ── */}
        {tab === 'historial' && (
          <div className="grid md:grid-cols-2 gap-6">
            {HISTORIAL.map((t) => (
              <div key={t.id} className="rounded-lg border border-gray-200 p-7 flex flex-col gap-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-bold text-gray-900 text-base">{t.nombre}</p>
                    <p className="text-sm text-gray-500 mt-0.5">{t.categoria}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="rounded-full bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1">
                      {t.estado}
                    </span>
                    {t.esCampeon && (
                      <span className="text-xs text-yellow-600 font-medium">🏆 Campeón</span>
                    )}
                  </div>
                </div>

                <div className="flex gap-6">
                  <div>
                    <p className="text-xs text-gray-400">Resultado</p>
                    <p className={`font-bold text-base mt-0.5 ${t.esCampeon ? 'text-green-600' : 'text-gray-700'}`}>
                      {t.resultado}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Año</p>
                    <p className="font-bold text-base text-gray-900 mt-0.5">{t.anio}</p>
                  </div>
                </div>

                <div className="rounded-lg bg-gray-50 px-4 py-3">
                  <p className="text-xs text-gray-400 mb-1">⭐ Destacado</p>
                  <p className="text-sm text-gray-600">{t.destacado}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── PRÓXIMOS ── */}
        {tab === 'proximos' && (
          <div className="grid md:grid-cols-2 gap-6">
            {PROXIMOS.map((t) => (
              <div key={t.id} className="rounded-lg border border-gray-200 p-7 flex flex-col gap-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-bold text-gray-900 text-base">{t.nombre}</p>
                    <p className="text-sm text-gray-500 mt-0.5">{t.categoria}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-blue-100 text-blue-700 text-xs font-medium px-3 py-1">
                    {t.estado}
                  </span>
                </div>

                <p className="text-sm text-gray-500">{t.descripcion}</p>

                <div className="space-y-1.5">
                  <p className="text-sm text-gray-500 flex items-center gap-2">
                    <Calendar size={14} /> {t.fechaInicio} → {t.fechaFin}
                  </p>
                  <p className="text-sm text-gray-500 flex items-center gap-2">
                    <Trophy size={14} /> Clasificación: {t.clasificacion}
                  </p>
                </div>

                <div className="mt-auto pt-3 border-t border-gray-100">
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-green-600">
                    <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                    Patriotas clasificado
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}