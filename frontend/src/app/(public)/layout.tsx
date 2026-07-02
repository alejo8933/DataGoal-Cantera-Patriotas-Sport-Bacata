import { ReactNode } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

// Navegación institucional consistente en todo el sitio público. Se declara
// una sola vez aquí para que /, /partidos, /torneos, /estadisticas y
// /plantilla compartan el mismo Header y Footer sin duplicar el import
// en cada página.
export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-white text-carbon-900">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
