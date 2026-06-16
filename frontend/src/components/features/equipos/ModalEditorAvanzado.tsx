'use client'

import { useState, useRef } from 'react'
import { Settings2, X, Loader2, Shield, User, MapPin, Calendar, Trash2, Users, Activity } from 'lucide-react'
import { editarEquipo } from '@/services/actions/equipos'
import { useEntrenadores } from '@/hooks/useEntrenadores'

interface ModalEditorAvanzadoProps {
  equipo: {
    id: string
    equipo: string
    categoria: string | null
    tecnico: string | null
    tecnico_id: string | null
    sede: string | null
    fundacion: number | null
    genero?: string | null
    edades?: string | null
    cupos?: number | null
    horario?: string | null
  }
}

export default function ModalEditorAvanzado({ equipo }: ModalEditorAvanzadoProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const { entrenadores, loading: loadingCoaches } = useEntrenadores()
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    formData.append('id', equipo.id)
    
    // Si no se selecciona técnico, mandamos vacío para el id
    if (!formData.get('tecnico_id')) {
        formData.append('tecnico_id', '')
    }

    const result = await editarEquipo(formData)
    
    if (result?.success) {
      setIsOpen(false)
    } else {
      setError(result?.message || 'Error al actualizar el equipo.')
    }
    
    setIsLoading(false)
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
        title="Configuración Avanzada"
      >
        <Settings2 size={18} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-950/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-500 border border-gray-100">
            
            {/* Header */}
            <div className="bg-gray-900 px-10 py-10 text-white relative overflow-hidden">
               <div className="absolute right-0 top-0 opacity-10 pointer-events-none">
                  <Shield size={200} />
               </div>
               <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-5">
                    <div className="h-16 w-16 bg-red-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-red-600/40">
                       <Shield size={32} />
                    </div>
                    <div>
                      <h2 className="text-3xl font-black tracking-tight">{equipo.equipo}</h2>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Editor Maestro de Categoría</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => !isLoading && setIsOpen(false)}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <X size={28} />
                  </button>
               </div>
            </div>
            
            <form ref={formRef} onSubmit={handleSubmit} className="p-10">
              {error && (
                <div className="mb-8 p-4 bg-red-50 text-red-600 text-sm rounded-2xl border border-red-100 font-black italic">
                  ⚠️ {error}
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Nombre del Equipo */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Identidad de Competición *</label>
                  <input 
                    required 
                    name="equipo" 
                    defaultValue={equipo.equipo}
                    pattern="[A-Za-z0-9À-ÿ\s-]+"
                    title="Solo letras, números y guiones"
                    className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-red-500/20 focus:ring-4 focus:ring-red-500/5 outline-none transition-all font-bold text-gray-900 text-lg" 
                  />
                </div>

                {/* Categoria */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Categoría</label>
                  <select 
                    name="categoria" 
                    defaultValue={equipo.categoria || ''}
                    className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-red-500/20 focus:ring-4 focus:ring-red-500/5 outline-none transition-all font-bold text-gray-900 appearance-none bg-white"
                  >
                    <option value="">Selecciona...</option>
                    <option value="Sub-9">Sub-9</option>
                    <option value="Sub-11">Sub-11</option>
                    <option value="Sub-13">Sub-13</option>
                    <option value="Sub-15">Sub-15</option>
                    <option value="Sub-17">Sub-17</option>
                    <option value="Libre">Libre</option>
                  </select>
                </div>

                {/* Rango de Edad */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Rango de Edad</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      name="edades" 
                      defaultValue={equipo.edades || ''}
                      placeholder="Ej: 10 - 12 años"
                      className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-red-500/20 focus:ring-4 focus:ring-red-500/5 outline-none transition-all font-bold text-gray-900" 
                    />
                  </div>
                </div>

                {/* Género */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Género</label>
                  <select 
                    name="genero" 
                    defaultValue={equipo.genero || 'Mixto'}
                    className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-red-500/20 focus:ring-4 focus:ring-red-500/5 outline-none transition-all font-bold text-gray-900 appearance-none bg-white"
                  >
                    <option value="Mixto">Mixto</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                  </select>
                </div>

                {/* Cupos */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Cupos Máximos</label>
                  <input 
                    type="number" 
                    name="cupos" 
                    defaultValue={equipo.cupos || 25}
                    min="1"
                    className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-red-500/20 focus:ring-4 focus:ring-red-500/5 outline-none transition-all font-bold text-gray-900" 
                  />
                </div>

                {/* Horario */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Horario de Entrenamiento</label>
                  <input 
                    name="horario" 
                    defaultValue={equipo.horario || ''}
                    placeholder="Ej: Lun-Mie 4-6 PM"
                    className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-red-500/20 focus:ring-4 focus:ring-red-500/5 outline-none transition-all font-bold text-gray-900" 
                  />
                </div>

                {/* Director Técnico */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Entrenador Responsable</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <select 
                       name="tecnico_id" 
                       defaultValue={equipo.tecnico_id || ''}
                       className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-red-500/20 focus:ring-4 focus:ring-red-500/5 outline-none transition-all font-bold text-gray-900 appearance-none bg-white"
                    >
                      <option value="">{loadingCoaches ? 'Cargando...' : 'Sin Técnico Asignado'}</option>
                      {entrenadores.map(coach => (
                        <option key={coach.id} value={coach.id}>
                          {coach.nombre} {coach.apellido}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Sede */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Sede Principal</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      name="sede" 
                      defaultValue={equipo.sede || ''}
                      className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-red-500/20 focus:ring-4 focus:ring-red-500/5 outline-none transition-all font-bold text-gray-900" 
                    />
                  </div>
                </div>

                {/* Fundación (Oculto) */}
                <input type="hidden" name="fundacion" defaultValue={equipo.fundacion || 2024} />
              </div>

              {/* Botones de Acción */}
              <div className="mt-12 flex items-center justify-between pt-8 border-t border-gray-100">
                <button 
                  type="button"
                  className="px-6 py-4 font-black text-[10px] text-red-500 uppercase tracking-widest hover:bg-red-50 rounded-2xl transition-all flex items-center gap-2"
                >
                  <Trash2 size={16} />
                  Eliminar Categoría
                </button>
                
                <div className="flex items-center gap-4">
                    <button 
                      type="button" 
                      onClick={() => setIsOpen(false)}
                      disabled={isLoading}
                      className="px-6 py-4 font-black text-[10px] text-gray-400 uppercase tracking-widest hover:text-gray-900 transition-colors disabled:opacity-50"
                    >
                      Descartar
                    </button>
                    <button 
                      type="submit" 
                      disabled={isLoading}
                      className="px-10 py-4 bg-gray-900 hover:bg-black text-white font-black text-[10px] uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-gray-200 flex items-center justify-center min-w-[180px] disabled:opacity-70 active:scale-95"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                           <Loader2 size={16} className="animate-spin" />
                           Sincronizando...
                        </div>
                      ) : 'Confirmar Cambios'}
                    </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
