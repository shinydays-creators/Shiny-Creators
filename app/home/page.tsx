import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ShinyTitle from "@/components/ShinyTitle";
import BottomNav from "@/components/BottomNav";
import DailyTracker from "@/components/DailyTracker";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  // 90 días atrás en UTC — solo para limitar volumen de datos
  const since = new Date();
  since.setDate(since.getDate() - 91); // 91 para cubrir desfase de zona horaria

  const [{ data: profile }, { data: logs }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("daily_logs")
      .select("log_date, activities, challenge_completed")
      .eq("user_id", user.id)
      .gte("log_date", since.toISOString().split("T")[0])
      .order("log_date", { ascending: false }),
  ]);

  // Si el onboarding no está completado, redirigir automáticamente
  if (!profile?.onboarding_done) redirect("/onboarding");

  const userName = profile?.full_name || user.email?.split("@")[0] || "creadora";

  // Pasamos todos los logs al cliente — el cliente calcula "hoy" con su hora local
  const allLogs = (logs ?? []).map(l => ({
    log_date: l.log_date as string,
    activities: (l.activities ?? []) as string[],
    challenge_completed: l.challenge_completed as boolean,
  }));

  return (
    <main className="min-h-screen bg-glow-gradient flex flex-col overflow-hidden pb-24">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-glow-gold/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-glow-pink/25 blur-3xl" />
      </div>

      <header className="relative z-10 flex items-center justify-between px-6 pt-12 pb-2">
        <ShinyTitle className="text-2xl" />
      </header>

      <div className="relative z-10 flex-1 px-6 pb-10">
        <DailyTracker
          allLogs={allLogs}
          streakRecord={profile?.streak_record ?? 0}
          userName={userName}
          platform={profile?.platform ?? ""}
          xp={profile?.xp ?? 0}
          level={profile?.level ?? 1}
        />
      </div>

      <BottomNav />
    </main>
  );
}
