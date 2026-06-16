'use client'

import { Settings, Bell, Search, LogOut } from 'lucide-react'
import Link from 'next/link'
import AdminNotificacionesBadge from '@/components/admin/AdminNotificacionesBadge'

interface AdminHeaderProps {
  userId: string
  email?: string        // ← agregado
  nombre: string
  apellido: string
  rol: string
}

export default function AdminHeader({ userId, email, nombre, apellido, rol }: AdminHeaderProps) {
  const initial = nombre ? nombre.charAt(0).toUpperCase() : 'A'
  const char = apellido ? apellido.charAt(0).toUpperCase() : ''

  return (
    <header className="h-16 border-b border-gray-100 bg-white/80 backdrop-blur-lg sticky top-0 z-50 px-6 flex items-center justify-between">
      
      {/* Logo */}
      <div className="flex flex-col">
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] leading-none mb-0.5">
          Dashboard
        </span>
        <span className="text-sm font-black text-gray-900 tracking-tight flex items-center gap-2">
          Administración
          <span className="h-1.5 w-1.5 rounded-full bg-red-600 animate-pulse" />
        </span>
      </div>

      <div className="flex items-center gap-3">

        {/* Buscador */}
        <div className="relative group hidden lg:block">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-white transition-colors">
            <Search size={15} />
          </div>
          <input
            type="text"
            placeholder="Buscar en DataGoal..."
            className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs text-gray-900 placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-red-500/10 focus:bg-white focus:border-red-500/50 w-64 transition-all"
          />
        </div>

        {/* Notificaciones */}
        <AdminNotificacionesBadge userId={userId} />

        {/* Ajustes */}
        <Link
          href="/dashboard/admin/perfil?tab=preferencias"
          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition group"
        >
          <Settings size={18} className="group-hover:rotate-90 transition-transform duration-500" />
        </Link>

        {/* Separador */}
        <div className="h-6 w-px bg-gray-100 mx-1" />

        {/* Perfil */}
        <Link
          href="/dashboard/admin/perfil"
          className="flex items-center gap-3 px-2 py-1.5 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition group"
        >
          <div className="hidden md:flex flex-col items-end">
            <span className="text-xs font-bold text-gray-900 leading-none group-hover:text-red-700 transition-colors">
              {nombre} {apellido}
            </span>
            {email && (
              <span className="text-[10px] text-gray-400 mt-0.5">{email}</span>
            )}
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1 px-1.5 py-0.5 bg-gray-100 rounded-md">
              {rol || 'ADMIN'}
            </span>
          </div>
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-red-700 to-red-500 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-red-500/20 transition-all group-hover:scale-105 active:scale-95">
            {initial}{char}
          </div>
        </Link>
      </div>
    </header>
  )
}