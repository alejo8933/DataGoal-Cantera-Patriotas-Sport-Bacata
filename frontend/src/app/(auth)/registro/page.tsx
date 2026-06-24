import RegisterForm from './RegisterForm'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function RegisterPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-white px-4 py-10 relative">
      <Link 
        href="/" 
        className="absolute top-6 left-6 md:top-8 md:left-8 flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors font-medium bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-100 hover:border-red-200 shadow-sm hover:shadow-md z-10"
      >
        <ArrowLeft size={18} />
        <span className="hidden sm:inline">Volver al inicio</span>
        <span className="sm:hidden">Volver</span>
      </Link>
      <RegisterForm />
    </main>
  )
}
