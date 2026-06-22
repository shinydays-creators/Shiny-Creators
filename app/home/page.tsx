import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getLocalDate } from "@/lib/streak";
import ShinyTitle from "@/components/ShinyTitle";
import BottomNav from "@/components/BottomNav";
import DailyTracker from "@/components/DailyTracker";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const since = new Date();
  since.setDate(since.getDate() - 90);

  const { data: logs } = await supabase
    .from("daily_logs")
    .select("log_date, activities, challenge_completed")
    .eq("user_id", user.id)
    .gte("log_date", since.toISOString().split("T")[0])
    .order("log_date", { ascending: false });

  const today = getLocalDate();
  const todayLog = (logs ?? []).find(l => l.log_date === today);
  const logDates = (logs ?? []).map(l => l.log_date as string);

  const userName = profile?.full_name || user.email?.split("@")[0] || "creadora";

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
          initialLogs={logDates}
          todayActivities={(todayLog?.activities ?? []) as string[]}
          todayChallengeCompleted={todayLog?.challenge_completed ?? false}
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
