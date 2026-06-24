'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Users, 
  ShieldCheck, 
  Trophy, 
  Shield, 
  Calendar, 
  Activity, 
  Settings,
  LogOut,
  LayoutDashboard,
  Wallet,
  Archive,
  HeartPulse,
  LineChart
} from 'lucide-react'
import logoutAction from '@/services/actions/logout'

const ADMIN_LINKS = [
  { name: 'Dashboard', href: '/dashboard/admin', icon: LayoutDashboard },
  { name: 'Usuarios y Roles', href: '/dashboard/admin/usuarios', icon: ShieldCheck },
  { name: 'Categorías', href: '/dashboard/admin/categorias', icon: Shield },
  { name: 'Jugadores', href: '/dashboard/admin/jugadores', icon: Users },
  { name: 'Partidos', href: '/dashboard/admin/partidos', icon: Trophy },
  { name: 'Entrenamientos', href: '/dashboard/admin/entrenamientos', icon: Activity },
  { name: 'Lesiones', href: '/dashboard/admin/lesiones', icon: HeartPulse },
  { name: 'Evaluaciones', href: '/dashboard/admin/evaluacion', icon: LineChart },
  { name: 'Finanzas', href: '/dashboard/admin/finanzas', icon: Wallet },
  { name: 'Archivo del Club', href: '/dashboard/admin/archivo', icon: Archive },
]


export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-white border-r border-gray-100 text-gray-900 flex flex-col h-screen fixed top-0 left-0 shadow-sm">
      {/* BRANDING */}
      <div className="h-16 flex items-center px-6 border-b border-gray-100 shrink-0 bg-white">
        <span className="text-xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center text-xs">DG</div>
          DataGoal
        </span>
      </div>

      {/* NAV LINKS */}
      <div className="flex-1 overflow-y-auto py-6 px-3 flex flex-col gap-1">
        <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          Módulo Administrador
        </p>

        {ADMIN_LINKS.map((link) => {
          const isActive = pathname === link.href
          const Icon = link.icon

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-all ${
                isActive 
                  ? 'bg-red-600 text-white shadow-md shadow-red-500/20 translate-x-1' 
                  : 'text-gray-500 hover:text-red-600 hover:bg-red-50'
              }`}
            >
              <Icon size={18} />
              {link.name}
            </Link>
          )
        })}
      </div>

    </div>
  )
}
