'use client'

import { useState } from 'react'
import { RefreshCw, CheckCircle2, AlertTriangle } from 'lucide-react'
import { sincronizarPerfiles } from '@/lib/actions/usuarios.actions'

export default function BtnSincronizar() {
  const [isSyncing, setIsSyncing] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleSync = async () => {
    setIsSyncing(true)
    setStatus('idle')
    
    try {
      const result = await sincronizarPerfiles()
      if (result.success) {
        setStatus('success')
        setTimeout(() => setStatus('idle'), 5000)
      } else {
        setStatus('error')
        console.error('Error de Sincronización:', result.message)
      }
    } catch (error: any) {
      setStatus('error')
      console.error('Error técnico:', error.message)
    } finally {
      setIsSyncing(false)
    }
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        onClick={handleSync}
        disabled={isSyncing}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 ${
          status === 'success' 
            ? 'bg-emerald-500 text-white' 
            : status === 'error'
            ? 'bg-red-500 text-white'
            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-100'
        }`}
      >
        {isSyncing ? (
          <RefreshCw size={16} className="animate-spin text-red-600" />
        ) : status === 'success' ? (
          <CheckCircle2 size={16} />
        ) : status === 'error' ? (
          <AlertTriangle size={16} />
        ) : (
          <RefreshCw size={16} className="text-red-600" />
        )}
        
        {isSyncing ? 'Sincronizando...' : status === 'success' ? '¡Datos Reparados!' : 'Sincronizar Datos'}
      </button>
      
      {status === 'success' && (
        <p className="text-[10px] text-emerald-600 font-bold animate-pulse">
          Nombres y correos actualizados desde la base de datos maestra.
        </p>
      )}
    </div>
  )
}
