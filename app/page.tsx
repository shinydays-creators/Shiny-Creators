import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import MascotStar from "@/components/MascotStar";
import ShinyTitle from "@/components/ShinyTitle";

export default async function WelcomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) redirect("/home");
  return (
    <main className="relative min-h-screen bg-glow-gradient flex flex-col items-center justify-between overflow-hidden px-6 py-12">
      {/* Decoración de fondo — círculos difusos */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-glow-gold/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-glow-pink/30 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/30 blur-2xl" />
      </div>

      {/* Contenido */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-sm mx-auto gap-0">

        {/* Logo / título */}
        <div className="animate-fade-up text-center mt-8">
          <ShinyTitle className="text-5xl" />
          <div className="mt-1 flex items-center justify-center gap-1">
            <span className="text-xl">✨</span>
            <p className="font-inter text-sm font-medium text-glow-text-muted tracking-widest uppercase">
              para creadoras
            </p>
            <span className="text-xl">✨</span>
          </div>
        </div>

        {/* Mascota flotante */}
        <div className="mt-10 animate-fade-up" style={{ animationDelay: "0.15s", opacity: 0 }}>
          <MascotStar mood="happy" size={180} animate />
        </div>

        {/* Tagline */}
        <div className="mt-8 text-center animate-fade-up" style={{ animationDelay: "0.3s", opacity: 0 }}>
          <h1 className="font-poppins text-2xl font-semibold text-glow-text leading-snug">
            Haz brillar tu contenido
            <br />
            <span className="text-glow-gold-dark">cada día.</span>
          </h1>
          <p className="mt-3 font-inter text-sm text-glow-text-muted leading-relaxed max-w-xs mx-auto">
            Construye rachas, mantén el ritmo y crece en YouTube, TikTok e Instagram.
          </p>
        </div>

        {/* Botones */}
        <div
          className="mt-12 flex flex-col gap-3 w-full animate-fade-up"
          style={{ animationDelay: "0.45s", opacity: 0 }}
        >
          <Link href="/auth/signup" className="btn-primary text-center text-lg">
            Empezar gratis ✨
          </Link>
          <Link
            href="/auth/login"
            className="text-center font-poppins font-medium text-glow-text-muted text-sm py-3 transition-colors hover:text-glow-text"
          >
            Ya tengo cuenta →
          </Link>
        </div>
      </div>

      {/* Footer */}
      <p className="relative z-10 font-inter text-xs text-glow-text-muted/60 text-center mt-8">
        Hecho con amor para creadoras 💛
      </p>
    </main>
  );
}
