import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import BottomNav from "@/components/BottomNav";
import ShinyTitle from "@/components/ShinyTitle";
import HerramientasClient from "./HerramientasClient";

export default async function HerramientasPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  return (
    <main className="min-h-screen bg-glow-gradient pb-24 overflow-hidden">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-glow-gold/15 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-glow-pink/20 blur-3xl" />
      </div>
      <header className="relative z-10 px-6 pt-12 pb-2">
        <ShinyTitle className="text-2xl" />
        <h1 className="font-poppins text-2xl font-bold text-glow-text mt-3">Herramientas ✨</h1>
        <p className="font-inter text-sm text-glow-text-muted mt-1">Para tomar mejores decisiones como creadora</p>
      </header>
      <HerramientasClient />
      <BottomNav />
    </main>
  );
}
