import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import BottomNav from "@/components/BottomNav";
import StatsClient from "./StatsClient";

export default async function EstadisticasPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("xp, level, streak_record, full_name")
    .eq("id", user.id)
    .single();

  // Todos los logs (hasta 1 año)
  const since = new Date();
  since.setFullYear(since.getFullYear() - 1);

  const { data: logs } = await supabase
    .from("daily_logs")
    .select("log_date, activities, challenge_completed")
    .eq("user_id", user.id)
    .gte("log_date", since.toISOString().split("T")[0])
    .order("log_date", { ascending: true });

  return (
    <main className="min-h-screen bg-glow-gradient pb-24 overflow-hidden">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-glow-gold/15 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-glow-pink/20 blur-3xl" />
      </div>
      <StatsClient
        logs={logs ?? []}
        xp={profile?.xp ?? 0}
        level={profile?.level ?? 1}
        streakRecord={profile?.streak_record ?? 0}
        userName={profile?.full_name || user.email?.split("@")[0] || "creadora"}
      />
      <BottomNav />
    </main>
  );
}
