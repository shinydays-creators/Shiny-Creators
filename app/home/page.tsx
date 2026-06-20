import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ShinyTitle from "@/components/ShinyTitle";
import StreakTracker from "@/components/StreakTracker";
import LogoutButton from "@/components/LogoutButton";
import BottomNav from "@/components/BottomNav";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  // Redirige al onboarding si no lo ha completado
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // TODO: reactivar cuando el onboarding funcione bien
  // if (!profile?.onboarding_done) redirect("/onboarding");

  // Obtener los logs de los últimos 90 días (suficiente para calcular rachas)
  const since = new Date();
  since.setDate(since.getDate() - 90);

  const { data: logs } = await supabase
    .from("daily_logs")
    .select("log_date")
    .eq("user_id", user.id)
    .gte("log_date", since.toISOString().split("T")[0])
    .order("log_date", { ascending: false });

  const logDates = (logs ?? []).map((l) => l.log_date as string);
  const userName = profile?.full_name || user.email?.split("@")[0] || "creadora";

  return (
    <main className="min-h-screen bg-glow-gradient flex flex-col overflow-hidden pb-24">
      {/* Decoración */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-glow-gold/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-glow-pink/25 blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 pt-12 pb-4">
        <ShinyTitle className="text-2xl" />
        <LogoutButton />
      </header>

      {/* Contenido principal */}
      <div className="relative z-10 flex-1 px-6 pb-10">
        <StreakTracker
          initialLogs={logDates}
          streakRecord={profile?.streak_record ?? 0}
          userName={userName}
          platform={profile?.platform ?? ""}
        />
      </div>

      <BottomNav />
    </main>
  );
}
