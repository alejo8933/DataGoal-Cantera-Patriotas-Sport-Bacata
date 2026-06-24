'use client'

import { useState } from 'react'
import { Settings2, X, Loader2, ListChecks, Trash2 } from 'lucide-react'
import { editarCategoriaMaestra } from '@/services/actions/categorias_maestras'

interface ModalEditarCategoriaMaestraProps {
  categoria: {
    id: string
    nombre: string
    edades: string | null
    modalidad: string | null
  }
}

export default function ModalEditarCategoriaMaestra({ categoria }: ModalEditarCategoriaMaestraProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    formData.append('id', categoria.id)
    
    const result = await editarCategoriaMaestra(formData)
    
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
        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
        title="Editar parámetros maestros"
      >
        <Settings2 size={16} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-gray-950/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-500">
            
            <div className="flex items-center justify-between px-10 py-6 border-b border-gray-50 bg-gray-50/50">
              <h3 className="text-xl font-black text-gray-900 tracking-tight">Editar Categoría Maestra</h3>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-900"><X size={24} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-10 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Nombre Maestro</label>
                <input 
                  required
                  name="nombre"
                  defaultValue={categoria.nombre}
                  className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-red-500/20 outline-none transition-all font-bold text-gray-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Rango Edades</label>
                  <input 
                    name="edades"
                    defaultValue={categoria.edades || ''}
                    className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-red-500/20 outline-none transition-all font-bold text-gray-900"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Modalidad</label>
                  <select 
                    name="modalidad"
                    defaultValue={categoria.modalidad || 'Competitivo'}
                    className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white outline-none font-bold text-gray-900"
                  >
                    <option value="Competitivo">Competitivo</option>
                    <option value="Formativo">Formativo</option>
                    <option value="Alto Rendimiento">Alto Rendimiento</option>
                  </select>
                </div>
              </div>

              <div className="pt-6 flex items-center justify-end gap-4">
                <button type="submit" disabled={isLoading} className="px-8 py-4 bg-gray-900 hover:bg-black text-white font-black text-[10px] uppercase tracking-widest rounded-2xl transition-all shadow-xl">
                  {isLoading ? <Loader2 size={16} className="animate-spin" /> : 'Sincronizar Cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
