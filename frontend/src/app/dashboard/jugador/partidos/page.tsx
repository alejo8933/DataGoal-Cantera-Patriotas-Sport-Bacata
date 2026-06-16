'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface Match {
  id: string
  equipo_local: string
  equipo_visitante: string
  fecha: string
  hora: string
  lugar: string
  goles_local?: number
  goles_visitante?: number
  estado: 'programado' | 'finalizado' | 'cancelado' | 'en_curso'
  categoria: string
  torneos?: {
    nombre: string
  }
}

export default function JugadorPartidosPage() {
  const supabase = createClient()
  const router = useRouter()
  
  const [activeTab, setActiveTab] = useState<'proximos' | 'recientes'>('proximos')
  const [loading, setLoading] = useState(true)
  const [partidos, setPartidos] = useState<Match[]>([])
  const [categoriaUser, setCategoriaUser] = useState('')

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      // Obtener info del jugador
      const { data: jugadorInfo } = await supabase
        .from('jugadores')
        .select('id, categoria')
        .eq('user_id', user.id)
        .maybeSingle()

      const cat = jugadorInfo?.categoria || 'General'
      setCategoriaUser(cat)

      // Obtener partidos con información de torneos (JOIN)
      const { data, error } = await supabase
        .from('partidos')
        .select('*, torneos(nombre)')
        .eq('categoria', cat)
        .order('fecha', { ascending: activeTab === 'proximos' })

      if (data) setPartidos(data as any)
      setLoading(false)
    }

    loadData()
  }, [activeTab])

  const proximos = partidos.filter(p => new Date(p.fecha) >= new Date())
  const recientes = partidos.filter(p => new Date(p.fecha) < new Date())
  
  const displayMatches = activeTab === 'proximos' ? proximos : recientes

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header de la Página */}
      <div className="bg-white border-b border-gray-100 py-12 text-center animate-in fade-in duration-700">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Partidos</h1>
        <p className="mt-4 max-w-2xl mx-auto text-gray-500 text-sm px-6">
          Mantente al día con todos los partidos de Escuela Patriota Sport Bacatá en los torneos de Bogotá. 
          Resultados y próximos encuentros de todas las categorías.
        </p>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-10 space-y-8">
        
        {/* Sistema de Pestañas (Tabs) */}
        <div className="flex bg-white/50 p-1 rounded-2xl border border-gray-100 max-w-4xl mx-auto backdrop-blur-sm shadow-sm font-semibold">
          <button
            onClick={() => setActiveTab('proximos')}
            className={`flex-1 py-3 px-6 rounded-xl transition-all duration-300 ${
              activeTab === 'proximos' 
                ? 'bg-white text-gray-900 shadow-lg scale-[1.02] border border-gray-100' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            Próximos Partidos
          </button>
          <button
            onClick={() => setActiveTab('recientes')}
            className={`flex-1 py-3 px-6 rounded-xl transition-all duration-300 ${
              activeTab === 'recientes' 
                ? 'bg-white text-gray-900 shadow-lg scale-[1.02] border border-gray-100' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            Resultados Recientes
          </button>
        </div>

        {/* Grid de Partidos */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-gray-100 rounded-3xl border border-gray-100" />
            ))}
          </div>
        ) : displayMatches.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-5xl mb-6 opacity-30">🏟️</p>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">No hay partidos en esta categoría</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayMatches.map((p) => (
              <div key={p.id} className="relative group overflow-hidden rounded-3xl border border-gray-100 bg-white p-8 shadow-sm hover:shadow-xl transition-all hover:-translate-y-2">
                
                {/* Top Info Bar */}
                <div className="flex items-center justify-between mb-8">
                   <span className="text-[10px] font-black uppercase tracking-[0.1em] text-gray-500 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">
                     {p.torneos?.nombre || 'Torneo Local'}
                   </span>
                   <div className="flex gap-2">
                      <span className="text-[10px] font-black uppercase bg-purple-100 text-purple-700 px-2.5 py-1 rounded-lg">
                        {p.categoria}
                      </span>
                      <span className="text-[10px] font-black uppercase bg-blue-100 text-blue-700 px-2.5 py-1 rounded-lg">
                        {activeTab === 'proximos' ? 'Próximo' : 'Finalizado'}
                      </span>
                   </div>
                </div>

                {/* Match Center */}
                <div className="flex items-center justify-between gap-4 mb-8">
                   <div className="flex-1 text-center">
                      <p className="text-sm font-black text-gray-800 leading-tight min-h-[40px] flex items-center justify-center">{p.equipo_local}</p>
                   </div>
                   <div className="text-xl font-black text-gray-300 italic">VS</div>
                   <div className="flex-1 text-center">
                      <p className="text-sm font-black text-gray-800 leading-tight min-h-[40px] flex items-center justify-center">{p.equipo_visitante}</p>
                   </div>
                </div>

                {/* Match Details with Icons */}
                <div className="space-y-4 mb-8">
                   <div className="flex items-center gap-3 text-gray-500">
                      <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center shadow-sm">📅</div>
                      <span className="text-xs font-bold">{new Date(p.fecha).toLocaleDateString('es-CO', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-')}</span>
                   </div>
                   <div className="flex items-center gap-3 text-gray-500">
                      <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center shadow-sm">🕒</div>
                      <span className="text-xs font-bold">{p.hora || '15:00'}</span>
                   </div>
                   <div className="flex items-center gap-3 text-gray-500">
                      <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center shadow-sm">📍</div>
                      <span className="text-xs font-bold truncate max-w-[200px]">{p.lugar || 'Sede Principal'}</span>
                   </div>
                </div>

                {/* Action Button */}
                <button className="w-full py-4 border-2 border-gray-50 rounded-2xl text-xs font-black text-gray-700 hover:bg-gray-50 hover:border-gray-100 hover:scale-[0.98] transition-all flex items-center justify-center gap-2">
                   Ver Detalles
                   <span className="text-red-500">›</span>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Cancha Principal Footer */}
        <div className="mt-20 rounded-[40px] border border-gray-100 bg-white p-12 shadow-sm animate-in fade-in slide-in-from-bottom duration-1000">
           <div className="flex items-center gap-3 mb-10">
              <span className="text-2xl">📍</span>
              <h2 className="text-2xl font-black text-gray-900 italic tracking-tight uppercase">Cancha Principal — Parque Timiza</h2>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="space-y-4">
                 <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Información General</h3>
                 <p className="text-sm font-bold text-gray-700">Ubicación: Kennedy, Bogotá D.C.</p>
                 <p className="text-sm font-medium text-gray-400">Excelente complejo deportivo con grama sintética certificada.</p>
              </div>
              <div className="space-y-4 border-l border-gray-50 pl-12">
                 <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Capacidad</h3>
                 <p className="text-sm font-bold text-gray-700">👥 300 espectadores</p>
                 <p className="text-xs font-medium text-gray-400">Gradas laterales techadas</p>
              </div>
              <div className="space-y-4 border-l border-gray-50 pl-12">
                 <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Servicios</h3>
                 <ul className="text-sm font-bold text-gray-700 space-y-1">
                    <li>• Camerinos</li>
                    <li>• Cafetería</li>
                    <li>• Parqueadero</li>
                 </ul>
              </div>
           </div>
        </div>

      </div>
    </div>
  )
}
