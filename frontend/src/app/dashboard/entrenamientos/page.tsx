import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import EntrenamientosPanel from '@/components/entrenador/EntrenamientosPanel'
import { obtenerEntrenamientosDashboard, obtenerJugadoresRegistradosCount } from '@/lib/actions/entrenamientos.actions'

export default async function EntrenamientosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { entrenamientos, asistencias } = await obtenerEntrenamientosDashboard();
  const totalJugadores = await obtenerJugadoresRegistradosCount();

  return (
    <EntrenamientosPanel 
       entrenamientos={entrenamientos as any} 
       asistencias={asistencias as any} 
       totalJugadores={totalJugadores} 
    />
  )
}
