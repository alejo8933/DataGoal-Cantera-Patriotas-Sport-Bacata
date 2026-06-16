import { redirect } from 'next/navigation'
import { obtenerMisEstadisticasJugador } from '@/lib/actions/estadisticas.actions'
import { JugadorEstadisticasView } from '@/components/features/estadisticas/JugadorEstadisticasView'

export const dynamic = 'force-dynamic'

export default async function JugadorEstadisticasPage() {
  const { autenticado, estadistica } = await obtenerMisEstadisticasJugador()

  if (!autenticado) {
    redirect('/login')
  }

  return <JugadorEstadisticasView estadistica={estadistica} />
}
