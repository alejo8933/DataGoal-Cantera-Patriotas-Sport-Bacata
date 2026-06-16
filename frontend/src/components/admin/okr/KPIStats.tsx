'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, AlertCircle, Clock, Zap, Loader2 } from 'lucide-react'
import { getDashStats } from '@/services/actions/okr'

interface KPIWidgetProps {
  label: string
  value: string | number
  sublabel: string
  trend: 'up' | 'down' | 'neutral'
  variant: 'primary' | 'success' | 'warning'
}

function KPIWidget({ label, value, sublabel, trend, variant }: KPIWidgetProps) {
  const colors = {
    primary: 'bg-indigo-600 text-indigo-100',
    success: 'bg-emerald-600 text-emerald-100',
    warning: 'bg-amber-600 text-amber-100'
  }

  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className="bg-white dark:bg-slate-900 rounded-[32px] p-6 border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-5 group transition-all hover:shadow-xl"
    >
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${colors[variant]}`}>
        {variant === 'primary' && <Zap size={28} className="fill-current" />}
        {variant === 'success' && <CheckCircle2 size={28} className="fill-current" />}
        {variant === 'warning' && <AlertCircle size={28} className="fill-current" />}
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <div className="flex items-baseline gap-2">
          <h4 className="text-3xl font-black text-slate-900 dark:text-white">{value}</h4>
          <span className={`text-xs font-bold ${trend === 'up' ? 'text-emerald-500' : 'text-slate-400'}`}>
            {trend === 'up' && '↑'} {sublabel}
          </span>
        </div>
      </div>
    </motion.div>
  )
}

export default function KPIStats() {
  const [stats, setStats] = useState({
    asistencia: 0,
    recaudacion: 0,
    goles: 0,
    loading: true
  })

  // const supabase = createClient() // Ya no lo necesitamos aquí

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashStats()
        setStats({
          ...data,
          loading: false
        })
      } catch (error) {
        console.error('Error loading KPI stats:', error)
        setStats(s => ({ ...s, loading: false }))
      }
    }

    fetchStats()
  }, [])

  if (stats.loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-24 bg-slate-50 dark:bg-slate-800/50 animate-pulse rounded-[32px]" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
      <KPIWidget 
        label="Asistencia Promedio"
        value={`${stats.asistencia}%`}
        sublabel="Tiempo Real"
        trend="up"
        variant="primary"
      />
      <KPIWidget 
        label="Eficacia Recaudación"
        value={`${stats.recaudacion}%`}
        sublabel="vs Facturación"
        trend="up"
        variant="success"
      />
      <KPIWidget 
        label="Total Goles Cantera"
        value={stats.goles}
        sublabel="Temporada 2025"
        trend="up"
        variant="warning"
      />
    </div>
  )
}
