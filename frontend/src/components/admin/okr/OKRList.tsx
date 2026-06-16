'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, LayoutGrid, List as ListIcon, Loader2, Sparkles, Zap } from 'lucide-react'
import Link from 'next/link'
import OKRCard from './OKRCard'
import CreateOKRModal from './CreateOKRModal'
import { seedDashboardData } from '@/services/actions/okr'
import { useRouter } from 'next/navigation'

export default function OKRList() {
  const [objetivos, setObjetivos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [seeding, setSeeding] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    fetchOKRs()
  }, [])

  const fetchOKRs = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('okr_objetivos')
      .select(`
        *,
        krs:okr_resultados_clave(*)
      `)
      .order('created_at', { ascending: false })

    if (data) setObjetivos(data)
    setLoading(false)
  }

  const handleSeed = async () => {
    if (!confirm('¿Quieres simular datos de asistencia, finanzas y rendimiento para este dashboard?')) return
    
    setSeeding(true)
    const res = await seedDashboardData()
    if (res.success) {
      alert('¡Simulación completada! Los datos ahora son visibles.')
      // No necesitamos router.refresh() si fetchOKRs hace el trabajo, pero 
      // KPIStats es otro componente. Forzamos recarga de la página.
      window.location.reload()
    } else {
      alert('Error en simulación: ' + (res.message || 'Error desconocido'))
    }
    setSeeding(false)
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
            onClick={handleSeed}
            disabled={seeding}
            className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95 font-bold text-sm disabled:opacity-50"
          >
            {seeding ? <Loader2 className="animate-spin" size={18} /> : <Zap size={18} className="text-amber-500" />}
            Simular Temporada
          </button>
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
