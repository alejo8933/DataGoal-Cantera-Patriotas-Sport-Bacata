'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Factura {
  id: string
  fecha: string
  monto: number
  estado: string
}

export default function PlanManager() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [facturas, setFacturas] = useState<Factura[]>([])
  const [nombre, setNombre] = useState('')

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const userName = user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? ''
      setNombre(userName)

      // Intentamos cargar facturas filtrando por el nombre del jugador (según la lógica de finanzas.ts)
      const { data } = await supabase
        .from('facturas')
        .select('*')
        .ilike('jugador', `%${userName}%`)
        .order('fecha', { ascending: false })
        .limit(5)

      if (data) setFacturas(data)
      setLoading(false)
    }
    loadData()
  }, [])

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="flex items-center gap-2 text-base font-semibold text-gray-800">
          💳 Gestión de Plan y Pagos
        </h2>
        <span className="bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
          Activo
        </span>
      </div>

      <div className="flex flex-col gap-4 mb-10">
        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 flex flex-col justify-center shadow-sm">
          <p className="text-xs text-gray-400 uppercase font-bold tracking-[0.1em] mb-2">Tu Plan</p>
          <div className="flex items-center justify-between">
            <p className="text-xl font-black text-gray-900 leading-tight">Mensualidad Élite</p>
            <p className="text-xs text-red-500 font-bold whitespace-nowrap">Patriotas Sport</p>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 flex flex-col justify-center shadow-sm">
          <p className="text-xs text-gray-400 uppercase font-bold tracking-[0.1em] mb-2">Próximo Pago</p>
          <div className="flex items-center justify-between">
            <p className="text-xl font-black text-gray-900 leading-tight">May 05, 2026</p>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <p className="text-xs text-gray-600 font-medium italic">26 días</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 flex flex-col justify-center shadow-sm">
          <p className="text-xs text-gray-400 uppercase font-bold tracking-[0.1em] mb-2">Monto Base</p>
          <div className="flex items-center justify-between">
            <p className="text-xl font-black text-gray-900 leading-tight">$180,000</p>
            <p className="text-[10px] text-gray-500 font-medium">COP / Mes</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
          📄 Historial Reciente
        </h3>
        <div className="space-y-3">
          {loading ? (
            <div className="animate-pulse flex space-y-3 flex-col">
              <div className="h-10 bg-gray-100 rounded"></div>
              <div className="h-10 bg-gray-100 rounded"></div>
            </div>
          ) : facturas.length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-4 italic">No se encontraron facturas registradas para {nombre}</p>
          ) : (
            facturas.map((f) => (
              <div key={f.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-50 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                    $
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Pago de Mensualidad</p>
                    <p className="text-[10px] text-gray-400">{new Date(f.fecha).toLocaleDateString('es-CO', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">${f.monto.toLocaleString()}</p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    f.estado === 'Pagado' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {f.estado}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <button className="w-full mt-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all shadow-md active:scale-[0.98]">
        Reportar Nuevo Pago
      </button>
    </div>
  )
}
