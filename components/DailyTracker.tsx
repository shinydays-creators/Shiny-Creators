"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import MascotStar from "@/components/MascotStar";
import { calculateStreak, getLocalDate, getLastNDays, shortDayName } from "@/lib/streak";
import { logDailyActivities, updateStreakRecord } from "@/app/home/actions";
import { levelInfo } from "@/lib/levels";
import MotivationalBanner from "@/components/MotivationalBanner";
import ShareStreakCard from "@/components/ShareStreakCard";

const ACTIVITIES = [
  { id: "publish",   emoji: "📤", label: "Publicar contenido" },
  { id: "record",    emoji: "🎬", label: "Grabar contenido" },
  { id: "edit",      emoji: "✂️", label: "Editar contenido" },
  { id: "learn",     emoji: "📚", label: "Aprender algo nuevo" },
  { id: "collab",    emoji: "🤝", label: "Buscar colaboraciones" },
  { id: "plan",      emoji: "📅", label: "Planificar contenido" },
  { id: "ideas",     emoji: "💡", label: "Generar ideas" },
  { id: "community", emoji: "💬", label: "Interactuar con tu comunidad" },
];

const DAILY_CHALLENGES = [
  "Responde a 5 comentarios de tu comunidad",
  "Escribe 10 ideas de contenido para esta semana",
  "Analiza un creador de tu nicho",
  "Busca 3 marcas con las que te gustaría colaborar",
  "Graba un clip de 15 segundos aunque no lo publiques",
  "Mejora la miniatura de uno de tus vídeos",
  "Investiga una tendencia de tu plataforma",
  "Escribe el guión de tu próximo vídeo",
  "Deja comentarios valiosos en 3 publicaciones de tu nicho",
  "Crea una encuesta para conocer mejor a tu audiencia",
  "Organiza tu carpeta de ideas y borra lo obsoleto",
  "Graba un detrás de cámaras de tu proceso creativo",
];

function getDailyChallenge(): string {
  const today = getLocalDate();
  const dayOfYear = Math.floor(
    (new Date(today).getTime() - new Date(today.slice(0, 4) + "-01-01").getTime()) / 86400000
  );
  return DAILY_CHALLENGES[dayOfYear % DAILY_CHALLENGES.length];
}

interface Props {
  initialLogs: string[];
  todayActivities: string[];
  todayChallengeCompleted: boolean;
  streakRecord: number;
  userName: string;
  platform: string;
  xp: number;
  level: number;
}

export default function DailyTracker({
  initialLogs,
  todayActivities,
  todayChallengeCompleted,
  streakRecord,
  userName,
  platform,
  xp,
  level,
}: Props) {
  const router = useRouter();
  const [logs, setLogs] = useState<string[]>(initialLogs);
  const [selected, setSelected] = useState<string[]>(todayActivities);
  const [challengeDone, setChallengeDone] = useState(todayChallengeCompleted);
  const [saving, setSaving] = useState(false);
  const [xpToast, setXpToast] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  const today = getLocalDate();
  const alreadySaved = initialLogs.includes(today);
  const streak = calculateStreak(logs);
  const record = Math.max(streak, streakRecord);
  const last7 = getLastNDays(7).reverse();
  const challenge = getDailyChallenge();
  const info = levelInfo(level);
  const nextLevelXp = [100, 300, 700, 1500, 9999][Math.min(level - 1, 4)];
  const prevLevelXp = [0, 100, 300, 700, 1500][Math.min(level - 1, 4)];
  const xpProgress = Math.min(((xp - prevLevelXp) / (nextLevelXp - prevLevelXp)) * 100, 100);

  const platformLabel: Record<string, string> = {
    youtube: "YouTube", tiktok: "TikTok", instagram: "Instagram", pinterest: "Pinterest",
  };

  function toggleActivity(id: string) {
    if (alreadySaved) return;
    setSelected(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]);
  }

  async function handleSave() {
    if (saving || (selected.length === 0 && !challengeDone)) return;
    setSaving(true);

    const allActivities = challengeDone ? [...selected, "challenge"] : selected;
    const result = await logDailyActivities(allActivities, challengeDone, challenge);

    if (result?.success) {
      const newLogs = alreadySaved ? logs : [...logs, today];
      setLogs(newLogs);

      const newStreak = calculateStreak(newLogs);
      if (newStreak > record) await updateStreakRecord(newStreak);

      if (result.xpGained && result.xpGained > 0) {
        setXpToast(result.xpGained);
        setTimeout(() => setXpToast(null), 3000);
      }

      startTransition(() => router.refresh());
    }

    setSaving(false);
  }

  const mascotMood = streak >= 7 ? "excited" : streak >= 1 ? "happy" : "neutral";
  const hasAnythingSelected = selected.length > 0 || challengeDone;

  return (
    <div className="w-full max-w-sm mx-auto flex flex-col gap-5">

      {/* Toast XP */}
      {xpToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-glow-gold text-white font-poppins font-bold text-sm px-5 py-2.5 rounded-full shadow-lg animate-fade-up">
          +{xpToast} XP ✨
        </div>
      )}

      {/* Saludo */}
      <div className="text-center pt-2">
        <h1 className="font-poppins text-2xl font-bold text-glow-text">
          ¡Hola, {userName}! 👋
        </h1>
        {platform && (
          <p className="font-inter text-sm text-glow-text-muted mt-0.5">
            {platformLabel[platform] ?? platform} creator ✨
          </p>
        )}
      </div>

      {/* Banner motivador */}
      <MotivationalBanner
        userName={userName}
        streak={streak}
        streakRecord={record}
        xp={xp}
        level={level}
        totalDays={logs.length}
        savedToday={alreadySaved}
      />

      {/* Nivel y XP */}
      <div className="bg-white rounded-2xl shadow-soft p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">{info.emoji}</span>
            <div>
              <p className="font-poppins text-xs font-bold text-glow-text">Nivel {level} — {info.name}</p>
              <p className="font-inter text-xs text-glow-text-muted">{xp} XP acumulados</p>
            </div>
          </div>
          <span className="font-poppins text-xs font-semibold text-glow-gold-dark bg-glow-gold/10 px-2 py-1 rounded-full">
            🔥 {streak} días
          </span>
        </div>
        <div className="h-2 bg-glow-cream rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-glow-gold to-glow-pink rounded-full transition-all duration-700"
            style={{ width: `${xpProgress}%` }}
          />
        </div>
        {level < 5 && (
          <p className="font-inter text-xs text-glow-text-muted mt-1.5 text-right">
            {nextLevelXp - xp} XP para el siguiente nivel
          </p>
        )}
      </div>

      {/* Tira 7 días */}
      <div className="bg-white rounded-2xl shadow-soft p-4">
        <p className="font-poppins text-xs font-semibold text-glow-text-muted uppercase tracking-widest mb-3 text-center">
          Últimos 7 días
        </p>
        <div className="flex justify-between items-center gap-1">
          {last7.map((date) => {
            const marked = logs.includes(date);
            const isToday = date === today;
            return (
              <div key={date} className="flex flex-col items-center gap-1.5 flex-1">
                <span className="font-inter text-xs text-glow-text-muted">{shortDayName(date)}</span>
                <div className={`h-9 w-9 rounded-full flex items-center justify-center transition-all
                  ${marked ? "bg-glow-gold shadow-glow" : isToday ? "border-2 border-glow-gold/50 bg-glow-gold/5" : "bg-glow-cream"}
                  ${isToday ? "ring-2 ring-glow-gold/30" : ""}
                `}>
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

      {/* Reto diario */}
      <div className={`bg-white rounded-2xl shadow-soft p-4 border-2 transition-colors ${challengeDone ? "border-glow-gold/40 bg-glow-gold/5" : "border-transparent"}`}>
        <div className="flex items-start gap-3">
          <span className="text-2xl mt-0.5">⭐</span>
          <div className="flex-1">
            <p className="font-poppins text-xs font-bold text-glow-text-muted uppercase tracking-widest mb-1">Reto de hoy</p>
            <p className="font-inter text-sm text-glow-text leading-snug">{challenge}</p>
          </div>
          <button
            onClick={() => !alreadySaved && setChallengeDone(p => !p)}
            className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
              challengeDone ? "bg-glow-gold border-glow-gold text-white" : "border-glow-gold/40"
            }`}
          >
            {challengeDone && <span className="text-sm font-bold">✓</span>}
          </button>
        </div>
        {challengeDone && <p className="font-inter text-xs text-glow-gold-dark font-semibold mt-2 ml-9">+20 XP · ¡Reto completado! 🎉</p>}
      </div>

      {/* Registro de actividades */}
      <div className="bg-white rounded-2xl shadow-soft p-4">
        <div className="flex items-center gap-2 mb-1">
          <MascotStar mood={mascotMood} size={36} className="flex-shrink-0" />
          <p className="font-poppins text-sm font-bold text-glow-text">
            {alreadySaved ? "Lo que hiciste hoy:" : "¿Qué has hecho hoy?"}
          </p>
        </div>
        <p className="font-inter text-xs text-glow-text-muted mb-4 ml-11">
          {alreadySaved
            ? "Tu racha está activa 🔥"
            : "Marca todo lo que hayas hecho. No necesitas publicar para avanzar."}
        </p>
        <div className="flex flex-col gap-2">
          {ACTIVITIES.map((act) => {
            const isSelected = selected.includes(act.id);
            return (
              <button
                key={act.id}
                onClick={() => toggleActivity(act.id)}
                disabled={alreadySaved}
                className={`flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all ${
                  isSelected
                    ? "border-glow-gold bg-glow-gold/8 "
                    : "border-glow-cream bg-glow-cream/50"
                } ${alreadySaved ? "opacity-70" : "active:scale-98"}`}
              >
                <span className="text-lg flex-shrink-0">{act.emoji}</span>
                <span className="font-inter text-sm text-glow-text flex-1">{act.label}</span>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                  isSelected ? "bg-glow-gold border-glow-gold" : "border-glow-text-muted/40"
                }`}>
                  {isSelected && <span className="text-white text-xs font-bold">✓</span>}
                </div>
              </button>
            );
          })}
        </div>

        {/* Botón guardar */}
        {!alreadySaved ? (
          <button
            onClick={handleSave}
            disabled={saving || !hasAnythingSelected || isPending}
            className="w-full btn-primary mt-4 text-base disabled:opacity-40"
          >
            {saving ? "Guardando..." : hasAnythingSelected ? `✨ Guardar día (+${selected.length * 10 + (challengeDone ? 20 : 0)} XP)` : "Marca al menos una actividad"}
          </button>
        ) : (
          <div className="mt-4 bg-glow-gold/10 border-2 border-glow-gold/30 rounded-xl p-3 text-center">
            <p className="font-poppins font-semibold text-glow-text text-sm">✅ ¡Día registrado!</p>
            <p className="font-inter text-xs text-glow-text-muted mt-0.5">Vuelve mañana para seguir tu racha 🌟</p>
          </div>
        )}
      </div>

      {/* Récord */}
      {record > 0 && (
        <div className="text-center pb-2">
          <p className="font-inter text-xs text-glow-text-muted">
            🏆 Tu mejor racha: <span className="font-semibold text-glow-text">{record} {record === 1 ? "día" : "días"}</span>
          </p>
        </div>
      )}

      {/* Compartir racha */}
      {streak > 0 && (
        <ShareStreakCard
          streak={streak}
          xp={xp}
          level={level}
          userName={userName}
        />
      )}

    </div>
  );
}
