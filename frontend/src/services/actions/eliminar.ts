'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function eliminarOInhabilitarRegistro(formData: FormData) {
  const supabase = await createClient()

  const tabla = formData.get('tabla')?.toString()
  const id = formData.get('id')?.toString()
  const mode = formData.get('mode')?.toString() || 'hard' // 'hard', 'inactivo', 'cancelado', 'falso'
  const path = formData.get('path')?.toString() || '/dashboard/admin'

  if (!tabla || !id) {
    return { success: false, message: 'Faltan parámetros básicos de eliminación.' }
  }

  try {
    let result;

    if (tabla === 'partidos') {
      // Marcamos como cancelado el partido
      result = await supabase.from(tabla).update({ estado: 'Cancelado' }).eq('id', id)
    } else {
      // Para Usuarios (perfiles), Jugadores, Equipos y Entrenamientos usamos la columna 'activo'
      result = await supabase.from(tabla).update({ activo: false }).eq('id', id)
    }

    if (result.error) throw result.error

    revalidatePath(path)
    revalidatePath('/dashboard/admin/archivo') // Siempre revalidar el archivo también

    return { 
      success: true, 
      message: 'Registro movido al archivo del club.' 
    }

  } catch (err: any) {
    console.error('Error procesando eliminación:', err)
    
    // Diagnóstico avanzado de Foreing Keys (Relaciones)
    if (err.message?.includes('foreign key constraint')) {
      return { 
        success: false, 
        message: 'No puedes borrar permanentemente este registro porque está atado a transacciones, partidos o reportes históricos (Es de vital importancia empresarial conservarlo).' 
      }
    }

    return { success: false, message: err.message || 'Error desconocido al borrar.' }
  }
}
