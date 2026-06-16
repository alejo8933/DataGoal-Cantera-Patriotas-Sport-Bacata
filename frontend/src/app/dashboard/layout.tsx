import { ReactNode } from 'react'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  // El layout general del dashboard ahora es transparente para permitir 
  // que cada rol (entrenador, admin, etc.) maneje su propia navegación (ej. HeaderEntrenador)
  return (
    <>
      {children}
    </>
  )
}

