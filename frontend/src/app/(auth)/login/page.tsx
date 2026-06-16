import LoginForm from './LoginForm'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import Image from 'next/image'

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center relative overflow-hidden bg-black">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/login-bg.png"
          alt="Soccer Academy Background"
          fill
          priority
          className="object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      </div>

      {/* Volver al inicio button */}
      <Link 
        href="/" 
        className="absolute top-6 left-6 md:top-8 md:left-8 z-20 flex items-center gap-2 text-white/80 hover:text-white transition-all font-medium bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 hover:border-white/30 shadow-xl"
      >
        <ArrowLeft size={18} />
        <span className="hidden sm:inline">Volver al inicio</span>
        <span className="sm:hidden">Volver</span>
      </Link>

      {/* Logo in the top right corner */}
      <div className="absolute top-6 right-6 md:top-8 md:right-8 z-20 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 shadow-xl flex items-center justify-center">
        <div className="relative w-28 h-8 md:w-32 md:h-10">
          <Image 
            src="/logodata.png" 
            alt="Patriotas Sport Bacatá Logo" 
            fill
            className="object-contain"
          />
        </div>
      </div>

      {/* Login Card with Glassmorphism */}
      <div className="relative z-10 w-full max-w-md px-4">
        <div className="bg-white/95 backdrop-blur-xl p-8 md:p-10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/20">
          <LoginForm />
        </div>
      </div>
    </main>
  )
}
