import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { obtenerPartidoPorId, obtenerEventosPartido } from '@/lib/actions/partidos.actions'
import ResumenClient from './ResumenClient'

export default async function PartidoResumenPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Obtener partido
  const partido = await obtenerPartidoPorId(id)

  if (!partido) {
    return (
      <div className="min-h-screen p-10 flex flex-col items-center">
         <h1 className="text-2xl font-bold">Partido no encontrado</h1>
         <Link href="/dashboard/partidos" className="mt-4 text-red-600 hover:underline">Volver a partidos</Link>
      </div>
    )
  }

  // Obtener eventos
  const eventos = await obtenerEventosPartido(id)

  const isFinalizado = partido.estado && (partido.estado.toLowerCase() === 'jugado' || partido.estado.toLowerCase() === 'finalizado')

  return (
    <div className="bg-white min-h-screen rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="mx-auto max-w-5xl px-6 py-8">
        
        {/* Breadcrumb */}
        <Link
          href="/dashboard/partidos"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-6 font-medium"
        >
          <ArrowLeft size={16} /> Volver a Partidos
        </Link>
        
        {/* Cabecera del Partido */}
        <div className="mb-8 relative border-b border-gray-100 pb-8 flex flex-col items-center justify-center">
          
          <div className="absolute top-0 right-0">
             <span className={`text-xs font-bold px-3 py-1 rounded-full border ${isFinalizado ? 'bg-green-50 text-green-700 border-green-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                {isFinalizado ? 'Finalizado' : 'Próximo'}
             </span>
          </div>

          <div className="flex items-center justify-center gap-6 mt-4 w-full">
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 flex-1 text-right leading-tight">
               {partido.equipo_local}
            </h1>
            
            <div className="shrink-0 flex items-center justify-center gap-4 bg-gray-50 px-6 py-3 rounded-2xl border border-gray-200 shadow-sm">
               {isFinalizado ? (
                  <>
                     <span className="text-4xl font-black text-gray-900">{partido.goles_local ?? 0}</span>
                     <span className="text-xl font-bold text-gray-300">-</span>
                     <span className="text-4xl font-black text-gray-900">{partido.goles_visitante ?? 0}</span>
                  </>
               ) : (
                  <span className="text-2xl font-black text-gray-400">VS</span>
               )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 flex-1 text-left leading-tight">
               {partido.equipo_visitante}
            </h1>
          </div>

          <p className="text-gray-500 mt-5 font-medium text-sm flex items-center gap-2 flex-wrap justify-center">
            <span>{new Date(partido.fecha).toLocaleDateString()} a las {partido.hora || '00:00'}</span>
            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
            <span>{partido.lugar || 'Por definir lugar'}</span>
            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
            <span>{partido.torneo || 'Liga de Bogotá'}</span>
          </p>
        </div>

        {/* Cliente interactivo de pestañas y TL */}
        <ResumenClient partido={partido} eventos={eventos} />

      </div>
    </div>
  )
}
