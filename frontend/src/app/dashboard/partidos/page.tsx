import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { obtenerPartidos } from '@/lib/actions/partidos.actions'
import PartidosClient from './PartidosClient'

export default async function PartidosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Obtener partidos ordenados del más reciente o próximo al más antiguo
  const partidos = await obtenerPartidos().catch(() => [])

  return (
    <div className="bg-white min-h-screen rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Partidos</h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-sm">
            Mantente al día con todos los partidos de Escuela Patriota Sport Bacatá en los torneos de
            Bogotá. Resultados y próximos encuentros de todas las categorías.
          </p>
        </div>

        <PartidosClient partidos={partidos} />
        
      </div>
    </div>
  )
}
