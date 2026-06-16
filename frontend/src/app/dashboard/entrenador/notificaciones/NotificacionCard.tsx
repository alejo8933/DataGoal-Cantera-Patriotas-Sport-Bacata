"use client";

type Notificacion = {
  id: string;
  titulo: string;
  descripcion: string | null;
  tipo: string;
  prioridad: string;
  leida: boolean;
  created_at: string;
};

const TIPO_ICON: Record<string, string> = {
  partido: "⚽",
  entrenamiento: "🏃",
  torneo: "🏆",
  sistema: "🔔",
};

const PRIORIDAD_COLOR: Record<string, string> = {
  alta: "border-l-red-500",
  media: "border-l-yellow-500",
  baja: "border-l-blue-500",
};

export default function NotificacionCard({
  notificacion: n,
  onLeer,
  onEliminar,
}: {
  notificacion: Notificacion;
  onLeer: () => void;
  onEliminar: () => void;
}) {
  const fecha = new Date(n.created_at).toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className={`bg-white/5 border-l-4 ${PRIORIDAD_COLOR[n.prioridad] ?? "border-l-gray-500"} 
        rounded-xl p-4 flex gap-4 items-start transition
        ${n.leida ? "opacity-60" : "opacity-100"}`}
    >
      <span className="text-2xl">{TIPO_ICON[n.tipo] ?? "🔔"}</span>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <p className={`font-semibold text-white ${!n.leida ? "font-bold" : ""}`}>
            {n.titulo}
          </p>
          {!n.leida && (
            <span className="w-2 h-2 rounded-full bg-blue-400 shrink-0" />
          )}
        </div>
        {n.descripcion && (
          <p className="text-sm text-gray-400 truncate">{n.descripcion}</p>
        )}
        <p className="text-xs text-gray-500 mt-1">{fecha}</p>
      </div>

      <div className="flex flex-col gap-1 shrink-0">
        {!n.leida && (
          <button
            onClick={onLeer}
            className="text-xs text-blue-400 hover:text-blue-300 transition"
          >
            Leída
          </button>
        )}
        <button
          onClick={onEliminar}
          className="text-xs text-red-400 hover:text-red-300 transition"
        >
          Borrar
        </button>
      </div>
    </div>
  );
}