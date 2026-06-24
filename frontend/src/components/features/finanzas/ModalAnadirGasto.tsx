'use client'

import { useState, useRef } from 'react'
import { Plus, X, Loader2 } from 'lucide-react'
import { anadirGasto } from '@/services/actions/finanzas'

export default function ModalAnadirGasto() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    const result = await anadirGasto(formData)
    
    if (result?.success) {
      formRef.current?.reset()
      setIsOpen(false)
    } else {
      setError(result?.message || 'Error reportando el gasto.')
    }
    
    setIsLoading(false)
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded transition flex items-center gap-1"
      >
        <Plus size={16} /> 
        Añadir Gasto
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Salida de Capital (Gasto)</h2>
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
                  ⚠️ {error} <br/> (Verifica con tu programador si la tabla "gastos" está creada)
                </div>
              )}
              
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="concepto" className="text-sm font-medium text-gray-700">Concepto de Gasto <span className="text-red-500">*</span></label>
                  <input required type="text" id="concepto" name="concepto" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition" placeholder="Ej: Compra de 10 Balones" />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="categoria" className="text-sm font-medium text-gray-700">Categoría <span className="text-red-500">*</span></label>
                  <select required id="categoria" name="categoria" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition bg-white">
                    <option value="">Selecciona...</option>
                    <option value="Equipamiento Base">Equipamiento Base</option>
                    <option value="Instalaciones">Instalaciones (Alquileres)</option>
                    <option value="Inscripción de Torneos">Inscripción de Torneos</option>
                    <option value="Nómina y Arbitrajes">Nómina y Arbitrajes</option>
                    <option value="Logística (Transporte/Agua)">Logística</option>
                    <option value="Varios">Varios (Otros)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="fecha" className="text-sm font-medium text-gray-700">Fecha del Gasto <span className="text-red-500">*</span></label>
                    <input required type="date" id="fecha" name="fecha" min="2024-01-01" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition text-gray-700" />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="monto" className="text-sm font-medium text-gray-700">Monto Restado (COP) <span className="text-red-500">*</span></label>
                    <input required type="number" min="1000" step="1000" id="monto" name="monto" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition font-mono text-red-600 font-medium" placeholder="450000" />
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
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition flex items-center justify-center min-w-[140px] disabled:opacity-70 shadow-sm"
                >
                  {isLoading ? <Loader2 size={18} className="animate-spin" /> : 'Confirmar Salida'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
