import Link from 'next/link'
import { Calendar, ArrowRight, Clock, MapPin, Star } from 'lucide-react'

const PARTIDOS = [
  { rival: 'Academia Los Millonarios', torneo: 'Liga de Bogotá', categoria: 'Sub-17', fecha: '2026-04-05', dia: '05', mes: 'ABR', hora: '15:00' },
  { rival: 'Escuela Santa Fe', torneo: 'Torneo Maracaná', categoria: 'Sub-15', fecha: '2026-04-12', dia: '12', mes: 'ABR', hora: '18:00' },
  { rival: 'Academia Nacional', torneo: 'Torneo DBS', categoria: 'Sub-13', fecha: '2026-04-19', dia: '19', mes: 'ABR', hora: '10:00' },
]

const NOTICIAS = [
  {
    categoria: 'Campeonato',
    titulo: 'Escuela Patriota Sport Bacatá campeona del Torneo DBS Sub-15',
    resumen: 'El equipo Sub-15 logró el título con una victoria 2-0 en la final ante Academia Chicó.',
    fecha: '20 Mar 2026',
  },
  {
    categoria: 'Resultados',
    titulo: 'Victoria importante ante Escuela Equidad Sub-17',
    resumen: 'El equipo Sub-17 se impuso 3-1 ante Escuela Equidad, consolidándose en el segundo lugar de la Liga.',
    fecha: '22 Mar 2026',
  },
  {
    categoria: 'Instalaciones',
    titulo: 'Nuevas instalaciones de entrenamiento en Parque Timiza',
    resumen: 'Mejoras en la cancha sintética Bacatá, incluyendo nuevo alumbrado para entrenamientos nocturnos.',
    fecha: '15 Mar 2026',
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
    <div className="bg-white text-carbon-900">
      {/* ── HERO ─────────────────────────────────── */}
      <section
        className="relative overflow-hidden bg-brand-950 bg-cover bg-center pb-24 pt-24 md:pt-32"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 90% 60% at 50% -10%, rgba(185,20,35,0.6), transparent), linear-gradient(180deg, rgba(32,5,7,0.4) 0%, rgba(32,5,7,0.68) 55%, rgba(32,5,7,0.88) 100%), url('https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=1600&q=80')",
        }}
      >
        <div className="bg-pitch-lines pointer-events-none absolute inset-0 opacity-30" />

        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <div className="animate-fade-up mx-auto mb-7 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
            <Star size={13} className="text-brand-200" strokeWidth={2.5} fill="currentColor" />
            Escuela de fútbol juvenil · Bogotá, Colombia
          </div>

          <h1 className="animate-fade-up delay-100 text-5xl font-black leading-[1.05] tracking-tight text-white md:text-7xl">
            Formando <span className="text-gradient-brand">campeones</span>
            <br className="hidden md:block" /> desde la cantera
          </h1>

          <p className="animate-fade-up delay-200 mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/80 md:text-lg">
            Categorías Sub-7 a Sub-17 en Bogotá. Metodología, disciplina y pasión
            por el fútbol, con el respaldo de una plataforma de gestión de clase mundial.
          </p>

          <div className="animate-fade-up delay-300 mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/registro"
              className="group flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-bold text-brand-700 shadow-[0_12px_30px_-10px_rgba(0,0,0,0.6)] transition-all duration-200 hover:bg-brand-50 hover:-translate-y-0.5"
            >
              Únete a la Escuela
              <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
            <Link
              href="/partidos"
              className="rounded-xl border border-white/30 px-7 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:border-white/50 hover:bg-white/10"
            >
              Próximos Partidos
            </Link>
          </div>
        </div>
      </section>

      {/* ── PARTIDOS + NOTICIAS ──────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="mb-12 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600">Actividad del club</p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-carbon-900 md:text-4xl">
            Lo que está pasando en la cancha
          </h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Próximos Partidos */}
          <div className="rounded-2xl border border-carbon-100 bg-white p-7 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-base font-bold text-carbon-900">
                <Calendar size={17} className="text-brand-500" />
                Próximos Partidos
              </h3>
              <Link
                href="/partidos"
                className="group flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700"
              >
                Ver todos
                <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            <div className="flex flex-col divide-y divide-carbon-100">
              {PARTIDOS.map((p) => (
                <div key={p.fecha} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                  <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                    <span className="text-lg font-black leading-none">{p.dia}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wide">{p.mes}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-carbon-900">{p.rival}</p>
                    <p className="mt-0.5 text-xs text-carbon-500">
                      {p.torneo} · <span className="font-semibold text-carbon-600">{p.categoria}</span>
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1 text-xs font-medium text-carbon-500">
                    <Clock size={13} />
                    {p.hora}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Últimas Noticias */}
          <div className="rounded-2xl border border-carbon-100 bg-white p-7 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
            <h3 className="mb-6 text-base font-bold text-carbon-900">Últimas Noticias</h3>

            <div className="flex flex-col divide-y divide-carbon-100">
              {NOTICIAS.map((n) => (
                <div key={n.titulo} className="py-4 first:pt-0 last:pb-0">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="rounded-full bg-brand-600 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                      {n.categoria}
                    </span>
                    <span className="text-[11px] text-carbon-400">{n.fecha}</span>
                  </div>
                  <p className="text-sm font-bold leading-snug text-carbon-900">{n.titulo}</p>
                  <p className="mt-1 text-xs leading-relaxed text-carbon-500">{n.resumen}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CATEGORÍAS ───────────────────────────── */}
      <section className="bg-carbon-50 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600">Formación por edades</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-carbon-900 md:text-4xl">
              Nuestras Categorías
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {CATEGORIAS.map((c) => (
              <div
                key={c.nombre}
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 px-4 py-7 text-center shadow-[0_10px_24px_-12px_rgba(150,18,29,0.6)] transition-transform duration-200 hover:-translate-y-1"
              >
                <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-white/10 blur-2xl transition-opacity duration-200 group-hover:bg-white/20" />
                <p className="relative text-xl font-black text-white">{c.nombre}</p>
                <p className="relative mt-1 text-xs font-medium text-brand-100">Nacidos en {c.año}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <Link
              href="/registro"
              className="group flex items-center gap-2 text-sm font-bold text-brand-600 hover:text-brand-700"
            >
              ¿Tu hijo tiene la edad? Inscríbelo aquí
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 via-brand-800 to-brand-950 px-8 py-16 text-center md:px-16">
          <div
            className="pointer-events-none absolute inset-0 opacity-50"
            style={{
              backgroundImage:
                'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.15), transparent 45%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.1), transparent 45%)',
            }}
          />
          <div className="relative">
            <div className="mx-auto mb-6 flex items-center justify-center gap-1.5 text-brand-100">
              <MapPin size={15} />
              <span className="text-xs font-bold uppercase tracking-widest">Parque Timiza · Kennedy, Bogotá</span>
            </div>
            <h2 className="text-3xl font-black tracking-tight text-white md:text-4xl">
              ¿Listo para dar el siguiente paso?
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm text-white/70 md:text-base">
              Agenda una prueba, conoce a nuestro cuerpo técnico y descubre por qué
              somos la escuela de fútbol de referencia en Bogotá.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/registro"
                className="group flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-bold text-brand-700 shadow-lg transition-transform duration-200 hover:-translate-y-0.5"
              >
                Inscríbete Ahora
                <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
              <Link
                href="/torneos"
                className="rounded-xl border border-white/25 px-7 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:border-white/50 hover:bg-white/10"
              >
                Ver Torneos
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
