"use client";

import { levelInfo } from "@/lib/levels";

interface Props {
  userName: string;
  streak: number;
  streakRecord: number;
  xp: number;
  level: number;
  totalDays: number;
  savedToday: boolean;
}

const XP_THRESHOLDS = [100, 300, 700, 1500, 9999];
const XP_STARTS =     [0,   100, 300, 700,  1500];

function getMessage(props: Props): { emoji: string; title: string; body: string; color: string } {
  const { userName, streak, streakRecord, xp, level, totalDays, savedToday } = props;
  const first = userName.split(" ")[0];
  const info = levelInfo(level);
  const xpForNext = XP_THRESHOLDS[Math.min(level - 1, 4)];
  const xpLeft = xpForNext - xp;

  // Nueva usuaria
  if (totalDays === 0 && !savedToday) {
    return {
      emoji: "🌱",
      title: `¡Bienvenida, ${first}!`,
      body: "Registra tu primera actividad de hoy y empieza tu racha. Cada día cuenta.",
      color: "from-green-50 to-emerald-50 border-green-200",
    };
  }

  // Ha guardado hoy — racha récord nuevo
  if (savedToday && streak > 0 && streak === streakRecord && streak > 1) {
    return {
      emoji: "🏆",
      title: `¡Nuevo récord personal!`,
      body: `${streak} días seguida. Nunca habías llegado tan lejos. Eres increíble, ${first}.`,
      color: "from-glow-gold/10 to-yellow-50 border-glow-gold/40",
    };
  }

  // Ha guardado hoy — racha larga
  if (savedToday && streak >= 14) {
    return {
      emoji: "🔥",
      title: `${streak} días seguida`,
      body: "Eso no es suerte, eso es disciplina. Sigue así.",
      color: "from-orange-50 to-red-50 border-orange-200",
    };
  }

  // Ha guardado hoy — cerca de subir de nivel
  if (savedToday && level < 5 && xpLeft <= 50) {
    return {
      emoji: info.emoji,
      title: `¡Casi subes de nivel!`,
      body: `Solo te faltan ${xpLeft} XP para ser ${levelInfo(level + 1).name}. Mañana vuelve a registrar.`,
      color: "from-purple-50 to-pink-50 border-purple-200",
    };
  }

  // Ha guardado hoy — mensaje de celebración general
  if (savedToday) {
    const msgs = [
      { title: "¡Día registrado! ✨", body: "Cada pequeño paso suma. Mañana, una vez más." },
      { title: "Lo estás haciendo bien", body: `${streak > 1 ? `${streak} días de racha. ` : ""}Tu constancia es tu superpoder.` },
      { title: "Un día más, ${first}", body: "Las creadoras que triunfan son las que aparecen aunque no tengan ganas." },
    ];
    const pick = msgs[new Date().getDate() % msgs.length];
    return {
      emoji: "✅",
      title: pick.title.replace("${first}", first),
      body: pick.body,
      color: "from-glow-cream to-pink-50 border-glow-pink/30",
    };
  }

  // No ha guardado hoy — lleva varios días sin entrar (streak = 0 y tenía actividad antes)
  if (!savedToday && streak === 0 && totalDays > 0) {
    return {
      emoji: "💪",
      title: `Hola de nuevo, ${first}`,
      body: "Has tenido un parón, y eso pasa. Hoy puedes empezar una racha nueva. ¿Qué hiciste para tu canal?",
      color: "from-blue-50 to-indigo-50 border-blue-200",
    };
  }

  // No ha guardado hoy — tiene racha activa, urge registrar
  if (!savedToday && streak > 0) {
    return {
      emoji: "⚡",
      title: streak >= 7 ? `No pierdas tus ${streak} días` : `¡Registra tu actividad de hoy!`,
      body: streak >= 7
        ? `Llevas ${streak} días seguida. Unos minutos ahora protegen toda tu racha.`
        : "Cuéntanos qué has hecho hoy por tu canal. Cualquier cosa cuenta.",
      color: "from-yellow-50 to-amber-50 border-amber-300",
    };
  }

  // No ha guardado hoy — primera semana
  return {
    emoji: "🌟",
    title: `Hola, ${first}`,
    body: "¿Qué has hecho hoy para acercarte a tus metas? Registra tu actividad.",
    color: "from-glow-cream to-pink-50 border-glow-pink/30",
  };
}

export default function MotivationalBanner(props: Props) {
  const { emoji, title, body, color } = getMessage(props);

  return (
    <div className={`bg-gradient-to-r ${color} border rounded-2xl px-4 py-3 mb-4`}>
      <div className="flex items-start gap-3">
        <span className="text-2xl mt-0.5">{emoji}</span>
        <div>
          <p className="font-poppins text-sm font-bold text-glow-text leading-tight">{title}</p>
          <p className="font-inter text-xs text-glow-text-muted mt-0.5 leading-snug">{body}</p>
        </div>
      </div>
    </div>
  );
}
