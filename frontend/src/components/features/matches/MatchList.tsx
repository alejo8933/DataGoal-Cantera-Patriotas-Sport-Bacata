'use client'

import { useMatches } from '@/hooks/useMatches'

export default function MatchList() {
  const { matches, loading, error } = useMatches()

  if (loading) return <p className="text-muted-foreground">Cargando partidos...</p>
  if (error)   return <p className="text-destructive">{error}</p>
  if (!matches.length) return <p className="text-muted-foreground">No hay partidos registrados.</p>

  return (
    <div className="flex flex-col gap-3">
      {matches.map((match) => (
        <div
          key={match.id}
          className="flex items-center justify-between rounded-lg border border-border bg-surface px-4 py-3"
        >
          <div>
            <p className="font-medium text-foreground">
              {match.equipo_local} vs {match.equipo_visitante}
            </p>
            <p className="text-sm text-muted-foreground">
              {new Date(match.fecha).toLocaleDateString('es-CO')} · {match.categoria}
            </p>
          </div>

          {match.goles_local !== null && match.goles_visitante !== null ? (
            <span className="text-lg font-bold text-primary">
              {match.goles_local} – {match.goles_visitante}
            </span>
          ) : (
            <span className="text-sm text-muted-foreground">Pendiente</span>
          )}
        </div>
      ))}
    </div>
  )
}