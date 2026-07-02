import { EstadisticasView } from '@/components/features/estadisticas/EstadisticasView'
import {
  obtenerEstadisticasEquipo,
  obtenerGolesPorMes,
  obtenerGoleadores,
} from '@/lib/actions/estadisticas.actions'

export const dynamic = 'force-dynamic'

export default async function EstadisticasPublicPage() {
  try {
    const [rendimientoList, goleadoresList, golesPorMes] = await Promise.all([
      obtenerEstadisticasEquipo(),
      obtenerGoleadores(),
      obtenerGolesPorMes(),
    ])

    return (
      <div className="w-full max-w-7xl mx-auto py-10 px-4 sm:px-6">
        <EstadisticasView
          rendimientoList={rendimientoList}
          goleadoresList={goleadoresList}
          golesPorMes={golesPorMes}
          showAnalisisIndividualLink={false}
        />
      </div>
    )
  } catch (error) {
    console.error('Error cargando estadísticas públicas:', error)
    return (
      <div className="w-full max-w-7xl mx-auto py-10 px-4 sm:px-6">
        <div className="bg-brand-50 text-brand-700 p-6 rounded-xl border border-brand-200">
          <h2 className="text-xl font-bold mb-2">Error al cargar estadísticas</h2>
          <p>
            Ocurrió un problema al intentar obtener los datos. Por favor, intenta de nuevo más
            tarde.
          </p>
        </div>
      </div>
    )
  }
}
