'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { authService } from '@/services/api/authService'

export default function OlvidePasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await authService.resetPassword(email)
      setSuccess(true)
    } catch (err: any) {
      setError(err.message || 'Error al enviar el correo de recuperación.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-white px-4 py-10 relative">
      <Link 
        href="/login" 
        className="absolute top-6 left-6 md:top-8 md:left-8 flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors font-medium bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-100 hover:border-red-200 shadow-sm hover:shadow-md z-10"
      >
        <ArrowLeft size={18} />
        <span className="hidden sm:inline">Volver al login</span>
        <span className="sm:hidden">Volver</span>
      </Link>

      <div className="w-full max-w-sm mx-auto flex flex-col items-center gap-6">
        {/* Logo */}
        <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center">
          <span className="text-white text-2xl font-bold">P</span>
        </div>

        {/* Título */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Recuperar Contraseña</h1>
          <p className="text-sm text-gray-500 mt-1">
            Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
          </p>
        </div>

        {/* Formulario */}
        {!success ? (
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2 rounded-lg text-center">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <div className="flex items-center border-2 border-gray-400 rounded-lg px-3 py-2 gap-2 bg-white focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-100">
                <span className="text-gray-400">✉️</span>
                <input
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 text-sm outline-none bg-transparent text-gray-900 placeholder:text-gray-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !email}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 mt-2"
            >
              {loading ? 'Enviando...' : 'Enviar enlace'}
            </button>
          </form>
        ) : (
          <div className="w-full bg-green-50 border border-green-200 text-green-800 text-sm px-5 py-4 rounded-lg text-center flex flex-col gap-2 shadow-sm">
            <span className="text-2xl">✅</span>
            <p className="font-semibold">¡Correo enviado!</p>
            <p>Revisa tu bandeja de entrada o la carpeta de spam para encontrar el enlace de recuperación.</p>
          </div>
        )}
      </div>
    </main>
  )
}
