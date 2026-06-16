import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import PlantillaClient from './PlantillaClient'

export default async function PlantillaPage({ params }: { params: { categoria: string } }) {
  const categoriaStr = decodeURIComponent(params.categoria)

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Obtener el equipo real
  const { data: equipoDB } = await supabase
    .from('rendimiento_equipos')
    .select('*')
    .eq('categoria', categoriaStr)
    .single()

  // Obtener todos los jugadores de esa categoría
  const { data: jugadoresDB } = await supabase
    .from('jugadores')
    .select('*')
    .eq('categoria', categoriaStr)
    .eq('activo', true)

  const jugadores = jugadoresDB || []

  const stats = [
    { label: 'Jugadores', valor: jugadores.length.toString(), sub: 'Total' },
    { label: 'Goles Totales', valor: jugadores.reduce((acc, j) => acc + (j.goles || 0), 0).toString(), sub: 'Total' },
    { label: 'Asistencias Totales', valor: jugadores.reduce((acc, j) => acc + (j.asistencias || 0), 0).toString(), sub: 'Total' },
    { label: 'Disponibles', valor: jugadores.length.toString(), sub: 'Jugadores' }, // Mock para estado
    { label: 'Lesionados', valor: '0', sub: 'Jugadores' },
  ]

  const equipoFormat = {
    nombre: equipoDB ? `Escuela Patriota Sport ${equipoDB.categoria}` : `Categoría ${categoriaStr}`
  }

  return (
    <div className="bg-white min-h-screen rounded-xl shadow-sm border border-gray-100 p-6 sm:p-10">
      {/* Volver */}
      <Link
        href="/dashboard/categorias"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors mb-6 font-medium"
      >
        <ArrowLeft size={16} /> Volver a Categorías
      </Link>

      {/* Título */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{equipoFormat.nombre} — Plantilla</h1>
        <p className="text-base text-gray-500 mt-2">Gestión completa de jugadores y estadísticas</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="rounded-lg border border-gray-200 p-5 text-center bg-gray-50/50">
            <p className="text-2xl font-bold text-gray-900">{s.valor}</p>
            <p className="text-xs text-gray-400 mt-0.5">{s.sub}</p>
            <p className="text-xs font-medium text-gray-600 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Client component para filtros y grid interactivo */}
      <PlantillaClient jugadores={jugadores} />
    </div>
  )
}
