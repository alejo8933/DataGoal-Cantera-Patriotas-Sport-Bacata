'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, Eye, EyeOff, ShieldCheck, RefreshCw } from 'lucide-react'
import { MatrixData, generarMatrizUsuario } from '@/lib/actions/usuarios.actions'

interface MatrixCardProps {
  initialMatrix?: MatrixData
  onGenerate?: () => void
}

export default function MatrixCard({ initialMatrix, onGenerate }: MatrixCardProps) {
  const [matrix, setMatrix] = useState<MatrixData | undefined>(initialMatrix)
  const [isVisible, setIsVisible] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  const rows = ['A', 'B', 'C', 'D', 'E']
  const cols = ['1', '2', '3', '4', '5']

  const handleGenerate = async () => {
    setIsGenerating(true)
    const result = await generarMatrizUsuario()
    if (result.success && result.matrix) {
      setMatrix(result.matrix)
      setIsVisible(true)
      if (onGenerate) onGenerate()
    }
    setIsGenerating(false)
  }

  const downloadPDF = async () => {
    if (!matrix) return
    
    // Importación dinámica para evitar errores de SSR
    const { jsPDF } = await import('jspdf')
    const doc = new jsPDF()
    
    doc.setFontSize(22)
    doc.text('DataGoal - Tarjeta de Coordenadas', 20, 20)
    
    doc.setFontSize(12)
    doc.text('Guarde esta tarjeta en un lugar seguro. No la comparta con nadie.', 20, 30)
    
    let y = 50
    doc.setFontSize(14)
    
    // Dibujar Grid en PDF
    rows.forEach((row, i) => {
      let x = 30
      cols.forEach((col, j) => {
        const key = `${row}${col}`
        doc.text(`${key}: ${matrix[key]}`, x, y)
        x += 35
      })
      y += 15
    })
    
    doc.save('DataGoal_Matrix.pdf')
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8 max-w-2xl mx-auto overflow-hidden relative">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl text-indigo-600 dark:text-indigo-400">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Tarjeta de Seguridad</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Su segundo factor de autenticación</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setIsVisible(!isVisible)}
            disabled={!matrix}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400 transition-colors disabled:opacity-30"
            title={isVisible ? "Ocultar" : "Mostrar"}
          >
            {isVisible ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
          <button
            onClick={downloadPDF}
            disabled={!matrix}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400 transition-colors disabled:opacity-30"
            title="Descargar PDF"
          >
            <Download size={20} />
          </button>
        </div>
      </div>

      {!matrix ? (
        <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900/50">
          <p className="text-slate-500 dark:text-slate-400 mb-6 text-center max-w-xs">
            Aún no has generado tu tarjeta de coordenadas de seguridad.
          </p>
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-indigo-200 dark:shadow-none active:scale-95 disabled:opacity-50"
          >
            {isGenerating ? (
              <RefreshCw className="animate-spin" size={20} />
            ) : (
              "Generar Mi Tarjeta"
            )}
          </button>
        </div>
      ) : (
        <div className="relative group">
          <div className={`grid grid-cols-6 gap-2 transition-all duration-500 ${!isVisible ? 'blur-md grayscale opacity-20 select-none pointer-events-none' : 'blur-0 opacity-100'}`}>
            {/* Header column index */}
            <div className="h-10"></div>
            {cols.map(c => (
              <div key={c} className="h-10 flex items-center justify-center font-bold text-slate-400 dark:text-slate-600">{c}</div>
            ))}

            {rows.map(row => (
              <React.Fragment key={row}>
                {/* Row label */}
                <div className="w-10 h-12 flex items-center justify-center font-bold text-slate-400 dark:text-slate-600">{row}</div>
                {cols.map(col => {
                  const key = `${row}${col}`
                  return (
                    <motion.div
                      key={key}
                      whileHover={{ scale: 1.05 }}
                      className="h-12 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg flex items-center justify-center font-mono font-bold text-indigo-600 dark:text-indigo-400 shadow-sm"
                    >
                      {matrix[key]}
                    </motion.div>
                  )
                })}
              </React.Fragment>
            ))}
          </div>
          
          {!isVisible && (
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={() => setIsVisible(true)}
                className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-6 py-2 rounded-full shadow-2xl border border-slate-200 dark:border-slate-700 font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all active:scale-95"
              >
                Haga clic para mostrar
              </button>
            </div>
          )}
        </div>
      )}

      {matrix && (
        <div className="mt-8 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30 rounded-xl">
          <p className="text-xs text-amber-800 dark:text-amber-400 leading-relaxed">
            <strong>ADVERTENCIA:</strong> Esta tarjeta es personal e intransferible. El personal de DataGoal nunca le pedirá la tarjeta completa, solo coordenadas específicas para validar acciones.
          </p>
        </div>
      )}

      <div className="mt-8 flex justify-center">
        {matrix && (
            <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="text-sm text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 flex items-center gap-2 transition-colors"
            >
                <RefreshCw size={14} className={isGenerating ? 'animate-spin' : ''} />
                Regenerar Tarjeta
            </button>
        )}
      </div>
    </div>
  )
}
