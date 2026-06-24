import { createClient } from "@/lib/supabase/server";
import { Archive, RotateCcw, Users, Shield, Trophy, Activity } from "lucide-react";
import { restaurarRegistro } from "@/services/actions/restaurar";
import { obtenerPerfilesInactivos } from "@/lib/actions/usuarios.actions";

export default async function AdminArchivoPage() {
  const supabase = await createClient();

  const [
    { data: jugadores },
    { data: equipos },
    usuarios,
    { data: partidos },
    { data: entrenamientos },
  ] = await Promise.all([
    supabase.from("jugadores").select("*").eq("activo", false),
    supabase.from("rendimiento_equipos").select("*").eq("activo", false),
    obtenerPerfilesInactivos(),
    supabase.from("partidos").select("*").eq("estado", "Cancelado"),
    supabase.from("entrenamientos").select("*").eq("activo", false),
  ]);

  const sections = [
    { name: "Jugadores",      data: jugadores,      icon: Users,     table: "jugadores",           path: "/dashboard/admin/jugadores" },
    { name: "Categorías",     data: equipos,        icon: Shield,    table: "rendimiento_equipos", path: "/dashboard/admin/categorias" },
    { name: "Usuarios",       data: usuarios,       icon: RotateCcw, table: "perfiles",            path: "/dashboard/admin/usuarios" },
    { name: "Partidos",       data: partidos,       icon: Trophy,    table: "partidos",            path: "/dashboard/admin/partidos" },
    { name: "Entrenamientos", data: entrenamientos, icon: Activity,  table: "entrenamientos",      path: "/dashboard/admin/entrenamientos" },
  ];

  const totalInactivos =
    (jugadores?.length ?? 0) +
    (equipos?.length ?? 0) +
    (usuarios?.length ?? 0) +
    (partidos?.length ?? 0) +
    (entrenamientos?.length ?? 0);

  return (
    <div className="flex flex-col gap-8 p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Archive size={28} className="text-red-600" />
          Archivo del Club
        </h1>
        <p className="text-gray-500 text-sm mt-1 max-w-2xl">
          Repositorio de registros inactivos y cancelados. Puedes restaurarlos para volver a la gestión activa en cualquier momento.
        </p>
      </div>

      {totalInactivos === 0 ? (
        <div className="bg-white border-2 border-dashed border-gray-100 rounded-2xl p-20 text-center flex flex-col items-center gap-4 shadow-sm">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
            <Archive size={32} className="text-gray-300" />
          </div>
          <p className="text-gray-400 font-medium">El archivo está vacío actualmente</p>
        </div>
      ) : (
        <div className="space-y-10">
          {sections.map((section) =>
            section.data && section.data.length > 0 ? (
              <div key={section.name} className="flex flex-col gap-4">

                {/* Título de sección */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500">
                    <section.icon size={18} />
                  </div>
                  <h2 className="text-lg font-bold text-gray-900">
                    {section.name} Archivados
                  </h2>
                  <span className="bg-red-50 text-red-600 px-2.5 py-0.5 rounded-full text-xs font-black border border-red-100">
                    {section.data.length}
                  </span>
                </div>

                {/* Tabla */}
                <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-400 uppercase text-[10px] font-black tracking-widest">
                        <th className="px-6 py-4">Nombre / Referencia</th>
                        <th className="px-6 py-4">Categoría</th>
                        <th className="px-6 py-4 text-right">Acción</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {section.data.map((item: any) => (
                        <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                          <td className="px-6 py-4 font-bold text-gray-900">
                            {item.nombre ??
                              item.titulo ??
                              (item.equipo_local && item.equipo_visitante
                                ? `${item.equipo_local} vs ${item.equipo_visitante}`
                                : item.id)}
                          </td>
                          <td className="px-6 py-4 text-gray-500 font-medium">
                            {item.categoria ?? "—"}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <form action={restaurarRegistro}>
                              <input type="hidden" name="id"    value={item.id} />
                              <input type="hidden" name="tabla" value={section.table} />
                              <input type="hidden" name="path"  value={section.path} />
                              <button
                                type="submit"
                                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl hover:bg-emerald-100 hover:shadow-sm transition-all text-xs font-bold"
                              >
                                <RotateCcw size={14} />
                                Restaurar Registro
                              </button>
                            </form>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : null
          )}
        </div>
      )}
    </div>
  );
}