'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldAlert, CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import { MatrixData, validarRetoMatriz } from '@/lib/actions/usuarios.actions'

interface MatrixChallengeProps {
  onSuccess: () => void
  onCancel: () => void
  title?: string
  description?: string
}

export default function MatrixChallenge({ 
  onSuccess, 
  onCancel, 
  title = "Validación de Seguridad",
  description = "Por favor, ingrese los valores de las siguientes coordenadas de su tarjeta para continuar."
}: MatrixChallengeProps) {
  const [coords, setCoords] = useState<string[]>([])
  const [inputs, setInputs] = useState<MatrixData>({})
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  // Generar 3 coordenadas aleatorias al cargar
  useEffect(() => {
    const rows = ['A', 'B', 'C', 'D', 'E']
    const cols = ['1', '2', '3', '4', '5']
    const all = []
    for (const r of rows) for (const c of cols) all.push(`${r}${c}`)
    
    // Mezclar y tomar 3
    const shuffled = all.sort(() => 0.5 - Math.random())
    const selected = shuffled.slice(0, 3)
    setCoords(selected)
    
    const initialInputs: MatrixData = {}
    selected.forEach(c => initialInputs[c] = '')
    setInputs(initialInputs)
  }, [])

  const handleInputChange = (coord: string, value: string) => {
    // Solo permitir números y máximo 3 caracteres
    if (/^\d*$/.test(value) && value.length <= 3) {
      setInputs(prev => ({ ...prev, [coord]: value }))
      if (status === 'error') setStatus('idle')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validar que todos los campos tengan 3 dígitos
    const isComplete = Object.values(inputs).every(v => v.length === 3)
    if (!isComplete) {
      setStatus('error')
      setErrorMessage('Por favor ingrese los 3 dígitos para cada coordenada.')
      return
    }

    setStatus('loading')
    const result = await validarRetoMatriz(inputs)
    
    if (result.success) {
      setStatus('success')
      setTimeout(() => onSuccess(), 1000)
    } else {
      setStatus('error')
      setErrorMessage(result.message || 'Error de validación')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md overflow-hidden"
      >
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
              <ShieldAlert size={20} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h3>
          </div>
          
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">
            {description}
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-between gap-4">
              {coords.map((coord) => (
                <div key={coord} className="flex-1 text-center">
                  <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase mb-2">
                    {coord}
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    autoFocus={coord === coords[0]}
                    value={inputs[coord] || ''}
                    onChange={(e) => handleInputChange(coord, e.target.value)}
                    placeholder="---"
                    className={`w-full h-14 text-center text-2xl font-mono font-bold rounded-xl border-2 transition-all outline-none
                      ${status === 'error' ? 'border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10 text-red-600' : 
                        status === 'success' ? 'border-green-200 dark:border-green-900/30 bg-green-50 dark:bg-green-900/10 text-green-600' :
                        'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 focus:border-indigo-500 dark:focus:border-indigo-400 text-slate-900 dark:text-white'}
                    `}
                  />
                </div>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {status === 'error' && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/10 p-3 rounded-lg border border-red-100 dark:border-red-900/20"
                >
                  <XCircle size={16} />
                  <span>{errorMessage}</span>
                </motion.div>
              )}
              {status === 'success' && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/10 p-3 rounded-lg border border-green-100 dark:border-green-900/20"
                >
                  <CheckCircle2 size={16} />
                  <span>Validación exitosa, redirigiendo...</span>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 px-4 py-3 text-slate-600 dark:text-slate-400 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                disabled={status === 'loading'}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-200 dark:shadow-none active:scale-95 flex items-center justify-center gap-2"
                disabled={status === 'loading' || status === 'success'}
              >
                {status === 'loading' ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  "Verificar"
                )}
              </button>
            </div>
          </form>
        </div>
        
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 text-center">
          <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold">
            Sistema de Seguridad Data_Goal v2.0
          </p>
        </div>
      </motion.div>
    </div>
  )
}
