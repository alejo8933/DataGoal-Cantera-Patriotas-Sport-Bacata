'use client'

import { useTournaments } from '@/hooks/useTournaments'

export default function TournamentList() {
  const { tournaments, loading, error } = useTournaments()

  if (loading) return <p className="text-muted-foreground">Cargando torneos...</p>
  if (error)   return <p className="text-destructive">{error}</p>
  if (!tournaments.length) return <p className="text-muted-foreground">No hay torneos registrados.</p>

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {tournaments.map((t) => (
        <div key={t.id} className="rounded-lg border border-border bg-surface p-4">
          <div className="flex items-start justify-between">
            <p className="font-semibold text-foreground">{t.nombre}</p>
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                t.estado === 'en_curso'
                ? 'bg-green-100 text-green-700'
                : t.estado === 'proximo'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-muted text-muted-foreground'
              }`}
            >
              {t.estado}
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{t.categoria}</p>
          {t.fecha_inicio && (
            <p className="mt-2 text-xs text-muted-foreground">
              📅 {new Date(t.fecha_inicio).toLocaleDateString('es-CO')}
            </p>
          )}
        </div>
      ))}
    </div>
  )
}