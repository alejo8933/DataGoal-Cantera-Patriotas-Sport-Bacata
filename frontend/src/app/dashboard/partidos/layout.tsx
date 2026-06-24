import { ReactNode } from 'react'
import HeaderEntrenador from '@/components/layout/HeaderEntrenador'
import FooterEntrenador from '@/components/layout/FooterEntrenador'

export default function PartidosLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <HeaderEntrenador />
      <main className="min-h-screen bg-gray-50 flex flex-col justify-between">
        <div className="mx-auto w-full max-w-7xl flex-grow px-6 py-8">
          {children}
        </div>
        <FooterEntrenador />
      </main>
    </>
  )
}
