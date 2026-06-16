import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import PanelCharts from '@/components/entrenador/PanelCharts'

export default async function PanelEntrenadorPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const nombre = user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? 'Entrenador'

  // Obtener Equipo y Categoría del Entrenador
  const { data: equipoPropio } = await supabase
    .from('rendimiento_equipos')
    .select('*, categorias_maestras(nombre)')
    .eq('tecnico_id', user.id)
    .maybeSingle()

  // KPI 1 — Jugadores activos
  const { data: jugadores } = await supabase
    .from('jugadores')
    .select('id, nombre, apellido, numero, posicion, estado')
    .order('numero')

  const jugadoresActivos  = jugadores?.filter(j => j.estado === 'activo').length  ?? 0
  const jugadoresLesionados   = jugadores?.filter(j => j.estado === 'lesionado').length ?? 0
  const jugadoresSuspendidos  = jugadores?.filter(j => j.estado === 'suspendido').length ?? 0

  // KPI 2 — Próximo partido
  const { data: proximoPartido } = await supabase
    .from('partidos')
    .select('id, fecha, rival, sede, torneo')
    .gt('fecha', new Date().toISOString())
    .order('fecha')
    .limit(1)
    .maybeSingle()

  const diasProximoPartido = proximoPartido
    ? Math.ceil((new Date(proximoPartido.fecha).getTime() - Date.now()) / 86400000)
    : null

  // KPI 3 — % Asistencia últimos 30 días
  const hace30dias = new Date(Date.now() - 30 * 86400000).toISOString()
  const { data: asistencias } = await supabase
    .from('asistencias')
    .select('presente')
    .gte('created_at', hace30dias)

  const totalAsistencias = asistencias?.length ?? 0
  const presentes        = asistencias?.filter(a => a.presente).length ?? 0
  const pctAsistencia    = totalAsistencias > 0
    ? Math.round((presentes / totalAsistencias) * 100)
    : 0

  // KPI 4 — Rendimiento promedio
  const { data: evaluaciones } = await supabase
    .from('evaluaciones')
    .select('tecnica, fisica, tactica, mental')

  const rendimientoProm = evaluaciones && evaluaciones.length > 0
    ? (evaluaciones.reduce((acc, e) =>
        acc + ((e.tecnica + e.fisica + e.tactica + e.mental) / 4), 0
      ) / evaluaciones.length).toFixed(1)
    : '—'

  // Próximos eventos (partidos + entrenamientos)
  const { data: proximosPartidos } = await supabase
    .from('partidos')
    .select('id, fecha, rival, sede, torneo, estado')
    .gt('fecha', new Date().toISOString())
    .order('fecha')
    .limit(3)

  const { data: proximosEntrenamientos } = await supabase
    .from('entrenamientos')
    .select('id, fecha, tipo, lugar, duracion_minutos')
    .gt('fecha', new Date().toISOString())
    .order('fecha')
    .limit(3)

  type Evento = {
    id: string
    fecha: string
    titulo: string
    subtitulo: string
    tipo: 'partido' | 'entrenamiento'
    etiqueta: string
  }

  const eventos: Evento[] = [
    ...(proximosPartidos ?? []).map(p => ({
      id: p.id,
      fecha: p.fecha,
      titulo: `vs ${p.rival}`,
      subtitulo: p.sede ?? '',
      tipo: 'partido' as const,
      etiqueta: p.torneo ?? 'Partido',
    })),
    ...(proximosEntrenamientos ?? []).map(e => ({
      id: e.id,
      fecha: e.fecha,
      titulo: `Entrenamiento ${e.tipo ?? ''}`,
      subtitulo: e.lugar ?? '',
      tipo: 'entrenamiento' as const,
      etiqueta: 'Entrenamiento',
    })),
  ].sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime()).slice(0, 5)

  // Alertas — lesionados + suspendidos + ausencias frecuentes
  const { data: lesionesActivas } = await supabase
    .from('lesiones')
    .select('id, descripcion, jugador_id, fecha_retorno, jugadores(nombre, apellido, numero)')
    .eq('estado', 'activo')
    .limit(5)

  // Resultados recientes
  const { data: resultados } = await supabase
    .from('partidos')
    .select('id, fecha, rival, resultado_local, resultado_visitante')
    .not('resultado_local', 'is', null)
    .order('fecha', { ascending: false })
    .limit(5)

  // Mejores jugadores por evaluación promedio
  const { data: topJugadores } = await supabase
    .from('evaluaciones')
    .select('jugador_id, tecnica, fisica, tactica, mental, jugadores(nombre, apellido, numero, posicion)')
    .order('created_at', { ascending: false })
    .limit(20)

  // Agrupar promedios por jugador
  type JugadorProm = { nombre: string; apellido: string; numero: number; posicion: string; promedio: number }
  const promediosPorJugador = new Map<string, JugadorProm>()
  topJugadores?.forEach(ev => {
    const jid = ev.jugador_id
    const prom = (ev.tecnica + ev.fisica + ev.tactica + ev.mental) / 4
    if (!promediosPorJugador.has(jid)) {
      const j = ev.jugadores as any
      promediosPorJugador.set(jid, {
        nombre: j?.nombre ?? '',
        apellido: j?.apellido ?? '',
        numero: j?.numero ?? 0,
        posicion: j?.posicion ?? '',
        promedio: prom,
      })
    }
  })
  const mejoresJugadores = Array.from(promediosPorJugador.values())
    .sort((a, b) => b.promedio - a.promedio)
    .slice(0, 3)

  const ACCIONES = [
    { href: '/dashboard/entrenador/asistencias', label: 'Control de Asistencia',   color: 'bg-blue-500',   icon: '⊙' },
    { href: '/dashboard/entrenador/entrenamientos', label: 'Planificar Entrenamiento', color: 'bg-green-500',  icon: '📋' },
    { href: '/dashboard/entrenador/convocatorias',  label: 'Gestionar Convocatoria',   color: 'bg-purple-500', icon: '👥' },
    { href: '/dashboard/entrenador/evaluacion',     label: 'Evaluar Jugadores',         color: 'bg-orange-500', icon: '📊' },
    { href: '/dashboard/entrenador/lesiones',       label: 'Registro de Lesiones',      color: 'bg-red-500',    icon: '🏥' },
    { href: '/dashboard/entrenador/partidos',       label: 'Eventos de Partidos',        color: 'bg-yellow-500', icon: '🏆' },
  ]

  return (
    <div className="mx-auto max-w-7xl px-6 py-8 space-y-8">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-900">
            <span className="text-red-500">↗</span> Panel del Entrenador
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Bienvenido, {nombre} {equipoPropio ? `· ${equipoPropio.categorias_maestras?.nombre} - ${equipoPropio.equipo}` : '· Escuela Patriota Sport Bacatá'}
          </p>
        </div>
        <span className="flex items-center gap-1.5 text-xs font-medium text-green-600">
          <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
          Temporada 2026
        </span>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            icon: '👥',
            valor: jugadoresActivos,
            label: 'Jugadores Activos',
            sub: `${jugadoresLesionados} lesionados · ${jugadoresSuspendidos} suspendido${jugadoresSuspendidos !== 1 ? 's' : ''}`,
          },
          {
            icon: '🏆',
            valor: diasProximoPartido !== null ? `${diasProximoPartido} días` : '—',
            label: 'Próximo Partido',
            sub: proximoPartido ? `vs ${proximoPartido.rival}` : 'Sin partido programado',
          },
          {
            icon: '✅',
            valor: `${pctAsistencia}%`,
            label: '% Asistencia',
            sub: 'Últimos 28 entrenamientos',
          },
          {
            icon: '📈',
            valor: `${rendimientoProm}/10`,
            label: 'Rendimiento',
            sub: '67% victorias esta temporada',
          },
        ].map((kpi, i) => (
          <div key={i} className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <p className="text-2xl mb-2">{kpi.icon}</p>
            <p className="text-3xl font-bold text-gray-900">{kpi.valor}</p>
            <p className="text-sm font-medium text-gray-700 mt-1">{kpi.label}</p>
            <p className="text-xs text-gray-400 mt-0.5">{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* Acciones rápidas */}
      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="flex items-center gap-2 text-base font-semibold text-gray-800 mb-4">
          ⚡ Acciones Rápidas
        </h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {ACCIONES.map(a => (
            <Link
              key={a.href}
              href={a.href}
              className="flex flex-col items-center gap-2 rounded-xl border border-gray-100 p-4 text-center hover:shadow-md transition-all duration-150 hover:border-red-100 group"
            >
              <div className={`w-12 h-12 rounded-xl ${a.color} flex items-center justify-center text-white text-xl shadow-sm group-hover:scale-105 transition-transform`}>
                {a.icon}
              </div>
              <span className="text-xs font-medium text-gray-600 leading-tight">{a.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Próximos eventos + Alertas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Próximos eventos */}
        <div className="lg:col-span-2 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="flex items-center gap-2 text-base font-semibold text-gray-800">
              📅 Próximos Eventos
            </h2>
            <Link href="/partidos" className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1">
              Ver todos →
            </Link>
          </div>
          <div className="space-y-3">
            {eventos.length === 0 ? (
              <p className="text-sm text-gray-400 py-4 text-center">No hay eventos próximos</p>
            ) : (
              eventos.map(ev => (
                <div key={ev.id} className="flex items-center gap-3 rounded-lg p-3 hover:bg-gray-50 transition-colors">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-white text-sm font-bold flex-shrink-0 ${
                    ev.tipo === 'partido' ? 'bg-purple-500' : 'bg-blue-500'
                  }`}>
                    {ev.tipo === 'partido' ? '🏆' : '⚡'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{ev.titulo}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(ev.fecha).toLocaleDateString('es-CO', { month: 'short', day: 'numeric' })} ·{' '}
                      {new Date(ev.fecha).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })} · {ev.subtitulo}
                    </p>
                  </div>
                  <span className={`text-xs font-medium rounded-full px-2.5 py-0.5 flex-shrink-0 ${
                    ev.tipo === 'partido'
                      ? 'bg-red-100 text-red-600'
                      : 'text-gray-500 bg-gray-100'
                  }`}>
                    {ev.etiqueta}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Alertas de jugadores */}
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="flex items-center gap-2 text-base font-semibold text-gray-800">
              ⚠️ Alertas de Jugadores
              {(lesionesActivas?.length ?? 0) > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {lesionesActivas!.length}
                </span>
              )}
            </h2>
          </div>
          <div className="space-y-2">
            {(lesionesActivas?.length ?? 0) === 0 ? (
              <p className="text-sm text-gray-400 py-4 text-center">Sin alertas activas ✅</p>
            ) : (
              lesionesActivas!.map(lesion => {
                const j = lesion.jugadores as any
                const initiales = `${j?.nombre?.[0] ?? ''}${j?.apellido?.[0] ?? ''}`
                return (
                  <div key={lesion.id} className="rounded-lg bg-red-50 border border-red-100 p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-7 h-7 rounded-full bg-red-200 flex items-center justify-center text-xs font-bold text-red-700">
                        {initiales}
                      </div>
                      <span className="text-sm font-semibold text-gray-900">
                        #{j?.numero} {j?.nombre} {j?.apellido}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 ml-9">{lesion.descripcion}</p>
                    {lesion.fecha_retorno && (
                      <p className="text-xs text-red-500 ml-9 mt-0.5">
                        Retorno: {new Date(lesion.fecha_retorno).toLocaleDateString('es-CO')}
                      </p>
                    )}
                  </div>
                )
              })
            )}
          </div>
          <Link
            href="/dashboard/entrenador/lesiones"
            className="mt-4 w-full text-center text-xs text-red-600 hover:text-red-700 flex items-center justify-center gap-1"
          >
            Ver todas las alertas →
          </Link>
        </div>
      </div>

      {/* Gráficas + Perfil del equipo */}
      <PanelCharts />

      {/* Mejores jugadores + Resultados recientes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Mejores jugadores */}
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="flex items-center gap-2 text-base font-semibold text-gray-800">
              ⚡ Mejores Jugadores
            </h2>
            <Link href="/dashboard/entrenador/evaluacion" className="text-sm text-red-600 hover:text-red-700">
              Ver evaluaciones →
            </Link>
          </div>
          <div className="space-y-3">
            {mejoresJugadores.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">Sin evaluaciones aún</p>
            ) : (
              mejoresJugadores.map((j, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                    i === 0 ? 'bg-yellow-400' : i === 1 ? 'bg-gray-400' : 'bg-orange-400'
                  }`}>
                    {i + 1}
                  </div>
                  <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                    {j.nombre[0]}{j.apellido[0]}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">#{j.numero} {j.nombre} {j.apellido}</p>
                    <p className="text-xs text-gray-400">{j.posicion}</p>
                  </div>
                  <span className="text-sm font-bold text-green-600">{j.promedio.toFixed(1)}</span>
                  <span className="text-xs text-gray-400">prom</span>
                </div>
              ))
            )}
          </div>
          {mejoresJugadores.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Rendimiento promedio equipo</span>
                <span>{rendimientoProm}/10</span>
              </div>
              <div className="mt-1.5 h-2 rounded-full bg-red-100 overflow-hidden">
                <div
                  className="h-full bg-red-500 rounded-full"
                  style={{ width: `${(parseFloat(String(rendimientoProm)) / 10) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Resultados recientes */}
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="flex items-center gap-2 text-base font-semibold text-gray-800">
              🏆 Resultados Recientes
            </h2>
            <Link href="/partidos" className="text-sm text-red-600 hover:text-red-700">
              Ver partidos →
            </Link>
          </div>
          <div className="space-y-2">
            {(resultados?.length ?? 0) === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">Sin resultados registrados</p>
            ) : (
              resultados!.map(r => {
                const local = r.resultado_local ?? 0
                const visitante = r.resultado_visitante ?? 0
                const resultado = local > visitante ? 'V' : local === visitante ? 'E' : 'D'
                const colores = { V: 'bg-green-100 text-green-700', E: 'bg-yellow-100 text-yellow-700', D: 'bg-red-100 text-red-600' }
                return (
                  <div key={r.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${colores[resultado]}`}>
                      {resultado}
                    </span>
                    <span className="flex-1 text-sm font-medium text-gray-900">{r.rival}</span>
                    <span className="text-sm font-bold text-gray-900 tabular-nums">{local}-{visitante}</span>
                    <span className="text-xs text-gray-400 w-14 text-right">
                      {new Date(r.fecha).toLocaleDateString('es-CO', { day: '2-digit', month: 'short' })}
                    </span>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>
    </div>
  )
}