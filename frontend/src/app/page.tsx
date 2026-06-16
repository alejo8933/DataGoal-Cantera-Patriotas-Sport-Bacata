import Link from 'next/link'
import { Users, Trophy, Calendar, TrendingUp } from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

const STATS = [
  { icon: Users, value: '102+', label: 'Jugadores Activos' },
  { icon: Trophy, value: '12', label: 'Títulos Ganados' },
  { icon: Calendar, value: '16', label: 'Años de Historia' },
  { icon: TrendingUp, value: '85%', label: 'Victorias Locales' },
]

const PARTIDOS = [
  { rival: 'vs Academia Los Millonarios', torneo: 'Liga de Bogotá · Sub-17', fecha: '2026-04-05', hora: '15:00' },
  { rival: 'vs Escuela Santa Fe', torneo: 'Torneo Maracaná · Sub-15', fecha: '2026-04-12', hora: '18:00' },
  { rival: 'vs Academia Nacional', torneo: 'Torneo DBS · Sub-13', fecha: '2026-04-19', hora: '10:00' },
]

const NOTICIAS = [
  {
    titulo: 'Escuela Patriota Sport Bacatá campeona del Torneo DBS Sub-15',
    resumen: 'El equipo Sub-15 logró el título del Torneo DBS con una victoria 2-0 en la final ante Academia Chicó...',
    fecha: '2026-03-20',
  },
  {
    titulo: 'Victoria importante ante Escuela Equidad Sub-17',
    resumen: 'El equipo Sub-17 logró una victoria 3-1 ante Escuela Equidad, consolidándose en el segundo lugar de la Liga de Bogotá...',
    fecha: '2026-03-22',
  },
  {
    titulo: 'Nuevas instalaciones de entrenamiento en Parque Timiza',
    resumen: 'Se inauguraron mejoras en la cancha sintética Bacatá, incluyendo nuevo alumbrado para entrenamientos nocturnos...',
    fecha: '2026-03-15',
  },
]

const CATEGORIAS = [
  { nombre: 'Sub-7', año: '2018' },
  { nombre: 'Sub-9', año: '2016' },
  { nombre: 'Sub-11', año: '2014' },
  { nombre: 'Sub-13', año: '2012' },
  { nombre: 'Sub-15', año: '2010' },
  { nombre: 'Sub-17', año: '2008' },
]

export default function HomePage() {
  return (
    <div className="bg-white text-gray-900">
      <Header />
      {/* ── HERO ─────────────────────────────────── */}
      <section
        className="relative flex min-h-[420px] items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url('https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=1400&q=80')" }}
      >
        <div className="text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Escuela Patriota Sport Bacatá
          </h1>
          <p className="text-lg text-gray-200 mb-8">
            Formando campeones desde la cantera. Categorías Sub-7 a Sub-17 en Bogotá, Colombia.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/equipos"
              className="rounded-md bg-red-600 px-6 py-2.5 font-semibold text-white hover:bg-red-700 transition-colors"
            >
              Ver Equipos
            </Link>
            <Link
              href="/partidos"
              className="rounded-md border-2 border-white px-6 py-2.5 font-semibold text-white hover:bg-white hover:text-gray-900 transition-colors"
            >
              Próximos Partidos
            </Link>
          </div>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map((s) => (
            <div key={s.label} className="rounded-lg border border-gray-200 p-6 text-center shadow-sm">
              <div className="flex justify-center mb-3">
                <s.icon size={28} className="text-gray-400" strokeWidth={1.5} />
              </div>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="text-sm text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── PARTIDOS + NOTICIAS ──────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-6">
        <div className="grid md:grid-cols-2 gap-6">

          {/* Próximos Partidos */}
          <div className="rounded-lg border border-gray-200 p-5">
            <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Calendar size={16} className="text-gray-400" />
              Próximos Partidos
            </h2>
            <div className="flex flex-col gap-3">
              {PARTIDOS.map((p) => (
                <div key={p.fecha} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="font-medium text-sm text-gray-900">{p.rival}</p>
                    <p className="text-xs text-gray-500">{p.torneo}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-700">{p.fecha}</p>
                    <p className="text-xs text-gray-500">{p.hora}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link
              href="/partidos"
              className="mt-4 block w-full rounded border border-gray-300 py-2 text-center text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Ver Todos los Partidos
            </Link>
          </div>

          {/* Últimas Noticias */}
          <div className="rounded-lg border border-gray-200 p-5">
            <h2 className="font-semibold text-gray-800 mb-4">Noticias</h2>
            <div className="flex flex-col gap-3">
              {NOTICIAS.map((n) => (
                <div key={n.titulo} className="py-2 border-b border-gray-100 last:border-0">
                  <p className="font-medium text-sm text-gray-900">{n.titulo}</p>
                  <p className="text-xs text-gray-500 mt-1">{n.resumen}</p>
                  <p className="text-xs text-gray-400 mt-1">{n.fecha}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ── CATEGORÍAS ───────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">Nuestras Categorías</h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {CATEGORIAS.map((c) => (
            <div
              key={c.nombre}
              className="rounded-xl bg-red-600 text-white text-center py-5 cursor-pointer hover:bg-red-700 transition-colors"
            >
              <p className="text-lg font-bold">{c.nombre}</p>
              <p className="text-xs mt-1 text-red-200">{c.año}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  )
}
