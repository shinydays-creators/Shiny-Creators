"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";
import MascotStar from "@/components/MascotStar";
import ShinyTitle from "@/components/ShinyTitle";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setLoading(false);

    if (error) {
      setError(
        error.message === "User already registered"
          ? "Ya existe una cuenta con ese email. ¿Quieres iniciar sesión?"
          : error.message
      );
      return;
    }

    setSuccess(true);
  }

  if (success) {
    return (
      <main className="min-h-screen bg-glow-gradient flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-sm text-center animate-fade-up">
          <MascotStar mood="excited" size={140} animate className="mx-auto mb-6" />
          <h2 className="font-poppins text-2xl font-semibold text-glow-text">
            ¡Ya casi estás! 🎉
          </h2>
          <p className="mt-3 font-inter text-sm text-glow-text-muted leading-relaxed">
            Te hemos enviado un email de confirmación a{" "}
            <span className="font-semibold text-glow-text">{email}</span>
            <br />
            Revisa tu bandeja de entrada (y spam) para activar tu cuenta.
          </p>
          <Link href="/auth/login" className="mt-8 btn-secondary inline-block">
            Ir al inicio de sesión
          </Link>
        </div>
      </main>
    );
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
            Crea tu cuenta
          </h1>
          <p className="font-inter text-sm text-glow-text-muted mt-1">
            Empieza a brillar hoy ✨
          </p>
        </div>

        {/* Formulario */}
        <div className="card-glow">
          <form onSubmit={handleSignup} className="flex flex-col gap-4">
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
                placeholder="Mínimo 8 caracteres"
                className="input-glow"
                required
                minLength={8}
                autoComplete="new-password"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 text-sm text-red-600 font-inter">
                {error}
              </div>
            )}

            <Button type="submit" loading={loading} className="w-full mt-2">
              Crear cuenta ✨
            </Button>
          </form>
        </div>

        {/* Link a login */}
        <p className="text-center font-inter text-sm text-glow-text-muted mt-6">
          ¿Ya tienes cuenta?{" "}
          <Link
            href="/auth/login"
            className="font-semibold text-glow-text hover:text-glow-gold-dark transition-colors"
          >
            Inicia sesión →
          </Link>
        </p>
      </div>
    </main>
  );
}
