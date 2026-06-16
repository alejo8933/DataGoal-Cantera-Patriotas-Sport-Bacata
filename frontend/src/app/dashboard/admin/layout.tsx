import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getUserProfile } from '@/lib/actions/usuarios.actions'
import { ReactNode } from 'react'
import AdminSidebar from '@/components/layout/AdminSidebar'
import AdminHeader from '@/components/layout/AdminHeader'

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Verificar el rol y datos del usuario saltándose RLS si está bloqueado
  const perfil = await getUserProfile(user.id)

  if (!perfil) {
    console.error('[AdminLayout] Perfil not found for user:', user.id)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Perfil no encontrado</h1>
          <p className="text-gray-600 mb-6">Tu cuenta está incompleta o hubo un error al leer tu perfil administrativo.</p>
          <a href="/" className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium inline-block hover:bg-red-700">Ir al inicio</a>
        </div>
      </div>
    )
  }

  if (perfil.rol !== 'admin') {
    // Si no es admin, lo devolvemos a su módulo correspondiente
    redirect(`/dashboard/${perfil.rol}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Fijo de 64 (256px) de ancho */}
      <AdminSidebar />

      {/* Contenedor Principal de la Derecha */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        
        {/* Header superior de Navegación y Perfil */}
        <AdminHeader 
          userId={user.id}
          email={user.email} 
          nombre={perfil.nombre || 'Administrador'} 
          apellido={perfil.apellido || ''} 
          rol={perfil.rol} 
        />

        {/* Contenido principal con padding interno */}
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
