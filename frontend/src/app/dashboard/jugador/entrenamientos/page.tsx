import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { obtenerEntrenamientos, obtenerAsistenciasPorJugador } from '@/lib/actions/entrenamientos.actions'

export default async function JugadorEntrenamientosPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Obtener info del jugador
  const { data: jugadorInfo } = await supabase
    .from('jugadores')
    .select('id, categoria')
    .eq('user_id', user.id)
    .maybeSingle()

  const categoria = jugadorInfo?.categoria || 'General'

  // Obtener entrenamientos de su categoría
  const entrenamientos = await obtenerEntrenamientos({ categoria })

  // Obtener asistencias del jugador
  const asistencias = jugadorInfo?.id 
    ? await obtenerAsistenciasPorJugador(jugadorInfo.id)
    : []

  const totalEntrenamientos = asistencias?.length || 0
  const presentes = asistencias?.filter(a => a.estado === 'Presente').length || 0
  const asistenciasPct = totalEntrenamientos > 0 ? Number(((presentes / totalEntrenamientos) * 100).toFixed(0)) : 0

  return (
    <div className="mx-auto max-w-7xl px-6 py-8 space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 animate-in fade-in slide-in-from-top duration-700">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">📅 Horarios y Asistencia</h1>
          <p className="text-sm text-gray-500 mt-1">Consulta tus sesiones de entrenamiento programadas para <span className="font-bold text-red-600">{categoria}</span></p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex items-center gap-4">
          <div className="relative w-12 h-12 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90">
                <circle cx="24" cy="24" r="20" fill="none" stroke="#f3f4f6" strokeWidth="4" />
                <circle cx="24" cy="24" r="20" fill="none" stroke="#ef4444" strokeWidth="4" strokeDasharray="125.6" strokeDashoffset={125.6 - (125.6 * (asistenciasPct as number)) / 100} />
            </svg>
            <span className="absolute text-[10px] font-bold text-gray-700">{asistenciasPct}%</span>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Asistencia Total</p>
            <p className="text-sm font-bold text-gray-800">{presentes} de {totalEntrenamientos} sesiones</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        
        {/* Cronograma de la Semana */}
        <section className="space-y-6">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <span className="w-2 h-8 bg-orange-500 rounded-full" />
            Sesiones Programadas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {!entrenamientos || entrenamientos.length === 0 ? (
                <div className="col-span-full rounded-2xl border-2 border-dashed border-gray-100 p-12 text-center">
                    <p className="text-4xl mb-4">👟</p>
                    <p className="text-gray-400 font-medium">No hay entrenamientos cargados por el momento.</p>
                </div>
            ) : (
                entrenamientos.map((ent, i) => (
                    <div key={ent.id} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex flex-col items-center justify-center font-bold">
                                <span className="text-[10px] uppercase leading-none">{new Date(ent.fecha).toLocaleDateString('es-CO', { month: 'short' })}</span>
                                <span className="text-lg leading-none">{new Date(ent.fecha).getDate()}</span>
                            </div>
                            <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-gray-100 text-gray-500 uppercase tracking-wider">
                                {ent.hora || 'Hora pendiente'}
                            </span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-red-600 transition-colors uppercase tracking-tight">
                            {ent.titulo ? ent.titulo.split(' | JSON_DATA:')[0] : 'Entrenamiento'}
                        </h3>
                        <p className="text-xs text-gray-400 mt-1 mb-4 flex items-center gap-1.5 font-medium">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                            {ent.lugar || 'Sede Principal'}
                        </p>
                        <div className="text-[11px] text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100 italic">
                            "{ent.descripcion || 'Sin instrucciones adicionales para esta sesión.'}"
                        </div>
                    </div>
                ))
            )}
          </div>
        </section>

        {/* Resumen de Asistencia */}
        <section className="space-y-6">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <span className="w-2 h-8 bg-green-500 rounded-full" />
            Historial de Asistencia
          </h2>
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                        <th className="px-6 py-4 font-bold text-gray-600 uppercase tracking-widest text-[10px]">Fecha</th>
                        <th className="px-6 py-4 font-bold text-gray-600 uppercase tracking-widest text-[10px]">Actividad</th>
                        <th className="px-6 py-4 font-bold text-gray-600 uppercase tracking-widest text-[10px] text-center">Estado</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {!asistencias || asistencias.length === 0 ? (
                        <tr>
                            <td colSpan={3} className="px-6 py-10 text-center text-gray-400 italic">No hay registros de asistencia todavía.</td>
                        </tr>
                    ) : (
                        asistencias.map((asist) => {
                            const entRel = entrenamientos?.find(e => e.id === asist.entrenamiento_id)
                            return (
                                <tr key={asist.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-800">{new Date(entRel?.fecha || Date.now()).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-gray-500">
                                        {entRel?.titulo ? entRel.titulo.split(' | JSON_DATA:')[0] : 'Entrenamiento General'}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest ${
                                            asist.estado === 'Presente' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                            {asist.estado}
                                        </span>
                                    </td>
                                </tr>
                            )
                        })
                    )}
                </tbody>
            </table>
          </div>
        </section>

      </div>
    </div>
  )
}
