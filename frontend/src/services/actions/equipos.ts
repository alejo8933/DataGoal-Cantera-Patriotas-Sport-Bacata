'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

/**
 * Crea un nuevo equipo con validaciones de integridad y relación con técnico
 */
export async function crearEquipo(formData: FormData) {
  try {
    const supabase = await createClient()
    
    const equipo = formData.get('equipo') as string
    const tecnico_id = formData.get('tecnico_id') as string
    const sede = formData.get('sede') as string
    const fundacion = parseInt(formData.get('fundacion') as string) || 2024
    
    // Jerarquía de 3 niveles
    const categoria_id = formData.get('categoria_id') as string
    const color = formData.get('color') as string
    const horario = formData.get('horario') as string

    // Validaciones de Servidor
    if (!equipo || !categoria_id) {
      return { success: false, message: 'Nombre y categoría maestra son obligatorios.' }
    }

    // Verificar unicidad de equipo + categoría
    const { data: existente } = await supabase
      .from('rendimiento_equipos')
      .select('id')
      .eq('equipo', equipo)
      .eq('categoria_id', categoria_id)
      .single()

    if (existente) {
      return { success: false, message: 'Ya existe este equipo en la categoría seleccionada.' }
    }

    const { error } = await supabase
      .from('rendimiento_equipos')
      .insert([
        { 
          equipo, 
          tecnico_id: tecnico_id || null, 
          sede: sede || 'Sede Principal', 
          fundacion,
          categoria_id,
          color,
          horario
        }
      ])

    if (error) throw error

    revalidatePath('/dashboard/admin/categorias')
    return { success: true }
  } catch (error: any) {
    console.error('Error creating team:', error)
    return { success: false, message: error.message }
  }
}

/**
 * Edita un equipo existente
 */
export async function editarEquipo(formData: FormData) {
  try {
    const supabase = await createClient()
    
    const id = formData.get('id') as string
    const equipo = formData.get('equipo') as string
    const tecnico_id = formData.get('tecnico_id') as string
    const sede = formData.get('sede') as string
    const fundacion = parseInt(formData.get('fundacion') as string) || 2024
    
    // Jerarquía y nuevos campos
    const categoria_id = formData.get('categoria_id') as string
    const color = formData.get('color') as string
    const horario = formData.get('horario') as string

    if (!id || !equipo) {
      return { success: false, message: 'Datos incompletos para actualizar.' }
    }

    const { error } = await supabase
      .from('rendimiento_equipos')
      .update({ 
        equipo, 
        tecnico_id: tecnico_id || null, 
        sede, 
        fundacion,
        categoria_id,
        color,
        horario
      })
      .eq('id', id)

    if (error) throw error

    revalidatePath('/dashboard/admin/categorias')
    return { success: true }
  } catch (error: any) {
    console.error('Error updating team:', error)
    return { success: false, message: error.message }
  }
}
