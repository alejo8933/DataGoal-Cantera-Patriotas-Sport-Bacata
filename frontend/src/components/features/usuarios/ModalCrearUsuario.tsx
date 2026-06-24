'use client'

import { useState, useRef } from 'react'
import { 
  ShieldCheck, X, Loader2, Key, User, Mail, Phone, 
  Calendar, Target, Award, ChevronRight, Lock
} from 'lucide-react'
import { crearUsuario } from '@/lib/actions/usuarios.actions'

const POSICIONES = ['Portero', 'Defensa', 'Mediocampista', 'Delantero']
const CATEGORIAS = ['Sub-7', 'Sub-9', 'Sub-11', 'Sub-13', 'Sub-15', 'Sub-17']

export default function ModalCrearUsuario() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedRol, setSelectedRol] = useState<string>('')
  
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    const result = await crearUsuario(formData)
    
    if (result?.success) {
      formRef.current?.reset()
      setSelectedRol('')
      setIsOpen(false)
    } else {
      setError(result?.message || 'Error del servidor al crear usuario.')
    }
    
    setIsLoading(false)
  }

  const inputClass = "w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:ring-4 focus:ring-red-500/5 focus:border-red-500 outline-none transition-all placeholder:text-gray-400 placeholder:font-medium"
  const labelClass = "text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1"

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-gray-900/10 flex items-center gap-2 active:scale-95"
      >
        <ShieldCheck size={18} />
        Añadir Usuario Autorizado
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-500 border border-white/20">
            
            {/* HEADER DEL MODAL */}
            <div className="flex items-center justify-between p-8 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-500/20">
                  <Key size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-gray-900 tracking-tight">
                    Gestión de Credenciales
                  </h2>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Nuevo Perfil Maestro</p>
                </div>
              </div>
              <button 
                onClick={() => !isLoading && setIsOpen(false)}
                className="h-10 w-10 flex items-center justify-center rounded-xl bg-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all"
              >
                <X size={20} />
              </button>
            </div>
            
            <form ref={formRef} onSubmit={handleSubmit} className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
              {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 text-xs font-black rounded-2xl border border-red-100 animate-shake">
                  {error}
                </div>
              )}
              
              <div className="space-y-8">
                
                {/* SECCIÓN 1: IDENTIDAD Y ROL */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className={labelClass}>Nivel de Acceso (Rol) *</label>
                    <div className="relative">
                      <ShieldCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <select 
                        required 
                        name="rol" 
                        value={selectedRol}
                        onChange={(e) => setSelectedRol(e.target.value)}
                        className={`${inputClass} appearance-none cursor-pointer`}
                      >
                        <option value="">Selecciona Jerarquía...</option>
                        <option value="admin">Administrador Total</option>
                        <option value="entrenador">Entrenador (Coach)</option>
                        <option value="jugador">Jugador / Acudiente</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className={labelClass}>Correo de Acceso *</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input required type="email" name="email" className={inputClass} placeholder="ejemplo@datagoal.com" />
                    </div>
                  </div>
                </div>

                {/* SECCIÓN 2: DATOS PERSONALES */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-gray-100 pb-2 mb-4">
                    <User size={14} className="text-red-600" />
                    <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Información Personal</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className={labelClass}>Nombre(s) *</label>
                      <div className="relative text-gray-400 focus-within:text-red-600">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2" size={18} />
                        <input 
                          required 
                          name="nombre" 
                          className={inputClass} 
                          placeholder="Juan" 
                          pattern="[A-Za-zÀ-ÿ\s]+" 
                          title="Solo se permiten letras"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className={labelClass}>Apellido(s) *</label>
                      <div className="relative text-gray-400 focus-within:text-red-600">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2" size={18} />
                        <input 
                          required 
                          name="apellido" 
                          className={inputClass} 
                          placeholder="Pérez" 
                          pattern="[A-Za-zÀ-ÿ\s]+" 
                          title="Solo se permiten letras"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className={labelClass}>Teléfono de Contacto</label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                          name="telefono" 
                          className={inputClass} 
                          placeholder="3001234567" 
                          type="tel"
                          pattern="\d+"
                          minLength={7}
                          maxLength={15}
                          title="Solo números (7 a 15 dígitos)"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className={labelClass}>Fecha de Nacimiento</label>
                      <div className="relative">
                        <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input type="date" name="fecha_nacimiento" className={inputClass} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* SECCIÓN 3: DATOS DEPORTIVOS (DINÁMICO) */}
                {selectedRol && selectedRol !== 'admin' && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="flex items-center gap-2 border-b border-gray-100 pb-2 mb-4">
                      <Award size={14} className="text-red-600" />
                      <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Perfil Deportivo</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedRol === 'jugador' && (
                        <div className="space-y-2">
                          <label className={labelClass}>Posición en Campo</label>
                          <div className="relative">
                            <Target className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <select name="posicion" className={`${inputClass} appearance-none cursor-pointer text-gray-700`}>
                              <option value="">Selecciona Posición...</option>
                              {POSICIONES.map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                          </div>
                        </div>
                      )}
                      
                      <div className={`space-y-2 ${selectedRol === 'entrenador' ? 'col-span-2' : ''}`}>
                        <label className={labelClass}>Categoría Asignada</label>
                        <div className="relative">
                          <Award className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                          <select name="categoria" className={`${inputClass} appearance-none cursor-pointer text-gray-700`}>
                            <option value="">Selecciona Categoría...</option>
                            {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* SECCIÓN 4: SEGURIDAD MAESTRA */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-gray-100 pb-2 mb-4">
                    <Lock size={14} className="text-red-600" />
                    <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Seguridad del Sistema</span>
                  </div>
                  <div className="space-y-2">
                    <label className={labelClass}>Contraseña Temporal (Mín. 6) *</label>
                    <div className="relative">
                      <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input 
                        required 
                        type="password" 
                        name="password" 
                        minLength={8} 
                        className={inputClass} 
                        placeholder="Mínimo 8 caracteres" 
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* PIE DEL MODAL (ACCIONES) */}
              <div className="mt-12 flex items-center justify-between gap-4 p-6 bg-gray-50 -mx-8 -mb-8 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => setIsOpen(false)}
                  disabled={isLoading}
                  className="px-6 py-3 font-bold text-gray-500 hover:text-gray-900 transition-all text-xs uppercase tracking-widest disabled:opacity-50"
                >
                  Cancelar Operación
                </button>
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="px-10 py-4 bg-gray-900 hover:bg-black text-white font-black rounded-2xl transition-all flex items-center justify-center gap-3 disabled:opacity-70 shadow-xl shadow-gray-200 active:scale-95"
                >
                  {isLoading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <>
                      Generar Acceso Maestro
                      <ChevronRight size={18} className="text-red-500" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
