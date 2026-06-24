import { Users, UserCheck, UserX, Shield } from 'lucide-react'
import ModalCrearUsuario from '@/components/features/usuarios/ModalCrearUsuario'
import TablaUsuarios from '@/components/features/usuarios/TablaUsuarios'
import BtnSincronizar from '@/components/features/usuarios/BtnSincronizar'
import { obtenerPerfiles } from '@/lib/actions/usuarios.actions'

export default async function AdminUsuariosPage() {
  const perfiles = await obtenerPerfiles()

  const total = perfiles.length
  const activos = perfiles.filter(p => p.activo).length
  const inactivos = total - activos
  const admins = perfiles.filter(p => p.rol === 'admin').length

  const stats = [
    { name: 'Usuarios Activos', icon: UserCheck, value: activos, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { name: 'Usuarios Inactivos', icon: UserX, value: inactivos, color: 'text-gray-400', bg: 'bg-gray-50' },
    { name: 'Administradores', icon: Shield, value: admins, color: 'text-blue-600', bg: 'bg-blue-50' },
    { name: 'Total Usuarios', icon: Users, value: total, color: 'text-red-600', bg: 'bg-red-50' },
  ]

  return (
    <div className="flex flex-col gap-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex-1">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
            Gestión de Usuarios
          </h1>
          <p className="text-gray-500 font-medium mt-1">Administra usuarios, roles y permisos de acceso al sistema DataGoal.</p>
        </div>
        <div className="flex items-center gap-4">
          <BtnSincronizar />
          <ModalCrearUsuario />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex items-center gap-4 group">
            <div className={`h-12 w-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center transition-transform group-hover:scale-110`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.name}</p>
              <h2 className="text-2xl font-black text-gray-900 leading-none">{stat.value}</h2>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex flex-col gap-1 pr-4">
           <h2 className="text-xl font-bold text-gray-900">Lista de Usuarios</h2>
           <p className="text-sm text-gray-400 font-medium tracking-tight">Gestiona los usuarios y sus roles en el sistema</p>
        </div>

        <TablaUsuarios usuarios={perfiles} />
      </div>

      <div className="space-y-6 pt-10 border-t border-gray-100">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-bold text-gray-900">Roles del Sistema</h2>
          <p className="text-sm text-gray-400 font-medium tracking-tight">Descripción de los roles y permisos disponibles</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:border-red-200 transition-colors">
             <span className="inline-block px-3 py-1 bg-red-50 text-red-600 rounded-lg text-[10px] font-bold uppercase tracking-widest mb-3">Administrador</span>
             <p className="text-sm text-gray-500 font-medium leading-relaxed">Acceso completo a todos los módulos: Usuarios, Finazas, Categorías y Entrenamientos.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:border-blue-200 transition-colors">
             <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-bold uppercase tracking-widest mb-3">Entrenador</span>
             <p className="text-sm text-gray-500 font-medium leading-relaxed">Gestión operativa de categorías, asistencia a entrenamientos y registro de desempeño técnico.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:border-emerald-200 transition-colors">
             <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-bold uppercase tracking-widest mb-3">Jugador</span>
             <p className="text-sm text-gray-500 font-medium leading-relaxed">Acceso a estadísticas individuales, calendario de partidos y historial de pagos personales.</p>
          </div>
        </div>
      </div>

    </div>
  )
}
