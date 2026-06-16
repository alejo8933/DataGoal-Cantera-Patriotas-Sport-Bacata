'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { SupabaseEntrenamientoRepository } from '@backend/modules/entrenamientos/infrastructure/SupabaseEntrenamientoRepository'
import { EntrenamientoMapper } from '@backend/modules/entrenamientos/infrastructure/EntrenamientoMapper'

// Casos de uso
import { GetEntrenamientosUseCase } from '@backend/modules/entrenamientos/use-cases/GetEntrenamientosUseCase'
import { GetEntrenamientoByIdUseCase } from '@backend/modules/entrenamientos/use-cases/GetEntrenamientoByIdUseCase'
import { CreateEntrenamientoUseCase } from '@backend/modules/entrenamientos/use-cases/CreateEntrenamientoUseCase'
import { UpdateEntrenamientoUseCase } from '@backend/modules/entrenamientos/use-cases/UpdateEntrenamientoUseCase'
import { DeleteEntrenamientoUseCase } from '@backend/modules/entrenamientos/use-cases/DeleteEntrenamientoUseCase'
import { GetJugadoresConAsistenciaUseCase } from '@backend/modules/entrenamientos/use-cases/GetJugadoresConAsistenciaUseCase'
import { GuardarAsistenciasBulkUseCase } from '@backend/modules/entrenamientos/use-cases/GuardarAsistenciasBulkUseCase'
import { GetReportesAsistenciaUseCase } from '@backend/modules/entrenamientos/use-cases/GetReportesAsistenciaUseCase'
import { GetJugadoresRegistradosCountUseCase } from '@backend/modules/entrenamientos/use-cases/GetJugadoresRegistradosCountUseCase'
import { GetRawAsistenciasUseCase } from '@backend/modules/entrenamientos/use-cases/GetRawAsistenciasUseCase'
import { GetAsistenciasPorJugadorUseCase } from '@backend/modules/entrenamientos/use-cases/GetAsistenciasPorJugadorUseCase'

// DTOs
import type { EntrenamientoResponseDTO, JugadorAsistenciaDTO, ReporteAsistenciaDTO } from '@backend/modules/entrenamientos/dtos/EntrenamientoResponseDTO'

async function createRepository() {
  const supabase = await createClient()
  return new SupabaseEntrenamientoRepository(supabase)
}

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error && error.message ? error.message : fallback
}

export async function obtenerEntrenamientos(query?: { categoria?: string }): Promise<EntrenamientoResponseDTO[]> {
  const repo = await createRepository()
  const useCase = new GetEntrenamientosUseCase(repo)
  const list = await useCase.execute(query)
  return list.map(EntrenamientoMapper.toDTO)
}

export async function obtenerEntrenamientoPorId(id: string): Promise<EntrenamientoResponseDTO | null> {
  try {
    const repo = await createRepository()
    const useCase = new GetEntrenamientoByIdUseCase(repo)
    const ent = await useCase.execute(id)
    return ent ? EntrenamientoMapper.toDTO(ent) : null;
  } catch (error) {
    return null;
  }
}

export async function crearEntrenamiento(formData: FormData) {
  try {
    const fecha = formData.get('fecha')?.toString().trim();
    const hora = formData.get('hora')?.toString().trim() || null;
    const lugar = formData.get('lugar')?.toString().trim() || null;
    
    const categoria = (formData.get('categoria') || formData.get('equipo'))?.toString().trim();
    const tipo = formData.get('tipo')?.toString().trim() || null;
    const duracionRaw = formData.get('duracion');
    const duracion = duracionRaw ? Number(duracionRaw) : null;
    const objetivos = formData.get('objetivos')?.toString().trim() || null;
    const descripcion = formData.get('descripcion')?.toString().trim() || null;
    
    let titulo = formData.get('titulo')?.toString().trim();
    if (!titulo) {
      if (tipo && categoria) {
        titulo = `${tipo} - ${categoria}`;
      } else {
        titulo = 'Entrenamiento';
      }
    }

    if (!fecha || !categoria) {
      throw new Error('La fecha y la categoría son obligatorias.');
    }

    const repo = await createRepository()
    const useCase = new CreateEntrenamientoUseCase(repo)
    await useCase.execute({
      titulo,
      fecha,
      hora,
      lugar,
      categoria,
      descripcion,
      tipo,
      duracion,
      objetivos,
    })

    revalidatePath('/dashboard/entrenamientos')
    revalidatePath('/dashboard/admin/entrenamientos')
    return { success: true }
  } catch (error) {
    return { success: false, error: getErrorMessage(error, 'Error al crear el entrenamiento') }
  }
}

export async function editarEntrenamiento(formData: FormData) {
  try {
    const id = formData.get('id')?.toString().trim();
    if (!id) throw new Error('El ID de entrenamiento es obligatorio.');

    const titulo = formData.get('titulo')?.toString().trim();
    const fecha = formData.get('fecha')?.toString().trim();
    const hora = formData.get('hora')?.toString().trim() || null;
    const lugar = formData.get('lugar')?.toString().trim() || null;
    const categoria = formData.get('categoria')?.toString().trim();
    const descripcion = formData.get('descripcion')?.toString().trim() || null;

    const repo = await createRepository()
    const useCase = new UpdateEntrenamientoUseCase(repo)
    
    const data: any = {};
    if (titulo !== undefined) data.titulo = titulo;
    if (fecha !== undefined) data.fecha = fecha;
    if (hora !== undefined) data.hora = hora;
    if (lugar !== undefined) data.lugar = lugar;
    if (categoria !== undefined) data.categoria = categoria;
    if (descripcion !== undefined) data.descripcion = descripcion;

    await useCase.execute(id, data)

    revalidatePath('/dashboard/entrenamientos')
    revalidatePath('/dashboard/admin/entrenamientos')
    return { success: true }
  } catch (error) {
    return { success: false, error: getErrorMessage(error, 'Error al actualizar el entrenamiento') }
  }
}

export async function eliminarEntrenamiento(id: string) {
  try {
    const repo = await createRepository()
    const useCase = new DeleteEntrenamientoUseCase(repo)
    await useCase.execute(id)

    revalidatePath('/dashboard/entrenamientos')
    revalidatePath('/dashboard/admin/entrenamientos')
    return { success: true }
  } catch (error) {
    return { success: false, error: getErrorMessage(error, 'Error al eliminar el entrenamiento') }
  }
}

// Operaciones de asistencia
export async function obtenerJugadoresConAsistencia(entrenamientoId: string): Promise<JugadorAsistenciaDTO[]> {
  const repo = await createRepository()
  const useCase = new GetJugadoresConAsistenciaUseCase(repo)
  return useCase.execute(entrenamientoId)
}

export async function guardarAsistenciasBulk(
  entrenamientoId: string,
  asistencias: {
    jugadorId: string;
    presente: boolean | null;
    excusa?: string;
    horaLlegada?: string;
    notas?: string;
  }[]
) {
  try {
    const repo = await createRepository()
    const useCase = new GuardarAsistenciasBulkUseCase(repo)

    const formatted = asistencias.map(a => ({
      jugadorId: a.jugadorId,
      presente: a.presente ?? false,
      excusa: a.notas ? a.notas : (a.excusa || null),
      horaLlegada: a.horaLlegada || null,
    }))

    await useCase.execute(entrenamientoId, formatted)

    revalidatePath(`/dashboard/admin/entrenamientos/${entrenamientoId}/asistencia`)
    revalidatePath('/dashboard/entrenamientos')
    return { success: true }
  } catch (error) {
    return { success: false, error: getErrorMessage(error, 'Error al guardar la asistencia') }
  }
}

export async function obtenerReportesAsistencia(): Promise<ReporteAsistenciaDTO[]> {
  const repo = await createRepository()
  const useCase = new GetReportesAsistenciaUseCase(repo)
  return useCase.execute()
}

export async function obtenerJugadoresRegistradosCount(): Promise<number> {
  const repo = await createRepository()
  const useCase = new GetJugadoresRegistradosCountUseCase(repo)
  return useCase.execute()
}

export async function obtenerEntrenamientosDashboard() {
  const repo = await createRepository()
  const listUseCase = new GetEntrenamientosUseCase(repo)
  const rawUseCase = new GetRawAsistenciasUseCase(repo)

  const list = await listUseCase.execute()
  const asistencias = await rawUseCase.execute()

  return {
    entrenamientos: list.map(EntrenamientoMapper.toDTO),
    asistencias,
  }
}

export async function obtenerAsistenciasPorJugador(jugadorId: string) {
  const repo = await createRepository()
  const useCase = new GetAsistenciasPorJugadorUseCase(repo)
  const list = await useCase.execute(jugadorId)
  return list.map((a: any) => ({
    id: a.id,
    entrenamiento_id: a.entrenamiento_id,
    presente: a.presente,
    estado: a.presente ? 'Presente' : 'Ausente',
    excusa: a.excusa,
    hora_llegada: a.hora_llegada,
  }))
}
