"use client";
import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { marcarLeida, marcarTodasLeidas, eliminarNotificacion } from "@/lib/entrenador/notificaciones";
import { getConfiguracionNotificaciones, updateConfiguracionNotificaciones, ConfiguracionNotificaciones } from "@/lib/entrenador/configuracion";
import NotificacionCard from "@/components/entrenador/NotificacionCard";
import { Bell, CheckCircle2, Settings } from "lucide-react";

type Notificacion = {
  id: string;
  titulo: string;
  descripcion: string | null;
  tipo: string;
  prioridad: string;
  leida: boolean;
  created_at: string;
};

// Mapeos de tipo de notificación a categoría
const CATEGORY_MAP: Record<string, string> = {
  partido: "Partidos",
  partido_revertido: "Partidos",
  entrenamiento: "Entrenamientos",
  entrenamiento_creado: "Entrenamientos",
  entrenamiento_eliminado: "Entrenamientos",
  asistencia: "Entrenamientos",
  torneo: "Torneos",
  equipo: "Equipo",
  lesion: "Equipo",
  lesion_eliminada: "Equipo",
  convocatoria: "Partidos",
  sistema: "Sistema",
};

const TABS = ["Todas", "No leídas", "Partidos", "Entrenamientos", "Torneos", "Equipo", "Sistema"];

export default function NotificacionesPanel({
  notificaciones,
}: {
  notificaciones: Notificacion[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState<string>("Todas");
  
  const [config, setConfig] = useState<ConfiguracionNotificaciones | null>(null);

  useEffect(() => {
    getConfiguracionNotificaciones().then(setConfig).catch(console.error);
  }, []);

  const noLeidasCount = notificaciones.filter((n) => !n.leida).length;

  const filtradas = notificaciones.filter((n) => {
    if (activeTab === "Todas") return true;
    if (activeTab === "No leídas") return !n.leida;
    
    // Para las otras categorías (Partidos, Entrenamientos, etc.)
    const cat = CATEGORY_MAP[n.tipo] || "Sistema";
    return cat === activeTab;
  });

  function refresh() {
    startTransition(() => router.refresh());
  }

  async function handleMarcarTodas() {
    await marcarTodasLeidas();
    refresh();
  }

  async function handleEliminar(id: string) {
    await eliminarNotificacion(id);
    refresh();
  }

  async function toggleConfig(key: keyof ConfiguracionNotificaciones) {
    if (!config) return;
    const nextVal = !config[key];
    setConfig({ ...config, [key]: nextVal });
    try {
      await updateConfiguracionNotificaciones({ [key]: nextVal });
    } catch (e) {
      console.error(e);
      // Revertir si falla
      setConfig({ ...config });
    }
  }

  const Switch = ({ label, desc, configKey }: { label: string, desc: string, configKey: keyof ConfiguracionNotificaciones }) => (
    <div className="flex items-start justify-between py-2">
      <div>
        <p className="text-sm font-medium text-gray-900">{label}</p>
        <p className="text-xs text-gray-500">{desc}</p>
      </div>
      <button
        type="button"
        onClick={() => toggleConfig(configKey)}
        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${config?.[configKey] ? "bg-red-600" : "bg-gray-200"}`}
      >
        <span
          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${config?.[configKey] ? "translate-x-2" : "-translate-x-2"}`}
        />
      </button>
    </div>
  );

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* HEADER SECTION */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-red-50 rounded-lg text-red-600">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">Notificaciones</h1>
              {noLeidasCount > 0 && (
                <span className="px-2.5 py-0.5 bg-red-600 text-white text-xs font-bold rounded-full">
                  {noLeidasCount} nuevas
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-1">Mantente al día con todas las novedades</p>
          </div>
        </div>

        <button
          onClick={handleMarcarTodas}
          disabled={isPending || noLeidasCount === 0}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <CheckCircle2 className="w-4 h-4 text-gray-500" />
          Marcar todas como leídas
        </button>
      </div>

      {/* TABS SECTION */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-1.5 flex flex-wrap gap-1">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 px-3 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
              activeTab === tab
                ? "bg-gray-50/80 text-gray-900 shadow-sm border border-gray-200/50"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50/50"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* NOTIFICATIONS LIST */}
      <div className="space-y-3">
        {filtradas.length === 0 ? (
           <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center text-gray-500">
              No hay notificaciones en esta categoría.
           </div>
        ) : (
          filtradas.map(n => (
            <div 
              key={n.id} 
              onClick={() => {
                if (!n.leida) {
                  marcarLeida(n.id).then(refresh);
                }
              }}
              className={!n.leida ? "cursor-pointer" : ""}
            >
              <NotificacionCard
                notificacion={n}
                onEliminar={() => handleEliminar(n.id)}
              />
            </div>
          ))
        )}
      </div>

      {/* SETTINGS SECTION */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 opacity-95">
        <div className="flex items-center gap-2 mb-6">
          <Settings className="w-5 h-5 text-gray-500" />
          <div>
            <h3 className="text-gray-900 font-bold">Configuración de Notificaciones</h3>
            <p className="text-sm text-gray-500">Personaliza qué notificaciones deseas recibir</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
          {/* Col 1 */}
          <div className="space-y-6">
            <div>
              <h4 className="font-bold text-gray-800 mb-3 text-sm">Partidos</h4>
              <div className="space-y-1">
                <Switch 
                  label="Recordatorios de partidos" 
                  desc="Recibir recordatorios antes de los partidos" 
                  configKey="partidos_recordatorios" 
                />
                <Switch 
                  label="Cambios en partidos" 
                  desc="Notificar cambios de horario o cancelaciones" 
                  configKey="partidos_cambios" 
                />
              </div>
            </div>

            <div>
              <h4 className="font-bold text-gray-800 mb-3 text-sm">Torneos y Equipos</h4>
              <div className="space-y-1">
                <Switch 
                  label="Actualizaciones de torneos" 
                  desc="Noticias sobre fases y resultados de torneos" 
                  configKey="torneos_actualizaciones" 
                />
                <Switch 
                  label="Noticias del equipo" 
                  desc="Incorporaciones, bajas y noticias generales" 
                  configKey="equipo_noticias" 
                />
              </div>
            </div>
          </div>

          {/* Col 2 */}
          <div className="space-y-6">
            <div>
              <h4 className="font-bold text-gray-800 mb-3 text-sm">Entrenamientos</h4>
              <div className="space-y-1">
                <Switch 
                  label="Recordatorios de entrenamientos" 
                  desc="Recibir recordatorios antes de los entrenamientos" 
                  configKey="entrenamientos_recordatorios" 
                />
                <Switch 
                  label="Cambios en entrenamientos" 
                  desc="Notificar cambios de horario o cancelaciones" 
                  configKey="entrenamientos_cambios" 
                />
              </div>
            </div>

            <div>
              <h4 className="font-bold text-gray-800 mb-3 text-sm">Sistema</h4>
              <div className="space-y-1">
                <Switch 
                  label="Actualizaciones del sistema" 
                  desc="Nuevas funciones y mantenimientos" 
                  configKey="sistema_actualizaciones" 
                />
                <Switch 
                  label="Notificaciones por email" 
                  desc="Recibir también las notificaciones por correo" 
                  configKey="sistema_email" 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}