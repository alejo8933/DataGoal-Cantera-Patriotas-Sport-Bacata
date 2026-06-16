'use client'

import { useState } from 'react'
import { Edit2, X, Loader2, Save } from 'lucide-react'
import { actualizarGasto } from '@/services/actions/finanzas'

interface Gasto {
  id: string
  concepto: string
  categoria: string
  monto: number
  fecha: string
}

export default function ModalEditarGasto({ gasto }: { gasto: Gasto }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    const result = await actualizarGasto(gasto.id, formData)
    
    if (result?.success) {
      setIsOpen(false)
    } else {
      setError(result?.message || 'Error actualizando el gasto.')
    }
    
    setIsLoading(false)
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        title="Editar Gasto"
      >
        <Edit2 size={16} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-8 border-b border-gray-100 bg-gray-50/50">
              <div>
                <h2 className="text-xl font-black text-gray-900 tracking-tight">Editar Gasto Operativo</h2>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Gasto: {gasto.id.slice(0, 8)}</p>
              </div>
              <button 
                onClick={() => !isLoading && setIsOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {error && (
                <div className="p-4 bg-red-50 text-red-700 text-sm rounded-2xl border border-red-100 flex items-start gap-3">
                  <span className="shrink-0">⚠️</span>
                  <p className="font-medium text-xs leading-relaxed">{error}</p>
                </div>
              )}
              
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Concepto / Descripción</label>
                  <input 
                    required 
                    type="text" 
                    name="concepto" 
                    defaultValue={gasto.concepto}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all font-bold text-gray-900" 
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Categoría</label>
                    <select 
                      name="categoria" 
                      defaultValue={gasto.categoria}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all font-bold text-gray-900 appearance-none"
                    >
                      <option value="Servicios">Servicios</option>
                      <option value="Mantenimiento">Mantenimiento</option>
                      <option value="Uniformes">Uniformes</option>
                      <option value="Transporte">Transporte</option>
                      <option value="Sueldos">Sueldos</option>
                      <option value="Otros">Otros</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Monto (COP)</label>
                    <input 
                      required 
                      type="number" 
                      name="monto" 
                      defaultValue={gasto.monto}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all font-black text-red-600" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Fecha de Gasto</label>
                  <input 
                    required 
                    type="date" 
                    name="fecha" 
                    defaultValue={gasto.fecha}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all font-bold text-gray-900" 
                  />
                </div>
              </div>

              <div className="pt-6 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsOpen(false)}
                  disabled={isLoading}
                  className="flex-1 py-3 text-sm font-black text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-2xl transition-all"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="flex-1 py-3 bg-gray-900 hover:bg-black text-white font-black rounded-2xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
                >
                  {isLoading ? <Loader2 size={18} className="animate-spin" /> : <><Save size={18} /> Guardar Cambios</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
