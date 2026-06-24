import { createClient } from '@/lib/supabase/server'
import { Users, ShieldAlert, Image as ImageIcon, FileDown } from 'lucide-react'
import Link from 'next/link'
import ModalCrearJugador from '@/components/features/jugadores/ModalCrearJugador'
import ModalEliminar from '@/components/features/ui/ModalEliminar'
import ModalEditarJugador from '@/components/features/jugadores/ModalEditarJugador'
import ModalTransferirJugador from '@/components/features/jugadores/ModalTransferirJugador'
import ExportarReporte from '@/components/admin/ExportarReporte'

export default async function AdminJugadoresPage() {
  const supabase = await createClient()

  // Fetching public.jugadores (solo activos)
  const { data: jugadores, error } = await supabase
    .from('jugadores')
    .select('*, categorias_maestras(nombre), rendimiento_equipos(equipo)')
    .eq('activo', true)
    .order('apellido')

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            <div className="p-2 bg-red-50 rounded-2xl text-red-600">
              <Users size={32} />
            </div>
            Gestión de Jugadores
          </h1>
          <p className="text-gray-500 font-medium mt-2 ml-1">Directorio completo y administración de la cantera.</p>
        </div>
        <div className="flex items-center gap-3">
          <ExportarReporte 
            filas={(jugadores || []).map(j => [
              j.nombre, 
              j.apellido, 
              j.categorias_maestras?.nombre || j.categoria || '--', 
              j.rendimiento_equipos?.equipo || '--',
              j.posicion || '--', 
              j.goles || 0, 
              j.tarjetas_amarillas || 0, 
              j.tarjetas_rojas || 0
            ])}
            titulo="REPORTE OFICIAL DE JUGADORES - DATAGOAL"
            nombreArchivo="jugadores_datagoal"
            columnas={["Nombre", "Apellido", "Categoría", "Posición", "Goles", "Amarillas", "Rojas"]}
          />
          <ModalCrearJugador />
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden group">
        {error ? (
          <div className="p-12 text-center text-red-500 flex flex-col items-center gap-4 bg-red-50/30">
            <ShieldAlert size={48} className="animate-pulse" />
            <p className="font-bold">Error al conectar con la base de datos: {error.message}</p>
          </div>
        ) : !jugadores?.length ? (
          <div className="p-20 text-center text-gray-400 flex flex-col items-center gap-4">
             <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                <Users size={32} className="text-gray-200" />
             </div>
             <p className="font-medium text-lg">No hay jugadores registrados aún en el sistema.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                  <th className="px-6 py-5">Jugador</th>
                  <th className="px-6 py-5 text-center">Categoría</th>
                  <th className="px-6 py-5 text-center">Posición</th>
                  <th className="px-6 py-5 text-center">Dorsal</th>
                  <th className="px-6 py-5 text-center">Estadísticas</th>
                  <th className="px-6 py-5 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {jugadores.map((jugador) => (
                  <tr key={jugador.id} className="hover:bg-gray-50/50 transition-colors group/row">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 shrink-0 bg-white rounded-2xl flex items-center justify-center overflow-hidden border border-gray-100 shadow-sm group-hover/row:scale-105 transition-transform">
                          {jugador.foto_url ? (
                            <img src={jugador.foto_url} alt={jugador.nombre} className="h-full w-full object-cover" />
                          ) : (
                            <ImageIcon size={20} className="text-gray-200" />
                          )}
                        </div>
                        <div>
                          <p className="font-black text-gray-900 text-sm">{jugador.nombre} {jugador.apellido}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Perfil Activo</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <Link 
                          href={`/dashboard/admin/categorias`}
                          className="px-3 py-1 rounded-lg text-[10px] font-black uppercase bg-red-50 text-red-600 border border-red-100 tracking-tight hover:bg-red-600 hover:text-white transition-all"
                        >
                          {jugador.categorias_maestras?.nombre || jugador.categoria || 'Sin Cat.'}
                        </Link>
                        {jugador.rendimiento_equipos?.equipo && (
                          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none">
                            {jugador.rendimiento_equipos.equipo}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center text-gray-500 font-bold text-xs">{jugador.posicion || '--'}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-black mx-auto">
                        {jugador.numero_camiseta || '0'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-4">
                        <div className="text-center">
                           <p className="text-[10px] font-black text-gray-400 uppercase leading-none mb-1">Goles</p>
                           <p className="text-sm font-black text-emerald-600 leading-none">{jugador.goles || 0}</p>
                        </div>
                        <div className="text-center">
                           <p className="text-[10px] font-black text-gray-400 uppercase leading-none mb-1">Tarjetas (A/R)</p>
                           <div className="flex items-center justify-center gap-1 font-black text-xs">
                             <span className="text-yellow-500">{jugador.tarjetas_amarillas || 0}</span>
                             <span className="text-gray-200">/</span>
                             <span className="text-red-500">{jugador.tarjetas_rojas || 0}</span>
                           </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover/row:opacity-100 transition-opacity">
                        <ModalTransferirJugador jugador={jugador} />
                        <ModalEditarJugador jugador={jugador} />
                        <ModalEliminar 
                          tabla="jugadores" 
                          idRegistro={jugador.id} 
                          pathRevalidacion="/dashboard/admin/jugadores"
                          modo="inactivo"
                          etiqueta="Inhabilitar"
                          esIcono={true}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
