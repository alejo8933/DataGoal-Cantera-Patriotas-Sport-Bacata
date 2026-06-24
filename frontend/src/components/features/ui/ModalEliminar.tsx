'use client'

import { useState } from 'react'
import { Trash2, AlertTriangle, Loader2 } from 'lucide-react'
import { eliminarOInhabilitarRegistro } from '@/services/actions/eliminar'

interface ModalEliminarProps {
  tabla: string
  idRegistro: string
  pathRevalidacion: string
  modo?: 'hard' | 'inactivo' | 'cancelado' | 'falso'
  etiqueta?: string 
  esIcono?: boolean
}

export default function ModalEliminar({ 
  tabla, 
  idRegistro, 
  pathRevalidacion, 
  modo = 'hard', 
  etiqueta = 'Eliminar',
  esIcono = false 
}: ModalEliminarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const esSoftDelete = modo !== 'hard'

  const handleConfirm = async () => {
    setIsLoading(true)
    setError(null)

    const formData = new FormData()
    formData.append('tabla', tabla)
    formData.append('id', idRegistro)
    formData.append('mode', modo)
    formData.append('path', pathRevalidacion)
    
    const result = await eliminarOInhabilitarRegistro(formData)
    
    if (result.success) {
      setIsOpen(false)
    } else {
      setError(result.message)
    }
    
    setIsLoading(false)
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        title={etiqueta}
        className={esIcono 
          ? "p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition" 
          : "text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded transition flex items-center gap-1 w-full"
        }
      >
        <Trash2 size={esIcono ? 18 : 16} /> 
        {!esIcono && <span>{etiqueta}</span>}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <AlertTriangle size={32} className="text-red-600" />
              </div>
              
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                {esSoftDelete ? '¿Desactivar Registro?' : '¿Borrado Permanente?'}
              </h2>
              
              <p className="text-gray-500 text-sm mb-6">
                {esSoftDelete 
                  ? 'Este elemento pasará a estar inactivo o cancelado, pero permanecerá en la historia de la base de datos.' 
                  : 'Esta acción es irreversible. Se destruirá esta información de la base de datos central.'}
              </p>

              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100 w-full text-left">
                  {error}
                </div>
              )}

              <div className="flex gap-3 w-full">
                <button 
                  onClick={() => setIsOpen(false)}
                  disabled={isLoading}
                  className="flex-1 py-2.5 font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleConfirm}
                  disabled={isLoading}
                  className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition flex items-center justify-center disabled:opacity-70"
                >
                  {isLoading ? <Loader2 size={18} className="animate-spin" /> : 'Confirmar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
