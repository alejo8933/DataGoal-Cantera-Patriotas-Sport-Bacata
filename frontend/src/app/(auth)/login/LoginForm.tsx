'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react'
import Image from 'next/image'

export default function LoginForm() {
  const { login, loading, error } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    login(email, password)
  }

  return (
    <div className="w-full flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-500">

      {/* Título */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Bienvenido de nuevo</h1>
        <p className="text-sm text-gray-500 mt-1">
          Escuela Patriota Sport Bacatá
        </p>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-4 py-3 rounded-xl animate-in shake duration-300">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-700 ml-1">Correo Electrónico</label>
          <div className="group flex items-center border-2 border-gray-200 rounded-xl px-4 py-2.5 gap-3 bg-gray-50/50 focus-within:bg-white focus-within:border-red-500 focus-within:ring-4 focus-within:ring-red-50 transition-all duration-300">
            <Mail className="text-gray-400 group-focus-within:text-red-500 transition-colors" size={18} />
            <input
              type="email"
              placeholder="nombre@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 text-sm outline-none bg-transparent text-gray-900 placeholder:text-gray-400"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center ml-1">
            <label className="text-xs font-semibold text-gray-700">Contraseña</label>
            <Link href="/olvide-password" tabIndex={-1} className="text-[10px] text-red-600 hover:underline font-bold">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          <div className="group flex items-center border-2 border-gray-200 rounded-xl px-4 py-2.5 gap-3 bg-gray-50/50 focus-within:bg-white focus-within:border-red-500 focus-within:ring-4 focus-within:ring-red-50 transition-all duration-300">
            <Lock className="text-gray-400 group-focus-within:text-red-500 transition-colors" size={18} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="flex-1 text-sm outline-none bg-transparent text-gray-900 placeholder:text-gray-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="group relative flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 rounded-xl transition-all duration-300 shadow-lg shadow-red-200 hover:shadow-red-300 disabled:opacity-50 overflow-hidden active:scale-[0.98]"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <span>Entrar al Sistema</span>
              <LogIn size={18} className="transition-transform group-hover:translate-x-1" />
            </>
          )}
        </button>
      </form>

      {/* Footer / Alt Links */}
      <div className="text-center flex flex-col gap-4 w-full mt-2">
        <div className="relative">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-gray-400">O bien</span></div>
        </div>
        
        <p className="text-sm text-gray-500">
          ¿Aún no eres parte de la familia? 
        </p>
        <Link
          href="/registro"
          className="border-2 border-gray-200 rounded-xl py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-900 text-center transition-all duration-300"
        >
          Crear una cuenta nueva
        </Link>
      </div>

    </div>
  )
}