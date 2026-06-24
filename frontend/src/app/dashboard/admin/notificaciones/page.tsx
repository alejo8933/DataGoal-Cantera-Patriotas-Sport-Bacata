import { getNotificaciones } from "@/lib/entrenador/notificaciones";
import NotificacionesPanel from "@/components/entrenador/NotificacionesPanel";
import ModalBroadcast from "@/components/admin/notificaciones/ModalBroadcast";
import { Bell, Megaphone, ShieldCheck, Mail, Send } from 'lucide-react';

export default async function AdminNotificacionesPage() {
  const notificaciones = await getNotificaciones();

  // Estadísticas rápidas
  const noLeidas = notificaciones.filter(n => !n.leida).length;
  const urgentes = notificaciones.filter(n => n.prioridad === 'alta' && !n.leida).length;

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      {/* HEADER & ACTION SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-2 w-2 rounded-full bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.5)] animate-pulse" />
            <span className="text-[10px] font-black text-red-600 uppercase tracking-[0.2em]">Centro de Control</span>
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Comunicaciones</h1>
          <p className="text-gray-400 font-medium">Gestiona las alertas del sistema y emite comunicados a todo el club.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <ModalBroadcast />
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-5 group hover:shadow-md transition-all">
          <div className="h-14 w-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center transition-transform group-hover:scale-110">
            <Bell size={28} />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Pendientes</p>
            <h2 className="text-3xl font-black text-gray-900">{noLeidas}</h2>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-5 group hover:shadow-md transition-all">
          <div className="h-14 w-14 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center transition-transform group-hover:scale-110">
            <ShieldCheck size={28} />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Urgentes</p>
            <h2 className="text-3xl font-black text-gray-900">{urgentes}</h2>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-5 group hover:shadow-md transition-all">
          <div className="h-14 w-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center transition-transform group-hover:scale-110">
            <Mail size={28} />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Total Recibidas</p>
            <h2 className="text-3xl font-black text-gray-900">{notificaciones.length}</h2>
          </div>
        </div>
      </div>

      {/* NOTIFICATIONS PANEL */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <h2 className="text-xl font-bold text-gray-900">Historial de Notificaciones</h2>
          <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
             <Clock size={14} /> Actualizado recientemente
          </div>
        </div>
        
        <div className="bg-white border border-gray-100 shadow-xl shadow-gray-200/20 rounded-[2.5rem] p-8">
          <NotificacionesPanel notificaciones={notificaciones} />
        </div>
      </div>

    </div>
  );
}

function Clock(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}
