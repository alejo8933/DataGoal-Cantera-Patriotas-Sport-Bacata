"use client";

import { Calendar, Trash2, Clock, Users, Trophy, Bell, UserPlus } from "lucide-react";

type Notificacion = {
  id: string;
  titulo: string;
  descripcion: string | null;
  tipo: string;
  prioridad: string;
  leida: boolean;
  created_at: string;
};

const TIPO_ICON: Record<string, React.ElementType> = {
  partido: Calendar,
  partido_revertido: Calendar,
  entrenamiento: Users,
  entrenamiento_creado: Users,
  entrenamiento_eliminado: Users,
  asistencia: Users,
  torneo: Trophy,
  sistema: Bell,
  lesion: UserPlus,
  lesion_eliminada: UserPlus,
  convocatoria: Calendar,
};

const TIPO_LABEL: Record<string, string> = {
  partido: "Partido",
  partido_revertido: "Cambio de partido",
  entrenamiento: "Entrenamiento",
  entrenamiento_creado: "Nuevo entrenamiento",
  entrenamiento_eliminado: "Cambio de entrenamiento",
  asistencia: "Asistencia",
  torneo: "Torneo",
  sistema: "Sistema",
  lesion: "Lesión",
  lesion_eliminada: "Actualización de lesión",
  convocatoria: "Convocatoria",
};

const PRIORIDAD_COLORS: Record<string, { bg: string, text: string }> = {
  alta: { bg: "bg-red-50", text: "text-red-500" },
  media: { bg: "bg-yellow-50", text: "text-yellow-600" },
  baja: { bg: "bg-blue-50", text: "text-blue-500" },
};

export default function NotificacionCard({
  notificacion: n,
  onEliminar,
  onLeer,
}: {
  notificacion: Notificacion;
  onEliminar: () => void;
  onLeer?: () => void;
}) {
  const fecha = new Date(n.created_at).toLocaleDateString("es-CO", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });

  const Icon = TIPO_ICON[n.tipo] || Bell;
  const labelCategoria = TIPO_LABEL[n.tipo] || "Notificación";
  const prior = n.prioridad ? n.prioridad.toLowerCase() : "baja";
  const prioridadColors = PRIORIDAD_COLORS[prior] || PRIORIDAD_COLORS.baja;

  return (
    <div
      className={`border rounded-xl p-4 flex flex-col gap-3 transition-colors ${
        !n.leida ? "bg-red-50/20 border-red-100" : "bg-white border-gray-200"
      }`}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-start gap-3">
          <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${!n.leida ? "text-red-600" : "text-gray-400"}`} />
          <div>
            <h4 className={`text-sm ${!n.leida ? "font-bold text-gray-900" : "font-semibold text-gray-700"}`}>
              {n.titulo}
            </h4>
            {n.descripcion && (
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                {n.descripcion}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 ml-4">
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${prioridadColors.bg} ${prioridadColors.text}`}>
            {prior}
          </span>
          {!n.leida && (
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
          )}
        </div>
      </div>

      <div className="flex justify-between items-center mt-1 pl-8">
        <span className="text-xs text-gray-400 font-medium">
          {labelCategoria}
        </span>
        <div className="flex items-center gap-3 text-gray-400">
          <div className="flex items-center gap-1.5 text-xs font-medium">
            <Clock className="w-3.5 h-3.5" />
            <span>{fecha}</span>
          </div>
          <button
            onClick={onEliminar}
            className="hover:text-red-600 transition-colors"
            title="Eliminar notificación"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}