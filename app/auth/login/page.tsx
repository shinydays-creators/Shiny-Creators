"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";
import MascotStar from "@/components/MascotStar";
import ShinyTitle from "@/components/ShinyTitle";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);

    if (error) {
      setError(
        error.message === "Invalid login credentials"
          ? "Email o contraseña incorrectos. ¿Lo compruebas?"
          : error.message
      );
      return;
    }

    router.push("/home");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-glow-gradient flex flex-col items-center justify-center px-6">
      {/* Decoración */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-glow-gold/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-glow-pink/30 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-sm animate-fade-up">
        {/* Cabecera */}
        <div className="text-center mb-8">
          <Link href="/">
            <ShinyTitle className="text-2xl" />
          </Link>
          <MascotStar mood="happy" size={80} className="mx-auto mt-4 mb-2" />
          <h1 className="font-poppins text-xl font-semibold text-glow-text mt-3">
            ¡Bienvenida de vuelta!
          </h1>
          <p className="font-inter text-sm text-glow-text-muted mt-1">
            Tu racha te está esperando 💛
          </p>
        </div>

        {/* Formulario */}
        <div className="card-glow">
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="font-poppins text-xs font-semibold text-glow-text-muted uppercase tracking-wider block mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hola@micanal.com"
                className="input-glow"
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label className="font-poppins text-xs font-semibold text-glow-text-muted uppercase tracking-wider block mb-2">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-glow"
                required
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 text-sm text-red-600 font-inter">
                {error}
              </div>
            )}

            <Button type="submit" loading={loading} className="w-full mt-2">
              Entrar ✨
            </Button>
          </form>
        </div>

        {/* Link a signup */}
        <p className="text-center font-inter text-sm text-glow-text-muted mt-6">
          ¿Primera vez aquí?{" "}
          <Link
            href="/auth/signup"
            className="font-semibold text-glow-text hover:text-glow-gold-dark transition-colors"
          >
            Crea tu cuenta →
          </Link>
        </p>
      </div>
    </main>
  );
}
