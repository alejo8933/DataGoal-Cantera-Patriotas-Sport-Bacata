import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getUserProfile } from '@/lib/actions/usuarios.actions'

export default async function DashboardIndex() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const perfil = await getUserProfile(user.id)

  if (perfil?.rol) {
    redirect(`/dashboard/${perfil.rol}`)
  } else {
    // Si no tiene rol (fallback de seguridad)
    console.error('[DashboardIndex] Perfil or rol not found for user:', user.id)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Perfil no asignado</h1>
          <p className="text-gray-600 mb-6">Tu cuenta no tiene un rol o perfil válido en el sistema.</p>
          <a href="/" className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium inline-block hover:bg-red-700">Ir al inicio</a>
        </div>
      </div>
    )
  }
}
