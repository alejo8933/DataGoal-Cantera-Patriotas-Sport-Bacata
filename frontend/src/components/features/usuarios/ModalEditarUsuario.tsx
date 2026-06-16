'use client'

import { useState, useRef } from 'react'
import { Edit, X, Loader2, ShieldCheck } from 'lucide-react'
import { editarUsuario } from '@/lib/actions/usuarios.actions'

interface ModalEditarUsuarioProps {
  usuario: {
    id: string
    nombre: string | null
    apellido: string | null
    email: string | null
    rol: string
    telefono?: string | null
    fecha_nacimiento?: string | null
    posicion?: string | null
    categoria?: string | null
  }
}

export default function ModalEditarUsuario({ usuario }: ModalEditarUsuarioProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedRol, setSelectedRol] = useState(usuario.rol)
  
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    formData.append('id', usuario.id)
    
    const result = await editarUsuario(formData)
    
    if (result?.success) {
      setIsOpen(false)
    } else {
      setError(result?.message || 'Error al actualizar.')
    }
    
    setIsLoading(false)
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all active:scale-90"
        title="Editar perfil completo"
      >
        <Edit size={18} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md animate-in fade-in duration-300 text-left">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-gray-100">
            
            {/* Cabecera Estilizada */}
            <div className="relative p-8 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                  <div className="p-2 bg-red-100 text-red-600 rounded-xl">
                    <ShieldCheck size={24} />
                  </div>
                  Modificar Perfil
                </h2>
                <p className="text-sm text-gray-400 font-medium mt-1">
                  Actualiza la información de <span className="text-red-500 font-bold">{usuario.email}</span>
                </p>
              </div>
              <button 
                onClick={() => !isLoading && setIsOpen(false)} 
                className="p-2 bg-white hover:bg-gray-100 text-gray-400 hover:text-gray-900 rounded-full shadow-sm transition-all"
              >
                <X size={20} />
              </button>
            </div>
            
            <form ref={formRef} onSubmit={handleSubmit} className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
              {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-700 text-sm rounded-2xl border-l-4 border-red-500 flex items-center gap-3 animate-pulse">
                  <span className="font-bold">⚠️</span> {error}
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* SECCIÓN 1: IDENTIDAD */}
                <div className="space-y-4 md:col-span-2">
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pb-2 border-b border-gray-50 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                    Identidad Personal
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 ml-1">Nombre</label>
                      <input 
                        name="nombre" 
                        required
                        defaultValue={usuario.nombre || ''} 
                        className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-red-500/10 transition-all font-medium text-gray-900" 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 ml-1">Apellido</label>
                      <input 
                        name="apellido" 
                        required
                        defaultValue={usuario.apellido || ''} 
                        className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-red-500/10 transition-all font-medium text-gray-900" 
                      />
                    </div>
                  </div>
                </div>

                {/* SECCIÓN 2: CONTACTO Y ACCESO */}
                <div className="space-y-4">
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pb-2 border-b border-gray-50 flex items-center gap-2 text-blue-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                    Comunicación y Acceso
                  </h3>
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 ml-1">Teléfono</label>
                      <input 
                        name="telefono" 
                        type="tel"
                        defaultValue={usuario.telefono || ''} 
                        placeholder="+57..."
                        className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-500/10 transition-all font-medium text-gray-900" 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 ml-1">Perfil del Sistema (Rol)</label>
                      <select 
                        name="rol" 
                        defaultValue={usuario.rol}
                        onChange={(e) => setSelectedRol(e.target.value)}
                        className="w-full px-4 py-3 bg-red-50 text-red-700 border-none rounded-2xl focus:ring-4 focus:ring-red-500/10 transition-all font-black uppercase text-xs"
                      >
                        <option value="admin">ADMINISTRADOR</option>
                        <option value="entrenador">ENTRENADOR</option>
                        <option value="jugador">JUGADOR</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* SECCIÓN 3: PERFIL DEPORTIVO */}
                <div className="space-y-4">
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pb-2 border-b border-gray-50 flex items-center gap-2 text-emerald-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Información Deportiva
                  </h3>
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 ml-1">Fecha de Nacimiento</label>
                      <input 
                        name="fecha_nacimiento" 
                        type="date"
                        defaultValue={usuario.fecha_nacimiento || ''} 
                        className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-emerald-500/10 transition-all font-medium text-gray-900" 
                      />
                    </div>

                    {/* CAMPOS DINÁMICOS POR ROL */}
                    {(selectedRol === 'jugador' || selectedRol === 'entrenador') && (
                      <div className="space-y-1.5 animate-in slide-in-from-top-2 duration-300">
                        <label className="text-xs font-bold text-gray-500 ml-1">Categoría</label>
                        <select 
                          name="categoria" 
                          defaultValue={usuario.categoria || ''}
                          className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-emerald-500/10 transition-all font-medium text-gray-900"
                        >
                          <option value="">Selecciona nivel</option>
                          <option value="sub-10">Sub-10</option>
                          <option value="sub-13">Sub-13</option>
                          <option value="sub-15">Sub-15</option>
                          <option value="sub-17">Sub-17</option>
                          <option value="sub-20">Sub-20</option>
                          <option value="profesional">Profesional</option>
                        </select>
                      </div>
                    )}
                  </div>
                </div>

                {selectedRol === 'jugador' && (
                  <div className="md:col-span-2 space-y-1.5 animate-in slide-in-from-top-2 duration-300">
                    <label className="text-xs font-bold text-gray-500 ml-1 italic">Posición en el Campo (Jugador)</label>
                    <select 
                      name="posicion" 
                      defaultValue={usuario.posicion || ''}
                      className="w-full px-4 py-3 bg-emerald-50 text-emerald-700 border-none rounded-2xl focus:ring-4 focus:ring-emerald-500/10 transition-all font-black uppercase text-xs"
                    >
                      <option value="">No definida</option>
                      <option value="portero">Portero</option>
                      <option value="defensa">Defensa</option>
                      <option value="mediocampista">Mediocampista</option>
                      <option value="delantero">Delantero</option>
                    </select>
                  </div>
                )}

              </div>

              {/* Botones de Acción */}
              <div className="mt-10 flex flex-col-reverse md:flex-row justify-end gap-4 pt-6 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => setIsOpen(false)} 
                  className="px-6 py-3 text-gray-400 font-bold hover:text-gray-900 rounded-2xl transition-all text-sm uppercase tracking-widest"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  disabled={isLoading} 
                  className="px-8 py-3 bg-red-600 text-white font-black rounded-2xl hover:bg-red-700 shadow-xl shadow-red-500/20 transition-all disabled:opacity-50 text-sm uppercase tracking-widest flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <><Loader2 className="animate-spin" size={18} /> Procesando...</>
                  ) : 'Actualizar Perfil'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
