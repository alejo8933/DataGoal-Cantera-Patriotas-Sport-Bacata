import { UserCircle, Shield } from 'lucide-react'
import Link from 'next/link'
import ActualizarPerfilForm from '@/components/features/perfil/ActualizarPerfilForm'
import { obtenerPerfilActual } from '@/lib/actions/usuarios.actions'

export default async function PerfilPage() {
  const perfil = await obtenerPerfilActual()

  if (!perfil) {
    return (
      <div className="p-8 text-center bg-white rounded-3xl border border-red-100 mt-10">
        <p className="text-red-500 font-bold">Error al cargar la información de tu perfil.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-12">
      
      <div className="relative bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="h-24 w-full bg-gradient-to-r from-red-600 to-red-500"></div>
        
        <div className="px-8 pb-8 -mt-12 flex flex-col md:flex-row items-end gap-6 relative z-10">
          <div className="h-32 w-32 rounded-3xl bg-white p-1.5 shadow-lg border border-gray-50">
            <div className="h-full w-full rounded-2xl bg-gray-50 flex items-center justify-center text-red-600 border border-gray-100">
               <UserCircle size={64} />
            </div>
          </div>
          
          <div className="flex-1 pb-2">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                {perfil.nombre} {perfil.apellido}
              </h1>
              <span className="px-2.5 py-0.5 bg-red-100 text-red-700 rounded-md text-[10px] font-bold uppercase tracking-wider">
                {perfil.rol}
              </span>
            </div>
            <p className="text-gray-500 font-medium text-sm">
              Panel de Administración Personal
            </p>
          </div>

          <div className="pb-2 flex flex-col gap-2 items-end">
             <div className="px-4 py-2 bg-gray-50 rounded-xl border border-gray-100 w-full">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">ID Usuario</p>
                <p className="text-xs font-mono text-gray-600">{perfil.id.substring(0, 8)}...</p>
             </div>
             <Link 
               href="/dashboard/admin/perfil/seguridad"
               className="flex items-center gap-2 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl border border-indigo-100 transition-all font-bold text-xs"
             >
               <Shield size={14} />
               Seguridad de la Matriz
             </Link>
          </div>
        </div>
      </div>

      <div className="mt-2">
         <ActualizarPerfilForm perfil={{
           nombre: perfil.nombre,
           apellido: perfil.apellido,
           email: perfil.email,
           telefono: perfil.telefono,
           genero: perfil.genero,
           documento: perfil.documento,
           fecha_nacimiento: perfil.fechaNacimiento,
           rol: perfil.rol,
         }} />
      </div>

    </div>
  )
}
