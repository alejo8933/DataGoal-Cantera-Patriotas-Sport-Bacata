import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getUserProfile } from '@/lib/actions/usuarios.actions'
import { ReactNode } from 'react'
import HeaderJugador from '@/components/layout/HeaderJugador'

export default async function JugadorLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const perfil = await getUserProfile(user.id)

  if (!perfil) {
    console.error('[JugadorLayout] Perfil not found for user:', user.id)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Perfil no encontrado</h1>
          <p className="text-gray-600 mb-6">Tu cuenta está incompleta o hubo un error al leer tu perfil.</p>
          <a href="/" className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium inline-block hover:bg-red-700">Ir al inicio</a>
        </div>
      </div>
    )
  }

  if (perfil.rol !== 'jugador') {
    redirect(`/dashboard/${perfil.rol}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderJugador />
      <main className="container mx-auto">
        {children}
      </main>
    </div>
  )
}
