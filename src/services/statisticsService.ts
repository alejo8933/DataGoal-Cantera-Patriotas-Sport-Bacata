import { SupabaseStatisticsRepository } from '@/repositories/supabase/StatisticsRepository'

const repo = new SupabaseStatisticsRepository()

export const statisticsService = {
  getGoalscorers:     () => repo.getGoalscorers(),
  getTeamPerformance: () => repo.getTeamPerformance(),
  // Calcula promedio de goles por partido (global o por equipo si se provee teamId)
  averageGoalsPerMatch: async (teamId?: string) => {
    const supabase = await (await import('@/lib/supabase/server')).createClient()
    // contar goles por partido
    let query = supabase.from('eventos_partido').select('partido_id, tipo')
    if (teamId) query = query.eq('equipo', teamId)
    const { data, error } = await query
    if (error) throw new Error(error.message)
    const goles = (data ?? []).filter((e: any) => e.tipo === 'gol')
    const partidosSet = new Set((goles as any[]).map((g: any) => g.partido_id))
    const totalGoals = goles.length
    const totalMatches = partidosSet.size || 1
    return { averageGoalsPerMatch: totalGoals / totalMatches, totalGoals, totalMatches }
  },

  // Rendimiento porcentual de un equipo: (goles a favor - goles en contra) / partidos * 100
  performancePercentage: async (teamId: string) => {
    if (!teamId) throw new Error('teamId requerido')
    const supabase = await (await import('@/lib/supabase/server')).createClient()
    const { data, error } = await supabase.from('eventos_partido').select('*').or(`equipo.eq.${teamId},equipo.eq.${teamId}`)
    if (error) throw new Error(error.message)
    const events = data ?? []
    // consideramos goles por equipo por partido
    const partidos = new Map<string, { for: number; against: number }>()
    for (const ev of events) {
      const pid = ev.partido_id
      if (!partidos.has(pid)) partidos.set(pid, { for: 0, against: 0 })
      const record = partidos.get(pid)!
      if (ev.tipo === 'gol') {
        if (ev.equipo === teamId) record.for += 1
        else record.against += 1
      }
    }
    const totalMatches = partidos.size
    let netGoals = 0
    for (const val of partidos.values()) netGoals += val.for - val.against
    const performance = totalMatches === 0 ? 0 : (netGoals / totalMatches) * 100
    return { performancePercentage: performance, totalMatches, netGoals }
  },
}