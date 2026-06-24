import { Trophy, MapPin, CalendarDays, Clock, ShieldAlert } from 'lucide-react'
import { obtenerPartidos } from '@/lib/actions/partidos.actions'
import type { PartidoResponseDTO } from '@backend/modules/partidos/dtos/PartidoResponseDTO'
import ModalCrearPartido from '@/components/features/partidos/ModalCrearPartido'
import ModalEliminar from '@/components/features/ui/ModalEliminar'
import ModalEditarPartido from '@/components/features/partidos/ModalEditarPartido'

export default async function AdminPartidosPage() {
  let partidos: PartidoResponseDTO[] = []
  let errorMessage: string | null = null

  try {
    partidos = await obtenerPartidos({ incluirCancelados: false })
  } catch (error: unknown) {
    errorMessage = error instanceof Error ? error.message : 'Error desconocido.'
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Trophy className="text-red-600" />
            Gestión de Partidos
          </h1>
          <p className="text-gray-500 mt-1">Programa y registra los resultados de partidos oficiales y amistosos.</p>
        </div>
        <ModalCrearPartido />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {errorMessage ? (
          <div className="col-span-full p-12 text-center text-red-500 bg-red-50/50 rounded-3xl border border-red-100 flex flex-col items-center gap-4">
            <ShieldAlert size={48} className="animate-pulse" />
            <p className="font-bold">Error al cargar partidos: {errorMessage}</p>
          </div>
        ) : !partidos?.length ? (
          <div className="col-span-full p-20 text-center text-gray-400 bg-gray-50 rounded-[3rem] border-4 border-dashed border-gray-100 flex flex-col items-center gap-4">
             <Trophy size={64} className="opacity-10" />
             <p className="font-bold text-lg italic tracking-tight">El campo está despejado. No hay partidos programados.</p>
          </div>
        ) : (
          partidos.map((partido) => (
            <div 
              key={partido.id} 
              className="bg-white rounded-[2rem] border border-gray-100 shadow-xl hover:shadow-2xl hover:shadow-red-500/5 transition-all duration-500 overflow-hidden group flex flex-col"
            >
              {/* Scoreboard Header */}
              <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6 text-white relative">
                <div className="absolute top-4 left-6 flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${
                    partido.estado === 'Finalizado' ? 'bg-emerald-500 text-white' : 
                    partido.estado === 'Programado' ? 'bg-blue-500 text-white' : 
                    'bg-gray-600 text-white'
                  }`}>
                    {partido.estado || 'Prog.'}
                  </span>
                </div>
                <div className="absolute top-4 right-6 uppercase text-[10px] font-black tracking-widest text-red-500">
                  {partido.categoria || 'Sub-15'}
                </div>

                <div className="flex items-center justify-between gap-4 mt-6">
                  {/* Local */}
                  <div className="flex flex-col items-center gap-2 flex-1">
                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center border border-white/20 backdrop-blur-sm shadow-inner group-hover:scale-110 transition-transform">
                       <span className="text-xl font-black">{partido.equipo_local?.[0]}</span>
                    </div>
                    <p className="text-sm font-bold truncate max-w-[100px] text-center">{partido.equipo_local}</p>
                  </div>

                  {/* Score */}
                  <div className="flex flex-col items-center justify-center px-4">
                    <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-2xl flex items-center gap-3">
                      <span className="text-3xl font-black tracking-tighter w-8 text-center">{partido.goles_local ?? '-'}</span>
                      <span className="text-red-500 font-black text-xl">:</span>
                      <span className="text-3xl font-black tracking-tighter w-8 text-center">{partido.goles_visitante ?? '-'}</span>
                    </div>
                  </div>

                  {/* Visitante */}
                  <div className="flex flex-col items-center gap-2 flex-1">
                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center border border-white/20 backdrop-blur-sm shadow-inner group-hover:scale-110 transition-transform">
                       <span className="text-xl font-black">{partido.equipo_visitante?.[0]}</span>
                    </div>
                    <p className="text-sm font-bold truncate max-w-[100px] text-center">{partido.equipo_visitante}</p>
                  </div>
                </div>
              </div>

              {/* Match Details Padding */}
              <div className="p-6 flex flex-col flex-1">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl">
                    <div className="bg-white p-2 rounded-xl text-gray-400 shadow-sm">
                      <CalendarDays size={14} />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Fecha</p>
                      <p className="text-xs font-black text-gray-700">{partido.fecha}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl">
                    <div className="bg-white p-2 rounded-xl text-gray-400 shadow-sm">
                      <Clock size={14} />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Hora</p>
                      <p className="text-xs font-black text-gray-700">{partido.hora || 'Por definir'}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-red-50/30 rounded-2xl mb-6">
                   <div className="bg-white p-2 rounded-xl text-red-400 shadow-sm">
                      <MapPin size={14} />
                   </div>
                   <div>
                      <p className="text-[9px] font-black text-red-500 uppercase tracking-widest mb-0.5">Ubicación</p>
                      <p className="text-xs font-bold text-gray-700 leading-tight">{partido.lugar || 'Sede Principal Bacatá'}</p>
                   </div>
                </div>

                {/* Management Toolbar */}
                <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between gap-3">
                   <div className="flex items-center gap-2">
                      <ModalEditarPartido partido={partido} soloResultado={true} />
                      <ModalEditarPartido partido={partido} />
                   </div>
                   <ModalEliminar 
                    tabla="partidos" 
                    idRegistro={partido.id} 
                    pathRevalidacion="/dashboard/admin/partidos"
                    modo="cancelado"
                    etiqueta="Cancelar Encuentro"
                    esIcono={true}
                  />
                </div>
              </div>
            </div>
          ))
        ) }
      </div>
    </div>
  )
}
