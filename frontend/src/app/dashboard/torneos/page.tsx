import { obtenerTorneos } from '@/lib/actions/torneos.actions'
import { TorneosView } from '@/components/features/torneos/TorneosView'
import HeaderEntrenador from '@/components/layout/HeaderEntrenador'
import FooterEntrenador from '@/components/layout/FooterEntrenador'

export const dynamic = 'force-dynamic'

export default async function TorneosPage() {
  try {
    const torneos = await obtenerTorneos()

    return (
      <>
        <HeaderEntrenador />
        <main className="min-h-screen bg-gray-50 flex flex-col pt-8 pb-16">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 flex-grow">
            <TorneosView torneos={torneos} />
          </div>
        </main>
        <FooterEntrenador />
      </>
    )
  } catch (error) {
    console.error('Error cargando torneos:', error)
    return (
      <>
        <HeaderEntrenador />
        <main className="min-h-screen bg-gray-50 flex flex-col pt-8 pb-16">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 flex-grow">
            <div className="bg-red-50 text-red-600 p-6 rounded-xl border border-red-200 text-center">
              <h2 className="text-xl font-bold mb-2">Error al cargar datos de torneos</h2>
              <p>Ocurrió un problema al intentar obtener la información de la base de datos.</p>
            </div>
          </div>
        </main>
        <FooterEntrenador />
      </>
    )
  }
}
