'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { SupabaseCategoriaRepository } from '@backend/modules/categorias/infrastructure/SupabaseCategoriaRepository'
import { UpsertEquipoUseCase } from '@backend/modules/categorias/use-cases/UpsertEquipoUseCase'

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

    const categoria_id = formData.get('categoria_id') as string
    const color = formData.get('color') as string
    const horario = formData.get('horario') as string

    if (!equipo || !categoria_id) {
      return { success: false, message: 'Nombre y categoría maestra son obligatorios.' }
    }

    const useCase = new UpsertEquipoUseCase(new SupabaseCategoriaRepository(supabase))
    await useCase.execute({
      equipo,
      tecnicoId: tecnico_id || null,
      sede,
      fundacion,
      categoriaId: categoria_id,
      color,
      horario,
    })

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

    const categoria_id = formData.get('categoria_id') as string
    const color = formData.get('color') as string
    const horario = formData.get('horario') as string

    if (!id || !equipo) {
      return { success: false, message: 'Datos incompletos para actualizar.' }
    }

    const useCase = new UpsertEquipoUseCase(new SupabaseCategoriaRepository(supabase))
    await useCase.execute({
      id,
      equipo,
      tecnicoId: tecnico_id || null,
      sede,
      fundacion,
      categoriaId: categoria_id,
      color,
      horario,
    })

    revalidatePath('/dashboard/admin/categorias')
    return { success: true }
  } catch (error: any) {
    console.error('Error updating team:', error)
    return { success: false, message: error.message }
  }
}
