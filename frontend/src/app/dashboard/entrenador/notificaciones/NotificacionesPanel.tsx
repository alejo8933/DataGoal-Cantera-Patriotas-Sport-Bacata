"use client";
import { useState, useTransition } from "react";
import { marcarLeida, marcarTodasLeidas, eliminarNotificacion } from "@/lib/entrenador/notificaciones";
import NotificacionCard from "@/components/entrenador/NotificacionCard";
import { useRouter } from "next/navigation";

type Notificacion = {
  id: string;
  titulo: string;
  descripcion: string | null;
  tipo: string;
  prioridad: string;
  leida: boolean;
  created_at: string;
};

export default function NotificacionesPanel({
  notificaciones,
}: {
  notificaciones: Notificacion[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [filtro, setFiltro] = useState<"todas" | "no_leidas">("todas");

  const filtradas =
    filtro === "no_leidas"
      ? notificaciones.filter((n) => !n.leida)
      : notificaciones;

  const noLeidas = notificaciones.filter((n) => !n.leida).length;

  function refresh() {
    startTransition(() => router.refresh());
  }

  async function handleMarcarTodas() {
    await marcarTodasLeidas();
    refresh();
  }

  async function handleMarcarLeida(id: string) {
    await marcarLeida(id);
    refresh();
  }

  async function handleEliminar(id: string) {
    await eliminarNotificacion(id);
    refresh();
  }

  return (
    <div>
      {/* Header con filtros */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          <button
            onClick={() => setFiltro("todas")}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
              filtro === "todas"
                ? "bg-blue-600 text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            Todas ({notificaciones.length})
          </button>
          <button
            onClick={() => setFiltro("no_leidas")}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
              filtro === "no_leidas"
                ? "bg-blue-600 text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            No leídas ({noLeidas})
          </button>
        </div>

        {noLeidas > 0 && (
          <button
            onClick={handleMarcarTodas}
            disabled={isPending}
            className="text-sm text-blue-400 hover:text-blue-300 transition"
          >
            Marcar todas como leídas
          </button>
        )}
      </div>

      {/* Lista */}
      {filtradas.length === 0 ? (
        <div className="text-center text-gray-400 py-16">
          <p className="text-4xl mb-3">🔔</p>
          <p className="text-lg">Sin notificaciones</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtradas.map((n) => (
            <NotificacionCard
              key={n.id}
              notificacion={n}
              onLeer={() => handleMarcarLeida(n.id)}
              onEliminar={() => handleEliminar(n.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}