'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

/**
 * Crea una nueva Categoría Maestra (Sub-11, Adultos, etc.)
 */
export async function crearCategoriaMaestra(formData: FormData) {
  try {
    const supabase = await createClient()
    
    const nombre = formData.get('nombre') as string
    const edades = formData.get('edades') as string
    const modalidad = formData.get('modalidad') as string

    if (!nombre) {
      return { success: false, message: 'El nombre es obligatorio.' }
    }

    const { error } = await supabase
      .from('categorias_maestras')
      .insert([{ nombre, edades, modalidad }])

    if (error) throw error

    revalidatePath('/dashboard/admin/categorias')
    return { success: true }
  } catch (error: any) {
    console.error('Error creating master category:', error)
    return { success: false, message: error.message }
  }
}

/**
 * Edita una Categoría Maestra existente
 */
export async function editarCategoriaMaestra(formData: FormData) {
  try {
    const supabase = await createClient()
    
    const id = formData.get('id') as string
    const nombre = formData.get('nombre') as string
    const edades = formData.get('edades') as string
    const modalidad = formData.get('modalidad') as string

    if (!id || !nombre) {
      return { success: false, message: 'Datos insuficientes.' }
    }

    const { error } = await supabase
      .from('categorias_maestras')
      .update({ nombre, edades, modalidad })
      .eq('id', id)

    if (error) throw error

    revalidatePath('/dashboard/admin/categorias')
    return { success: true }
  } catch (error: any) {
    console.error('Error updating master category:', error)
    return { success: false, message: error.message }
  }
}
