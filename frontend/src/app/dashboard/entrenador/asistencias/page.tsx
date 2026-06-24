import { obtenerEntrenamientos, obtenerJugadoresConAsistencia, obtenerReportesAsistencia } from "@/lib/actions/entrenamientos.actions";
import AsistenciasPanel from "@/components/entrenador/AsistenciasPanel";

export default async function ControlAsistenciaPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const entrenamientoId = typeof searchParams.entrenamientoId === 'string' ? searchParams.entrenamientoId : "";

  const [entrenamientos, reportes] = await Promise.all([
    obtenerEntrenamientos(),
    obtenerReportesAsistencia()
  ]);

  const formattedEntrenamientos = entrenamientos.map(e => ({
    ...e,
    hora: e.hora || '',
    lugar: e.lugar || '',
    titulo: e.titulo ? e.titulo.split(' | JSON_DATA:')[0] : 'Entrenamiento',
  }));

  let jugadores: any[] = [];
  if (entrenamientoId) {
      jugadores = await obtenerJugadoresConAsistencia(entrenamientoId);
  }

  return (
    <div className="p-6 max-w-6xl mx-auto min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Control de Asistencia</h1>
        <p className="text-gray-500">Registra y controla la asistencia de jugadores a entrenamientos</p>
      </div>

      <AsistenciasPanel 
        entrenamientos={formattedEntrenamientos}
        initialEntrenamientoId={entrenamientoId}
        jugadores={jugadores} 
        reportes={reportes}
      />
    </div>
  );
}