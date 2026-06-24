import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getLesiones, getJugadoresParaLesiones } from '@/lib/entrenador/lesiones'
import LesionesPanel from '@/components/entrenador/LesionesPanel'

export default async function LesionesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const lesiones = (await getLesiones()) as any[]
  const jugadores = await getJugadoresParaLesiones()

  return <LesionesPanel lesiones={lesiones as any} jugadores={jugadores as any} />
}
