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
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [emailConfirm, setEmailConfirm] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (email.toLowerCase() !== emailConfirm.toLowerCase()) {
      setError("Los emails no coinciden. Compruébalo.");
      return;
    }

    if (name.trim().length < 2) {
      setError("Pon tu nombre, aunque sea solo tu nombre de pila.");
      return;
    }

    setLoading(true);

    const supabase = createClient();
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name.trim() },
      },
    });

    if (signUpError) {
      setLoading(false);
      setError(
        signUpError.message === "User already registered"
          ? "Ya existe una cuenta con ese email. ¿Quieres iniciar sesión?"
          : signUpError.message
      );
      return;
    }

    // Guardar nombre en profiles
    if (data.user) {
      await supabase
        .from("profiles")
        .update({ full_name: name.trim() })
        .eq("id", data.user.id);
    }

    router.push("/onboarding");
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
            Crea tu cuenta
          </h1>
          <p className="font-inter text-sm text-glow-text-muted mt-1">
            Empieza a brillar hoy ✨
          </p>
        </div>

        {/* Formulario */}
        <div className="card-glow">
          <form onSubmit={handleSignup} className="flex flex-col gap-4">

            {/* Nombre */}
            <div>
              <label className="font-poppins text-xs font-semibold text-glow-text-muted uppercase tracking-wider block mb-2">
                Tu nombre
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="¿Cómo te llamamos?"
                className="input-glow"
                required
                autoComplete="given-name"
              />
            </div>

            {/* Email */}
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

            {/* Confirmar email */}
            <div>
              <label className="font-poppins text-xs font-semibold text-glow-text-muted uppercase tracking-wider block mb-2">
                Confirma tu email
              </label>
              <input
                type="email"
                value={emailConfirm}
                onChange={(e) => setEmailConfirm(e.target.value)}
                placeholder="Repite tu email"
                className={`input-glow ${
                  emailConfirm && email.toLowerCase() !== emailConfirm.toLowerCase()
                    ? "border-red-300 focus:border-red-400"
                    : emailConfirm && email.toLowerCase() === emailConfirm.toLowerCase()
                    ? "border-green-300 focus:border-green-400"
                    : ""
                }`}
                required
                autoComplete="off"
              />
              {emailConfirm && email.toLowerCase() !== emailConfirm.toLowerCase() && (
                <p className="font-inter text-xs text-red-500 mt-1">Los emails no coinciden</p>
              )}
              {emailConfirm && email.toLowerCase() === emailConfirm.toLowerCase() && (
                <p className="font-inter text-xs text-green-600 mt-1">✓ Emails coinciden</p>
              )}
            </div>

            {/* Contraseña */}
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
