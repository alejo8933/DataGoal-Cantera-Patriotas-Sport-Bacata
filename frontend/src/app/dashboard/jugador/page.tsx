import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import PlanManager from '@/components/jugador/PlanManager'
import PanelCharts from '@/components/entrenador/PanelCharts' // Reutilizamos por ahora o creamos uno nuevo

export default async function JugadorDashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const nombre = user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? 'Jugador'

  // Fetch player specific data
  // 1. Datos básicos del jugador
   const { data: jugadorInfo } = await supabase
     .from('jugadores')
     .select('*, categorias_maestras(nombre), rendimiento_equipos(equipo)')
     .ilike('nombre', `%${nombre.split(' ')[0]}%`)
     .maybeSingle()

  // 2. Próximo partido para su categoría
  const categoria = jugadorInfo?.categoria || 'General'
  const { data: proximoPartido } = await supabase
    .from('partidos')
    .select('*')
    .eq('categoria', categoria)
    .gt('fecha', new Date().toISOString())
    .order('fecha')
    .limit(1)
    .maybeSingle()

  // 3. Próximo entrenamiento
  const { data: proximoEntrenamiento } = await supabase
    .from('entrenamientos')
    .select('*')
    .order('fecha')
    .limit(1)
    .maybeSingle()

  // 4. Estadísticas rápidas (Asistencia y Rendimiento)
  // Mock values if data is missing
  const asistenciasPct = 92
  const rendimientoProm = jugadorInfo ? ((jugadorInfo.goles + jugadorInfo.asistencias) / 2 || 8.5).toFixed(1) : 8.5

  const ACCIONES = [
    { href: '/dashboard/jugador/estadisticas', label: 'Mis Estadísticas', color: 'bg-blue-500', icon: '📊' },
    { href: '/dashboard/entrenamientos', label: 'Ver Horarios', color: 'bg-green-500', icon: '📅' },
    { href: '/dashboard/partidos', label: 'Próximos Partidos', color: 'bg-purple-500', icon: '🏆' },
    { href: '/dashboard/notificaciones', label: 'Notificaciones', color: 'bg-orange-500', icon: '🔔' },
  ]

  return (
    <div className="mx-auto max-w-7xl px-6 py-8 space-y-8">

      {/* Header de Bienvenida */}
      <div className="flex items-center justify-between">
        <div className="animate-in fade-in slide-in-from-left duration-700">
          <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-900">
            <span className="text-red-500 text-3xl">👋</span> Hola, {nombre}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Tu progreso en la <span className="font-semibold text-red-600">Escuela Patriota Sport Bacatá</span>
            {jugadorInfo && (
              <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-400 rounded text-[10px] font-black uppercase tracking-widest">
                {jugadorInfo.categorias_maestras?.nombre} {jugadorInfo.rendimiento_equipos?.equipo ? `— ${jugadorInfo.rendimiento_equipos.equipo}` : ''}
              </span>
            )}
          </p>
        </div>
        <div className="hidden md:flex items-center gap-1.5 text-xs font-bold text-gray-500 bg-white px-3 py-1.5 rounded-full border border-gray-100 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Temporada 2026 Activa
        </div>
      </div>

      {/* KPIs Rápidos */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            icon: '🏟️',
            valor: proximoPartido ? 'Listo' : '—',
            label: 'Estado Competencia',
            sub: proximoPartido ? `vs ${proximoPartido.equipo_visitante}` : 'Sin partidos',
          },
          {
            icon: '✅',
            valor: `${asistenciasPct}%`,
            label: 'Asistencia Total',
            sub: 'Últimos 30 días',
          },
          {
            icon: '⚽',
            valor: jugadorInfo?.goles ?? 0,
            label: 'Goles Anotados',
            sub: 'Temporada actual',
          },
          {
            icon: '📈',
            valor: `${rendimientoProm}/10`,
            label: 'Rendimiento Prom.',
            sub: 'Basado en evaluaciones',
          },
        ].map((kpi, i) => (
          <div key={i} className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm hover:shadow-md transition-shadow group cursor-default">
            <p className="text-2xl mb-2 group-hover:scale-110 transition-transform">{kpi.icon}</p>
            <p className="text-3xl font-bold text-gray-900 tabular-nums">{kpi.valor}</p>
            <p className="text-sm font-semibold text-gray-700 mt-1">{kpi.label}</p>
            <p className="text-[10px] text-gray-400 mt-0.5 truncate">{kpi.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Columna Principal: Gráficas y Próximos Eventos */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Gráficas de Rendimiento */}
          <div className="animate-in fade-in slide-in-from-bottom duration-700">
             <PanelCharts />
          </div>

          {/* Acciones Rápidas */}
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
              🚀 Acciones Rápidas
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {ACCIONES.map(a => (
                <Link
                  key={a.href}
                  href={a.href}
                  className="flex flex-col items-center gap-3 rounded-xl border border-gray-50 p-4 hover:border-red-200 hover:shadow-md transition-all group"
                >
                  <div className={`w-12 h-12 rounded-xl ${a.color} flex items-center justify-center text-white text-2xl shadow-sm group-hover:scale-110 transition-transform`}>
                    {a.icon}
                  </div>
                  <span className="text-xs font-bold text-gray-600 text-center">{a.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Barra Lateral: Plan Manager y Próximo Evento */}
        <div className="space-y-8">
          
          {/* Módulo de Pagos */}
          <PlanManager />

          {/* Próximo Evento Card */}
          <div className="rounded-xl bg-gradient-to-br from-red-600 to-red-800 p-6 text-white shadow-lg overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="text-9xl rotate-12 inline-block">⚽</span>
            </div>
            <h3 className="text-sm font-bold uppercase tracking-widest opacity-80 mb-4">Próximo Compromiso</h3>
            {proximoPartido ? (
              <>
                <p className="text-2xl font-bold mb-1">vs {proximoPartido.equipo_visitante}</p>
                <div className="flex flex-col gap-1 text-sm opacity-90">
                   <p className="flex items-center gap-2">📅 {new Date(proximoPartido.fecha).toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                   <p className="flex items-center gap-2">📍 {proximoPartido.lugar || 'Sede Principal'}</p>
                </div>
              </>
            ) : (
              <p className="text-sm opacity-80 italic">No hay partidos programados próximamente.</p>
            )}
            <Link 
              href="/dashboard/partidos"
              className="mt-6 block w-full text-center bg-white/20 hover:bg-white/30 py-2 rounded-lg text-sm font-bold transition-colors"
            >
              Ver todos los partidos
            </Link>
          </div>

        </div>

      </div>
    </div>
  )
}
