'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Target, TrendingUp, ChevronRight, MoreHorizontal } from 'lucide-react'

interface KR {
  id: string
  nombre: string
  valor_actual: number
  valor_meta: number
  unidad: string
}

interface OKRCardProps {
  titulo: string
  descripcion: string
  tipo: 'Club' | 'Categoria' | 'Personal'
  krs: KR[]
}

export default function OKRCard({ titulo, descripcion, tipo, krs }: OKRCardProps) {
  // Calcular progreso total como promedio de los KRs
  const totalProgress = krs.length > 0 
    ? Math.round(krs.reduce((acc, kr) => acc + (kr.valor_actual / kr.valor_meta), 0) / krs.length * 100)
    : 0

  const getStatusColor = (progress: number) => {
    if (progress >= 70) return 'from-emerald-500 to-teal-600'
    if (progress >= 30) return 'from-amber-500 to-orange-600'
    return 'from-rose-500 to-red-600'
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
    >
      {/* Badge de Tipo */}
      <div className="flex items-center justify-between mb-6">
        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest
          ${tipo === 'Club' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' : 
            tipo === 'Categoria' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 
            'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'}
        `}>
          {tipo}
        </span>
        <button className="text-slate-400 hover:text-indigo-600 transition-colors">
          <MoreHorizontal size={20} />
        </button>
      </div>

      <div className="flex items-start gap-4 mb-6">
        <div className={`p-3 rounded-2xl bg-gradient-to-br ${getStatusColor(totalProgress)} text-white shadow-lg`}>
          <Target size={24} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
            {titulo}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
            {descripcion}
          </p>
        </div>
      </div>

      {/* Barra de Progreso Principal */}
      <div className="mb-8">
        <div className="flex justify-between items-end mb-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Progreso Global</span>
          <span className="text-2xl font-black text-slate-900 dark:text-white">{totalProgress}%</span>
        </div>
        <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${totalProgress}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className={`h-full bg-gradient-to-r ${getStatusColor(totalProgress)}`}
          />
        </div>
      </div>

      {/* Resultados Clave (KRs) */}
      <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
        {krs.slice(0, 2).map((kr) => (
          <div key={kr.id} className="group/kr">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 truncate pr-4">
                {kr.nombre}
              </span>
              <span className="text-xs font-bold text-slate-900 dark:text-white shrink-0">
                {kr.valor_actual}{kr.unidad} / {kr.valor_meta}{kr.unidad}
              </span>
            </div>
            <div className="h-1.5 w-full bg-slate-50 dark:bg-slate-800/50 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(kr.valor_actual / kr.valor_meta) * 100}%` }}
                className="h-full bg-indigo-500 group-hover/kr:bg-indigo-400 transition-colors"
              />
            </div>
          </div>
        ))}
        {krs.length > 2 && (
          <button className="w-full mt-2 py-2 text-[10px] font-bold text-slate-400 hover:text-indigo-600 uppercase tracking-widest flex items-center justify-center gap-1 transition-all">
            Ver {krs.length - 2} Resultados Clave más <ChevronRight size={12} />
          </button>
        )}
      </div>

      {/* Overlay decorativo para hover */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -mr-16 -mt-16 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.div>
  )
}
