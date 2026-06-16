import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { BellIcon } from "lucide-react"; // o el ícono que uses

export default async function NotificacionesBadge() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { count } = await supabase
    .from("notificaciones")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user?.id ?? "")
    .eq("leida", false);

  return (
    <Link
      href="/dashboard/entrenador/notificaciones"
      className="relative text-gray-300 hover:text-white transition"
    >
      <BellIcon className="w-6 h-6" />
      {(count ?? 0) > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
          {count}
        </span>
      )}
    </Link>
  );
}