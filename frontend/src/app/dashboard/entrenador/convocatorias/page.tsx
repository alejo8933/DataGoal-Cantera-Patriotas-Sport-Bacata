import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getPartidosParaConvocatoria, getJugadoresParaConvocatoria } from '@/lib/entrenador/convocatorias'
import ConvocatoriasPanel from '@/components/entrenador/ConvocatoriasPanel'

export default async function ConvocatoriasPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const partidos = await getPartidosParaConvocatoria();
  
  // Si no hay id seleccionado y hay partidos, por defecto seleccionamos el primero (o el más próximo)
  let partidoId = typeof searchParams.partidoId === 'string' ? searchParams.partidoId : "";
  if (!partidoId && partidos.length > 0) {
    partidoId = partidos[0].id;
  }

  const { jugadores, convocadosIds, notas } = await getJugadoresParaConvocatoria(partidoId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
             Gestión de Convocatorias
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Selecciona los jugadores para cada partido</p>
        </div>
      </div>

      <ConvocatoriasPanel 
        partidos={partidos}
        initialPartidoId={partidoId}
        jugadores={jugadores}
        initialConvocados={convocadosIds}
        initialNotas={notas}
      />
    </div>
  )
}
