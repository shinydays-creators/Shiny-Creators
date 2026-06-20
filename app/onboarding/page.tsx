"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import MascotStar from "@/components/MascotStar";
import Button from "@/components/ui/Button";
import { saveOnboardingAction } from "./actions";

// ─── Tipos ───────────────────────────────────────────────────────────────────

type StepId =
  | "platform" | "followers" | "editing" | "challenge"
  | "goal" | "reason" | "frequency" | "time" | "niche" | "goal3m";

interface Option {
  value: string;
  label: string;
  emoji: string;
  description?: string;
}

interface Step {
  id: StepId;
  question: string;
  subtitle: string;
  options: Option[];
  cols?: 2 | 3;
  multiple?: boolean;   // permite seleccionar varias
  hasCustom?: boolean;  // muestra campo "Otra/Otro" con texto libre
  customPlaceholder?: string;
}

// ─── Pasos ───────────────────────────────────────────────────────────────────

const STEPS: Step[] = [
  {
    id: "platform",
    question: "¿En qué plataforma brillas más?",
    subtitle: "Tu canal principal — donde más tiempo pasas",
    cols: 3,
    hasCustom: true,
    customPlaceholder: "¿Cuál? Escríbela aquí...",
    options: [
      { value: "youtube",   label: "YouTube",   emoji: "▶️" },
      { value: "tiktok",    label: "TikTok",    emoji: "🎵" },
      { value: "instagram", label: "Instagram", emoji: "📸" },
      { value: "pinterest", label: "Pinterest", emoji: "📌" },
      { value: "other",     label: "Otra",      emoji: "✏️" },
    ],
  },
  {
    id: "followers",
    question: "¿Cuántos seguidores tienes ahora?",
    subtitle: "Sin miedo, ¡todas empezamos desde cero! 🌱",
    cols: 2,
    options: [
      { value: "0-100",   label: "Empezando",    emoji: "🌱", description: "0 – 100" },
      { value: "100-1k",  label: "Un poquito",   emoji: "🌿", description: "100 – 1.000" },
      { value: "1k-10k",  label: "Creciendo",    emoji: "🌳", description: "1K – 10K" },
      { value: "10k+",    label: "Ya despegué",  emoji: "🚀", description: "10K+" },
    ],
  },
  {
    id: "editing",
    question: "¿Sabes editar vídeos?",
    subtitle: "Honestidad ante todo 💛 — no hay respuesta mala",
    cols: 2,
    options: [
      { value: "pro",   label: "Soy pro",       emoji: "🎬" },
      { value: "yes",   label: "Me defiendo",   emoji: "✂️" },
      { value: "a-bit", label: "Un poco",       emoji: "📱" },
      { value: "no",    label: "Nada aún",      emoji: "🙈" },
    ],
  },
  {
    id: "challenge",
    question: "¿Qué es lo que más te cuesta?",
    subtitle: "Puedes elegir varias — cuéntanoslo todo 💛",
    cols: 2,
    multiple: true,
    options: [
      { value: "ideas",       label: "Tener ideas",         emoji: "💡" },
      { value: "consistency", label: "Ser constante",       emoji: "📅" },
      { value: "editing",     label: "La edición",          emoji: "🎞️" },
      { value: "algorithm",   label: "El algoritmo",        emoji: "📊" },
      { value: "time",        label: "El tiempo",           emoji: "⏰" },
      { value: "confidence",  label: "La confianza",        emoji: "🦋" },
      { value: "gear",        label: "El equipo técnico",   emoji: "📷" },
      { value: "oncamera",    label: "Hablar a cámara",     emoji: "🎤" },
    ],
  },
  {
    id: "goal",
    question: "¿A cuántos seguidores quieres llegar?",
    subtitle: "Sueña en grande — las metas existen para cumplirse ✨",
    cols: 2,
    options: [
      { value: "1k",  label: "1.000",      emoji: "⭐", description: "Primer hito" },
      { value: "10k", label: "10.000",     emoji: "🌟", description: "Creator oficial" },
      { value: "100k",label: "100.000",    emoji: "💫", description: "Mega creator" },
      { value: "1m",  label: "¡1 millón!", emoji: "🏆", description: "A lo grande" },
    ],
  },
  {
    id: "reason",
    question: "¿Por qué haces contenido?",
    subtitle: "Puedes elegir varias — tu motivación es tu superpoder 💪",
    cols: 2,
    multiple: true,
    options: [
      { value: "passion",   label: "Por pasión",         emoji: "❤️" },
      { value: "income",    label: "Para ganar dinero",  emoji: "💰" },
      { value: "brand",     label: "Mi marca personal",  emoji: "🌟" },
      { value: "community", label: "Crear comunidad",    emoji: "🤝" },
      { value: "fun",       label: "¡Por diversión!",    emoji: "🎉" },
      { value: "inspire",   label: "Inspirar a otros",   emoji: "✨" },
      { value: "voice",     label: "Dar mi opinión",     emoji: "🎤" },
    ],
  },
  {
    id: "frequency",
    question: "¿Con qué frecuencia publicas ahora?",
    subtitle: "Sé honesta — es solo para conocerte mejor",
    cols: 2,
    options: [
      { value: "none",    label: "No publico aún",          emoji: "😅" },
      { value: "random",  label: "Sin regularidad",         emoji: "⚡" },
      { value: "monthly", label: "1-2 veces al mes",        emoji: "📆" },
      { value: "weekly",  label: "1-2 veces a la semana",   emoji: "📅" },
      { value: "daily",   label: "Casi cada día",           emoji: "🔥" },
    ],
  },
  {
    id: "time",
    question: "¿Cuánto tiempo tienes para crear contenido?",
    subtitle: "Al día, aproximadamente",
    cols: 2,
    options: [
      { value: "under1h",   label: "Menos de 1 hora",          emoji: "⏱️" },
      { value: "1-2h",      label: "1-2 horas",                emoji: "⏰" },
      { value: "3-4h",      label: "Unas 3-4 horas",           emoji: "🌅" },
      { value: "fulltime",  label: "Tiempo completo",          emoji: "✨" },
    ],
  },
  {
    id: "niche",
    question: "¿Cuál es tu nicho?",
    subtitle: "Puedes elegir varios — o escribir el tuyo propio",
    cols: 2,
    multiple: true,
    hasCustom: true,
    customPlaceholder: "Mi nicho es...",
    options: [
      { value: "lifestyle",  label: "Lifestyle",       emoji: "🌸" },
      { value: "beauty",     label: "Belleza y moda",  emoji: "💄" },
      { value: "travel",     label: "Viajes",          emoji: "✈️" },
      { value: "fitness",    label: "Fitness y salud", emoji: "💪" },
      { value: "food",       label: "Cocina",          emoji: "🍳" },
      { value: "gaming",     label: "Gaming",          emoji: "🎮" },
      { value: "education",  label: "Educación",       emoji: "📚" },
      { value: "other",      label: "Otro",            emoji: "✏️" },
    ],
  },
  {
    id: "goal3m",
    question: "¿Qué quieres conseguir en 3 meses?",
    subtitle: "Puedes elegir varios — esto define tu camino ✨",
    cols: 2,
    multiple: true,
    options: [
      { value: "consistency",  label: "Publicar con constancia",     emoji: "📅" },
      { value: "milestone",    label: "Llegar a mi primer hito",     emoji: "⭐" },
      { value: "brand-deal",   label: "Mi primer brand deal",        emoji: "🤝" },
      { value: "monetize",     label: "Monetizar mi canal",          emoji: "💰" },
      { value: "quality",      label: "Mejorar la calidad",          emoji: "🎬" },
      { value: "confidence",   label: "Ganar confianza en cámara",   emoji: "🦋" },
    ],
  },
];

// ─── Labels para la pantalla final ───────────────────────────────────────────

const PLATFORM_LABEL: Record<string, string> = {
  youtube: "YouTube", tiktok: "TikTok", instagram: "Instagram",
  pinterest: "Pinterest", other: "tu plataforma",
};
const FOLLOWERS_LABEL: Record<string, string> = {
  "0-100": "0", "100-1k": "100", "1k-10k": "1.000", "10k+": "10.000",
};
const GOAL_LABEL: Record<string, string> = {
  "1k": "1.000", "10k": "10.000", "100k": "100.000", "1m": "1.000.000",
};

// ─── Utilidades ──────────────────────────────────────────────────────────────

type Answer = string | string[];
type Answers = Partial<Record<StepId, Answer>>;

function isAnswered(answer: Answer | undefined): boolean {
  if (!answer) return false;
  if (Array.isArray(answer)) return answer.length > 0;
  return answer.length > 0;
}

function answerToString(answer: Answer | undefined): string {
  if (!answer) return "";
  if (Array.isArray(answer)) return answer.join(",");
  return answer;
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [customValues, setCustomValues] = useState<Partial<Record<StepId, string>>>({});
  const [done, setDone] = useState(false);
  const [saving, setSaving] = useState(false);
  const [animKey, setAnimKey] = useState(0);
  const [userName, setUserName] = useState("");

  const current = STEPS[step];
  const total = STEPS.length;
  const currentAnswer = answers[current.id];
  const customValue = customValues[current.id] ?? "";

  // Si hay "other" seleccionado, el campo libre es obligatorio
  const otherSelected = Array.isArray(currentAnswer)
    ? currentAnswer.includes("other")
    : currentAnswer === "other";
  const canProceed = isAnswered(currentAnswer) && (!otherSelected || customValue.trim().length > 0);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email) setUserName(user.email.split("@")[0]);
    });
  }, []);

  function handleSelect(value: string) {
    const stepId = current.id;
    if (current.multiple) {
      const prev = (answers[stepId] as string[]) ?? [];
      const next = prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value];
      setAnswers((a) => ({ ...a, [stepId]: next }));
    } else {
      setAnswers((a) => ({ ...a, [stepId]: value }));
    }
  }

  function handleNext() {
    if (!canProceed) return;
    const newAnswers = { ...answers };
    const newCustom = { ...customValues };

    if (step < total - 1) {
      setAnimKey((k) => k + 1);
      setStep((s) => s + 1);
    } else {
      saveAndFinish(newAnswers, newCustom);
    }
  }

  function handleBack() {
    if (step > 0) {
      setAnimKey((k) => k + 1);
      setStep((s) => s - 1);
    }
  }

  async function saveAndFinish(finalAnswers: Answers, finalCustom: Partial<Record<StepId, string>>) {
    setSaving(true);

    const result = await saveOnboardingAction({
      platform:        answerToString(finalAnswers.platform),
      platform_custom: finalCustom.platform  ?? "",
      followers:       answerToString(finalAnswers.followers),
      editing:         answerToString(finalAnswers.editing),
      challenge:       answerToString(finalAnswers.challenge),
      goal:            answerToString(finalAnswers.goal),
      reason:          answerToString(finalAnswers.reason),
      frequency:       answerToString(finalAnswers.frequency),
      time:            answerToString(finalAnswers.time),
      niche:           answerToString(finalAnswers.niche),
      niche_custom:    finalCustom.niche ?? "",
      goal3m:          answerToString(finalAnswers.goal3m),
    });

    setSaving(false);

    if (result?.error) {
      console.error("Error:", result.error);
    }

    setDone(true);
  }

  // ─── Pantalla final ────────────────────────────────────────────────────────

  if (done) {
    const platformKey = answerToString(answers.platform);
    const platform = customValues.platform || PLATFORM_LABEL[platformKey] || "tu plataforma";
    const from = FOLLOWERS_LABEL[answerToString(answers.followers)] ?? "0";
    const to = GOAL_LABEL[answerToString(answers.goal)] ?? "tu meta";

    return (
      <main className="min-h-screen bg-glow-gradient flex flex-col items-center justify-center px-6 overflow-hidden">
        <div className="pointer-events-none fixed inset-0">
          <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-glow-gold/25 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-glow-pink/30 blur-3xl" />
        </div>

        <div className="relative z-10 w-full max-w-sm text-center animate-fade-up">
          <MascotStar mood="excited" size={160} animate className="mx-auto" />

          <h1 className="font-poppins text-3xl font-bold text-glow-text mt-6 leading-tight">
            ¡{userName}, vamos a por ello! 🌟
          </h1>
          <p className="font-inter text-sm text-glow-text-muted mt-3 leading-relaxed">
            Ya sabemos todo lo que necesitamos para diseñar tu camino.
          </p>

          <div className="mt-6 bg-white rounded-3xl shadow-soft-lg p-6 text-left">
            <p className="font-poppins text-xs font-semibold text-glow-text-muted uppercase tracking-widest mb-4">
              Tu aventura en {platform}
            </p>

            <div className="flex items-center gap-3">
              <div className="flex-1 bg-glow-cream rounded-2xl p-3 text-center">
                <p className="font-poppins text-xs text-glow-text-muted mb-1">Ahora</p>
                <p className="font-poppins text-2xl font-bold text-glow-text">{from}</p>
                <p className="font-inter text-xs text-glow-text-muted">seguidores</p>
              </div>

              <div className="flex flex-col items-center gap-1">
                <div className="h-px w-8 bg-gradient-to-r from-glow-gold to-glow-pink" />
                <span className="text-lg">✨</span>
                <div className="h-px w-8 bg-gradient-to-r from-glow-gold to-glow-pink" />
              </div>

              <div className="flex-1 bg-glow-gold/15 rounded-2xl p-3 text-center border-2 border-glow-gold/30">
                <p className="font-poppins text-xs text-glow-text-muted mb-1">Tu meta</p>
                <p className="font-poppins text-2xl font-bold text-glow-gold-dark">{to}</p>
                <p className="font-inter text-xs text-glow-text-muted">seguidores</p>
              </div>
            </div>

            <p className="font-inter text-xs text-glow-text-muted text-center mt-4 leading-relaxed">
              Paso a paso, racha a racha. <br />
              <span className="font-semibold text-glow-text">Tú puedes. 💛</span>
            </p>
          </div>

          <Button className="w-full mt-6 text-base" onClick={() => router.push("/perfil")}>
            ¡Empecemos! →
          </Button>
        </div>
      </main>
    );
  }

  // ─── Pasos del cuestionario ────────────────────────────────────────────────

  const cols = current.cols ?? 2;

  function isOptionSelected(value: string): boolean {
    if (current.multiple) {
      return ((answers[current.id] as string[]) ?? []).includes(value);
    }
    return answers[current.id] === value;
  }

  return (
    <main className="min-h-screen bg-glow-gradient flex flex-col px-6 py-10 overflow-hidden">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-glow-gold/15 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-glow-pink/25 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-sm mx-auto flex flex-col flex-1">

        {/* Barra de progreso */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={handleBack}
              className={`font-inter text-sm text-glow-text-muted transition-opacity ${step === 0 ? "opacity-0 pointer-events-none" : ""}`}
            >
              ← Volver
            </button>
            <span className="font-poppins text-xs font-semibold text-glow-text-muted">
              {step + 1} / {total}
            </span>
          </div>
          <div className="w-full h-1.5 bg-white/60 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${((step + 1) / total) * 100}%`,
                background: "linear-gradient(90deg, #FBCB6A, #FECFE4)",
              }}
            />
          </div>
        </div>

        {/* Pregunta */}
        <div key={animKey} className="animate-fade-up flex flex-col flex-1">
          <div className="mb-6">
            <h1 className="font-poppins text-2xl font-bold text-glow-text leading-snug">
              {current.question}
            </h1>
            <p className="font-inter text-sm text-glow-text-muted mt-2">
              {current.subtitle}
            </p>
            {current.multiple && (
              <span className="inline-block mt-2 font-inter text-xs text-glow-gold-dark font-semibold bg-glow-gold/10 rounded-full px-3 py-1">
                Selección múltiple ✓
              </span>
            )}
          </div>

          {/* Opciones */}
          <div className={`grid gap-3 ${cols === 3 ? "grid-cols-3" : "grid-cols-2"}`}>
            {current.options.map((opt) => {
              const sel = isOptionSelected(opt.value);
              return (
                <button
                  key={opt.value}
                  onClick={() => handleSelect(opt.value)}
                  className={`
                    relative flex flex-col items-center justify-center gap-1.5
                    rounded-2xl p-4 transition-all duration-200 active:scale-95
                    ${sel
                      ? "bg-glow-gold/20 border-2 border-glow-gold shadow-glow"
                      : "bg-white border-2 border-transparent shadow-soft hover:border-glow-pink/50"
                    }
                  `}
                >
                  {sel && (
                    <span className="absolute top-2 right-2 text-xs text-glow-gold font-bold">✓</span>
                  )}
                  <span className={cols === 3 ? "text-3xl" : "text-2xl"}>{opt.emoji}</span>
                  <span className={`font-poppins font-semibold text-glow-text text-center leading-tight ${cols === 3 ? "text-xs" : "text-sm"}`}>
                    {opt.label}
                  </span>
                  {opt.description && (
                    <span className="font-inter text-xs text-glow-text-muted">{opt.description}</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Campo libre si eligió "Otra/Otro" */}
          {current.hasCustom && otherSelected && (
            <div className="mt-4 animate-fade-up">
              <input
                type="text"
                value={customValue}
                onChange={(e) => setCustomValues((cv) => ({ ...cv, [current.id]: e.target.value }))}
                placeholder={current.customPlaceholder ?? "Escríbelo aquí..."}
                className="input-glow"
                autoFocus
              />
            </div>
          )}

          {/* Botón siguiente */}
          <div className="mt-auto pt-8">
            <Button
              className="w-full"
              onClick={handleNext}
              disabled={!canProceed}
              loading={saving}
            >
              {step < total - 1 ? "Siguiente →" : "¡Listo! ✨"}
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
