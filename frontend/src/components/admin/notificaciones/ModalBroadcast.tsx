'use client'

import { useState } from 'react'
import { 
  Bell, 
  Send, 
  Users, 
  X, 
  AlertCircle, 
  CheckCircle, 
  Info,
  ChevronRight,
  Loader2,
  Trash2,
  Megaphone
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { enviarNotificacionMasiva } from '@/lib/entrenador/notificaciones'
import { useRouter } from 'next/navigation'

export default function ModalBroadcast() {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const [form, setForm] = useState({
    targetRole: 'all' as 'all' | 'entrenador' | 'jugador' | 'admin',
    prioridad: 'media',
    titulo: '',
    descripcion: '',
    tipo: 'comunicado'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.titulo || !form.descripcion) {
      setError('Por favor completa todos los campos requeridos')
      return
    }

    setLoading(true)
    setError(null)

    const res = await enviarNotificacionMasiva(form)

    if (res.success) {
      setSuccess(true)
      setTimeout(() => {
        setIsOpen(false)
        setSuccess(false)
        setForm({
           targetRole: 'all',
           prioridad: 'media',
           titulo: '',
           descripcion: '',
           tipo: 'comunicado'
        })
        router.refresh()
      }, 2000)
    } else {
      setError(res.error || 'Error al enviar el comunicado')
    }
    setLoading(false)
  }

  const roleLabels = {
    all: 'Todo el Club',
    entrenador: 'Entrenadores',
    jugador: 'Jugadores',
    admin: 'Administradores'
  }

  const priorityColors = {
    baja: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    media: 'bg-blue-50 text-blue-600 border-blue-100',
    alta: 'bg-red-50 text-red-600 border-red-100'
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl shadow-lg shadow-red-500/20 transition-all active:scale-95 group"
      >
        <Megaphone size={20} className="group-hover:rotate-12 transition-transform" />
        Nuevo Comunicado
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !loading && setIsOpen(false)}
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
            />

            {/* Modal Content */}
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[32px] shadow-2xl overflow-hidden border border-gray-100"
            >
              {/* Header */}
              <div className="p-8 pb-4 flex items-center justify-between border-b border-gray-50 bg-gray-50/50">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-red-600 flex items-center justify-center text-white shadow-xl shadow-red-500/20">
                    <Megaphone size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-gray-900 leading-tight">Comunicado Masivo</h2>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-0.5">Centro de Difusión Administrador</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-200/50 text-gray-400 hover:text-gray-900 rounded-xl transition-all"
                  disabled={loading}
                >
                  <X size={24} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                
                {/* Audiencia y Prioridad */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Para quién:</label>
                    <select 
                      value={form.targetRole}
                      onChange={(e) => setForm({...form, targetRole: e.target.value as any})}
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-red-500/10 focus:border-red-500 outline-none font-bold text-gray-700 transition-all appearance-none cursor-pointer"
                    >
                      <option value="all">Todo el Club</option>
                      <option value="entrenador">Entrenadores únicamente</option>
                      <option value="jugador">Jugadores únicamente</option>
                      <option value="admin">Otros Administradores</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Prioridad del mensaje:</label>
                    <div className="flex bg-gray-50 p-1 rounded-2xl border border-gray-100 h-[58px]">
                      {(['baja', 'media', 'alta'] as const).map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setForm({...form, prioridad: p})}
                          className={`flex-1 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                            form.prioridad === p 
                              ? p === 'alta' ? 'bg-red-600 text-white shadow-lg shadow-red-500/20' : 
                                p === 'media' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' :
                                'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'
                              : 'text-gray-400 hover:text-gray-600'
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Título */}
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Título del Comunicado:</label>
                  <input 
                    type="text"
                    required
                    placeholder="Ej: Cambio de horario - Torneo Liga Bogotá"
                    value={form.titulo}
                    onChange={(e) => setForm({...form, titulo: e.target.value})}
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-red-500/10 focus:border-red-500 outline-none font-bold text-gray-700 placeholder:text-gray-300 transition-all"
                  />
                </div>

                {/* Descripción */}
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Mensaje detallado:</label>
                  <textarea 
                    required
                    rows={4}
                    placeholder="Escribe aquí los detalles del anuncio..."
                    value={form.descripcion}
                    onChange={(e) => setForm({...form, descripcion: e.target.value})}
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-3xl focus:ring-4 focus:ring-red-500/10 focus:border-red-500 outline-none font-bold text-gray-700 placeholder:text-gray-300 transition-all resize-none"
                  />
                </div>

                {/* Feedback */}
                {error && (
                  <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }} 
                    animate={{ scale: 1, opacity: 1 }}
                    className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center gap-3 text-sm font-bold"
                  >
                    <AlertCircle size={20} />
                    {error}
                  </motion.div>
                )}

                {success && (
                  <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }} 
                    animate={{ scale: 1, opacity: 1 }}
                    className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center gap-3 text-sm font-bold"
                  >
                    <CheckCircle size={20} />
                    ¡Comunicado enviado con éxito!
                  </motion.div>
                )}

                {/* Footer Buttons */}
                <div className="pt-4 flex gap-4">
                  <button 
                    type="button"
                    disabled={loading}
                    onClick={() => setIsOpen(false)}
                    className="flex-1 py-4 bg-gray-100 hover:bg-gray-200 text-gray-500 font-bold rounded-2xl transition-all active:scale-95"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    disabled={loading || success}
                    className="flex-2 flex-[2] py-4 bg-gray-900 hover:bg-black text-white font-black rounded-2xl transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3 relative overflow-hidden group disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <>
                        Enviar Comunicado
                        <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>

              </form>

              {/* Security Hint */}
              <div className="p-6 bg-red-600 flex items-center justify-center gap-2">
                 <AlertCircle size={14} className="text-white/60" />
                 <p className="text-[10px] font-black text-white/80 uppercase tracking-widest">Este mensaje será enviado a {form.targetRole === 'all' ? 'TODOS' : form.targetRole.toUpperCase()}</p>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
