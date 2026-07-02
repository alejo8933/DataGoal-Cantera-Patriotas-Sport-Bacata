'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

const NAV_LINKS = [
  { href: '/', label: 'Inicio' },
  { href: '/partidos', label: 'Partidos' },
  { href: '/torneos', label: 'Torneos' },
]

export default function Header() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-brand-700 via-brand-600 to-brand-700 shadow-[0_4px_24px_-8px_rgba(89,16,25,0.5)]">
      <div className="h-[3px] w-full bg-carbon-950/40" />

      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo — protagonista de la cabecera */}
        <Link href="/" className="flex items-center gap-3.5 shrink-0">
          <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-white p-1.5 shadow-[0_8px_20px_-6px_rgba(0,0,0,0.35)]">
            <Image
              src="/logodata.png"
              alt="DataGoal Logo"
              width={56}
              height={56}
              className="h-full w-full object-contain"
              priority
            />
          </div>
          <div className="hidden flex-col sm:flex">
            <span className="text-2xl font-black leading-tight tracking-tight text-white">DataGoal</span>
            <span className="text-sm font-medium leading-tight text-white/80">
              Escuela Patriota Sport Bacatá
            </span>
          </div>
        </Link>

        {/* Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 text-sm font-semibold transition-colors ${
                  active ? 'text-white' : 'text-white/70 hover:text-white'
                }`}
              >
                {link.label}
                {active && (
                  <span className="absolute inset-x-4 -bottom-[1px] h-[2px] rounded-full bg-white" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Acciones */}
        <div className="hidden items-center gap-2.5 md:flex">
          <Link
            href="/login"
            className="rounded-lg border border-white/30 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-150 hover:border-white/60 hover:bg-white/10"
          >
            Iniciar Sesión
          </Link>
          <Link
            href="/registro"
            className="rounded-lg bg-white px-4 py-2.5 text-sm font-bold text-brand-700 shadow-[0_8px_20px_-8px_rgba(0,0,0,0.4)] transition-all duration-150 hover:bg-brand-50 active:brightness-95"
          >
            Registro
          </Link>
        </div>

        {/* Toggle móvil */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex h-11 w-11 items-center justify-center rounded-lg text-white md:hidden"
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Menú móvil */}
      {open && (
        <div className="border-t border-white/20 bg-brand-700 px-6 py-4 md:hidden">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`rounded-lg px-3 py-2.5 text-sm font-semibold ${
                  pathname === link.href ? 'bg-white/15 text-white' : 'text-white/75'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 flex flex-col gap-2">
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="rounded-lg border border-white/30 px-4 py-2.5 text-center text-sm font-semibold text-white"
            >
              Iniciar Sesión
            </Link>
            <Link
              href="/registro"
              onClick={() => setOpen(false)}
              className="rounded-lg bg-white px-4 py-2.5 text-center text-sm font-bold text-brand-700"
            >
              Registro
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
