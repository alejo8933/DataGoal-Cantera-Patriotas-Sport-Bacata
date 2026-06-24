import { EstadisticasView } from '@/components/features/estadisticas/EstadisticasView'
import HeaderEntrenador from '@/components/layout/HeaderEntrenador'
import FooterEntrenador from '@/components/layout/FooterEntrenador'
import {
  obtenerEstadisticasEquipo,
  obtenerGolesPorMes,
  obtenerGoleadores,
} from '@/lib/actions/estadisticas.actions'

export const dynamic = 'force-dynamic'

export default async function EstadisticasPage() {
  try {
    const [rendimientoList, goleadoresList, golesPorMes] = await Promise.all([
      obtenerEstadisticasEquipo(),
      obtenerGoleadores(),
      obtenerGolesPorMes(),
    ])

    return (
      <>
        <HeaderEntrenador />
        <main className="min-h-screen bg-gray-50 flex flex-col justify-between">
          <div className="w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 flex-grow">
            <EstadisticasView 
              rendimientoList={rendimientoList} 
              goleadoresList={goleadoresList}
              golesPorMes={golesPorMes}
            />
          </div>
          <FooterEntrenador />
        </main>
      </>
    )
  } catch (error) {
    console.error('Error cargando estadísticas:', error)
    return (
      <>
        <HeaderEntrenador />
        <main className="min-h-screen bg-gray-50 flex flex-col justify-between">
          <div className="w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 flex-grow">
            <div className="bg-red-50 text-red-600 p-6 rounded-xl border border-red-200">
              <h2 className="text-xl font-bold mb-2">Error al cargar estadísticas</h2>
              <p>Ocurrió un problema al intentar obtener los datos. Por favor, intenta de nuevo más tarde o verifica tu conexión a la base de datos.</p>
            </div>
          </div>
          <FooterEntrenador />
        </main>
      </>
    )
  }
}
