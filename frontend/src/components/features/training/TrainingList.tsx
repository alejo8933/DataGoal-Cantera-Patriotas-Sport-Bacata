'use client'

import { useTraining } from '@/hooks/useTraining'

export default function TrainingList() {
  const { trainings, loading, error } = useTraining()

  if (loading) return <p className="text-muted-foreground">Cargando entrenamientos...</p>
  if (error)   return <p className="text-destructive">{error}</p>
  if (!trainings.length) return <p className="text-muted-foreground">No hay entrenamientos registrados.</p>

  return (
    <div className="flex flex-col gap-3">
      {trainings.map((t) => (
        <div key={t.id} className="rounded-lg border border-border bg-surface px-4 py-3">
          <div className="flex items-center justify-between">
            <p className="font-medium text-foreground">{t.titulo}</p>
            <span className="text-sm text-muted-foreground">
              {new Date(t.fecha).toLocaleDateString('es-CO')}
            </span>
          </div>
          {t.descripcion && (
            <p className="mt-1 text-sm text-muted-foreground">{t.descripcion}</p>
          )}
          <p className="mt-1 text-xs text-muted-foreground">Categoría: {t.categoria}</p>
        </div>
      ))}
    </div>
  )
}