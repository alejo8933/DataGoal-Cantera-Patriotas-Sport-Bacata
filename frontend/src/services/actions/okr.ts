'use server'

import { createClient } from '@/lib/supabase/server'
import { SupabaseEntrenamientoRepository } from '@backend/modules/entrenamientos/infrastructure/SupabaseEntrenamientoRepository'
import { GetRawAsistenciasUseCase } from '@backend/modules/entrenamientos/use-cases/GetRawAsistenciasUseCase'
import { SupabaseJugadorRepository } from '@backend/modules/jugadores/infrastructure/SupabaseJugadorRepository'
import { GetJugadoresUseCase } from '@backend/modules/jugadores/use-cases/GetJugadoresUseCase'
import { SupabaseOKRRepository } from '@backend/modules/okr/infrastructure/SupabaseOKRRepository'
import { GetOKRsUseCase } from '@backend/modules/okr/use-cases/GetOKRsUseCase'
import { UpsertOKRUseCase } from '@backend/modules/okr/use-cases/UpsertOKRUseCase'
import { AddKRUseCase } from '@backend/modules/okr/use-cases/AddKRUseCase'
import { DeleteOKRUseCase } from '@backend/modules/okr/use-cases/DeleteOKRUseCase'
import type { ObjetivoOKREntity, KRProps } from '@backend/modules/okr/domain/entities/ObjetivoOKREntity'
import { SupabaseFacturaRepository } from '@backend/modules/finanzas/infrastructure/SupabaseFacturaRepository'
import { CalcularEficaciaRecaudacionUseCase } from '@backend/modules/finanzas/use-cases/CalcularEficaciaRecaudacionUseCase'

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>

// Shape consumido por OKRCard y CreateOKRModal — conservar snake_case.
type KROut = {
  id: string
  nombre: string
  valor_actual: number
  valor_meta: number
  unidad: string
  kpi_slug: string | null
}

type ObjetivoOKROut = {
  id: string
  titulo: string
  descripcion: string
  tipo: 'Club' | 'Categoria' | 'Personal'
  periodo: string | null
  progreso_promedio: number
  krs: KROut[]
}

function krPropsToOut(kr: KRProps): KROut {
  return {
    id: kr.id,
    nombre: kr.nombre,
    valor_actual: kr.valorActual,
    valor_meta: kr.valorMeta,
    unidad: kr.unidad,
    kpi_slug: kr.kpiSlug,
  }
}

function objetivoToOut(o: ObjetivoOKREntity): ObjetivoOKROut {
  return {
    id: o.id,
    titulo: o.titulo,
    descripcion: o.descripcion ?? '',
    tipo: o.tipo,
    periodo: o.periodo,
    progreso_promedio: o.getProgresoPromedio(),
    krs: o.krs.map(krPropsToOut),
  }
}

export async function getOKRs(): Promise<ObjetivoOKROut[]> {
  const supabase = await createClient()
  try {
    const useCase = new GetOKRsUseCase(new SupabaseOKRRepository(supabase))
    const objetivos = await useCase.execute()
    return objetivos.map(objetivoToOut)
  } catch (error) {
    console.error('Error fetching OKRs:', error)
    return []
  }
}

export async function upsertOKR(okr: {
  id?: string
  titulo: string
  descripcion?: string | null
  tipo: 'Club' | 'Categoria' | 'Personal'
  periodo?: string | null
}): Promise<{ id: string }> {
  const supabase = await createClient()
  const useCase = new UpsertOKRUseCase(new SupabaseOKRRepository(supabase))
  const objetivo = await useCase.execute({
    id: okr.id,
    titulo: okr.titulo,
    descripcion: okr.descripcion ?? null,
    tipo: okr.tipo,
    periodo: okr.periodo ?? null,
  })
  return { id: objetivo.id }
}

export async function addKR(kr: {
  objetivo_id: string
  nombre: string
  valor_actual?: number
  valor_meta: number
  unidad?: string
  kpi_slug?: string | null
}): Promise<KROut> {
  const supabase = await createClient()
  const useCase = new AddKRUseCase(new SupabaseOKRRepository(supabase))
  const created = await useCase.execute({
    objetivoId: kr.objetivo_id,
    nombre: kr.nombre,
    valorActual: kr.valor_actual,
    valorMeta: kr.valor_meta,
    unidad: kr.unidad,
    kpiSlug: kr.kpi_slug ?? null,
  })
  return krPropsToOut(created)
}

export async function deleteOKR(id: string): Promise<boolean> {
  const supabase = await createClient()
  const useCase = new DeleteOKRUseCase(new SupabaseOKRRepository(supabase))
  await useCase.execute(id)
  return true
}

export async function getDashStats() {
  const supabase = await createClient()

  try {
    const [asistenciaPct, golesTotales, recaudacionPct] = await Promise.all([
      calcularPorcentajeAsistencia(supabase),
      calcularTotalGoles(supabase),
      calcularEficaciaRecaudacionLegacy(supabase),
    ])

    return {
      asistencia: asistenciaPct,
      recaudacion: recaudacionPct,
      goles: golesTotales,
    }
  } catch (error) {
    console.error('Error in getDashStats:', error)
    return { asistencia: 0, recaudacion: 0, goles: 0 }
  }
}

async function calcularPorcentajeAsistencia(supabase: SupabaseServerClient): Promise<number> {
  const useCase = new GetRawAsistenciasUseCase(new SupabaseEntrenamientoRepository(supabase))
  const asistencias = await useCase.execute()
  const total = asistencias.length
  if (total === 0) return 0
  const presentes = asistencias.filter(a => a.estado === 'presente').length
  return Math.round((presentes / total) * 100)
}

async function calcularTotalGoles(supabase: SupabaseServerClient): Promise<number> {
  const useCase = new GetJugadoresUseCase(new SupabaseJugadorRepository(supabase))
  const jugadores = await useCase.execute()
  return jugadores.reduce((acc, j) => acc + j.goles, 0)
}

async function calcularEficaciaRecaudacionLegacy(supabase: SupabaseServerClient): Promise<number> {
  const useCase = new CalcularEficaciaRecaudacionUseCase(new SupabaseFacturaRepository(supabase))
  return useCase.execute()
}

