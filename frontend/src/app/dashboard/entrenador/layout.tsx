import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getUserProfile } from '@/lib/actions/usuarios.actions'
import HeaderEntrenador from '@/components/layout/HeaderEntrenador'
import FooterEntrenador from '@/components/layout/FooterEntrenador'

export default async function EntrenadorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Verificar rol en tabla perfiles saltando RLS
  const perfil = await getUserProfile(user.id)

  if (perfil?.rol !== 'entrenador') redirect('/no-autorizado')

  return (
    <>
      <HeaderEntrenador />
      <main className="min-h-screen bg-gray-50 flex flex-col justify-between">
        <div className="mx-auto w-full max-w-7xl flex-grow px-6 py-8">
          {children}
        </div>
        <FooterEntrenador />
      </main>
    </>
  )
}