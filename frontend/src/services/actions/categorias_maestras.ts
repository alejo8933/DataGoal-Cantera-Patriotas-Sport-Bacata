'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { SupabaseCategoriaRepository } from 'datagoal-backend/modules/categorias/infrastructure/SupabaseCategoriaRepository'
import { UpsertCategoriaMaestraUseCase } from 'datagoal-backend/modules/categorias/use-cases/UpsertCategoriaMaestraUseCase'
import { GetCategoriasYEquiposParaSelectoresUseCase } from 'datagoal-backend/modules/categorias/use-cases/GetCategoriasYEquiposParaSelectoresUseCase'

/**
 * Lectura para selectores en formularios (e.g. ModalEditarJugador).
 * Devuelve categorías maestras y equipos activos con el shape mínimo necesario.
 */
export async function getCategoriasYEquiposParaSelectores() {
  const supabase = await createClient()
  const useCase = new GetCategoriasYEquiposParaSelectoresUseCase(
    new SupabaseCategoriaRepository(supabase),
  )
  return useCase.execute()
}

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

    const useCase = new UpsertCategoriaMaestraUseCase(new SupabaseCategoriaRepository(supabase))
    await useCase.execute({ nombre, edades, modalidad })

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

    const useCase = new UpsertCategoriaMaestraUseCase(new SupabaseCategoriaRepository(supabase))
    await useCase.execute({ id, nombre, edades, modalidad })

    revalidatePath('/dashboard/admin/categorias')
    return { success: true }
  } catch (error: any) {
    console.error('Error updating master category:', error)
    return { success: false, message: error.message }
  }
}
