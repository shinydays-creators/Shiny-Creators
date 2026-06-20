"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import MascotStar from "@/components/MascotStar";
import { calculateStreak, getLocalDate, getLastNDays, shortDayName } from "@/lib/streak";

interface StreakTrackerProps {
  initialLogs: string[];       // fechas YYYY-MM-DD
  streakRecord: number;
  userName: string;
  platform: string;
}

export default function StreakTracker({
  initialLogs,
  streakRecord,
  userName,
  platform,
}: StreakTrackerProps) {
  const router = useRouter();
  const [logs, setLogs] = useState<string[]>(initialLogs);
  const [isPending, startTransition] = useTransition();
  const [justMarked, setJustMarked] = useState(false);

  const today = getLocalDate();
  const markedToday = logs.includes(today);
  const streak = calculateStreak(logs);
  const record = Math.max(streak, streakRecord);
  const last7 = getLastNDays(7).reverse(); // lunes → domingo

  // Mascota según racha
  const mascotMood =
    justMarked ? "excited"
    : streak >= 7 ? "excited"
    : streak >= 1 ? "happy"
    : "neutral";

  const platformLabel: Record<string, string> = {
    youtube: "YouTube", tiktok: "TikTok", instagram: "Instagram",
    pinterest: "Pinterest",
  };

  async function markToday() {
    if (markedToday || isPending) return;
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from("daily_logs")
      .insert({ user_id: user.id, log_date: today });

    if (!error) {
      const newLogs = [...logs, today];
      setLogs(newLogs);
      setJustMarked(true);

      // Actualizar récord si hace falta
      const newStreak = calculateStreak(newLogs);
      if (newStreak > streakRecord) {
        await supabase
          .from("profiles")
          .update({ streak_record: newStreak })
          .eq("id", user.id);
      }

      startTransition(() => router.refresh());
      setTimeout(() => setJustMarked(false), 3000);
    }
  }

  return (
    <div className="w-full max-w-sm mx-auto flex flex-col items-center gap-6">

      {/* Saludo */}
      <div className="text-center">
        <h1 className="font-poppins text-2xl font-bold text-glow-text">
          ¡Hola, {userName}! 👋
        </h1>
        {platform && (
          <p className="font-inter text-sm text-glow-text-muted mt-1">
            {platformLabel[platform] ?? platform} creator ✨
          </p>
        )}
      </div>

      {/* Tarjeta principal de racha */}
      <div className="w-full bg-white rounded-3xl shadow-soft-lg p-6 text-center relative overflow-hidden">
        {/* Fondo decorativo */}
        <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full bg-glow-gold/10 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-glow-pink/15 blur-2xl pointer-events-none" />

        <p className="font-poppins text-xs font-semibold text-glow-text-muted uppercase tracking-widest mb-2">
          🔥 Racha actual
        </p>

        <div className="relative z-10">
          <span className="font-poppins text-7xl font-bold text-glow-text leading-none">
            {streak}
          </span>
          <p className="font-inter text-sm text-glow-text-muted mt-1">
            {streak === 1 ? "día seguido" : "días seguidos"}
          </p>
        </div>

        {/* Mascota */}
        <div className="my-4">
          <MascotStar mood={mascotMood} size={110} animate={justMarked} className="mx-auto" />
        </div>

        {/* Mensaje motivador */}
        <p className="font-inter text-sm text-glow-text-muted leading-relaxed relative z-10">
          {justMarked
            ? "¡Increíble! ¡Otro día marcado! 🎉"
            : streak === 0
            ? "¡Hoy es un gran día para empezar! 💪"
            : streak < 3
            ? "¡Buen comienzo! Sigue así 🌱"
            : streak < 7
            ? "¡Estás en racha! No lo rompas 🔥"
            : "¡Imparable! Eres una máquina 🏆"}
        </p>

        {/* Récord */}
        {record > 0 && (
          <div className="mt-4 pt-4 border-t border-glow-pink/20 relative z-10">
            <p className="font-inter text-xs text-glow-text-muted">
              🏆 Tu récord: <span className="font-semibold text-glow-text">{record} {record === 1 ? "día" : "días"}</span>
            </p>
          </div>
        )}
      </div>

      {/* Tira de los últimos 7 días */}
      <div className="w-full bg-white rounded-2xl shadow-soft p-4">
        <p className="font-poppins text-xs font-semibold text-glow-text-muted uppercase tracking-widest mb-3 text-center">
          Últimos 7 días
        </p>
        <div className="flex justify-between items-center gap-1">
          {last7.map((date) => {
            const marked = logs.includes(date);
            const isToday = date === today;
            return (
              <div key={date} className="flex flex-col items-center gap-1.5 flex-1">
                <span className="font-inter text-xs text-glow-text-muted">
                  {shortDayName(date)}
                </span>
                <div
                  className={`
                    h-9 w-9 rounded-full flex items-center justify-center transition-all
                    ${marked
                      ? "bg-glow-gold shadow-glow"
                      : isToday
                      ? "border-2 border-glow-gold/50 bg-glow-gold/5"
                      : "bg-glow-cream"
                    }
                    ${isToday ? "ring-2 ring-glow-gold/30" : ""}
                  `}
                >
                  {marked
                    ? <span className="text-glow-text text-sm font-bold">✓</span>
                    : <span className="text-glow-text-muted text-xs">○</span>
                  }
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Botón marcar hoy */}
      {markedToday ? (
        <div className="w-full bg-glow-gold/10 border-2 border-glow-gold/30 rounded-2xl p-4 text-center">
          <p className="font-poppins font-semibold text-glow-text">
            ✅ ¡Ya publicaste hoy!
          </p>
          <p className="font-inter text-xs text-glow-text-muted mt-1">
            Vuelve mañana para seguir tu racha 🌟
          </p>
        </div>
      ) : (
        <button
          onClick={markToday}
          disabled={isPending}
          className="w-full btn-primary text-center text-base disabled:opacity-60"
        >
          {isPending ? "Guardando..." : "✨ ¡He publicado hoy!"}
        </button>
      )}
    </div>
  );
}
