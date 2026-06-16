import { obtenerEntrenamientos, obtenerEntrenamientoPorId, obtenerJugadoresConAsistencia, obtenerReportesAsistencia } from "@/lib/actions/entrenamientos.actions";
import AdminAsistenciasPanel from "@/components/admin/AdminAsistenciasPanel";
import Link from "next/link";
import { ArrowLeft, Activity } from "lucide-react";
import { notFound } from "next/navigation";

export default async function AdminTomarAsistenciaPage({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ entrenamientoId?: string }>;
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const currentId = resolvedSearchParams.entrenamientoId || resolvedParams.id;

  const [entrenamientos, entrenamiento, jugadores, reportes] = await Promise.all([
    obtenerEntrenamientos(),
    obtenerEntrenamientoPorId(currentId),
    obtenerJugadoresConAsistencia(currentId),
    obtenerReportesAsistencia(),
  ]);

  if (!entrenamiento) notFound();

  const formattedEntrenamientos = entrenamientos.map(e => ({
    ...e,
    hora: e.hora || '',
    lugar: e.lugar || '',
    titulo: e.titulo ? e.titulo.split(' | JSON_DATA:')[0] : 'Entrenamiento',
  }));

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-10">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Link
          href="/dashboard/admin/entrenamientos"
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 transition w-fit"
        >
          <ArrowLeft size={16} />
          Volver a Entrenamientos
        </Link>
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
                    <Activity className="text-red-600" />
                    Asistencia: {entrenamiento.titulo ? entrenamiento.titulo.split(' | JSON_DATA:')[0] : 'Sesión'}
                </h1>
                <p className="text-gray-500 mt-1">
                    Control de presencia para la sesión del {entrenamiento.fecha}
                </p>
            </div>
        </div>
      </div>

      <AdminAsistenciasPanel
        entrenamientos={formattedEntrenamientos}
        initialEntrenamientoId={currentId}
        jugadores={jugadores}
        reportes={reportes}
      />
    </div>
  );
}
