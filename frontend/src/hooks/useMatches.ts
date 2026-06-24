'use client'

import { usePartidos } from '@/features/partidos/hooks/usePartidos'

export function useMatches(categoria?: string) {
  const { partidos, loading, error } = usePartidos(categoria)
  return { matches: partidos, loading, error }
}
