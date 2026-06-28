"use client";

import { useState, useTransition, useEffect } from "react";
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

// Retos base (para todas)
const CHALLENGES_BASE = [
  "Responde a 5 comentarios de tu comunidad",
  "Escribe 10 ideas de contenido para esta semana",
  "Analiza un creador de tu nicho y apunta qué hace bien",
  "Graba un clip de 15 segundos aunque no lo publiques",
  "Investiga una tendencia de tu plataforma hoy",
  "Escribe el guión o estructura de tu próximo contenido",
  "Deja comentarios valiosos en 3 publicaciones de tu nicho",
  "Organiza tu carpeta de ideas y borra lo obsoleto",
  "Graba un detrás de cámaras de tu proceso creativo",
  "Crea una encuesta para conocer mejor a tu audiencia",
  "Dedica 20 minutos a mejorar una publicación antigua",
  "Busca inspiración en un nicho diferente al tuyo",
];

// Retos para quien quiere monetizar / colaboraciones
const CHALLENGES_MONEY = [
  "Busca 3 marcas con las que te gustaría colaborar y anota su email de contacto",
  "Prepara o mejora tu kit de medios (media kit) con tus datos actualizados",
  "Investiga cuánto cobra un creador similar a ti por colaboraciones",
  "Escribe un email de pitch a una marca como práctica, aunque no lo envíes",
  "Revisa y mejora tu bio para que quede claro que estás abierta a colaboraciones",
  "Calcula tu tarifa mínima para el próximo mes con la calculadora de la app",
  "Busca hashtags o comunidades donde marcas de tu nicho buscan creadores",
];

// Retos para quien quiere crecer en seguidores
const CHALLENGES_GROW = [
  "Publica o programa un contenido optimizado para el algoritmo de tu plataforma",
  "Estudia las estadísticas de tu último contenido y apunta qué cambiarías",
  "Interactúa con 10 cuentas nuevas de tu nicho (comenta, no solo likes)",
  "Crea un contenido que responda a una pregunta frecuente de tu audiencia",
  "Escribe 5 títulos o hooks para tu próximo vídeo y quédate con el mejor",
  "Analiza qué contenido tuyo ha tenido más alcance y por qué",
  "Busca una colaboración con otra creadora de tamaño similar",
];

// Retos para plataforma YouTube
const CHALLENGES_YOUTUBE = [
  "Mejora la miniatura de uno de tus vídeos publicados",
  "Revisa las primeras palabras de la descripción de tus últimos 3 vídeos",
  "Añade tarjetas o pantallas finales a un vídeo que no las tenga",
  "Revisa qué palabras clave están funcionando mejor en tu canal esta semana",
  "Responde a todos los comentarios sin respuesta de tu último vídeo",
];

// Retos para TikTok / Reels
const CHALLENGES_SHORTFORM = [
  "Crea un vídeo usando un audio tendencia de esta semana",
  "Graba una versión alternativa de tu contenido más visto",
  "Estudia los primeros 3 segundos de tus 5 vídeos con más views",
  "Sube un vídeo en el horario en que más activa está tu audiencia",
  "Prueba un formato nuevo: dueto, stitch, POV, o transición creativa",
];

// Retos para nicho lifestyle / bienestar
const CHALLENGES_LIFESTYLE = [
  "Comparte un proceso real de tu día sin filtros ni edición excesiva",
  "Graba un 'vlog de 60 segundos' de algo que hiciste hoy",
  "Crea contenido sobre un hábito tuyo que tu audiencia no conoce",
  "Responde a una pregunta de tu comunidad con un vídeo personal",
];

// Retos para nicho educación / formación
const CHALLENGES_EDUCATION = [
  "Explica un concepto de tu nicho en menos de 60 segundos",
  "Transforma una pregunta frecuente de tu audiencia en un post o vídeo",
  "Busca 3 datos o estadísticas recientes de tu área que puedas compartir",
  "Crea un contenido 'mitos vs realidad' sobre tu tema",
];

function getDailyChallenge(profile?: { niche?: string; platform?: string; contentReason?: string; goal3m?: string }): string {
  const today = getLocalDate();
  const dayOfYear = Math.floor(
    (new Date(today).getTime() - new Date(today.slice(0, 4) + "-01-01").getTime()) / 86400000
  );

  // Construir pool personalizado
  let pool = [...CHALLENGES_BASE];

  if (profile?.contentReason?.toLowerCase().includes("diner") ||
      profile?.contentReason?.toLowerCase().includes("monetiz") ||
      profile?.contentReason?.toLowerCase().includes("colabor") ||
      profile?.contentReason?.toLowerCase().includes("marca")) {
    pool = [...pool, ...CHALLENGES_MONEY];
  }

  if (profile?.goal3m?.toLowerCase().includes("seguidor") ||
      profile?.goal3m?.toLowerCase().includes("crecer") ||
      profile?.goal3m?.toLowerCase().includes("viral") ||
      profile?.goal3m?.toLowerCase().includes("alcance")) {
    pool = [...pool, ...CHALLENGES_GROW];
  }

  const plat = profile?.platform?.toLowerCase() ?? "";
  if (plat.includes("youtube")) pool = [...pool, ...CHALLENGES_YOUTUBE];
  if (plat.includes("tiktok") || plat.includes("instagram") || plat.includes("reel")) {
    pool = [...pool, ...CHALLENGES_SHORTFORM];
  }

  const niche = profile?.niche?.toLowerCase() ?? "";
  if (niche.includes("lifestyle") || niche.includes("bienestar") || niche.includes("vida")) {
    pool = [...pool, ...CHALLENGES_LIFESTYLE];
  }
  if (niche.includes("educaci") || niche.includes("formaci") || niche.includes("aprend")) {
    pool = [...pool, ...CHALLENGES_EDUCATION];
  }

  return pool[dayOfYear % pool.length];
}

interface LogEntry {
  log_date: string;
  activities: string[];
  challenge_completed: boolean;
}

interface Props {
  allLogs: LogEntry[];
  streakRecord: number;
  userName: string;
  platform: string;
  xp: number;
  level: number;
  niche?: string;
  contentReason?: string;
  goal3m?: string;
}

export default function DailyTracker({
  allLogs,
  streakRecord,
  userName,
  platform,
  xp,
  level,
  niche,
  contentReason,
  goal3m,
}: Props) {
  const router = useRouter();

  // "hoy" se calcula siempre en el cliente con su hora local
  const today = getLocalDate();
  const todayLog = allLogs.find(l => l.log_date === today);
  const todayActivities = todayLog?.activities ?? [];
  const todayChallengeCompleted = todayLog?.challenge_completed ?? false;

  const [logs, setLogs] = useState<string[]>(allLogs.map(l => l.log_date));
  const [selected, setSelected] = useState<string[]>(todayActivities);
  const [savedActivities, setSavedActivities] = useState<string[]>(todayActivities);
  const [challengeDone, setChallengeDone] = useState(todayChallengeCompleted);
  const [savedChallenge, setSavedChallenge] = useState(todayChallengeCompleted);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [xpToast, setXpToast] = useState<number | null>(null);
  const [firstDayCelebration, setFirstDayCelebration] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Sincroniza estado cuando llegan nuevos datos del servidor tras router.refresh()
  useEffect(() => {
    const freshLog = allLogs.find(l => l.log_date === today);
    const freshActivities = freshLog?.activities ?? [];
    const freshChallenge = freshLog?.challenge_completed ?? false;
    setLogs(allLogs.map(l => l.log_date));
    setSavedActivities(freshActivities);
    setSelected(prev => [...new Set([...freshActivities, ...prev.filter(a => freshActivities.includes(a))])]);
    setSavedChallenge(freshChallenge);
    if (freshChallenge) setChallengeDone(true);
  }, [allLogs]); // eslint-disable-line react-hooks/exhaustive-deps

  const savedToday = logs.includes(today);
  const streak = calculateStreak(logs);
  const record = Math.max(streak, streakRecord);
  const last7 = getLastNDays(7).reverse();
  const challenge = getDailyChallenge({ niche, platform, contentReason, goal3m });
  const info = levelInfo(level);
  const nextLevelXp = [100, 300, 700, 1500, 9999][Math.min(level - 1, 4)];
  const prevLevelXp = [0, 100, 300, 700, 1500][Math.min(level - 1, 4)];
  const xpProgress = Math.min(((xp - prevLevelXp) / (nextLevelXp - prevLevelXp)) * 100, 100);

  // Nuevas actividades no guardadas aún hoy
  const newActivities = selected.filter(a => !savedActivities.includes(a));
  const challengeIsNew = challengeDone && !savedChallenge;
  const hasNewToSave = newActivities.length > 0 || challengeIsNew;

  const platformLabel: Record<string, string> = {
    youtube: "YouTube", tiktok: "TikTok", instagram: "Instagram", pinterest: "Pinterest",
  };

  function toggleActivity(id: string) {
    if (savedActivities.includes(id)) return; // ya guardada, no se puede desmarcar
    setSelected(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]);
  }

  async function handleSave() {
    if (saving || !hasNewToSave) return;
    setSaving(true);

    const allActivities = challengeDone ? [...selected, "challenge"] : selected;
    const result = await logDailyActivities(allActivities, challengeDone, challenge);

    if (result?.success) {
      setSaveError(null);
      const isFirstEver = logs.length === 0;
      const newLogs = savedToday ? logs : [...logs, today];
      setLogs(newLogs);
      setSavedActivities(selected);
      setSavedChallenge(challengeDone);

      const newStreak = calculateStreak(newLogs);
      if (newStreak > record) await updateStreakRecord(newStreak);

      if (isFirstEver) {
        setFirstDayCelebration(true);
        setTimeout(() => setFirstDayCelebration(false), 4000);
      } else if (result.xpGained && result.xpGained > 0) {
        setXpToast(result.xpGained);
        setTimeout(() => setXpToast(null), 3000);
      }

      startTransition(() => router.refresh());
    } else {
      setSaveError(result?.error ?? "Error desconocido");
    }

    setSaving(false);
  }

  const mascotMood = streak >= 7 ? "excited" : streak >= 1 ? "happy" : "neutral";
  

  return (
    <div className="w-full max-w-sm mx-auto flex flex-col gap-5">

      {/* Toast XP */}
      {xpToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-glow-gold text-white font-poppins font-bold text-sm px-5 py-2.5 rounded-full shadow-lg animate-fade-up">
          +{xpToast} XP ✨
        </div>
      )}

      {/* Celebración primer día */}
      {firstDayCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-8">
          <div className="bg-white rounded-3xl shadow-soft-lg p-8 text-center max-w-xs w-full animate-fade-up">
            <MascotStar mood="excited" size={100} animate className="mx-auto mb-4" />
            <h2 className="font-poppins text-xl font-black text-glow-text mb-2">
              ¡Tu primera estrella! 🌟
            </h2>
            <p className="font-inter text-sm text-glow-text-muted leading-relaxed mb-4">
              Acabas de registrar tu primer día. Así es como empieza todo lo grande. ¡A por la racha!
            </p>
            <div className="bg-glow-gold/10 rounded-2xl px-4 py-2">
              <p className="font-poppins text-xs font-bold text-glow-gold-dark">✨ ¡Racha iniciada!</p>
            </div>
          </div>
        </div>
      )}

      {/* Hero — bienvenida si es el primer día, racha si ya tiene días */}
      {logs.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-soft px-5 pt-5 pb-5">
          <div className="flex items-center gap-4 mb-4">
            <MascotStar mood="happy" size={80} animate />
            <div className="flex-1">
              <p className="font-inter text-xs text-glow-text-muted mb-0.5">¡Hola, {userName}! 👋</p>
              <p className="font-poppins text-lg font-black text-glow-text leading-tight">
                Bienvenida a tu primer día ✨
              </p>
              <p className="font-inter text-xs text-glow-text-muted mt-1">
                Marca lo que hayas hecho hoy y empieza tu racha.
              </p>
            </div>
          </div>
          <div className="bg-glow-gold/10 border border-glow-gold/30 rounded-2xl px-4 py-3">
            <p className="font-poppins text-xs font-bold text-glow-gold-dark mb-1">⭐ Tu reto de hoy:</p>
            <p className="font-inter text-sm text-glow-text leading-snug">{challenge}</p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-soft px-5 pt-5 pb-4 flex items-center gap-4">
          <MascotStar mood={mascotMood} size={90} animate />
          <div className="flex-1">
            <p className="font-inter text-xs text-glow-text-muted mb-0.5">
              ¡Hola, {userName}! 👋
            </p>
            <div className="flex items-end gap-2">
              <span className="font-poppins text-6xl font-black text-glow-text leading-none">{streak}</span>
              <div className="pb-1">
                <p className="font-poppins text-sm font-bold text-glow-gold-dark leading-tight">🔥 {streak === 1 ? "día" : "días"}</p>
                <p className="font-inter text-[10px] text-glow-text-muted leading-tight">de racha</p>
              </div>
            </div>
            {record > 0 && streak < record && (
              <p className="font-inter text-[10px] text-glow-text-muted mt-1">🏆 Récord: {record} {record === 1 ? "día" : "días"}</p>
            )}
            {streak > 0 && streak === record && streak > 1 && (
              <p className="font-inter text-[10px] text-glow-gold-dark mt-1 font-semibold">🏆 ¡Tu mejor racha!</p>
            )}
          </div>
        </div>
      )}

      {/* Banner motivador */}
      <MotivationalBanner
        userName={userName}
        streak={streak}
        streakRecord={record}
        xp={xp}
        level={level}
        totalDays={logs.length}
        savedToday={savedToday}
      />

      {/* Nivel + 7 días fusionados */}
      <div className="bg-white rounded-2xl shadow-soft p-4">
        {/* Nivel y XP */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">{info.emoji}</span>
            <div>
              <p className="font-poppins text-xs font-bold text-glow-text">Nivel {level} — {info.name}</p>
              <p className="font-inter text-xs text-glow-text-muted">{xp} XP acumulados</p>
            </div>
          </div>
          {platform && (
            <span className="font-inter text-[10px] text-glow-text-muted bg-glow-cream px-2 py-1 rounded-full">
              {platformLabel[platform] ?? platform}
            </span>
          )}
        </div>
        <div className="h-2 bg-glow-cream rounded-full overflow-hidden mb-1">
          <div
            className="h-full bg-gradient-to-r from-glow-gold to-glow-pink rounded-full transition-all duration-700"
            style={{ width: `${xpProgress}%` }}
          />
        </div>
        {level < 5 && (
          <p className="font-inter text-xs text-glow-text-muted mb-4 text-right">
            {nextLevelXp - xp} XP para el siguiente nivel
          </p>
        )}

        {/* Divisor */}
        <div className="border-t border-glow-cream mb-3" />

        {/* Tira 7 días */}
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

      {/* Reto + Actividades fusionados */}
      <div className="bg-white rounded-2xl shadow-soft p-4">
        {/* Reto de hoy */}
        <div className={`flex items-start gap-3 pb-3 mb-3 border-b-2 transition-colors ${challengeDone ? "border-glow-gold/30" : "border-glow-cream"}`}>
          <span className="text-xl mt-0.5">⭐</span>
          <div className="flex-1">
            <p className="font-poppins text-xs font-bold text-glow-text-muted uppercase tracking-widest mb-1">Reto de hoy</p>
            <p className="font-inter text-sm text-glow-text leading-snug">{challenge}</p>
            {challengeDone && <p className="font-inter text-xs text-glow-gold-dark font-semibold mt-1">+20 XP · ¡Reto completado! 🎉</p>}
          </div>
          <button
            onClick={() => !savedChallenge && setChallengeDone(p => !p)}
            className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
              challengeDone ? "bg-glow-gold border-glow-gold text-white" : "border-glow-gold/40"
            }`}
          >
            {challengeDone && <span className="text-sm font-bold">✓</span>}
          </button>
        </div>

        {/* Actividades */}
        <div className="flex items-center gap-2 mb-1">
          <MascotStar mood={mascotMood} size={32} className="flex-shrink-0" />
          <p className="font-poppins text-sm font-bold text-glow-text">
            {savedToday ? "Lo que hiciste hoy:" : "¿Qué has hecho hoy?"}
          </p>
        </div>
        <p className="font-inter text-xs text-glow-text-muted mb-3 ml-10">
          {savedToday ? "Tu racha está activa 🔥" : "Marca todo lo que hayas hecho."}
        </p>
        <div className="flex flex-col gap-2">
          {ACTIVITIES.map((act) => {
            const isSelected = selected.includes(act.id);
            return (
              <button
                key={act.id}
                onClick={() => toggleActivity(act.id)}
                disabled={savedActivities.includes(act.id)}
                className={`flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all ${
                  isSelected ? "border-glow-gold bg-glow-gold/8" : "border-glow-cream bg-glow-cream/50"
                } ${savedActivities.includes(act.id) ? "opacity-60" : "active:scale-98"}`}
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
        {!savedToday || hasNewToSave ? (
          <button
            onClick={handleSave}
            disabled={saving || !hasNewToSave || isPending}
            className="w-full btn-primary mt-4 text-base disabled:opacity-40"
          >
            {saving ? "Guardando..." : hasNewToSave ? `✨ Guardar día (+${newActivities.length * 10 + (challengeIsNew ? 20 : 0)} XP)` : "Marca al menos una actividad nueva"}
          </button>
        ) : (
          <div className="mt-4 bg-glow-gold/10 border-2 border-glow-gold/30 rounded-xl p-3 text-center">
            <p className="font-poppins font-semibold text-glow-text text-sm">✅ ¡Día registrado!</p>
            <p className="font-inter text-xs text-glow-text-muted mt-0.5">Vuelve mañana para seguir tu racha 🌟</p>
          </div>
        )}

        {saveError && (
          <div className="mt-2 bg-red-50 border border-red-200 rounded-xl p-3 text-center">
            <p className="font-inter text-xs text-red-600">No se pudo guardar. Inténtalo de nuevo.</p>
          </div>
        )}
      </div>

      {/* Récord */}
      {record > 0 && (
        <div className="text-center pb-1">
          <p className="font-inter text-xs text-glow-text-muted">
            🏆 Tu mejor racha: <span className="font-semibold text-glow-text">{record} {record === 1 ? "día" : "días"}</span>
          </p>
        </div>
      )}

      {/* Comunidad — tarjeta destacada */}
      <a
        href="/ranking"
        className="block rounded-3xl overflow-hidden shadow-soft active:scale-95 transition-all duration-200"
        style={{ background: "linear-gradient(135deg, #FBCB6A 0%, #FECFE4 100%)" }}
      >
        <div className="px-5 py-5 flex items-center justify-between">
          <div>
            <p className="font-poppins text-base font-black text-glow-text">🌟 Comunidad</p>
            <p className="font-inter text-xs text-glow-text/70 mt-0.5">Ver el ranking de creadoras</p>
            <p className="font-inter text-[10px] text-glow-text/50 mt-1">¿En qué posición estás tú?</p>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-4xl">🏅</span>
            <span className="font-poppins text-xs font-bold text-glow-text/60">Ver →</span>
          </div>
        </div>
      </a>

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
