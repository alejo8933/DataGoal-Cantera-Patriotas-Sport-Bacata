'use client'

import { usePlayers } from '@/hooks/usePlayers'

export default function PlayerList() {
  const { players, loading, error } = usePlayers()

  if (loading) return <p className="text-muted-foreground">Cargando jugadores...</p>
  if (error)   return <p className="text-destructive">{error}</p>
  if (!players.length) return <p className="text-muted-foreground">No hay jugadores registrados.</p>

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {players.map((player) => (
        <div key={player.id} className="rounded-lg border border-border bg-surface p-4 shadow-sm">
          <p className="font-semibold text-foreground">
            {player.nombre} {player.apellido}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {player.posicion} · {player.categoria}
          </p>
            {player.numero_camiseta && (
            <span className="mt-2 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
            #{player.numero_camiseta}
            </span>
            )}
        </div>
      ))}
    </div>
  )
}