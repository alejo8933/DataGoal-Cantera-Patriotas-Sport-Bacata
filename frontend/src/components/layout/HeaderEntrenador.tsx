'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

// ✅ Corregido: ahora apuntan a las rutas del dashboard
const NAV_LINKS = [
  { href: '/dashboard/categorias',              label: 'Categorías'      },
  { href: '/dashboard/partidos',                label: 'Partidos'        },
  { href: '/dashboard/entrenamientos',          label: 'Entrenamientos'  },
  { href: '/dashboard/estadisticas',            label: 'Estadísticas'    },
  { href: '/dashboard/torneos',                 label: 'Torneos'         },
  { href: '/dashboard/entrenador/notificaciones', label: 'Notificaciones' },
]

// ✅ Corregido: todas las rutas del dropdown son correctas
const DROPDOWN_ENTRENADOR = [
  { href: '/dashboard/entrenador',                    label: 'Panel Entrenador'    },
  { href: '/dashboard/entrenador/partidos',           label: 'Eventos de Partidos' },
  { href: '/dashboard/entrenador/asistencias',        label: 'Asistencias'         },
  { href: '/dashboard/entrenador/convocatorias',      label: 'Convocatorias'       },
  { href: '/dashboard/entrenador/evaluacion',         label: 'Evaluación Jugadores'},
  { href: '/dashboard/entrenador/lesiones',           label: 'Lesiones'            },
]

export default function HeaderEntrenador() {
  const pathname  = usePathname()
  const router    = useRouter()
  const supabase  = createClient()
  const [nombre,  setNombre]  = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const user = data.user
      if (!user) { router.push('/login'); return }
      setNombre(
        user.user_metadata?.full_name ??
        user.email?.split('@')[0]     ??
        'Entrenador'
      )
      setLoading(false)
    })
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  // Helper: link activo
  const isActive = (href: string) =>
    href === '/dashboard/entrenador'
      ? pathname === href              // exacto para el inicio
      : pathname.startsWith(href)

  return (
    <header
      className="sticky top-0 z-50 shadow-[0_4px_20px_rgba(0,0,0,0.25)] backdrop-blur-md"
      style={{ backgroundColor: 'rgba(220, 38, 38, 0.95)' }}
    >
      {/* Línea decorativa superior */}
      <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-white/50 to-transparent" />

      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <Link href="/dashboard/entrenador" className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl overflow-hidden bg-white shadow-sm flex items-center justify-center p-1">
              <Image
                src="/logodata.png"
                alt="DataGoal Logo"
                width={36}
                height={36}
                className="w-full h-full object-contain"
                priority
              />
            </div>
            <div className="hidden h-8 w-px bg-white/30 sm:block" />
            <div className="hidden sm:flex flex-col">
              <span className="text-sm font-bold text-white leading-tight">DataGoal</span>
              <span className="text-xs text-white/70 leading-tight">Escuela Patriota Sport Bacatá</span>
            </div>
          </Link>
        </div>

        {/* Nav principal */}
        <nav className="hidden items-center gap-0.5 md:flex">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-all duration-150 ${
                isActive(href)
                  ? 'bg-white text-red-600 shadow-sm'
                  : 'text-white/90 hover:bg-white/15 hover:text-white'
              }`}
            >
              {label}
            </Link>
          ))}

          {/* Dropdown Entrenador */}
          <div className="relative group">
            <Link
              href="/dashboard/entrenador"
              className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition-all duration-150 ${
                pathname.startsWith('/dashboard/entrenador')
                  ? 'bg-white text-red-600 shadow-sm'
                  : 'text-white/90 hover:bg-white/15 hover:text-white'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Entrenador
              <svg
                className="w-3.5 h-3.5 transition-transform duration-150 group-hover:rotate-180"
                fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </Link>

            {/* Menú desplegable */}
            <div className="absolute left-0 mt-1 w-52 rounded-xl border border-gray-100 bg-white shadow-lg overflow-hidden z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <div className="py-1">
                {DROPDOWN_ENTRENADOR.map(({ href, label }) => (
                  <Link
                    key={label}
                    href={href}
                    className={`block px-4 py-2 text-sm transition-colors duration-100 ${
                      pathname === href
                        ? 'bg-red-50 text-red-600 font-medium'
                        : 'text-gray-700 hover:bg-red-50 hover:text-red-600'
                    }`}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </nav>

        {/* Usuario + Cerrar Sesión */}
        <div className="flex items-center gap-3">
          {!loading && (
            <div className="hidden sm:flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1.5">
              <svg className="w-4 h-4 text-white/80" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <div className="flex flex-col leading-tight">
                <span className="text-xs font-semibold text-white">{nombre}</span>
                <span className="text-[10px] text-white/60">Entrenador</span>
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-lg bg-white/15 px-3 py-2 text-sm font-semibold text-white transition-all duration-150 hover:bg-white hover:text-red-600 hover:shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Cerrar Sesión
          </button>
        </div>

      </div>
    </header>
  )
}
