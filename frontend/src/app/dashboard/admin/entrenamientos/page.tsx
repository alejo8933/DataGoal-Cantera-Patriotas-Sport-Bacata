import { obtenerEntrenamientos } from '@/lib/actions/entrenamientos.actions'
import { Activity, Calendar, Clock, MapPin, Tag } from 'lucide-react'
import Link from 'next/link'
import ModalCrearEntrenamiento from '@/components/features/entrenamientos/ModalCrearEntrenamiento'
import ModalEliminar from '@/components/features/ui/ModalEliminar'
import ModalEditarEntrenamiento from '@/components/features/entrenamientos/ModalEditarEntrenamiento'

export default async function AdminEntrenamientosPage() {
  let entrenamientos: any[] = [];
  let errorMsg: string | null = null;

  try {
    const list = await obtenerEntrenamientos();
    entrenamientos = list.filter(e => e.activo);
  } catch (error: any) {
    errorMsg = error.message || 'Error desconocido';
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Activity className="text-red-600" />
            Gestión de Entrenamientos
          </h1>
          <p className="text-gray-500 mt-1">Programa y supervisa las sesiones de entrenamiento de todas las categorías.</p>
        </div>
        <ModalCrearEntrenamiento />
      </div>

      {errorMsg ? (
        <div className="bg-white p-6 rounded-xl border border-red-200 text-center text-red-500 flex flex-col items-center gap-2 shadow-sm">
          <p>Error al cargar entrenamientos: {errorMsg}</p>
        </div>
      ) : !entrenamientos.length ? (
        <div className="bg-white p-12 rounded-xl border border-gray-200 text-center text-gray-500 shadow-sm">
          <p>No hay entrenamientos programados registrados aún.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {entrenamientos.map((sesion) => (
            <div key={sesion.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
              <div className={`h-2 w-full ${sesion.activo ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-lg text-gray-900 leading-tight">
                    {sesion.titulo ? sesion.titulo.split(' | JSON_DATA:')[0] : 'Sesión de Entrenamiento'}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-sm ${
                      sesion.activo 
                        ? 'bg-green-50 text-green-700 border border-green-200' 
                        : 'bg-gray-100 text-gray-500 border border-gray-200'
                    }`}>
                      {sesion.activo ? 'Vigente' : 'Inactivo'}
                    </span>
                    <ModalEliminar 
                      tabla="entrenamientos" 
                      idRegistro={sesion.id} 
                      pathRevalidacion="/dashboard/admin/entrenamientos"
                      modo="falso"
                      etiqueta="Cancelar Sesión"
                      esIcono={true}
                    />
                  </div>
                </div>
                
                {sesion.descripcion && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {sesion.descripcion}
                  </p>
                )}

                <div className="space-y-2.5 mt-auto bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <div className="flex items-center text-sm text-gray-700">
                    <Calendar size={16} className="text-red-500 mr-2 shrink-0" />
                    <span className="font-medium">{sesion.fecha || 'Fecha por definir'}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <Clock size={16} className="text-red-500 mr-2 shrink-0" />
                    <span>{sesion.hora || '--:--'}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <MapPin size={16} className="text-red-500 mr-2 shrink-0" />
                    <span className="truncate">{sesion.lugar || 'Lugar por definir'}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <Tag size={16} className="text-red-500 mr-2 shrink-0" />
                    <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded font-medium text-xs">
                      {sesion.categoria || 'General'}
                    </span>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <ModalEditarEntrenamiento sesion={{
                    id: sesion.id,
                    titulo: sesion.titulo ? sesion.titulo.split(' | JSON_DATA:')[0] : '',
                    fecha: sesion.fecha,
                    hora: sesion.hora,
                    lugar: sesion.lugar,
                    categoria: sesion.categoria,
                    descripcion: sesion.descripcion,
                  }} />
                  <Link 
                    href={`/dashboard/admin/entrenamientos/${sesion.id}/asistencia`}
                    className="py-2 text-center text-sm font-medium bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition flex items-center justify-center"
                  >
                    Ver Asistencia
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
