'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Eye, EyeOff, ShieldCheck, CheckCircle2, Lock } from 'lucide-react'
import { validarCodigoRegistro } from '@/lib/actions/usuarios.actions'

const POSICIONES = ['Portero', 'Defensa', 'Mediocampista', 'Delantero']
const CATEGORIAS = ['Sub-7', 'Sub-9', 'Sub-11', 'Sub-13', 'Sub-15', 'Sub-17']

export default function RegisterForm() {
  const { register, loading, error } = useAuth()
  const [success, setSuccess] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)
  const [aceptaTerminos, setAceptaTerminos] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const [form, setForm] = useState({
    rol: 'jugador' as 'jugador' | 'entrenador' | 'admin',
    nombre: '', apellido: '', email: '', telefono: '',
    fechaNacimiento: '', posicion: '', categoria: '',
    password: '', confirm: '',
    codigoAcceso: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError(null)

    if (form.password !== form.confirm) {
      setLocalError('Las contraseñas no coinciden.')
      return
    }
    
    // Nueva validación extendida
    const validation = {
      length: form.password.length >= 8,
      upper: /[A-Z]/.test(form.password),
      lower: /[a-z]/.test(form.password),
      number: /[0-9]/.test(form.password),
    }

    if (!Object.values(validation).every(v => v)) {
      setLocalError('La contraseña no cumple con los requisitos de seguridad.')
      return
    }

    if (!aceptaTerminos) {
      setLocalError('Debes aceptar los términos y condiciones.')
      return
    }

    // Validación del Código de Acceso para Entrenador/Admin
    if (form.rol !== 'jugador') {
      const res = await validarCodigoRegistro(form.rol, form.codigoAcceso)
      if (!res.success) {
        setLocalError(res.message || 'Código de acceso inválido.')
        return
      }
    }

    const ok = await register({
      rol:             form.rol,
      email:           form.email,
      password:        form.password,
      nombre:          form.nombre,
      apellido:        form.apellido,
      telefono:        form.telefono,
      fechaNacimiento: form.fechaNacimiento,
      posicion:        form.posicion,
      categoria:       form.categoria,
    })

    if (ok) setSuccess(true)
  }

  if (success) {
    return (
      <div className="flex flex-col items-center gap-4 max-w-sm text-center">
        <div className="text-5xl">✅</div>
        <h2 className="text-xl font-bold text-gray-900">¡Registro exitoso!</h2>
        <p className="text-sm text-gray-500">Revisa tu correo para confirmar tu cuenta.</p>
        <a href="/login" className="text-red-600 hover:underline text-sm font-medium">
          Ir al Login
        </a>
      </div>
    )
  }

  const displayError = localError || error

  // ── Clase reutilizable para wrappers de input ──
  const inputWrapper = "flex items-center border-2 border-gray-400 rounded-lg px-3 py-2 gap-2 bg-white focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-100"
  const inputClass   = "flex-1 text-sm outline-none bg-transparent text-gray-900 placeholder:text-gray-400"
  const selectClass  = "w-full border-2 border-gray-400 rounded-lg px-3 py-2 text-sm bg-white text-gray-900 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition"

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center gap-6">

      {/* Logo */}
      <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center">
        <span className="text-white text-2xl font-bold">P</span>
      </div>

      {/* Título */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">Únete a Escuela Patriota Sport Bacatá</h1>
        <p className="text-sm text-gray-500 mt-1">
          Regístrate para ser parte de nuestra familia futbolística (Sub-7 a Sub-17)
        </p>
      </div>

      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">

        {displayError && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl flex flex-col gap-2 animate-in shake duration-300">
            <p className="font-medium flex items-center gap-2">
              <ShieldCheck size={16} className="text-red-500" />
              {displayError}
            </p>
            {displayError.includes('registrado') && (
              <a 
                href="/login" 
                className="w-full text-center bg-white border border-red-200 py-1.5 rounded-lg text-xs font-bold hover:bg-red-50 transition-colors mt-1"
              >
                Ir a Iniciar Sesión →
              </a>
            )}
          </div>
        )}

        {/* ── Selección de Rol ── */}
        <div className="flex flex-col gap-3">
          <h2 className="text-base font-semibold text-gray-900 border-b border-gray-200 pb-1">
            Tipo de Cuenta
          </h2>
          <div className="flex flex-wrap gap-2">
            <label className={`flex-1 min-w-[100px] text-xs text-center py-2 rounded-lg border-2 cursor-pointer transition ${form.rol === 'jugador' ? 'border-red-600 bg-red-50 text-red-700 font-bold' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
              <input type="radio" name="rol" value="jugador" checked={form.rol === 'jugador'} onChange={handleChange} className="hidden" />
              Jugador
            </label>
            <label className={`flex-1 min-w-[100px] text-xs text-center py-2 rounded-lg border-2 cursor-pointer transition ${form.rol === 'entrenador' ? 'border-red-600 bg-red-50 text-red-700 font-bold' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
              <input type="radio" name="rol" value="entrenador" checked={form.rol === 'entrenador'} onChange={handleChange} className="hidden" />
              Entrenador
            </label>
            <label className={`flex-1 min-w-[100px] text-xs text-center py-2 rounded-lg border-2 cursor-pointer transition ${form.rol === 'admin' ? 'border-red-600 bg-red-50 text-red-700 font-bold' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
              <input type="radio" name="rol" value="admin" checked={form.rol === 'admin'} onChange={handleChange} className="hidden" />
              Administrador
            </label>
          </div>
        </div>

        {/* ── Código de Acceso (Solo para Admin/Entrenador) ── */}
        {form.rol !== 'jugador' && (
          <div className="flex flex-col gap-1 animate-in fade-in slide-in-from-top-1 duration-300">
            <label className="text-sm font-medium text-red-700 flex items-center gap-1">
              <Lock size={14} /> Código de Acceso Requerido
            </label>
            <div className={inputWrapper + " border-red-300 bg-red-50/30"}>
              <span className="text-red-400 text-sm">🔑</span>
              <input 
                name="codigoAcceso" 
                placeholder={`Código secreto de ${form.rol}`}
                value={form.codigoAcceso}
                onChange={handleChange} 
                required 
                className={inputClass} 
              />
            </div>
            <p className="text-[10px] text-gray-500">
              Solicita este código a la coordinación para registrarte como {form.rol}.
            </p>
          </div>
        )}

        {/* ── Información Personal ── */}
        <div className="flex flex-col gap-3">
          <h2 className="text-base font-semibold text-gray-900 border-b border-gray-200 pb-1">
            Información Personal
          </h2>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Nombre</label>
              <div className={inputWrapper}>
                <span className="text-gray-400 text-sm">👤</span>
                <input name="nombre" placeholder="Tu nombre" value={form.nombre}
                  onChange={handleChange} required className={inputClass} />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Apellido</label>
              <div className={inputWrapper}>
                <span className="text-gray-400 text-sm">👤</span>
                <input name="apellido" placeholder="Tu apellido" value={form.apellido}
                  onChange={handleChange} required className={inputClass} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <div className={inputWrapper}>
                <span className="text-gray-400 text-sm">✉️</span>
                <input name="email" type="email" placeholder="tu@email.com" value={form.email}
                  onChange={handleChange} required className={inputClass} />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Teléfono</label>
              <div className={inputWrapper}>
                <span className="text-gray-400 text-sm">📱</span>
                <input name="telefono" placeholder="+57 300 123 4567" value={form.telefono}
                  onChange={handleChange} required className={inputClass} />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Fecha de Nacimiento</label>
            <div className={inputWrapper}>
              <span className="text-gray-400 text-sm">📅</span>
              <input name="fechaNacimiento" type="date" value={form.fechaNacimiento}
                onChange={handleChange} required className={inputClass} />
            </div>
          </div>
        </div>

        {/* ── Información Futbolística ── */}
        {form.rol !== 'admin' && (
          <div className="flex flex-col gap-3">
            <h2 className="text-base font-semibold text-gray-900 border-b border-gray-200 pb-1">
              Información Deportiva
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {form.rol === 'jugador' && (
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">Posición</label>
                  <select name="posicion" value={form.posicion} onChange={handleChange}
                    required={form.rol === 'jugador'} className={selectClass}>
                    <option value="">Selecciona posición</option>
                    {POSICIONES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              )}
              <div className={`flex flex-col gap-1 ${form.rol === 'entrenador' ? 'col-span-2' : ''}`}>
                <label className="text-sm font-medium text-gray-700">Categoría</label>
                <select name="categoria" value={form.categoria} onChange={handleChange}
                  required className={selectClass}>
                  <option value="">Selecciona categoría</option>
                  {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* ── Seguridad ── */}
        <div className="flex flex-col gap-3">
          <h2 className="text-base font-semibold text-gray-900 border-b border-gray-200 pb-1">
            Seguridad
          </h2>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Contraseña</label>
              <div className={inputWrapper + " relative group"}>
                <span className="text-gray-400 text-sm">🔒</span>
                <input 
                  name="password" 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Min. 8 caracteres" 
                  value={form.password}
                  onChange={handleChange} 
                  required 
                  className={inputClass} 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-600 px-2"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              
              {/* Requisitos visuales */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-1 bg-gray-50 p-2 rounded-lg border border-gray-100">
                <RequirementItem met={form.password.length >= 8} label="Mín. 8 caracteres" />
                <RequirementItem met={/[A-Z]/.test(form.password)} label="Mayúscula" />
                <RequirementItem met={/[a-z]/.test(form.password)} label="Minúscula" />
                <RequirementItem met={/[0-9]/.test(form.password)} label="Número" />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Confirmar Contraseña</label>
              <div className={inputWrapper + " relative group"}>
                <span className="text-gray-400 text-sm">🔒</span>
                <input 
                  name="confirm" 
                  type={showConfirm ? "text" : "password"} 
                  placeholder="••••••••" 
                  value={form.confirm}
                  onChange={handleChange} 
                  required 
                  className={inputClass} 
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="text-gray-400 hover:text-gray-600 px-2"
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {form.confirm && form.password !== form.confirm && (
                <p className="text-[10px] font-bold text-red-500">Las contraseñas no coinciden</p>
              )}
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <input type="checkbox" checked={aceptaTerminos}
              onChange={(e) => setAceptaTerminos(e.target.checked)}
              className="accent-red-600 w-4 h-4" />
            Acepto los{' '}
            <a href="#" className="text-red-600 hover:underline">términos y condiciones</a>
          </label>
        </div>

        <button type="submit" disabled={loading}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50">
          {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
        </button>

      </form>
    </div>
  )
}

function RequirementItem({ met, label }: { met: boolean; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className={`h-1 w-1 rounded-full ${met ? 'bg-emerald-500' : 'bg-gray-300'}`} />
      <span className={`text-[9px] font-bold ${met ? 'text-emerald-600' : 'text-gray-400'}`}>
        {label}
      </span>
      {met && <CheckCircle2 size={8} className="text-emerald-500" />}
    </div>
  )
}
