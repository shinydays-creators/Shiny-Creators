import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import BottomNav from "@/components/BottomNav";
import ShinyTitle from "@/components/ShinyTitle";
import RankingClient from "./RankingClient";

export default async function RankingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name, xp, level, streak_record, avatar_color")
    .order("xp", { ascending: false })
    .limit(50);

  return (
    <main className="min-h-screen bg-glow-gradient pb-24 overflow-hidden">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-glow-gold/15 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-glow-pink/20 blur-3xl" />
      </div>

      <header className="relative z-10 px-6 pt-12 pb-4">
        <ShinyTitle className="text-2xl" />
        <h1 className="font-poppins text-2xl font-bold text-glow-text mt-3">
          Comunidad 🌟
        </h1>
        <p className="font-inter text-sm text-glow-text-muted mt-1">
          Las creadoras más constantes esta temporada
        </p>
      </header>

      <RankingClient profiles={profiles ?? []} currentUserId={user.id} />

      <BottomNav />
    </main>
  );
}
