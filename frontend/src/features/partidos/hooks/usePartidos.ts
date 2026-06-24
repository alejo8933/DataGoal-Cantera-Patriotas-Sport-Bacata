'use client'

import { useEffect, useState } from 'react'
import { obtenerPartidos } from '@/lib/actions/partidos.actions'
import type { PartidoResponseDTO } from 'datagoal-backend/modules/partidos/dtos/PartidoResponseDTO'

export function usePartidos(categoria?: string) {
  const [partidos, setPartidos] = useState<PartidoResponseDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    setLoading(true)
    setError(null)

    obtenerPartidos({ categoria })
      .then((data) => {
        if (active) setPartidos(data)
      })
      .catch((err: unknown) => {
        if (active) {
          setError(err instanceof Error ? err.message : 'Error al cargar partidos.')
        }
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [categoria])

  return { partidos, loading, error }
}
