import { obtenerPartidoPorId, obtenerEventosPartido } from "@/lib/actions/partidos.actions";
import { obtenerJugadoresActivos } from "@/lib/actions/jugadores.actions";
import EventosPartidoPanel from "@/components/entrenador/EventosPartidoPanel";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

export default async function EventosPartidoPage({
  params,
}: {
  params: { id: string };
}) {
  const [partido, eventos, jugadores] = await Promise.all([
    obtenerPartidoPorId(params.id),
    obtenerEventosPartido(params.id),
    obtenerJugadoresActivos(),
  ]);

  if (!partido) notFound();

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <Link
          href="/dashboard/entrenador/partidos"
          className="flex items-center gap-1 text-sm text-gray-400 hover:text-white transition mb-3"
        >
          <ArrowLeft size={16} />
          Volver a partidos
        </Link>

        {/* Marcador */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center mb-4">
          <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">
            {partido.fecha} · {partido.hora} · {partido.lugar}
          </p>
          <div className="flex items-center justify-center gap-6">
            <p className="text-white font-bold text-lg">{partido.equipo_local}</p>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-black text-white">{partido.goles_local ?? 0}</span>
              <span className="text-gray-500 text-xl">-</span>
              <span className="text-3xl font-black text-white">{partido.goles_visitante ?? 0}</span>
            </div>
            <p className="text-white font-bold text-lg">{partido.equipo_visitante}</p>
          </div>
        </div>

        <h1 className="text-xl font-bold text-white">Eventos del partido</h1>
      </div>

      <EventosPartidoPanel
        partidos={[partido]}
        partidoId={partido.id}
        eventos={eventos}
        jugadores={jugadores}
      />
    </div>
  );
}