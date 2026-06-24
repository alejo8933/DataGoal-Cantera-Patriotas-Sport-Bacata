// src/app/dashboard/admin/page.tsx

import { createClient } from '@/lib/supabase/server'
import { Users, Shield, Trophy, Activity, TrendingUp, Calendar, Bell, MapPin, LineChart as ChartIcon } from 'lucide-react'
import Link from 'next/link'
import ActivityFeed from '@/components/admin/ActivityFeed'
import AnalyticsChart from '@/components/admin/AnalyticsChart'
import { contarPerfiles } from '@/lib/actions/usuarios.actions'

export default async function AdminDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [perfilesCount, jugadoresRes, partidosRes, entrenamientosRes, torneosRes, lesionesRes, notificacionesRes, partidosAnaliticaRes] =
    await Promise.all([
      contarPerfiles(),
      supabase.from('jugadores').select('*', { count: 'exact', head: true }),
      supabase.from('partidos').select('*', { count: 'exact', head: true }),
      supabase.from('entrenamientos').select('*', { count: 'exact', head: true }),
      supabase.from('torneos').select('*', { count: 'exact', head: true }),
      supabase.from('lesiones').select('*', { count: 'exact', head: true }),
      supabase.from('notificaciones')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(10),
      supabase.from('partidos')
        .select('id, goles_local, goles_visitante, equipo_local, equipo_visitante')
        .eq('estado', 'Finalizado')
        .order('fecha', { ascending: false })
        .limit(6)
    ])

  // Formatear datos para el gráfico
  const chartData = (partidosAnaliticaRes.data || []).reverse().map((p, i) => ({
    name: `P${i + 1}`,
    favor: p.goles_local || 0,
    contra: p.goles_visitante || 0,
  }))


  // Jugadores activos
  const { count: jugadoresActivos } = await supabase
    .from('jugadores')
    .select('*', { count: 'exact', head: true })
    .eq('activo', true)

  // Próximos partidos
  const { data: proximosPartidos } = await supabase
    .from('partidos')
    .select('equipo_local, equipo_visitante, fecha, hora, lugar')
    .eq('estado', 'Programado')
    .order('fecha', { ascending: true })
    .limit(3)

  const stats = [
    {
      title: 'Usuarios Registrados',
      value: perfilesCount,
      icon: Users,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
      href: '/dashboard/admin/usuarios'
    },
    {
      title: 'Jugadores Activos',
      value: jugadoresActivos ?? 0,
      total: jugadoresRes.count ?? 0,
      icon: Shield,
      color: 'text-green-400',
      bg: 'bg-green-500/10',
      border: 'border-green-500/20',
      href: '/dashboard/admin/jugadores'
    },
    {
      title: 'Partidos Registrados',
      value: partidosRes.count ?? 0,
      icon: Trophy,
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/20',
      href: '/dashboard/admin/partidos'
    },
    {
      title: 'Entrenamientos',
      value: entrenamientosRes.count ?? 0,
      icon: Activity,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20',
      href: '/dashboard/admin/entrenamientos'
    },
    {
      title: 'Torneos',
      value: torneosRes.count ?? 0,
      icon: TrendingUp,
      color: 'text-orange-400',
      bg: 'bg-orange-500/10',
      border: 'border-orange-500/20',
      href: '/dashboard/admin/archivo'
    },
    {
      title: 'Lesiones Activas',
      value: lesionesRes.count ?? 0,
      icon: Calendar,
      color: 'text-red-400',
      bg: 'bg-red-500/10',
      border: 'border-red-500/20',
      href: '/dashboard/admin/lesiones'
    },
  ]

  return (
    <div className="flex flex-col gap-8 w-full animate-in fade-in slide-in-from-bottom-4 duration-500 p-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Panel Administrativo
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Resumen general del estado del club
          </p>
        </div>
        <span className="text-xs font-bold text-white bg-red-600 px-4 py-2 rounded-full shadow-lg shadow-red-500/20">
          Admin
        </span>
      </div>


      <div className="h-px w-full bg-slate-100 dark:bg-slate-800" />

      {/* Grid de estadísticas básicas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((item, index) => {
          const Icon = item.icon
          return (
            <Link
              key={index}
              href={item.href}
              className={`bg-white border text-gray-900 border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${item.bg} group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={item.color} size={24} />
                </div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                  Gestionar →
                </div>
              </div>
              <h3 className="text-4xl font-black text-gray-900 mb-1 tracking-tight">
                {item.value}
                {'total' in item && (
                  <span className="text-lg font-medium text-gray-400 ml-1">
                    / {item.total}
                  </span>
                )}
              </h3>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{item.title}</p>
            </Link>
          )
        })}
      </div>

      {/* Nueva Sección: Actividad y Analítica */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Gráfico de Analitica (Nuevo) */}
        <div className="lg:col-span-2">
           <AnalyticsChart data={chartData} />
        </div>

        {/* Actividad de Entrenadores */}
        <div className="lg:col-span-1">
          <ActivityFeed notifications={notificacionesRes.data || []} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Próximos partidos (Ahora ocupa todo el ancho o se ajusta) */}
        <div className="lg:col-span-3 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Trophy size={20} className="text-yellow-500" />
            Próximos Partidos
          </h2>

          {!proximosPartidos || proximosPartidos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <Calendar className="text-gray-300" size={24} />
              </div>
              <p className="text-gray-400 text-sm font-medium">
                No hay partidos programados
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {proximosPartidos.map((partido, i) => (
                <div
                  key={i}
                  className="flex flex-col gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-gray-900 text-sm font-bold">
                      {partido.equipo_local} <span className="text-red-500 mx-1">vs</span> {partido.equipo_visitante}
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-medium text-gray-500 uppercase tracking-widest">
                    <span className="flex items-center gap-1"><MapPin size={12} /> {partido.lugar}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-gray-200/50">
                    <span className="text-xs font-bold text-gray-700">{partido.fecha}</span>
                    <span className="text-xs font-bold text-red-600">{partido.hora}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  )
}

