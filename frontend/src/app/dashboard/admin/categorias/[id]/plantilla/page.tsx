import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import PlantillaView from '@/components/features/equipos/PlantillaView'

export default async function EquipoPlantillaPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params
  const supabase = await createClient()

  // 1. Obtener datos del equipo
  const { data: equipo, error: equipoError } = await supabase
    .from('rendimiento_equipos')
    .select('*')
    .eq('id', id)
    .single()

  if (equipoError || !equipo) {
    return notFound()
  }

  // 2. Obtener jugadores de la misma categoría
  const { data: jugadores, error: jugadoresError } = await supabase
    .from('jugadores')
    .select('*')
    .eq('categoria', equipo.categoria)
    .eq('activo', true)
    .order('apellido', { ascending: true })

  return (
    <div className="container mx-auto px-4 py-6">
      <PlantillaView 
        equipo={equipo} 
        jugadores={jugadores || []} 
      />
    </div>
  )
}
