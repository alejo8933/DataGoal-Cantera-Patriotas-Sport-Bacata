'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

const NAV_LINKS = [
  { href: '/', label: 'Inicio' },
  { href: '/categorias', label: 'Categorías' },
  { href: '/partidos', label: 'Partidos' },
  { href: '/entrenamientos', label: 'Entrenamientos' },
  { href: '/estadisticas', label: 'Estadísticas' },
  { href: '/torneos', label: 'Torneos' },
]

export default function Header() {
  const pathname = usePathname()

  return (
    <header
      className="sticky top-0 z-50 shadow-[0_4px_20px_rgba(0,0,0,0.2)] backdrop-blur-md"
      style={{ backgroundColor: 'rgba(220, 38, 38, 0.82)' }}
    >
      <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-white/50 to-transparent" />

      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl overflow-hidden bg-white shadow-sm flex items-center justify-center p-1">
            <Image
              src="/logodata.png"
              alt="DataGoal Logo"
              width={40}
              height={40}
              className="w-full h-full object-contain"
              priority
            />
          </div>
          <div className="hidden h-8 w-px bg-white/30 sm:block" />
          <div className="hidden sm:flex flex-col">
            <span className="text-base font-bold text-white leading-tight">DataGoal</span>
            <span className="text-xs text-white/70 leading-tight">Escuela Patriota Sport Bacatá</span>
          </div>
        </div>

        {/* Nav (Eliminado a petición del usuario, solo quedan los botones) */}
        <nav className="hidden items-center gap-0.5 md:flex">
          {/* Espacio vacío para mantener la distribución si se requiere flex-between */}
        </nav>

        {/* Sin sesión */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/login"
            className="rounded-lg border border-white/40 px-4 py-2.5 text-sm font-medium text-white transition-all duration-150 hover:border-white/70 hover:bg-white/10"
          >
            Iniciar Sesión
          </Link>
          <Link
            href="/registro"
            className="rounded-lg bg-white px-4 py-2.5 text-sm font-bold text-red-600 shadow-sm transition-all duration-150 hover:bg-red-50 hover:shadow-md"
          >
            Registro
          </Link>
        </div>

      </div>
    </header>
  )
}