"use client";
import { Bell, CheckCircle2, AlertCircle, Calendar, User } from "lucide-react";

interface Notification {
  id: string;
  titulo: string;
  descripcion?: string;
  tipo: string;
  prioridad: string;
  created_at: string;
  leida: boolean;
}

interface ActivityFeedProps {
  notifications: Notification[];
}

export default function ActivityFeed({ notifications }: ActivityFeedProps) {
  const getIcon = (tipo: string) => {
    switch (tipo) {
      case "asistencia": return <CheckCircle2 className="text-green-400" size={18} />;
      case "lesion": return <AlertCircle className="text-red-400" size={18} />;
      case "convocatoria": return <Calendar className="text-blue-400" size={18} />;
      default: return <Bell className="text-yellow-400" size={18} />;
    }
  };

  const getPriorityColor = (prioridad: string) => {
    switch (prioridad) {
      case "alta": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "media": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      default: return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    }
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm overflow-hidden flex flex-col h-full">
      <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Bell size={20} className="text-blue-500" />
        Actividad de Entrenadores
      </h2>

      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center flex-1">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <Bell className="text-gray-300" size={24} />
          </div>
          <p className="text-gray-400 text-sm font-medium">
            No hay actividad reciente
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`flex gap-4 p-4 rounded-xl border transition-all duration-200 ${
                notif.leida 
                  ? "bg-gray-50/50 border-gray-100 opacity-70" 
                  : "bg-white border-gray-100 shadow-sm hover:border-blue-200 hover:shadow-md"
              }`}
            >
              <div className={`mt-1 h-10 w-10 shrink-0 rounded-lg flex items-center justify-center ${
                notif.tipo === 'lesion' ? 'bg-red-50' : 
                notif.tipo === 'asistencia' ? 'bg-green-50' : 
                notif.tipo === 'convocatoria' ? 'bg-blue-50' : 'bg-yellow-50'
              }`}>
                {getIcon(notif.tipo)}
              </div>

              <div className="flex flex-col flex-1 min-w-0">
                <div className="flex items-center justify-between gap-4 mb-1">
                  <h4 className="text-sm font-bold text-gray-900 truncate">
                    {notif.titulo}
                  </h4>
                  <span className={`text-[10px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-md border ${
                    notif.prioridad === 'alta' ? 'bg-red-100 text-red-600 border-red-200' :
                    notif.prioridad === 'media' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                    'bg-blue-50 text-blue-600 border-blue-100'
                  }`}>
                    {notif.prioridad}
                  </span>
                </div>
                
                <p className="text-xs text-gray-500 leading-relaxed font-medium">
                  {notif.descripcion}
                </p>
                
                <div className="flex items-center gap-4 mt-3 pt-2 border-t border-gray-100/50">
                  <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1 uppercase tracking-wider">
                    <Calendar size={10} />
                    {new Date(notif.created_at).toLocaleString("es-CO", {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

