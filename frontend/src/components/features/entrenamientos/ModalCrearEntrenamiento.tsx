'use client'

import { useState, useRef } from 'react'
import { Plus, X, Loader2 } from 'lucide-react'
import { crearEntrenamiento } from '@/lib/actions/entrenamientos.actions'

export default function ModalCrearEntrenamiento() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    
    const result = await crearEntrenamiento(formData)
    
    if (result?.success) {
      formRef.current?.reset()
      setIsOpen(false)
    } else {
      setError(result?.error || 'Error desconocido.')
    }
    
    setIsLoading(false)
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition shadow-sm flex items-center gap-2"
      >
        <Plus size={18} />
        Nueva Sesión
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Agendar Entrenamiento</h2>
              <button 
                onClick={() => !isLoading && setIsOpen(false)}
                className="text-gray-400 hover:text-gray-700 transition"
              >
                <X size={20} />
              </button>
            </div>
            
            <form ref={formRef} onSubmit={handleSubmit} className="p-6">
              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100">
                  {error}
                </div>
              )}
              
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="titulo" className="text-sm font-medium text-gray-700">Título de Sesión <span className="text-red-500">*</span></label>
                  <input required type="text" id="titulo" name="titulo" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition" placeholder="Ej: Práctica Táctica Semanal" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="fecha" className="text-sm font-medium text-gray-700">Fecha <span className="text-red-500">*</span></label>
                    <input required type="date" id="fecha" name="fecha" min="2024-01-01" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition text-gray-700" />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="hora" className="text-sm font-medium text-gray-700">Hora</label>
                    <input type="time" id="hora" name="hora" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition text-gray-700" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="categoria" className="text-sm font-medium text-gray-700">Categoría Objetiva <span className="text-red-500">*</span></label>
                    <select required id="categoria" name="categoria" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition bg-white">
                      <option value="">Selecciona...</option>
                      <option value="Sub-9">Sub-9</option>
                      <option value="Sub-11">Sub-11</option>
                      <option value="Sub-13">Sub-13</option>
                      <option value="Sub-15">Sub-15</option>
                      <option value="Sub-17">Sub-17</option>
                      <option value="Libre">Libre</option>
                      <option value="Todas">Todas (General)</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="lugar" className="text-sm font-medium text-gray-700">Lugar de Práctica</label>
                    <input type="text" id="lugar" name="lugar" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition" placeholder="Sede Principal" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="descripcion" className="text-sm font-medium text-gray-700">Instrucciones u Objetivos</label>
                  <textarea id="descripcion" name="descripcion" rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition" placeholder="Enfocado en precisión de pases..."></textarea>
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3 p-4 bg-gray-50 -mx-6 -mb-6 rounded-b-2xl border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => setIsOpen(false)}
                  disabled={isLoading}
                  className="px-4 py-2 font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition"
                >
                  Regresar
                </button>
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition flex items-center justify-center min-w-[120px] disabled:opacity-70 shadow-sm"
                >
                  {isLoading ? <Loader2 size={18} className="animate-spin" /> : 'Confirmar Sesión'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
