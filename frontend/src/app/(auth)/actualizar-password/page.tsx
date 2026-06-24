'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Eye, EyeOff, CheckCircle2, ShieldCheck } from 'lucide-react'
import { authService } from '@/services/api/authService'

export default function ActualizarPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const validationCriteria = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
  }

  const isPasswordValid = Object.values(validationCriteria).every(v => v)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.')
      return
    }
    
    if (!isPasswordValid) {
      setError('La contraseña no cumple con los requisitos mínimos de seguridad.')
      return
    }

    setLoading(true)
    setError(null)
    try {
      await authService.updatePassword(password)
      setSuccess(true)
      setTimeout(() => {
        router.push('/login')
      }, 3000)
    } catch (err: any) {
      setError(err.message || 'Error al actualizar la contraseña.')
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
          <h1 className="text-2xl font-bold text-gray-900">Nueva Contraseña</h1>
          <p className="text-sm text-gray-500 mt-1">
            Por favor, escribe tu nueva contraseña.
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
              <label className="text-sm font-medium text-gray-700">Nueva contraseña</label>
              <div className="flex items-center border-2 border-gray-400 rounded-lg px-3 py-2 gap-2 bg-white focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-100 relative group transition-all">
                <span className="text-gray-400">🔒</span>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 8 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="flex-1 text-sm outline-none bg-transparent text-gray-900 placeholder:text-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {/* Panel de Requisitos */}
              <div className="grid grid-cols-2 gap-2 mt-2 bg-gray-50 p-3 rounded-xl border border-gray-100">
                <RequirementItem met={validationCriteria.length} label="Mín. 8 caracteres" />
                <RequirementItem met={validationCriteria.upper} label="Letra mayúscula" />
                <RequirementItem met={validationCriteria.lower} label="Letra minúscula" />
                <RequirementItem met={validationCriteria.number} label="Un número" />
              </div>
            </div>
            
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Confirmar contraseña</label>
              <div className="flex items-center border-2 border-gray-400 rounded-lg px-3 py-2 gap-2 bg-white focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-100 relative group transition-all">
                <span className="text-gray-400">🔒</span>
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="flex-1 text-sm outline-none bg-transparent text-gray-900 placeholder:text-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p className="text-[10px] font-bold text-red-500 ml-1">Las contraseñas no coinciden</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !isPasswordValid || password !== confirmPassword}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 rounded-xl transition-all disabled:opacity-50 mt-2 shadow-lg shadow-red-600/20 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {loading ? (
                'Actualizando...'
              ) : (
                <>
                  Actualizar contraseña
                  <ShieldCheck size={18} />
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="w-full bg-green-50 border border-green-200 text-green-800 text-sm px-5 py-4 rounded-lg text-center flex flex-col gap-2 shadow-sm">
            <span className="text-2xl">✅</span>
            <p className="font-semibold">¡Contraseña actualizada!</p>
            <p>Redirigiendo al inicio de sesión...</p>
          </div>
        )}
      </div>
    </main>
  )
}

function RequirementItem({ met, label }: { met: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`h-1.5 w-1.5 rounded-full transition-colors ${met ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-gray-300'}`} />
      <span className={`text-[10px] font-bold transition-colors ${met ? 'text-emerald-600' : 'text-gray-400'}`}>
        {label}
      </span>
      {met && <CheckCircle2 size={10} className="text-emerald-500 animate-in zoom-in duration-300" />}
    </div>
  )
}
