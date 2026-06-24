'use client'

import { useState, useRef } from 'react'
import { Edit2, X, Loader2, Save } from 'lucide-react'
import { actualizarPago } from '@/services/actions/finanzas'

interface Factura {
  id: string
  jugador: string
  monto: number
  fecha: string
  estado: string
}

export default function ModalEditarFactura({ factura }: { factura: Factura }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    const result = await actualizarPago(factura.id, formData)
    
    if (result?.success) {
      setIsOpen(false)
    } else {
      setError(result?.message || 'Error actualizando el pago.')
    }
    
    setIsLoading(false)
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        title="Editar Pago"
      >
        <Edit2 size={16} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between p-8 border-b border-gray-100 bg-gray-50/50">
              <div>
                <h2 className="text-xl font-black text-gray-900 tracking-tight">Editar Mensualidad</h2>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">ID: {factura.id.slice(0, 8)}</p>
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
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nombre del Jugador</label>
                  <input 
                    required 
                    type="text" 
                    name="jugador" 
                    defaultValue={factura.jugador}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-gray-900" 
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Fecha / Mes</label>
                    <input 
                      required 
                      type="date" 
                      name="fecha" 
                      defaultValue={factura.fecha}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-gray-900" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Monto (COP)</label>
                    <input 
                      required 
                      type="number" 
                      name="monto" 
                      defaultValue={factura.monto}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-black text-blue-600" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Estado de Pago</label>
                  <select 
                    name="estado" 
                    defaultValue={factura.estado}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-gray-900 appearance-none"
                  >
                    <option value="Pagado">Pagado</option>
                    <option value="Pendiente">Pendiente</option>
                    <option value="Vencido">Vencido</option>
                  </select>
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
                  {isLoading ? <Loader2 size={18} className="animate-spin" /> : <><Save size={18} /> Guardar</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
