'use client'

import { useState, useRef } from 'react'
import { PlusCircle, X, Loader2, ListChecks, Calendar, Activity } from 'lucide-react'
import { crearCategoriaMaestra } from '@/services/actions/categorias_maestras'

export default function ModalCrearCategoriaMaestra() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    const result = await crearCategoriaMaestra(formData)
    
    if (result?.success) {
      formRef.current?.reset()
      setIsOpen(false)
    } else {
      setError(result?.message || 'Error al crear la categoría maestra.')
    }
    
    setIsLoading(false)
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="group bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg flex items-center gap-3 active:scale-95"
      >
        <PlusCircle size={18} className="group-hover:rotate-90 transition-transform duration-300" />
        Nueva Categoría Maestra
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-950/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-500 border border-gray-100">
            
            <div className="flex items-center justify-between px-10 py-8 border-b border-gray-50">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-50 rounded-2xl text-red-600">
                   <ListChecks size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight">Capa de Categoría</h2>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Definición de nivel maestro (Sub-X)</p>
                </div>
              </div>
              <button 
                onClick={() => !isLoading && setIsOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-900 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <form ref={formRef} onSubmit={handleSubmit} className="p-10 space-y-8">
              {error && (
                <div className="p-4 bg-red-50 text-red-700 text-sm rounded-2xl border border-red-100 font-bold">
                  ⚠️ {error}
                </div>
              )}
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="nombre" className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nombre Maestro *</label>
                  <input 
                    required 
                    type="text" 
                    id="nombre" 
                    name="nombre" 
                    className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-red-500/20 focus:ring-4 focus:ring-red-500/5 outline-none transition-all font-bold text-gray-900" 
                    placeholder="Ej: Juvenil, Sub-15, Adultos" 
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="edades" className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Rango de Edades</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input 
                        type="text" 
                        id="edades" 
                        name="edades" 
                        placeholder="Ej: 14-16 años"
                        className="w-full pl-12 pr-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-red-500/20 focus:ring-4 focus:ring-red-500/5 outline-none transition-all font-bold text-gray-900" 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="modalidad" className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Modalidad</label>
                    <div className="relative">
                      <Activity className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <select 
                        id="modalidad" 
                        name="modalidad" 
                        className="w-full pl-12 pr-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-red-500/20 focus:ring-4 focus:ring-red-500/5 outline-none transition-all font-bold text-gray-900 bg-white shadow-none appearance-none"
                      >
                        <option value="Competitivo">Competitivo</option>
                        <option value="Formativo">Formativo</option>
                        <option value="Recreativo">Recreativo</option>
                        <option value="Alto Rendimiento">Alto Rendimiento</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 flex items-center justify-end gap-4">
                <button 
                  type="button" 
                  onClick={() => setIsOpen(false)}
                  disabled={isLoading}
                  className="px-6 py-4 font-black text-[10px] text-gray-400 uppercase tracking-widest hover:text-gray-900 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="px-10 py-4 bg-red-600 hover:bg-red-700 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-red-500/20 flex items-center justify-center min-w-[200px]"
                >
                  {isLoading ? <Loader2 size={16} className="animate-spin" /> : 'Crear Categoría Maestra'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
