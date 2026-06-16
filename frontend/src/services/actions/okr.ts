'use server'

import { createClient } from '@/lib/supabase/server'

export async function getOKRs() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('okr_objetivos')
    .select('*, krs:okr_resultados_clave(*)')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching OKRs:', error)
    return []
  }

  return data
}

export async function upsertOKR(okr: any) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('okr_objetivos')
    .upsert({
      id: okr.id || undefined,
      titulo: okr.titulo,
      descripcion: okr.descripcion,
      tipo: okr.tipo,
      periodo: okr.periodo,
      updated_at: new Date().toISOString()
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function addKR(kr: any) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('okr_resultados_clave')
    .insert({
      objetivo_id: kr.objetivo_id,
      nombre: kr.nombre,
      valor_actual: kr.valor_actual || 0,
      valor_meta: kr.valor_meta,
      unidad: kr.unidad || '%',
      kpi_slug: kr.kpi_slug
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteOKR(id: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('okr_objetivos')
    .delete()
    .eq('id', id)

  if (error) throw error
  return true
}

export async function getDashStats() {
  const supabase = await createClient()

  try {
    // 1. Asistencia
    const { data: asist } = await supabase.from('asistencias').select('presente')
    const totalAsist = asist?.length || 0
    const presentes = asist?.filter(a => a.presente === true).length || 0

    // 2. Recaudación
    const { data: fact } = await supabase.from('facturas').select('estado')
    const totalFact = fact?.length || 0
    const pagadas = fact?.filter(f => f.estado === 'Pagado' || f.estado === 'Pagada').length || 0

    // 3. Goles (Sumando de la tabla jugadores)
    const { data: jugg } = await supabase.from('jugadores').select('goles')
    const totalGoles = jugg?.reduce((acc, curr) => acc + (curr.goles || 0), 0) || 0

    return {
      asistencia: totalAsist > 0 ? Math.round((presentes / totalAsist) * 100) : 0,
      recaudacion: totalFact > 0 ? Math.round((pagadas / totalFact) * 100) : 0,
      goles: totalGoles
    }
  } catch (error) {
    console.error('Error in getDashStats:', error)
    return { asistencia: 0, recaudacion: 0, goles: 0 }
  }
}

