'use client'

import { useState, useEffect } from 'react'
import { obtenerTorneos } from '@/lib/actions/torneos.actions'
import type { TorneoResponseDTO } from '@backend/modules/torneos/dtos/TorneoResponseDTO'

export function useTournaments(filtro?: 'proximos' | 'historial') {
  const [tournaments, setTournaments] = useState<TorneoResponseDTO[]>([])
  const [loading,     setLoading]     = useState(true)
  const [error,       setError]       = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    const estado =
      filtro === 'proximos' ? 'proximo' :
      filtro === 'historial' ? 'finalizado' :
      undefined;

    obtenerTorneos({ estado })
      .then(setTournaments)
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Error al cargar torneos.')
      })
      .finally(() => setLoading(false))
  }, [filtro])

  return { tournaments, loading, error }
}