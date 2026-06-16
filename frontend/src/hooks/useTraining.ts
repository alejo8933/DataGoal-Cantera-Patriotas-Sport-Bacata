'use client'

import { useState, useEffect } from 'react'
import { obtenerEntrenamientos } from '@/lib/actions/entrenamientos.actions'
import type { EntrenamientoResponseDTO } from '@backend/modules/entrenamientos/dtos/EntrenamientoResponseDTO'

export function useTraining(categoria?: string) {
  const [trainings, setTrainings] = useState<EntrenamientoResponseDTO[]>([])
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    obtenerEntrenamientos(categoria ? { categoria } : undefined)
      .then(setTrainings)
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Error al cargar entrenamientos.')
      })
      .finally(() => setLoading(false))
  }, [categoria])

  return { trainings, loading, error }
}