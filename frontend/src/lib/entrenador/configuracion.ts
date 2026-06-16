"use server";
import { createClient } from "@/lib/supabase/server";

export type ConfiguracionNotificaciones = {
  partidos_recordatorios: boolean;
  partidos_cambios: boolean;
  entrenamientos_recordatorios: boolean;
  entrenamientos_cambios: boolean;
  torneos_actualizaciones: boolean;
  equipo_noticias: boolean;
  sistema_actualizaciones: boolean;
  sistema_email: boolean;
};

const DEFAULT_CONFIG: ConfiguracionNotificaciones = {
  partidos_recordatorios: true,
  partidos_cambios: true,
  entrenamientos_recordatorios: true,
  entrenamientos_cambios: true,
  torneos_actualizaciones: true,
  equipo_noticias: false,
  sistema_actualizaciones: false,
  sistema_email: true,
};

export async function getConfiguracionNotificaciones(): Promise<ConfiguracionNotificaciones> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return DEFAULT_CONFIG;
  }

  const userMeta = user.user_metadata || {};
  const config = userMeta.configuracion_notificaciones as Partial<ConfiguracionNotificaciones> || {};

  return { ...DEFAULT_CONFIG, ...config };
}

export async function updateConfiguracionNotificaciones(config: Partial<ConfiguracionNotificaciones>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("No autenticado");
  }

  const userMeta = user.user_metadata || {};
  const currentConfig = userMeta.configuracion_notificaciones || {};

  const { error } = await supabase.auth.updateUser({
    data: {
      configuracion_notificaciones: {
        ...currentConfig,
        ...config,
      },
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  return true;
}
