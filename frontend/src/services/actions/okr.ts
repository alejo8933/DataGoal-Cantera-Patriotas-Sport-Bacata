'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

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

export async function seedDashboardData() {
  const supabase = await createClient()
  
  try {
    // 1. Obtener jugadores reales
    const { data: jugadores } = await supabase.from('jugadores').select('id, nombre, apellido').limit(20)
    if (!jugadores || jugadores.length === 0) return { success: false, message: 'No hay jugadores en la base de datos' }

    // 2. Crear un entrenamiento de prueba si no hay
    const { data: ent } = await supabase.from('entrenamientos')
      .upsert({ tipo: 'Sesión Táctica Elite', fecha: new Date().toISOString() })
      .select().single()
    const entId = ent?.id || 1

    // 3. Simular Asistencias
    const asistencias = jugadores.map(j => ({
      jugador_id: j.id,
      entrenamiento_id: entId,
      presente: Math.random() < 0.85,
      created_at: new Date().toISOString()
    }))
    await supabase.from('asistencias').upsert(asistencias)

    // 4. Simular Finanzas
    const facturas = jugadores.slice(0, 15).map(j => ({
      jugador: `${j.nombre} ${j.apellido}`,
      monto: 150000,
      estado: Math.random() < 0.90 ? 'Pagado' : 'Pendiente',
      fecha: new Date().toISOString().split('T')[0]
    }))
    await supabase.from('facturas').upsert(facturas)

    // 5. Simular Goles (Actualizar en tabla jugadores)
    for (const j of jugadores.slice(0, 10)) {
      await supabase.from('jugadores')
        .update({ goles: Math.floor(Math.random() * 5) + 2 })
        .eq('id', j.id)
    }

    revalidatePath('/dashboard/admin/okr')
    return { success: true }
  } catch (error) {
    console.error('Error in seedDashboardData:', error)
    return { success: false, message: error instanceof Error ? error.message : 'Error desconocido' }
  }
}
