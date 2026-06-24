import { createClient } from '@/lib/supabase/server'
import { Shield, ShieldAlert, Trophy, Users, Star, Activity } from 'lucide-react'
import ModalCrearEquipo from '@/components/features/equipos/ModalCrearEquipo'
import ModalCrearCategoriaMaestra from '@/components/features/equipos/ModalCrearCategoriaMaestra'
import ModalEditarCategoriaMaestra from '@/components/features/equipos/ModalEditarCategoriaMaestra'
import CardEquipoPremium from '@/components/features/equipos/CardEquipoPremium'
import { crearCategoriaMaestra } from '@/services/actions/categorias_maestras'

export default async function AdminCategoriasPage() {
  const supabase = await createClient()

  // Obtener Categorías Maestras
  const { data: categoriasMaestras } = await supabase
    .from('categorias_maestras')
    .select('*')
    .eq('activo', true)
    .order('nombre')

  // Obtener Equipos (Competitivos)
  const { data: equipos, error } = await supabase
    .from('rendimiento_equipos')
    .select('*')
    .eq('activo', true)
    .order('puntos', { ascending: false })

  const totalCategorias = categoriasMaestras?.length || 0
  const totalEquipos = equipos?.length || 0
  const totalPuntos = equipos?.reduce((acc, eq) => acc + (eq.puntos || 0), 0) || 0
  const mejorCategoria = equipos?.[0]?.equipo || 'Ninguna'

  const kpis = [
    { label: 'Grupos Maestros', value: totalCategorias, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Equipos Activos', value: totalEquipos, icon: Shield, color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'Puntos Totales', value: totalPuntos, icon: Star, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { label: 'Rendimiento Global', value: '84%', icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ]

  return (
    <div className="flex flex-col gap-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex-1">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
            Nuestras Categorías
          </h1>
          <p className="text-gray-500 font-medium mt-1">
            Descubre y gestiona las categorías que forman parte de la familia <span className="text-red-600 font-bold">Patriota Sport Bacatá</span>.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <ModalCrearCategoriaMaestra />
          <ModalCrearEquipo categoriasMaestras={categoriasMaestras || []} />
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`p-3 rounded-2xl ${kpi.bg} ${kpi.color}`}>
              <kpi.icon size={21} />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">{kpi.label}</p>
              <p className="text-lg font-black text-gray-900 truncate w-32 md:w-full font-sans">{kpi.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CATEGORIES & TEAMS SECTIONS */}
      <div className="space-y-16">
        {categoriasMaestras?.map((maestra) => {
          const equiposEnCategoria = equipos?.filter(e => e.categoria_id === maestra.id)
          
          return (
            <section key={maestra.id} className="space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-8 bg-red-600 rounded-full" />
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                      {maestra.nombre}
                    </h2>
                  </div>
                  <ModalEditarCategoriaMaestra categoria={maestra} />
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-sm text-gray-400 font-bold uppercase tracking-wider italic">
                    {maestra.modalidad} — {maestra.edades}
                  </p>
                  <span className="px-4 py-1.5 bg-gray-50 text-gray-400 text-[10px] font-black uppercase rounded-full tracking-widest">
                    {equiposEnCategoria?.length || 0} Equipos
                  </span>
                </div>
              </div>

              {equiposEnCategoria && equiposEnCategoria.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  {equiposEnCategoria.map((equipo) => (
                    <CardEquipoPremium key={equipo.id} equipo={equipo} />
                  ))}
                </div>
              ) : (
                <div className="py-12 px-10 bg-gray-50/50 rounded-[2.5rem] border-2 border-dashed border-gray-100 text-center">
                   <p className="text-gray-400 font-medium italic">No hay equipos creados bajo esta categoría maestra.</p>
                </div>
              )}
            </section>
          )
        })}

        {/* Equipos Sin Categoría Maestra (Legacy / Orphan) */}
        {equipos?.some(e => !e.categoria_id) && (
          <section className="space-y-6">
            <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
              <h2 className="text-2xl font-black text-gray-400 tracking-tight uppercase tracking-widest">Equipos por Migrar</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
              {equipos.filter(e => !e.categoria_id).map((equipo) => (
                <CardEquipoPremium key={equipo.id} equipo={equipo} />
              ))}
            </div>
          </section>
        )}

        {error && (
          <div className="p-12 text-center text-red-500 bg-red-50 rounded-[3rem] border border-red-100 flex flex-col items-center gap-4">
            <ShieldAlert size={48} className="animate-bounce" />
            <div className="max-w-xs">
              <p className="font-black uppercase text-xs tracking-widest mb-1">Error de Conexión</p>
              <p className="text-sm font-medium">{error.message}</p>
            </div>
          </div>
        )}

        {!categoriasMaestras?.length && !equipos?.length && (
          <div className="p-20 text-center text-gray-400 bg-gray-50 rounded-[3rem] border-4 border-dashed border-gray-100">
            <Shield size={64} className="mx-auto mb-4 opacity-20" />
            <p className="font-bold text-lg italic">Aún no hay categorías maestras ni equipos definidos.</p>
            <p className="text-sm">Comienza creando una categoría maestra (ej: Sub-11).</p>
          </div>
        )}
      </div>
    </div>
  )
}
