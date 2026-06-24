'use client'

import { useState, useRef } from 'react'
import { Edit2, X, Loader2 } from 'lucide-react'
import { editarEquipo } from '@/services/actions/equipos'

interface ModalEditarEquipoProps {
  equipo: {
    id: string
    equipo: string
    categoria: string | null
  }
}

export default function ModalEditarEquipo({ equipo }: ModalEditarEquipoProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    formData.append('id', equipo.id)
    
    const result = await editarEquipo(formData)
    
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
        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
        title="Editar Categoría"
      >
        <Edit2 size={18} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-in fade-in duration-200 text-left">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Editar Categoría</h2>
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
                  <label htmlFor="equipo" className="text-sm font-medium text-gray-700">Nombre de la Categoría <span className="text-red-500">*</span></label>
                  <input required type="text" id="equipo" name="equipo" defaultValue={equipo.equipo} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition" />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="categoria" className="text-sm font-medium text-gray-700">Rango / Nivel <span className="text-red-500">*</span></label>
                  <select required id="categoria" name="categoria" defaultValue={equipo.categoria || ''} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition bg-white text-gray-900">
                    <option value="">Selecciona...</option>
                    <option value="Sub-9">Sub-9</option>
                    <option value="Sub-11">Sub-11</option>
                    <option value="Sub-13">Sub-13</option>
                    <option value="Sub-15">Sub-15</option>
                    <option value="Sub-17">Sub-17</option>
                    <option value="Libre">Libre</option>
                  </select>
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsOpen(false)}
                  disabled={isLoading}
                  className="px-4 py-2 font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition"
                >
                  Cerrar
                </button>
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition flex items-center justify-center min-w-[120px] disabled:opacity-70"
                >
                  {isLoading ? <Loader2 size={18} className="animate-spin" /> : 'Actualizar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
