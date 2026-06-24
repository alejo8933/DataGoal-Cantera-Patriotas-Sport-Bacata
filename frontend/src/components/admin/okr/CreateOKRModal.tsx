'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Target, Info, Sparkles, Plus, Trash2, LayoutGrid, CheckCircle2 } from 'lucide-react'
import { upsertOKR, addKR } from '@/services/actions/okr'

interface CreateOKRModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function CreateOKRModal({ isOpen, onClose, onSuccess }: CreateOKRModalProps) {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [okrData, setOkrData] = useState({
    titulo: '',
    descripcion: '',
    tipo: 'Club' as 'Club' | 'Categoria' | 'Personal',
    periodo: '2025-T2'
  })

  const [krs, setKrs] = useState([
    { nombre: '', valor_meta: 100, kpi_slug: 'perc_asistencia', unidad: '%' }
  ])

  const handleAddKR = () => {
    setKrs([...krs, { nombre: '', valor_meta: 100, kpi_slug: 'manual', unidad: '%' }])
  }

  const handleRemoveKR = (index: number) => {
    setKrs(krs.filter((_, i) => i !== index))
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      // 1. Guardar OKR
      const newOKR = await upsertOKR(okrData)
      
      // 2. Guardar cada KR vinculado
      for (const kr of krs) {
        await addKR({ ...kr, objetivo_id: newOKR.id })
      }

      onSuccess()
      onClose()
      // Reset
      setStep(1)
      setOkrData({ titulo: '', descripcion: '', tipo: 'Club', periodo: '2025-T2' })
      setKrs([{ nombre: '', valor_meta: 100, kpi_slug: 'perc_asistencia', unidad: '%' }])
    } catch (error) {
      console.error('Error saving OKR:', error)
      alert('Error al guardar el objetivo estratégico')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-white/20 overflow-hidden"
        >
          {/* Header */}
          <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-indigo-50/50 to-white dark:from-indigo-900/10 dark:to-transparent">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-200 dark:shadow-none">
                <Target size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  Nuevo Objetivo Estratégico
                </h2>
                <p className="text-sm text-slate-500 font-medium italic">Define hacia donde va el club</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-slate-400"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
            {step === 1 ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Título del Objetivo</label>
                    <input 
                      type="text"
                      className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-indigo-500 rounded-2xl outline-none transition-all font-bold text-slate-900 dark:text-white"
                      placeholder="Ej: Excelencia en Cantera"
                      value={okrData.titulo}
                      onChange={(e) => setOkrData({...okrData, titulo: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Nivel / Alcance</label>
                    <select 
                      className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-indigo-500 rounded-2xl outline-none transition-all font-bold text-slate-900 dark:text-white appearance-none"
                      value={okrData.tipo}
                      onChange={(e) => setOkrData({...okrData, tipo: e.target.value as any})}
                    >
                      <option value="Club">Club</option>
                      <option value="Categoria">Categoría</option>
                      <option value="Personal">Personal</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Descripción Estratégica</label>
                  <textarea 
                    rows={3}
                    className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-indigo-500 rounded-2xl outline-none transition-all font-medium text-slate-700 dark:text-slate-300"
                    placeholder="Describe el impacto que buscas con esta meta..."
                    value={okrData.descripcion}
                    onChange={(e) => setOkrData({...okrData, descripcion: e.target.value})}
                  />
                </div>

                <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex gap-3 border border-indigo-100 dark:border-indigo-800">
                  <Info className="text-indigo-500 shrink-0" size={20} />
                  <p className="text-xs text-indigo-700 dark:text-indigo-300 leading-relaxed">
                    Un buen OKR debe ser cualitativo e inspirador. Los Resultados Clave (KR) en el siguiente paso lo harán medible.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <LayoutGrid size={18} className="text-indigo-500" />
                    Resultados Clave (Medibles)
                  </h3>
                  <button 
                    onClick={handleAddKR}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black transition-all shadow-md"
                  >
                    <Plus size={14} /> Añadir KR
                  </button>
                </div>

                <div className="space-y-4">
                  {krs.map((kr, index) => (
                    <div key={index} className="p-5 bg-slate-50 dark:bg-slate-800/40 rounded-[2rem] border border-slate-100 dark:border-slate-800 relative group">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                        <div className="md:col-span-6 space-y-1">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nombre del KR</label>
                          <input 
                            type="text"
                            placeholder="Ej: 95% Asistencia"
                            className="w-full bg-transparent border-b border-slate-200 dark:border-slate-700 py-2 outline-none focus:border-indigo-500 text-sm font-bold text-slate-900 dark:text-white"
                            value={kr.nombre}
                            onChange={(e) => {
                              const newKrs = [...krs]
                              newKrs[index].nombre = e.target.value
                              setKrs(newKrs)
                            }}
                          />
                        </div>
                        <div className="md:col-span-3 space-y-1">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Valor Meta</label>
                          <input 
                            type="number"
                            className="w-full bg-transparent border-b border-slate-200 dark:border-slate-700 py-2 outline-none focus:border-indigo-500 text-sm font-bold text-slate-900 dark:text-white"
                            value={kr.valor_meta}
                            onChange={(e) => {
                              const newKrs = [...krs]
                              newKrs[index].valor_meta = parseInt(e.target.value)
                              setKrs(newKrs)
                            }}
                          />
                        </div>
                        <div className="md:col-span-3 space-y-1">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Métrica (KPI)</label>
                          <select 
                            className="w-full bg-transparent border-b border-slate-200 dark:border-slate-700 py-2 outline-none focus:border-indigo-500 text-xs font-black text-slate-600 dark:text-slate-400"
                            value={kr.kpi_slug}
                            onChange={(e) => {
                              const newKrs = [...krs]
                              newKrs[index].kpi_slug = e.target.value
                              setKrs(newKrs)
                            }}
                          >
                            <option value="perc_asistencia">Asistencia %</option>
                            <option value="perc_recaudacion">Recaudación %</option>
                            <option value="avg_goles">Promedio Goles</option>
                            <option value="manual">Indicador Manual</option>
                          </select>
                        </div>
                      </div>

                      {krs.length > 1 && (
                        <button 
                          onClick={() => handleRemoveKR(index)}
                          className="absolute -right-2 -top-2 p-2 bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white rounded-full transition-all shadow-sm opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-8 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between">
            <div className="flex gap-2">
              <div className={`w-2 h-2 rounded-full ${step === 1 ? 'bg-indigo-600' : 'bg-indigo-200'}`} />
              <div className={`w-2 h-2 rounded-full ${step === 2 ? 'bg-indigo-600' : 'bg-indigo-200'}`} />
            </div>

            <div className="flex items-center gap-4">
              {step === 2 && (
                <button 
                  onClick={() => setStep(1)}
                  className="px-6 py-3 text-slate-500 font-bold hover:text-slate-900 transition-colors"
                >
                  Atrás
                </button>
              )}
              
              <button
                onClick={step === 1 ? () => setStep(2) : handleSave}
                disabled={loading || (step === 1 && !okrData.titulo)}
                className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black shadow-lg shadow-indigo-200 dark:shadow-none flex items-center gap-2 transition-all disabled:opacity-50 disabled:grayscale"
              >
                {loading ? (
                  <Sparkles className="animate-spin" size={20} />
                ) : step === 1 ? (
                  <>Siguiente Paso</>
                ) : (
                  <>
                    <CheckCircle2 size={20} /> Lanzar Objetivo
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
