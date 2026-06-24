"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { Bell } from "lucide-react";

export default function AdminNotificacionesBadge({ userId }: { userId: string }) {
  const [unreadCount, setUnreadCount] = useState(0);
  const supabase = createClient();

  useEffect(() => {
    if (!userId) return;

    const fetchUnreadCount = async () => {
      const { count } = await supabase
        .from("notificaciones")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("leida", false);
      
      setUnreadCount(count || 0);
    };

    fetchUnreadCount();

    // Suscripción en tiempo real para nuevas notificaciones
    const channel = supabase
      .channel("admin_notificaciones")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notificaciones",
          filter: `user_id=eq.${userId}`,
        },
        () => {
          fetchUnreadCount();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "notificaciones",
          filter: `user_id=eq.${userId}`,
        },
        () => {
          fetchUnreadCount();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, supabase]);

  return (
    <Link
      href="/dashboard/admin/notificaciones"
      className="relative p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition"
    >
      <Bell size={18} />
      {unreadCount > 0 && (
        <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-[#0f1117]">
          {unreadCount > 9 ? "+9" : unreadCount}
        </span>
      )}
    </Link>
  );
}
