import { ReactNode } from 'react'

// Todo el árbol /dashboard/** depende de sesión (cookies vía Supabase SSR).
// Se fuerza dinámico aquí una sola vez: Next.js hereda este segment config
// en todos los layouts y páginas hijas, así no se repite en cada page.tsx.
export const dynamic = 'force-dynamic'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  // El layout general del dashboard ahora es transparente para permitir 
  // que cada rol (entrenador, admin, etc.) maneje su propia navegación (ej. HeaderEntrenador)
  return (
    <>
      {children}
    </>
  )
}

