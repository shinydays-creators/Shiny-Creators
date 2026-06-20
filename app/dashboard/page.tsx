import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import MascotStar from "@/components/MascotStar";
import LogoutButton from "@/components/LogoutButton";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const name = profile?.full_name || user.email?.split("@")[0] || "creadora";

  return (
    <main className="min-h-screen bg-glow-gradient flex flex-col items-center justify-center px-6">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-glow-gold/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-glow-pink/30 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-sm text-center animate-fade-up">
        <MascotStar mood="excited" size={140} animate className="mx-auto mb-6" />

        <h1 className="font-poppins text-3xl font-bold text-glow-text">
          ¡Hola, {name}! 👋
        </h1>
        <p className="mt-2 font-inter text-sm text-glow-text-muted">
          Tu dashboard está en construcción. ¡Pronto aquí brillarán tus rachas!
        </p>

        <div className="mt-8 card-glow text-left space-y-2">
          <p className="font-poppins text-xs font-semibold text-glow-text-muted uppercase tracking-wider">
            Tu cuenta
          </p>
          <p className="font-inter text-sm text-glow-text">{user.email}</p>
        </div>

        <LogoutButton />
      </div>
    </main>
  );
}
