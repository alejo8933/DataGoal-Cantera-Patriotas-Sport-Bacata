'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://datagoal-backend.onrender.com'

type ResultadoPrueba = {
  paso: string
  ok: boolean
  detalle: string
}

export default function ApiTestPage() {
  const [resultados, setResultados] = useState<ResultadoPrueba[]>([])
  const [loading, setLoading] = useState(false)

  const correrPruebas = async () => {
    setLoading(true)
    const nuevos: ResultadoPrueba[] = []

    try {
      const healthRes = await fetch(`${BACKEND_URL}/health`)
      const healthBody = await healthRes.json()
      nuevos.push({
        paso: 'Backend en línea (GET /health)',
        ok: healthRes.ok,
        detalle: JSON.stringify(healthBody),
      })
    } catch (err) {
      nuevos.push({
        paso: 'Backend en línea (GET /health)',
        ok: false,
        detalle: err instanceof Error ? err.message : 'Error de red',
      })
    }

    try {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        nuevos.push({
          paso: 'Llamada autenticada al backend (GET /api/jugadores)',
          ok: false,
          detalle: 'No hay sesión activa de Supabase en el navegador.',
        })
      } else {
        const jugadoresRes = await fetch(`${BACKEND_URL}/api/categorias/selectores`, {
          headers: { Authorization: `Bearer ${session.access_token}` },
        })
        const jugadoresBody = await jugadoresRes.json()
        nuevos.push({
          paso: 'Llamada autenticada al backend (GET /api/categorias/selectores)',
          ok: jugadoresRes.ok,
          detalle: jugadoresRes.ok
            ? `${jugadoresBody.categoriasMaestras?.length ?? 0} categoría(s) y ${jugadoresBody.equipos?.length ?? 0} equipo(s) recibidos desde el backend en Render`
            : JSON.stringify(jugadoresBody),
        })
      }
    } catch (err) {
      nuevos.push({
        paso: 'Llamada autenticada al backend (GET /api/jugadores)',
        ok: false,
        detalle: err instanceof Error ? err.message : 'Error de red',
      })
    }

    setResultados(nuevos)
    setLoading(false)
  }

  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Prueba de conexión Frontend → Backend</h1>
      <p className="text-sm text-gray-500 mb-6">
        Verifica que este frontend (Vercel) puede llamar en vivo al backend desplegado en Render,
        usando el mismo token de sesión de Supabase del usuario logueado.
      </p>

      <button
        onClick={correrPruebas}
        disabled={loading}
        className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold px-5 py-2.5 rounded-xl transition-colors"
      >
        {loading ? 'Probando...' : 'Probar conexión con el backend'}
      </button>

      <div className="mt-8 flex flex-col gap-3">
        {resultados.map((r) => (
          <div
            key={r.paso}
            className={`rounded-xl border p-4 ${r.ok ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}
          >
            <div className="flex items-center gap-2">
              <span>{r.ok ? '✅' : '❌'}</span>
              <span className="font-bold text-sm text-gray-900">{r.paso}</span>
            </div>
            <p className="text-xs text-gray-600 mt-1 break-all">{r.detalle}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
