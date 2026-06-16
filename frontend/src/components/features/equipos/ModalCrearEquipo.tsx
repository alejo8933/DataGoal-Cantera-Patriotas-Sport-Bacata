'use client'

import { useState, useRef } from 'react'
import { PlusCircle, X, Loader2, Shield, User, MapPin, Calendar, Users, Activity } from 'lucide-react'
import { crearEquipo } from '@/services/actions/equipos'
import { useEntrenadores } from '@/hooks/useEntrenadores'

interface ModalCrearEquipoProps {
  categoriasMaestras: any[]
}

export default function ModalCrearEquipo({ categoriasMaestras }: ModalCrearEquipoProps) {
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
    const result = await crearEquipo(formData)
    
    if (result?.success) {
      formRef.current?.reset()
      setIsOpen(false)
    } else {
      setError(result?.message || 'Error desconocido.')
    }
    
    setIsLoading(false)
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="group bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-red-500/20 flex items-center gap-3 active:scale-95"
      >
        <PlusCircle size={18} className="group-hover:rotate-90 transition-transform duration-300" />
        Registrar Nuevo Equipo
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-950/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-500 border border-gray-100">
            
            {/* Header */}
            <div className="flex items-center justify-between px-10 py-8 border-b border-gray-50">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-50 rounded-2xl text-red-600">
                   <Shield size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight">Registrar Equipo</h2>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Vincular grupo a categoría maestra</p>
                </div>
              </div>
              <button 
                onClick={() => !isLoading && setIsOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-900 transition-colors rounded-xl hover:bg-gray-50"
              >
                <X size={24} />
              </button>
            </div>
            
            <form ref={formRef} onSubmit={handleSubmit} className="p-10">
              {error && (
                <div className="mb-8 p-4 bg-red-50 text-red-700 text-sm rounded-2xl border border-red-100 font-bold flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-red-600 animate-pulse" />
                  {error}
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Categoría Maestra (PADRE) */}
                <div className="space-y-2 md:col-span-2">
                  <label htmlFor="categoria_id" className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Categoría Maestra (Rango) *</label>
                  <select 
                    required 
                    id="categoria_id" 
                    name="categoria_id" 
                    className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-red-500/20 focus:ring-4 focus:ring-red-500/5 outline-none transition-all font-bold text-gray-900 bg-white"
                  >
                    <option value="">Selecciona la categoría superior...</option>
                    {categoriasMaestras.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.nombre} ({cat.edades})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Nombre del Equipo */}
                <div className="space-y-2">
                  <label htmlFor="equipo" className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Sufijo / Nombre del Equipo *</label>
                  <div className="relative">
                     <input 
                       required 
                       type="text" 
                       id="equipo" 
                       name="equipo" 
                       className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-red-500/20 focus:ring-4 focus:ring-red-500/5 outline-none transition-all font-bold text-gray-900" 
                       placeholder="Ej: Elite, Base, Grupo A" 
                     />
                  </div>
                </div>

                {/* Color (Opcional) */}
                <div className="space-y-2">
                  <label htmlFor="color" className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Color del Equipo</label>
                  <input 
                    type="text" 
                    id="color" 
                    name="color" 
                    placeholder="Ej: Azul, Rojo, Alterno"
                    className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-red-500/20 focus:ring-4 focus:ring-red-500/5 outline-none transition-all font-bold text-gray-900" 
                  />
                </div>

                {/* Horario */}
                <div className="space-y-2 md:col-span-2">
                  <label htmlFor="horario" className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Horario Específico</label>
                  <div className="relative">
                     <Activity className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                     <input 
                       type="text" 
                       id="horario" 
                       name="horario" 
                       placeholder="Ej: Sábados y Domingos 8-10 AM"
                       className="w-full pl-12 pr-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-red-500/20 focus:ring-4 focus:ring-red-500/5 outline-none transition-all font-bold text-gray-900" 
                     />
                  </div>
                </div>

                {/* Director Técnico */}
                <div className="space-y-2">
                  <label htmlFor="tecnico_id" className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Entrenador Responsable</label>
                  <div className="relative">
                     <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                     <select 
                       id="tecnico_id" 
                       name="tecnico_id" 
                       className="w-full pl-12 pr-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-red-500/20 focus:ring-4 focus:ring-red-500/5 outline-none transition-all font-bold text-gray-900 bg-white"
                     >
                       <option value="">{loadingCoaches ? 'Cargando...' : 'Selecciona un entrenador...'}</option>
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
                  <label htmlFor="sede" className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Sede Principal</label>
                  <div className="relative">
                     <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                     <input 
                       type="text" 
                       id="sede" 
                       name="sede" 
                       placeholder="Ej: Cancha Timiza"
                       className="w-full pl-12 pr-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-red-500/20 focus:ring-4 focus:ring-red-500/5 outline-none transition-all font-bold text-gray-900" 
                     />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-12 flex items-center justify-end gap-4">
                <button 
                  type="button" 
                  onClick={() => setIsOpen(false)}
                  disabled={isLoading}
                  className="px-6 py-4 font-black text-[10px] text-gray-400 uppercase tracking-widest hover:text-gray-900 transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="px-10 py-4 bg-red-600 hover:bg-red-700 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-red-500/20 flex items-center justify-center min-w-[200px] disabled:opacity-70 active:scale-95"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                       <Loader2 size={16} className="animate-spin" />
                       Procesando...
                    </div>
                  ) : 'Registrar Equipo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
