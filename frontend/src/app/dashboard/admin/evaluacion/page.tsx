import { getEvaluacionesReporte } from '@/lib/entrenador/evaluacion'
import EvaluacionPanel from '@/components/entrenador/EvaluacionPanel'

export default async function AdminEvaluacionPage() {
  const data = await getEvaluacionesReporte();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            📊 Evaluación General de Jugadores
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Visión administrativa del rendimiento y desarrollo del club</p>
        </div>
      </div>

      <EvaluacionPanel
        jugadores={data.jugadores}
        globals={data.globals}
      />
    </div>
  )
}
