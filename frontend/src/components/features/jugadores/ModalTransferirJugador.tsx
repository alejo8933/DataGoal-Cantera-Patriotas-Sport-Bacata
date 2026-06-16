'use client'

import { useState } from 'react'
import { ArrowRightLeft, X, Loader2, Info, CheckCircle2, ShieldAlert } from 'lucide-react'
import { transferirJugador } from '@/services/actions/jugadores'
import { motion, AnimatePresence } from 'framer-motion'

interface ModalTransferirJugadorProps {
  jugador: {
    id: string
    nombre: string
    apellido: string
    categoria: string | null
  }
}

const CATEGORIAS = ['Sub-7', 'Sub-9', 'Sub-11', 'Sub-13', 'Sub-15', 'Sub-17', 'Libre']

export default function ModalTransferirJugador({ jugador }: ModalTransferirJugadorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [nuevaCategoria, setNuevaCategoria] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleTransfer = async () => {
    if (!nuevaCategoria) {
      setError('Por favor selecciona la nueva categoría.')
      return
    }

    if (nuevaCategoria === jugador.categoria) {
      setError('El jugador ya se encuentra en esta categoría.')
      return
    }

    setIsLoading(true)
    setError(null)

    const result = await transferirJugador(jugador.id, nuevaCategoria)

    if (result.success) {
      setSuccess(true)
      setTimeout(() => {
        setIsOpen(false)
        setSuccess(false)
        setNuevaCategoria('')
      }, 2000)
    } else {
      setError(result.message)
    }
    setIsLoading(false)
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
        title="Transferir Jugador"
      >
        <ArrowRightLeft size={18} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isLoading && setIsOpen(false)}
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
            />

            {/* Modal Content */}
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[32px] shadow-2xl overflow-hidden border border-gray-100"
            >
              {/* Header */}
              <div className="p-8 pb-6 flex items-center justify-between border-b border-gray-50 bg-gray-50/50">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-xl shadow-emerald-500/20">
                    <ArrowRightLeft size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-gray-900 leading-tight">Traslado de Jugador</h2>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-0.5">Gestión de Transferencias</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-200/50 text-gray-400 hover:text-gray-900 rounded-xl transition-all"
                  disabled={isLoading}
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-8 space-y-8">
                {/* Visual Flow */}
                <div className="flex items-center justify-between bg-gray-50 p-6 rounded-3xl border border-gray-100 italic">
                  <div className="text-center space-y-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase">Origen</p>
                    <p className="text-lg font-black text-gray-700">{jugador.categoria || 'S.C'}</p>
                  </div>
                  <div className="h-px flex-1 bg-gray-200 mx-4 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-white border border-gray-200 flex items-center justify-center">
                       <ArrowRightLeft size={12} className="text-gray-400" />
                    </div>
                  </div>
                  <div className="text-center space-y-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase">Destino</p>
                    <p className="text-lg font-black text-emerald-600">{nuevaCategoria || '???'}</p>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-gray-500 text-sm">Vas a trasladar a <span className="font-black text-gray-900">{jugador.nombre} {jugador.apellido}</span> de su categoría actual.</p>
                </div>

                {/* Selection */}
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Seleccionar Nueva Categoría:</label>
                  <div className="grid grid-cols-3 gap-2">
                    {CATEGORIAS.filter(c => c !== jugador.categoria).map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setNuevaCategoria(cat)}
                        className={`py-3 px-2 rounded-xl text-xs font-bold transition-all border-2 ${
                          nuevaCategoria === cat 
                            ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-500/20' 
                            : 'bg-white border-gray-100 text-gray-500 hover:border-emerald-200'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Feedback */}
                <AnimatePresence>
                  {error && (
                    <motion.div 
                      initial={{ scale: 0.95, opacity: 0 }} 
                      animate={{ scale: 1, opacity: 1 }}
                      className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center gap-3 text-sm font-bold"
                    >
                      <ShieldAlert size={20} />
                      {error}
                    </motion.div>
                  )}

                  {success && (
                    <motion.div 
                      initial={{ scale: 0.95, opacity: 0 }} 
                      animate={{ scale: 1, opacity: 1 }}
                      className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center gap-3 text-sm font-bold"
                    >
                      <CheckCircle2 size={20} />
                      ¡Traslado realizado con éxito!
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Actions */}
                <div className="pt-2 flex gap-4">
                  <button 
                    disabled={isLoading}
                    onClick={() => setIsOpen(false)}
                    className="flex-1 py-4 bg-gray-100 hover:bg-gray-200 text-gray-500 font-bold rounded-2xl transition-all active:scale-95"
                  >
                    Cerrar
                  </button>
                  <button 
                    onClick={handleTransfer}
                    disabled={isLoading || !nuevaCategoria || success}
                    className="flex-[2] py-4 bg-gray-900 hover:bg-black text-white font-black rounded-2xl transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <>
                        <ArrowRightLeft size={18} />
                        Confirmar Traslado
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Warning Banner */}
              <div className="p-4 bg-emerald-600 flex items-center justify-center gap-2">
                 <Info size={14} className="text-white/60" />
                 <p className="text-[10px] font-black text-white/80 uppercase tracking-widest leading-none">Esta acción moverá al jugador inmediatamente</p>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
