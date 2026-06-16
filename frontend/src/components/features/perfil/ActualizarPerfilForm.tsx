'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { 
  User, Mail, Phone, Calendar, Fingerprint, Save, Loader2, 
  CheckCircle2, ShieldCheck, Settings, Activity, Globe, Lock,
  Sun, Moon, Languages, Eye, EyeOff, XCircle, LogOut
} from 'lucide-react'
import { actualizarMiPerfil, cambiarPassword } from '@/lib/actions/usuarios.actions'
import logoutAction from '@/services/actions/logout'

interface ActualizarPerfilFormProps {
  perfil: {
    nombre: string | null
    apellido: string | null
    email: string | null
    telefono: string | null
    genero: string | null
    documento: string | null
    fecha_nacimiento: string | null
    rol: string
  }
}

export default function ActualizarPerfilForm({ perfil }: ActualizarPerfilFormProps) {
  const searchParams = useSearchParams()
  const initialTab = (searchParams.get('tab') as any) || 'general'
  
  const [loading, setLoading] = useState(false)
  const [pwdLoading, setPwdLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'general' | 'seguridad' | 'preferencias'>(initialTab)
  
  // Estados para contraseña
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordValue, setPasswordValue] = useState('')
  const [confirmPasswordValue, setConfirmPasswordValue] = useState('')
  
  const validationCriteria = {
    length: passwordValue.length >= 8,
    hasUpper: /[A-Z]/.test(passwordValue),
    hasLower: /[a-z]/.test(passwordValue),
    hasNumber: /[0-9]/.test(passwordValue),
    passwordsMatch: passwordValue === confirmPasswordValue && passwordValue !== ''
  }

  const isPasswordValid = Object.values(validationCriteria).every(v => v)
  
  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab && (tab === 'general' || tab === 'seguridad' || tab === 'preferencias')) {
      setActiveTab(tab as any)
    }
  }, [searchParams])

  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [pwdMessage, setPwdMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    const formData = new FormData(e.currentTarget)
    const result = await actualizarMiPerfil(formData)

    if (result.success) {
      setMessage({ type: 'success', text: result.message })
      setTimeout(() => setMessage(null), 5000)
    } else {
      setMessage({ type: 'error', text: result.message })
    }
    setLoading(false)
  }

  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    
    if (!isPasswordValid) {
      setPwdMessage({ type: 'error', text: 'La contraseña no cumple con todos los requisitos de seguridad.' })
      return
    }

    setPwdLoading(true)
    setPwdMessage(null)

    const formData = new FormData(form)
    const result = await cambiarPassword(formData)

    if (result.success) {
      setPwdMessage({ type: 'success', text: result.message })
      form.reset()
      setTimeout(() => setPwdMessage(null), 5000)
    } else {
      setPwdMessage({ type: 'error', text: result.message })
    }
    setPwdLoading(false)
  }

  const tabs = [
    { id: 'general', label: 'Datos Generales', icon: User },
    { id: 'seguridad', label: 'Seguridad', icon: ShieldCheck },
    { id: 'preferencias', label: 'Preferencias', icon: Settings },
  ]

  return (
    <div className="flex flex-col gap-8 w-full">
      
      {/* TABS SELECTOR */}
      <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-2xl w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === tab.id 
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* COLUMNA IZQUIERDA: RESUMEN Y ESTADO */}
        <aside className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-4">Estado de Cuenta</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-2xl border border-emerald-100">
                <span className="text-xs font-bold text-emerald-700">Estado: Activo</span>
                <CheckCircle2 size={16} className="text-emerald-500" />
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Perfil completado</span>
                  <span className="text-xs font-black text-gray-900">85%</span>
                </div>
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-red-600 rounded-full w-[85%]"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-3xl shadow-xl text-white">
            <Activity size={32} className="text-red-500 mb-4" />
            <h3 className="text-lg font-bold mb-1">Actividad Reciente</h3>
            <p className="text-xs text-gray-400 mb-4">Últimos accesos registrados</p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-[11px] font-medium py-2 border-b border-white/5">
                <Globe size={14} className="text-blue-400" />
                <span>Login desde Bogotá, Col</span>
              </div>
            </div>
          </div>
        </aside>

        {/* COLUMNA DERECHA: FORMULARIOS INDEPENDIENTES */}
        <main className="lg:col-span-2 space-y-6">
          
          {activeTab === 'general' && (
            <form onSubmit={handleSubmit} className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-6">
              
              {/* BLOQUE: IDENTIDAD */}
              <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-50">
                  <div className="h-8 w-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
                    <User size={18} />
                  </div>
                  <h2 className="text-lg font-bold text-gray-900 tracking-tight">Datos de Identidad</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Nombre</label>
                    <input required name="nombre" defaultValue={perfil.nombre || ''} className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-red-500/10 focus:border-red-500 outline-none transition-all font-bold text-gray-800" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Apellido</label>
                    <input required name="apellido" defaultValue={perfil.apellido || ''} className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-red-500/10 focus:border-red-500 outline-none transition-all font-bold text-gray-800" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Documento (CC/TI)</label>
                    <div className="relative">
                      <Fingerprint className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                      <input name="documento" defaultValue={perfil.documento || ''} className="w-full pl-12 pr-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-red-500/10 focus:border-red-500 outline-none transition-all font-bold text-gray-800" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Fecha de Nacimiento</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                      <input type="date" name="fecha_nacimiento" defaultValue={perfil.fecha_nacimiento || ''} className="w-full pl-12 pr-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl outline-none font-bold text-gray-800" />
                    </div>
                  </div>
                </div>
              </div>

              {/* BLOQUE: CONTACTO */}
              <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-50">
                  <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Phone size={18} />
                  </div>
                  <h2 className="text-lg font-bold text-gray-900 tracking-tight">Comunicación</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Correo (Protegido)</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                      <input disabled value={perfil.email || ''} className="w-full pl-12 pr-4 py-3 bg-gray-100 border border-gray-100 rounded-2xl text-gray-400 font-bold cursor-not-allowed" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Teléfono Móvil</label>
                    <input name="telefono" defaultValue={perfil.telefono || ''} placeholder="+57 3..." className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-red-500/10 focus:border-red-500 outline-none font-bold text-gray-800" />
                  </div>
                </div>
              </div>

              {/* ACCIONES DE PERFIL */}
              <div className="flex items-center justify-between gap-4 sticky bottom-6 bg-white/80 backdrop-blur-md p-4 rounded-3xl border border-gray-200 shadow-xl">
                 <div className="flex-1">
                    {message && (
                      <div className={`flex items-center gap-2 text-sm font-bold ${message.type === 'success' ? 'text-emerald-600' : 'text-red-500'}`}>
                        {message.type === 'success' && <CheckCircle2 size={18} />}
                        {message.text}
                      </div>
                    )}
                 </div>
                 <button type="submit" disabled={loading} className="px-12 py-3.5 bg-red-600 hover:bg-black text-white font-black rounded-2xl transition-all shadow-lg active:scale-95 disabled:opacity-50 flex items-center gap-2">
                    {loading ? <Loader2 size={18} className="animate-spin" /> : <><Save size={18} /> Guardar Perfil</>}
                 </button>
              </div>

            </form>
          )}

          {activeTab === 'seguridad' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-6">
               <div className="bg-white p-12 rounded-3xl border border-gray-100 shadow-sm">
                  <div className="max-w-md mx-auto text-center space-y-8">
                    <div className="h-20 w-20 bg-red-50 text-red-600 rounded-3xl flex items-center justify-center mx-auto rotate-3 shadow-lg shadow-red-500/10">
                        <Lock size={40} />
                    </div>
                    
                    <div>
                      <h2 className="text-2xl font-black text-gray-900 tracking-tight">Actualizar Contraseña</h2>
                      <p className="text-gray-400 font-medium text-sm mt-2 leading-relaxed">
                        Ingresa tu nueva clave de acceso.
                      </p>
                    </div>

                    <form onSubmit={handlePasswordSubmit} className="space-y-6 text-left">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nueva Contraseña</label>
                        <div className="relative group">
                          <input 
                            required 
                            type={showPassword ? "text" : "password"} 
                            name="password" 
                            placeholder="Min. 8 caracteres" 
                            value={passwordValue}
                            onChange={(e) => setPasswordValue(e.target.value)}
                            className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-red-500/10 focus:border-red-500 outline-none font-bold transition-all" 
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                          </button>
                        </div>
                      </div>

                      {/* Panel de Requisitos */}
                      <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-3">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Requisitos de Seguridad</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <RequirementItem met={validationCriteria.length} label="Mínimo 8 caracteres" />
                          <RequirementItem met={validationCriteria.hasUpper} label="Una mayúscula" />
                          <RequirementItem met={validationCriteria.hasLower} label="Una minúscula" />
                          <RequirementItem met={validationCriteria.hasNumber} label="Un número" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Confirmar Contraseña</label>
                        <div className="relative group">
                          <input 
                            required 
                            type={showConfirmPassword ? "text" : "password"} 
                            name="confirmPassword" 
                            placeholder="Repite tu contraseña" 
                            value={confirmPasswordValue}
                            onChange={(e) => setConfirmPasswordValue(e.target.value)}
                            className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-red-500/10 focus:border-red-500 outline-none font-bold transition-all" 
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                          </button>
                        </div>
                        {confirmPasswordValue && !validationCriteria.passwordsMatch && (
                          <p className="text-[10px] font-bold text-red-500 ml-1">Las contraseñas no coinciden</p>
                        )}
                      </div>

                      {pwdMessage && (
                        <div className={`p-4 rounded-2xl text-[11px] font-black text-center border animate-in fade-in duration-300 ${pwdMessage.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-500 border-red-100'}`}>
                          {pwdMessage.text}
                        </div>
                      )}

                      <button 
                        type="submit" 
                        disabled={pwdLoading || !isPasswordValid} 
                        className="w-full py-4 bg-gray-900 hover:bg-black text-white font-black rounded-2xl transition-all shadow-xl disabled:opacity-30 disabled:cursor-not-allowed group active:scale-95"
                      >
                        {pwdLoading ? (
                          <Loader2 size={18} className="animate-spin mx-auto" />
                        ) : (
                          <span className="flex items-center justify-center gap-2">
                            Actualizar Credenciales
                            <ShieldCheck size={18} className="group-hover:translate-x-1 transition-transform" />
                          </span>
                        )}
                      </button>
                    </form>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'preferencias' && (
             <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-6">
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-8">
                  <div className="flex items-center gap-2 pb-2 border-b border-gray-50">
                    <div className="h-8 w-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
                      <Settings size={18} />
                    </div>
                    <h2 className="text-lg font-bold text-gray-900 tracking-tight">Ajustes de Interfaz</h2>
                  </div>

                  {/* OPCIÓN: TEMA VISUAL */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Sun size={16} className="text-gray-400" />
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Tema Visual</label>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <button type="button" className="p-4 rounded-2xl border-2 border-red-600 bg-red-50 text-red-600 flex flex-col items-center gap-2 transition-all">
                        <Sun size={24} />
                        <span className="text-xs font-bold">Modo Claro</span>
                      </button>
                      <button type="button" className="p-4 rounded-2xl border-2 border-gray-100 bg-gray-50 text-gray-400 flex flex-col items-center gap-2 hover:border-gray-200 transition-all">
                        <Moon size={24} />
                        <span className="text-xs font-bold">Modo Oscuro</span>
                      </button>
                      <button type="button" className="p-4 rounded-2xl border-2 border-gray-100 bg-gray-50 text-gray-400 flex flex-col items-center gap-2 hover:border-gray-200 transition-all">
                        <Activity size={24} />
                        <span className="text-xs font-bold">Sistema</span>
                      </button>
                    </div>
                  </div>

                  {/* OPCIÓN: IDIOMA */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Languages size={16} className="text-gray-400" />
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Idioma del Dashboard</label>
                    </div>
                    <select className="w-full max-w-xs px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl font-bold text-gray-800 outline-none">
                      <option value="es">Español (Colombia)</option>
                      <option value="en">English (International)</option>
                    </select>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button type="button" className="px-8 py-3 bg-gray-900 hover:bg-black text-white font-black rounded-2xl transition-all shadow-lg active:scale-95 flex items-center gap-2">
                      <Save size={18} /> Guardar Preferencias
                    </button>
                  </div>

                  {/* SECCIÓN: CIERRE DE SESIÓN */}
                  <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="space-y-1">
                      <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Gestión de Cuenta</h3>
                      <p className="text-xs text-gray-400 font-medium">Finaliza tu sesión actual en este dispositivo.</p>
                    </div>
                    <form action={logoutAction}>
                      <button 
                        type="submit"
                        className="flex items-center gap-3 px-8 py-3.5 rounded-2xl text-sm font-black text-red-600 bg-red-50 hover:bg-red-600 hover:text-white transition-all shadow-sm active:scale-95 border border-red-100/50"
                      >
                        <LogOut size={18} />
                        Cerrar Sesión Activa
                      </button>
                    </form>
                  </div>
                </div>
             </div>
          )}

        </main>
      </div>
    </div>
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
