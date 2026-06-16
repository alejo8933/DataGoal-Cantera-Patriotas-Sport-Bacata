'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { SupabasePartidoRepository } from '@backend/modules/partidos/infrastructure/SupabasePartidoRepository'
import { SupabaseEventoPartidoRepository } from '@backend/modules/partidos/infrastructure/SupabaseEventoPartidoRepository'
import { SupabaseEstadisticasEventoRepository } from '@backend/modules/partidos/infrastructure/SupabaseEstadisticasEventoRepository'
import { PartidoMapper } from '@backend/modules/partidos/infrastructure/PartidoMapper'
import { EventoPartidoMapper } from '@backend/modules/partidos/infrastructure/EventoPartidoMapper'
import { GetPartidosUseCase } from '@backend/modules/partidos/use-cases/GetPartidosUseCase'
import { GetPartidoByIdUseCase } from '@backend/modules/partidos/use-cases/GetPartidoByIdUseCase'
import { CreatePartidoUseCase } from '@backend/modules/partidos/use-cases/CreatePartidoUseCase'
import { UpdatePartidoUseCase } from '@backend/modules/partidos/use-cases/UpdatePartidoUseCase'
import { GetEventosPartidoUseCase } from '@backend/modules/partidos/use-cases/GetEventosPartidoUseCase'
import { RegistrarEventoPartidoUseCase } from '@backend/modules/partidos/use-cases/RegistrarEventoPartidoUseCase'
import { EliminarEventoPartidoUseCase } from '@backend/modules/partidos/use-cases/EliminarEventoPartidoUseCase'
import type {
  EquipoEventoPartido,
  TipoEventoPartido,
} from '@backend/modules/partidos/domain/entities/EventoPartidoEntity'
import type { PartidoResponseDTO } from '@backend/modules/partidos/dtos/PartidoResponseDTO'
import type { EventoPartidoResponseDTO } from '@backend/modules/partidos/dtos/EventoPartidoResponseDTO'
import { notificarActividadAdmin } from '@/lib/entrenador/notificaciones'

async function createRepository() {
  const supabase = await createClient()
  return new SupabasePartidoRepository(supabase)
}

async function createEventoDependencies() {
  const supabase = await createClient()
  return {
    partidosRepo: new SupabasePartidoRepository(supabase),
    eventosRepo: new SupabaseEventoPartidoRepository(supabase),
    estadisticasRepo: new SupabaseEstadisticasEventoRepository(supabase),
  }
}

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error && error.message ? error.message : fallback
}

function readNullableString(formData: FormData, key: string): string | null {
  return formData.get(key)?.toString().trim() || null
}

function readNullableInteger(formData: FormData, key: string): number | null {
  const raw = formData.get(key)?.toString()
  return raw ? Number.parseInt(raw, 10) : null
}

export async function obtenerPartidos(options?: {
  categoria?: string
  incluirCancelados?: boolean
}): Promise<PartidoResponseDTO[]> {
  const repo = await createRepository()
  const useCase = new GetPartidosUseCase(repo)
  const partidos = await useCase.execute(options)
  return partidos.map(PartidoMapper.toDTO)
}

export async function obtenerPartidoPorId(id: string): Promise<PartidoResponseDTO | null> {
  const repo = await createRepository()
  const useCase = new GetPartidoByIdUseCase(repo)
  const partido = await useCase.execute(id)
  return partido ? PartidoMapper.toDTO(partido) : null
}

export async function obtenerEventosPartido(
  partidoId: string
): Promise<EventoPartidoResponseDTO[]> {
  const { eventosRepo } = await createEventoDependencies()
  const useCase = new GetEventosPartidoUseCase(eventosRepo)
  const eventos = await useCase.execute(partidoId)
  return eventos.map(EventoPartidoMapper.toDTO)
}

export async function crearPartido(formData: FormData) {
  try {
    const equipoLocal = formData.get('equipo_local')?.toString().trim()
    const equipoVisitante = formData.get('equipo_visitante')?.toString().trim()
    const fecha = formData.get('fecha')?.toString().trim()

    if (!equipoLocal || !equipoVisitante || !fecha) {
      return {
        success: false,
        message: 'Los equipos (Local y Visitante) y la Fecha son obligatorios.',
      }
    }

    const repo = await createRepository()
    const useCase = new CreatePartidoUseCase(repo)
    const partido = await useCase.execute({
      equipoLocal,
      equipoVisitante,
      fecha,
      hora: readNullableString(formData, 'hora'),
      lugar: readNullableString(formData, 'lugar'),
      categoria: readNullableString(formData, 'categoria'),
      descripcion: readNullableString(formData, 'descripcion'),
    })

    revalidatePath('/dashboard/admin/partidos')
    revalidatePath('/dashboard/partidos')

    return {
      success: true,
      message: 'Partido programado exitosamente.',
      data: [PartidoMapper.toDTO(partido)],
    }
  } catch (error: unknown) {
    console.error('Error insertando partido:', error)
    return {
      success: false,
      message: getErrorMessage(
        error,
        'Ha ocurrido un error al programar el partido en la base de datos.'
      ),
    }
  }
}

export async function editarPartido(formData: FormData) {
  try {
    const id = formData.get('id')?.toString()
    const equipoLocal = formData.get('equipo_local')?.toString().trim()
    const equipoVisitante = formData.get('equipo_visitante')?.toString().trim()
    const fecha = formData.get('fecha')?.toString().trim()

    if (!id || !equipoLocal || !equipoVisitante || !fecha) {
      return { success: false, message: 'ID, Equipos y Fecha son obligatorios.' }
    }

    const repo = await createRepository()
    const useCase = new UpdatePartidoUseCase(repo)

    await useCase.execute(id, {
      equipoLocal,
      equipoVisitante,
      fecha,
      hora: readNullableString(formData, 'hora'),
      lugar: readNullableString(formData, 'lugar'),
      categoria: readNullableString(formData, 'categoria'),
      golesLocal: readNullableInteger(formData, 'goles_local'),
      golesVisitante: readNullableInteger(formData, 'goles_visitante'),
      estado: formData.get('estado')?.toString() || 'Programado',
    })

    revalidatePath('/dashboard/admin/partidos')
    revalidatePath('/dashboard/partidos')
    revalidatePath(`/dashboard/partidos/${id}`)

    return { success: true, message: 'Partido actualizado correctamente.' }
  } catch (error: unknown) {
    console.error('Error editando partido:', error)
    return {
      success: false,
      message: getErrorMessage(error, 'Fallo al actualizar partido.'),
    }
  }
}

export async function registrarEventoPartido(formData: FormData) {
  try {
    const partidoId = formData.get('partido_id')?.toString()
    const minutoRaw = formData.get('minuto')?.toString()
    const tipo = formData.get('tipo')?.toString() as TipoEventoPartido
    const equipo = formData.get('equipo')?.toString() as EquipoEventoPartido

    if (!partidoId || !minutoRaw || !tipo || !equipo) {
      return {
        success: false,
        message: 'Partido, minuto, tipo y equipo son obligatorios.',
      }
    }

    const { partidosRepo, eventosRepo, estadisticasRepo } =
      await createEventoDependencies()
    const useCase = new RegistrarEventoPartidoUseCase(
      partidosRepo,
      eventosRepo,
      estadisticasRepo
    )

    const evento = await useCase.execute({
      partidoId,
      jugadorId: readNullableString(formData, 'jugador_id'),
      minuto: Number(minutoRaw),
      tipo,
      equipo,
      descripcion: readNullableString(formData, 'descripcion'),
    })

    if (evento.jugadorId) {
      await notificarActividadAdmin({
        titulo: 'Nuevo Evento en Partido',
        descripcion: `Se ha registrado un(a) ${evento.tipo} en el partido.`,
        tipo: 'partido',
      })
    }

    revalidatePath('/dashboard/entrenador/partidos')
    revalidatePath(`/dashboard/entrenador/partidos/${partidoId}`)
    revalidatePath(`/dashboard/partidos/${partidoId}`)
    revalidatePath('/dashboard/admin/jugadores')

    return {
      success: true,
      message: 'Evento registrado correctamente.',
      data: EventoPartidoMapper.toDTO(evento),
    }
  } catch (error: unknown) {
    console.error('Error registrando evento de partido:', error)
    return {
      success: false,
      message: getErrorMessage(error, 'No se pudo registrar el evento.'),
    }
  }
}

export async function eliminarEventoPartido(formData: FormData) {
  try {
    const id = formData.get('id')?.toString()
    if (!id) {
      return { success: false, message: 'El ID del evento es obligatorio.' }
    }

    const { eventosRepo, estadisticasRepo } = await createEventoDependencies()
    const useCase = new EliminarEventoPartidoUseCase(
      eventosRepo,
      estadisticasRepo
    )
    const evento = await useCase.execute(id)

    await notificarActividadAdmin({
      titulo: 'Evento de Partido Revertido',
      descripcion: `Se ha eliminado/revertido un(a) ${evento.tipo} en el partido.`,
      tipo: 'partido_revertido',
      prioridad: 'media',
    })

    revalidatePath('/dashboard/entrenador/partidos')
    revalidatePath(`/dashboard/entrenador/partidos/${evento.partidoId}`)
    revalidatePath(`/dashboard/partidos/${evento.partidoId}`)
    revalidatePath('/dashboard/admin/jugadores')

    return { success: true, message: 'Evento eliminado correctamente.' }
  } catch (error: unknown) {
    console.error('Error eliminando evento de partido:', error)
    return {
      success: false,
      message: getErrorMessage(error, 'No se pudo eliminar el evento.'),
    }
  }
}
