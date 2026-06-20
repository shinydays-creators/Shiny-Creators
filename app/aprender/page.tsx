import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AprenderClient from "./AprenderClient";
import BottomNav from "@/components/BottomNav";
import ShinyTitle from "@/components/ShinyTitle";

export default async function AprenderPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: content } = await supabase
    .from("content_library")
    .select("*")
    .order("category")
    .order("order_index");

  return (
    <main className="min-h-screen bg-glow-gradient pb-24">
      {/* Decoración */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-glow-gold/15 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-glow-pink/20 blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 px-6 pt-12 pb-2">
        <ShinyTitle className="text-2xl" />
        <h1 className="font-poppins text-2xl font-bold text-glow-text mt-3">
          Aprender 📚
        </h1>
        <p className="font-inter text-sm text-glow-text-muted mt-1">
          Tutoriales y consejos para crecer
        </p>
      </header>

      {/* Contenido interactivo */}
      <AprenderClient content={content ?? []} />

      <BottomNav />
    </main>
  );
}
