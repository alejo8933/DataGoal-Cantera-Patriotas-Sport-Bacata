import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { obtenerPerfilPorId } from '@/lib/actions/usuarios.actions'

export default async function MiEquipoPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // 1. Obtener la información del jugador actual (para saber su categoría)
  // Intentamos obtener de 'jugadores', y si no, de 'perfiles' (registro original)
  const { data: jugadorActual } = await supabase
    .from('jugadores')
    .select('id, categoria')
    .eq('user_id', user.id)
    .maybeSingle()

  let miCategoria = jugadorActual?.categoria

  if (!miCategoria) {
    const perfilData = await obtenerPerfilPorId(user.id)
    miCategoria = perfilData?.categoria ?? undefined
  }

  miCategoria = miCategoria || 'General'

  // 2. Obtener todos los compañeros de la misma categoría
  const { data: compañeros } = await supabase
    .from('jugadores')
    .select('*')
    .eq('categoria', miCategoria)
    .order('apellido', { ascending: true })

  return (
    <div className="mx-auto max-w-7xl px-6 py-8 space-y-10">
      <div className="animate-in fade-in slide-in-from-top duration-700">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">👥 Mi Equipo: {miCategoria}</h1>
        <p className="text-sm text-gray-500 mt-1">Conoce a tus compañeros de categoría y equipo en la cantera.</p>
      </div>

      {(!compañeros || compañeros.length === 0) ? (
        <div className="rounded-3xl border-2 border-dashed border-gray-100 p-20 text-center">
          <p className="text-6xl mb-6">🤝</p>
          <p className="text-gray-400 font-medium text-lg">Aún no hay otros jugadores registrados en tu categoría.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {compañeros.map((comp) => {
            const esYo = comp.id === jugadorActual?.id
            return (
              <div 
                key={comp.id} 
                className={`group relative overflow-hidden rounded-3xl border ${
                  esYo ? 'border-red-200 bg-red-50/30' : 'border-gray-100 bg-white'
                } p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-1`}
              >
                {esYo && (
                  <span className="absolute top-3 right-3 bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter z-10">
                    Tú
                  </span>
                )}
                
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 rounded-2xl bg-gray-50 flex items-center justify-center text-3xl mb-4 border border-gray-100 shadow-inner group-hover:scale-110 transition-transform overflow-hidden">
                    {comp.foto_url ? (
                      <img src={comp.foto_url} alt={comp.nombre} className="w-full h-full object-cover" />
                    ) : (
                      comp.posicion?.toLowerCase().includes('portero') ? '🧤' : '🏃'
                    )}
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 text-center leading-tight">
                    {comp.nombre} {comp.apellido}
                  </h3>
                  <p className="text-xs font-bold text-red-600 uppercase tracking-widest mt-1">
                    {comp.posicion || 'Jugador'}
                  </p>
                  
                  <div className="mt-4 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-gray-900 text-white flex items-center justify-center text-xs font-black">
                      #{comp.numero_camiseta || '—'}
                    </span>
                    <div className="h-4 w-px bg-gray-200" />
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                       Temporada 2026
                    </span>
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-gray-50 grid grid-cols-2 gap-2 text-center">
                  <div>
                    <p className="text-xs font-black text-gray-800">{comp.goles || 0}</p>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Goles</p>
                  </div>
                  <div>
                    <p className="text-xs font-black text-gray-800">{comp.asistencias || 0}</p>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Asist.</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <div className="rounded-2xl bg-gradient-to-br from-gray-900 to-black p-8 text-white shadow-xl relative overflow-hidden">
         <div className="absolute right-0 top-0 p-6 opacity-10 pointer-events-none">
            <span className="text-9xl rotate-12 inline-block">🏆</span>
         </div>
         <div className="relative z-10 max-w-2xl">
            <h2 className="text-xl font-black mb-2 italic tracking-tight">VALORES DATA GOAL</h2>
            <p className="text-sm text-white/70 leading-relaxed font-medium">
              "El talento gana partidos, pero el trabajo en equipo y la inteligencia ganan campeonatos." 
              Apoya a tus compañeros y mantén siempre el respeto dentro y fuera de la cancha.
            </p>
         </div>
      </div>
    </div>
  )
}
