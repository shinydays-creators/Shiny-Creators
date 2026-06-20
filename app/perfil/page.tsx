import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import BottomNav from "@/components/BottomNav";
import PerfilClient from "./PerfilClient";

export default async function PerfilPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Racha y récord
  const since = new Date();
  since.setDate(since.getDate() - 90);
  const { data: logs } = await supabase
    .from("daily_logs")
    .select("log_date")
    .eq("user_id", user.id)
    .gte("log_date", since.toISOString().split("T")[0]);

  const logDates = (logs ?? []).map((l) => l.log_date as string);

  return (
    <main className="min-h-screen bg-glow-gradient pb-24 overflow-hidden">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-glow-gold/15 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-glow-pink/20 blur-3xl" />
      </div>

      <PerfilClient
        profile={profile ?? {}}
        email={user.email ?? ""}
        logDates={logDates}
      />

      <BottomNav />
    </main>
  );
}
