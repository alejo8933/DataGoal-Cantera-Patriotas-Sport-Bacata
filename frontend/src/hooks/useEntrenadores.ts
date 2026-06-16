'use client'

import { useState, useEffect } from 'react'
import { obtenerEntrenadores } from '@/lib/actions/usuarios.actions'

export interface Entrenador {
  id: string
  nombre: string
  apellido: string
}

export function useEntrenadores() {
  const [entrenadores, setEntrenadores] = useState<Entrenador[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    setLoading(true)

    obtenerEntrenadores()
      .then((data) => {
        if (active) setEntrenadores(data)
      })
      .catch((err: unknown) => {
        if (active) {
          setError(err instanceof Error ? err.message : 'Error al cargar entrenadores.')
        }
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  return { entrenadores, loading, error }
}
