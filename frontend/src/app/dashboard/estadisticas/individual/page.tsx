import { obtenerEstadisticasJugadores } from '@/lib/actions/estadisticas.actions'
import { AnalisisIndividualView } from '@/components/features/estadisticas/AnalisisIndividualView'
import HeaderEntrenador from '@/components/layout/HeaderEntrenador'
import FooterEntrenador from '@/components/layout/FooterEntrenador'

export const dynamic = 'force-dynamic'

export default async function AnalisisIndividualPage() {
  try {
    const estadisticas = await obtenerEstadisticasJugadores({ soloActivos: true })

    const categoriasDisponibles = Array.from(
      new Set(estadisticas.map((j) => j.categoria))
    ).filter(Boolean) as string[]

    return (
      <>
        <HeaderEntrenador />
        <main className="min-h-screen bg-gray-50 flex flex-col justify-between">
          <div className="w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 flex-grow">
            <AnalisisIndividualView
              estadisticas={estadisticas}
              categoriasDisponibles={categoriasDisponibles}
            />
          </div>
          <FooterEntrenador />
        </main>
      </>
    )
  } catch (error) {
    console.error('Error cargando análisis individual:', error)
    return (
      <>
        <HeaderEntrenador />
        <main className="min-h-screen bg-gray-50 flex flex-col justify-between">
          <div className="w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 flex-grow">
            <div className="bg-red-50 text-red-600 p-6 rounded-xl border border-red-200">
              <h2 className="text-xl font-bold mb-2">Error al cargar datos de jugadores</h2>
              <p>
                Ocurrió un problema al intentar obtener la información. Verifica la conexión a la
                base de datos.
              </p>
            </div>
          </div>
          <FooterEntrenador />
        </main>
      </>
    )
  }
}
