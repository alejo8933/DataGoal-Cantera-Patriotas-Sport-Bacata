'use server'

import { createClient } from '@/lib/supabase/server'
import { SupabaseEstadisticaRepository } from 'datagoal-backend/modules/estadisticas/infrastructure/SupabaseEstadisticaRepository'
import { EstadisticaMapper } from 'datagoal-backend/modules/estadisticas/infrastructure/EstadisticaMapper'
import { GetEstadisticasJugadorUseCase } from 'datagoal-backend/modules/estadisticas/use-cases/GetEstadisticasJugadorUseCase'
import { GetEstadisticasJugadorPorUsuarioUseCase } from 'datagoal-backend/modules/estadisticas/use-cases/GetEstadisticasJugadorPorUsuarioUseCase'
import { GetEstadisticasJugadoresUseCase } from 'datagoal-backend/modules/estadisticas/use-cases/GetEstadisticasJugadoresUseCase'
import { GetGoleadoresUseCase } from 'datagoal-backend/modules/estadisticas/use-cases/GetGoleadoresUseCase'
import { GetGolesPorMesUseCase } from 'datagoal-backend/modules/estadisticas/use-cases/GetGolesPorMesUseCase'
import { GetEstadisticasEquipoUseCase } from 'datagoal-backend/modules/estadisticas/use-cases/GetEstadisticasEquipoUseCase'
import { GetResumenTemporadaUseCase } from 'datagoal-backend/modules/estadisticas/use-cases/GetResumenTemporadaUseCase'
import type {
  EstadisticaEquipoResponseDTO,
  EstadisticaResponseDTO,
  GolPorMesResponseDTO,
  GoleadorResponseDTO,
  ResumenTemporadaResponseDTO,
} from 'datagoal-backend/modules/estadisticas/dtos/EstadisticaResponseDTO'
import type {
  EstadisticasEquipoQuery,
  EstadisticasJugadorQuery,
} from 'datagoal-backend/modules/estadisticas/domain/ports/IEstadisticaRepository'

async function createRepository() {
  const supabase = await createClient()
  return new SupabaseEstadisticaRepository(supabase)
}

export async function obtenerEstadisticasJugador(
  jugadorId: string
): Promise<EstadisticaResponseDTO | null> {
  const repo = await createRepository()
  const useCase = new GetEstadisticasJugadorUseCase(repo)
  const estadistica = await useCase.execute(jugadorId)
  return estadistica ? EstadisticaMapper.toDTO(estadistica) : null
}

export async function obtenerEstadisticasJugadores(
  query?: EstadisticasJugadorQuery
): Promise<EstadisticaResponseDTO[]> {
  const repo = await createRepository()
  const useCase = new GetEstadisticasJugadoresUseCase(repo)
  const estadisticas = await useCase.execute(query)
  return estadisticas.map(EstadisticaMapper.toDTO)
}

export async function obtenerGoleadores(
  limit = 20
): Promise<GoleadorResponseDTO[]> {
  const repo = await createRepository()
  const useCase = new GetGoleadoresUseCase(repo)
  const goleadores = await useCase.execute(limit)
  return goleadores.map(EstadisticaMapper.toGoleadorDTO)
}

export async function obtenerEstadisticasEquipo(
  query?: EstadisticasEquipoQuery
): Promise<EstadisticaEquipoResponseDTO[]> {
  const repo = await createRepository()
  const useCase = new GetEstadisticasEquipoUseCase(repo)
  const estadisticas = await useCase.execute(query)
  return estadisticas.map(EstadisticaMapper.toEquipoDTO)
}

export async function obtenerGolesPorMes(
  query?: Pick<EstadisticasEquipoQuery, 'categoria'>
): Promise<GolPorMesResponseDTO[]> {
  const repo = await createRepository()
  const useCase = new GetGolesPorMesUseCase(repo)
  const golesPorMes = await useCase.execute(query)
  return golesPorMes.map(EstadisticaMapper.toGolPorMesDTO)
}

export async function obtenerResumenTemporada(
  query?: EstadisticasEquipoQuery
): Promise<ResumenTemporadaResponseDTO> {
  const repo = await createRepository()
  const useCase = new GetResumenTemporadaUseCase(repo)
  const resumen = await useCase.execute(query)
  return EstadisticaMapper.toResumenDTO(resumen)
}

export async function obtenerMisEstadisticasJugador(): Promise<{
  autenticado: boolean
  estadistica: EstadisticaResponseDTO | null
}> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { autenticado: false, estadistica: null }
  }

  const repo = new SupabaseEstadisticaRepository(supabase)
  const useCase = new GetEstadisticasJugadorPorUsuarioUseCase(repo)
  const estadistica = await useCase.execute(user.id)

  return {
    autenticado: true,
    estadistica: estadistica ? EstadisticaMapper.toDTO(estadistica) : null,
  }
}
