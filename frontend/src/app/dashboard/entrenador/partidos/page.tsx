import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { obtenerPartidos, obtenerEventosPartido } from '@/lib/actions/partidos.actions'
import { obtenerJugadoresActivos } from '@/lib/actions/jugadores.actions'
import EventosPartidoPanel from '@/components/entrenador/EventosPartidoPanel'

export default async function PartidosEntrenadorPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const partidos = await obtenerPartidos();
  
  if (partidos.length === 0) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <div className="text-center py-16 text-gray-500">
           <p className="text-4xl mb-3">⚽</p>
           <p className="text-lg text-gray-400">No hay partidos registrados</p>
        </div>
      </div>
    );
  }

  let partidoId = typeof searchParams.partidoId === 'string' ? searchParams.partidoId : "";
  if (!partidoId && partidos.length > 0) {
    partidoId = partidos[0].id;
  }

  const eventos = await obtenerEventosPartido(partidoId);
  const jugadores = await obtenerJugadoresActivos();

  return (
    <div className="space-y-6">
      <EventosPartidoPanel 
        partidos={partidos as any}
        partidoId={partidoId}
        eventos={eventos as any}
        jugadores={jugadores as any}
      />
    </div>
  )
}