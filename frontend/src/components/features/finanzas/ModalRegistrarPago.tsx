'use client'

import { useState, useRef } from 'react'
import { CheckCircle, X, Loader2 } from 'lucide-react'
import { registrarPago } from '@/services/actions/finanzas'

export default function ModalRegistrarPago() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    const result = await registrarPago(formData)
    
    if (result?.success) {
      formRef.current?.reset()
      setIsOpen(false)
    } else {
      setError(result?.message || 'Error registrando el pago.')
    }
    
    setIsLoading(false)
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100 flex items-center gap-2 px-3 py-1.5 rounded transition"
      >
        <CheckCircle size={16} />
        Registrar Pago
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Ingreso por Mensualidad</h2>
              <button 
                onClick={() => !isLoading && setIsOpen(false)}
                className="text-gray-400 hover:text-gray-700 transition"
              >
                <X size={20} />
              </button>
            </div>
            
            <form ref={formRef} onSubmit={handleSubmit} className="p-6">
              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100 italic">
                  ⚠️ {error} <br/> (Verifica con tu programador la tabla "facturas")
                </div>
              )}
              
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="jugador" className="text-sm font-medium text-gray-700">Nombre del Jugador <span className="text-red-500">*</span></label>
                  <input required type="text" id="jugador" name="jugador" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition" placeholder="Ej: Mateo Gómez" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="fecha" className="text-sm font-medium text-gray-700">Mes Pagado (Fecha) <span className="text-red-500">*</span></label>
                    <input required type="date" id="fecha" name="fecha" min="2024-01-01" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition text-gray-700" />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="monto" className="text-sm font-medium text-gray-700">Monto Cobrado (COP) <span className="text-red-500">*</span></label>
                    <input required type="number" min="1000" step="1000" id="monto" name="monto" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition font-mono text-green-700 font-medium bg-green-50/30" placeholder="150000" />
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3 p-4 bg-gray-50 -mx-6 -mb-6 rounded-b-2xl border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => setIsOpen(false)}
                  disabled={isLoading}
                  className="px-4 py-2 font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition flex items-center justify-center min-w-[140px] disabled:opacity-70 shadow-sm"
                >
                  {isLoading ? <Loader2 size={18} className="animate-spin" /> : 'Confirmar Ingreso'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
