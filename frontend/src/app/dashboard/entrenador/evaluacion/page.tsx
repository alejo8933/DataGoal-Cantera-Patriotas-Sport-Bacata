import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getEvaluacionesReporte } from '@/lib/entrenador/evaluacion'
import EvaluacionPanel from '@/components/entrenador/EvaluacionPanel'

export default async function EvaluacionPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const data = await getEvaluacionesReporte();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            📊 Evaluación de Jugadores
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Seguimiento del rendimiento individual y desarrollo</p>
        </div>
      </div>

      <EvaluacionPanel
        jugadores={data.jugadores}
        globals={data.globals}
      />
    </div>
  )
}
