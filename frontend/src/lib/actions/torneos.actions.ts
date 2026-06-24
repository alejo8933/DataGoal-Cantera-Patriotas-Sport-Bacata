'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { SupabaseTorneoRepository } from 'datagoal-backend/modules/torneos/infrastructure/SupabaseTorneoRepository'
import { TorneoMapper } from 'datagoal-backend/modules/torneos/infrastructure/TorneoMapper'
import { GetTorneosUseCase } from 'datagoal-backend/modules/torneos/use-cases/GetTorneosUseCase'
import { GetTorneoByIdUseCase } from 'datagoal-backend/modules/torneos/use-cases/GetTorneoByIdUseCase'
import { CreateTorneoUseCase } from 'datagoal-backend/modules/torneos/use-cases/CreateTorneoUseCase'
import { UpdateTorneoUseCase } from 'datagoal-backend/modules/torneos/use-cases/UpdateTorneoUseCase'
import { DeleteTorneoUseCase } from 'datagoal-backend/modules/torneos/use-cases/DeleteTorneoUseCase'
import type { TorneoResponseDTO } from 'datagoal-backend/modules/torneos/dtos/TorneoResponseDTO'

async function createRepository() {
  const supabase = await createClient()
  return new SupabaseTorneoRepository(supabase)
}

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error && error.message ? error.message : fallback
}

function readNullableString(formData: FormData, key: string): string | null {
  return formData.get(key)?.toString().trim() || null
}

export async function obtenerTorneos(options?: {
  estado?: 'proximo' | 'en_curso' | 'finalizado'
}): Promise<TorneoResponseDTO[]> {
  const repo = await createRepository()
  const useCase = new GetTorneosUseCase(repo)
  const torneos = await useCase.execute(options)
  return torneos.map(TorneoMapper.toDTO)
}

export async function obtenerTorneoPorId(id: string): Promise<TorneoResponseDTO | null> {
  const repo = await createRepository()
  const useCase = new GetTorneoByIdUseCase(repo)
  const torneo = await useCase.execute(id)
  return torneo ? TorneoMapper.toDTO(torneo) : null
}

export async function crearTorneo(formData: FormData) {
  try {
    const nombre = formData.get('nombre')?.toString().trim()
    const categoria = formData.get('categoria')?.toString().trim()
    const fechaInicio = formData.get('fecha_inicio')?.toString().trim()
    const fechaFin = readNullableString(formData, 'fecha_fin')
    const estado = formData.get('estado')?.toString().trim() as 'proximo' | 'en_curso' | 'finalizado'
    const descripcion = readNullableString(formData, 'descripcion')
    const logoUrl = readNullableString(formData, 'logo_url')
    const resultado = readNullableString(formData, 'resultado')

    if (!nombre || !categoria || !fechaInicio || !estado) {
      throw new Error('Todos los campos obligatorios deben ser completados.')
    }

    const repo = await createRepository()
    const useCase = new CreateTorneoUseCase(repo)
    await useCase.execute({
      nombre,
      categoria,
      fechaInicio,
      fechaFin,
      estado,
      descripcion,
      logoUrl,
      resultado,
    })

    revalidatePath('/dashboard/torneos')
    return { success: true }
  } catch (error) {
    return { success: false, error: getErrorMessage(error, 'Error al crear torneo') }
  }
}

export async function actualizarTorneo(id: string, formData: FormData) {
  try {
    const nombre = formData.get('nombre')?.toString().trim()
    const categoria = formData.get('categoria')?.toString().trim()
    const fechaInicio = formData.get('fecha_inicio')?.toString().trim()
    const fechaFin = readNullableString(formData, 'fecha_fin')
    const estado = formData.get('estado')?.toString().trim() as 'proximo' | 'en_curso' | 'finalizado'
    const descripcion = readNullableString(formData, 'descripcion')
    const logoUrl = readNullableString(formData, 'logo_url')
    const resultado = readNullableString(formData, 'resultado')

    const data: any = {}
    if (nombre !== undefined) data.nombre = nombre
    if (categoria !== undefined) data.categoria = categoria
    if (fechaInicio !== undefined) data.fechaInicio = fechaInicio
    if (fechaFin !== undefined) data.fechaFin = fechaFin
    if (estado !== undefined) data.estado = estado
    if (descripcion !== undefined) data.descripcion = descripcion
    if (logoUrl !== undefined) data.logoUrl = logoUrl
    if (resultado !== undefined) data.resultado = resultado

    const repo = await createRepository()
    const useCase = new UpdateTorneoUseCase(repo)
    await useCase.execute(id, data)

    revalidatePath('/dashboard/torneos')
    return { success: true }
  } catch (error) {
    return { success: false, error: getErrorMessage(error, 'Error al actualizar torneo') }
  }
}

export async function eliminarTorneo(id: string) {
  try {
    const repo = await createRepository()
    const useCase = new DeleteTorneoUseCase(repo)
    await useCase.execute(id)

    revalidatePath('/dashboard/torneos')
    return { success: true }
  } catch (error) {
    return { success: false, error: getErrorMessage(error, 'Error al eliminar torneo') }
  }
}
