import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import BottomNav from "@/components/BottomNav";
import VictoriesClient from "./VictoriesClient";

export default async function YoPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, xp, level, streak_record")
    .eq("id", user.id)
    .single();

  const { data: victories } = await supabase
    .from("victories")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-glow-gradient pb-24 overflow-hidden">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-glow-gold/15 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-glow-pink/20 blur-3xl" />
      </div>
      <VictoriesClient
        victories={victories ?? []}
        userName={profile?.full_name || user.email?.split("@")[0] || "creadora"}
        xp={profile?.xp ?? 0}
        level={profile?.level ?? 1}
        streakRecord={profile?.streak_record ?? 0}
        email={user.email ?? ""}
      />
      <BottomNav />
    </main>
  );
}
