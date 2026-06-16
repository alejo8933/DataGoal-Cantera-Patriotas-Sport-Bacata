'use client'

import React, { useState, useEffect } from 'react'
import { Plus, LayoutGrid, Loader2, Sparkles } from 'lucide-react'
import OKRCard from './OKRCard'
import CreateOKRModal from './CreateOKRModal'
import { getOKRs } from '@/services/actions/okr'

export default function OKRList() {
  const [objetivos, setObjetivos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    fetchOKRs()
  }, [])

  const fetchOKRs = async () => {
    setLoading(true)
    const data = await getOKRs()
    setObjetivos(data ?? [])
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="animate-spin text-indigo-500" size={40} />
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest animate-pulse">Cargando Estrategia...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Mini Header de Sección */}
      <div className="flex items-end justify-between px-2">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-600 shadow-lg shadow-indigo-200 dark:shadow-none text-white rounded-2xl">
            <Sparkles size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Estrategia y Objetivos</h2>
            <p className="text-sm text-slate-500 font-medium">Sigue el progreso de las metas del club y el rendimiento</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none transition-all active:scale-95 font-bold text-sm"
          >
            <Plus size={18} />
            Configurar Estrategia
          </button>
        </div>
      </div>

      {objetivos.length === 0 ? (
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-[40px] border-2 border-dashed border-slate-200 dark:border-slate-800 p-12 text-center">
          <div className="w-20 h-20 bg-white dark:bg-slate-900 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
             <LayoutGrid className="text-slate-300" size={32} />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No hay objetivos definidos</h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto text-sm leading-relaxed mb-8">
            Define tus primeros OKRs hoy para empezar a medir el éxito de tu academia de forma inteligente.
          </p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm"
          >
            Crear primer OKR
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {objetivos.map((okr) => (
            <OKRCard 
              key={okr.id}
              titulo={okr.titulo}
              descripcion={okr.descripcion}
              tipo={okr.tipo}
              krs={okr.krs}
            />
          ))}
        </div>
      )}

      <CreateOKRModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchOKRs}
      />
    </div>
  )
}
