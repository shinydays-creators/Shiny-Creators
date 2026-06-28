"use client";

import { levelInfo } from "@/lib/levels";

interface Profile {
  id: string;
  full_name: string | null;
  xp: number;
  level: number;
  streak_record: number;
  avatar_color: string | null;
}

interface Props {
  profiles: Profile[];
  currentUserId: string;
}

function firstName(name: string | null): string {
  if (!name) return "Creadora";
  return name.trim().split(" ")[0];
}

function getInitials(name: string | null): string {
  if (!name) return "?";
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const DEFAULT_COLOR = "#F5C400";

const PODIUM_MEDALS = ["🥇", "🥈", "🥉"];

export default function RankingClient({ profiles, currentUserId }: Props) {
  const top3 = profiles.slice(0, 3);
  const rest = profiles.slice(3);
  const myPosition = profiles.findIndex(p => p.id === currentUserId);

  return (
    <div className="relative z-10 max-w-sm mx-auto px-6 pb-6">

      {profiles.length === 0 && (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">✨</p>
          <p className="font-poppins text-base font-bold text-glow-text">¡Eres de las primeras!</p>
          <p className="font-inter text-sm text-glow-text-muted mt-2">
            La comunidad está arrancando. Guarda tu primer día y aparece aquí antes que nadie.
          </p>
        </div>
      )}

      {profiles.length > 0 && profiles.length < 20 && (
        <div className="bg-glow-gold/10 border border-glow-gold/30 rounded-2xl px-4 py-3 mb-5 text-center">
          <p className="font-inter text-xs text-glow-text-muted">
            🌱 La comunidad está arrancando — eres de las primeras creadoras. ¡El ranking crecerá contigo!
          </p>
        </div>
      )}

      {/* Tu posición */}
      {myPosition >= 0 && (
        <div className="bg-glow-gold/10 border-2 border-glow-gold/30 rounded-2xl px-4 py-3 mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-poppins text-sm font-bold text-glow-text-muted">#{myPosition + 1}</span>
            <p className="font-poppins text-sm font-bold text-glow-text">Tu posición</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">{levelInfo(profiles[myPosition].level).emoji}</span>
            <span className="font-inter text-xs text-glow-text-muted">{profiles[myPosition].xp} XP</span>
          </div>
        </div>
      )}

      {/* Podio top 3 — solo si hay al menos 3 creadoras */}
      {top3.length >= 3 && (
        <div className="flex items-end justify-center gap-3 mb-6">
          {/* 2º */}
          {top3[1] && (
            <div className="flex flex-col items-center gap-1 flex-1">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center shadow-sm"
                style={{ backgroundColor: top3[1].avatar_color ?? DEFAULT_COLOR }}
              >
                <span className="font-poppins text-lg font-black text-white">{getInitials(top3[1].full_name)}</span>
              </div>
              <p className="font-poppins text-xs font-bold text-glow-text text-center leading-tight">{firstName(top3[1].full_name)}</p>
              <p className="font-inter text-[10px] text-glow-text-muted">{top3[1].xp} XP</p>
              <div className="w-full bg-glow-pink/40 rounded-t-xl flex items-center justify-center py-3">
                <span className="text-2xl">🥈</span>
              </div>
            </div>
          )}

          {/* 1º */}
          {top3[0] && (
            <div className="flex flex-col items-center gap-1 flex-1">
              <div className="relative">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center shadow-md"
                  style={{ backgroundColor: top3[0].avatar_color ?? DEFAULT_COLOR }}
                >
                  <span className="font-poppins text-xl font-black text-white">{getInitials(top3[0].full_name)}</span>
                </div>
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-lg">👑</span>
              </div>
              <p className="font-poppins text-xs font-bold text-glow-text text-center leading-tight">{firstName(top3[0].full_name)}</p>
              <p className="font-inter text-[10px] text-glow-text-muted">{top3[0].xp} XP</p>
              <div className="w-full bg-glow-gold/40 rounded-t-xl flex items-center justify-center py-5">
                <span className="text-2xl">🥇</span>
              </div>
            </div>
          )}

          {/* 3º */}
          {top3[2] && (
            <div className="flex flex-col items-center gap-1 flex-1">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center shadow-sm"
                style={{ backgroundColor: top3[2].avatar_color ?? DEFAULT_COLOR }}
              >
                <span className="font-poppins text-lg font-black text-white">{getInitials(top3[2].full_name)}</span>
              </div>
              <p className="font-poppins text-xs font-bold text-glow-text text-center leading-tight">{firstName(top3[2].full_name)}</p>
              <p className="font-inter text-[10px] text-glow-text-muted">{top3[2].xp} XP</p>
              <div className="w-full bg-glow-cream rounded-t-xl flex items-center justify-center py-2">
                <span className="text-2xl">🥉</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Lista: desde el 4 si hay podio, desde el 1 si hay menos de 3 creadoras */}
      {profiles.length > 0 && (top3.length < 3 ? profiles : rest).length > 0 && (
        <div className="flex flex-col gap-2">
          {(top3.length < 3 ? profiles : rest).map((profile, i) => {
            const pos = top3.length < 3 ? i + 1 : i + 4;
            const isMe = profile.id === currentUserId;
            const info = levelInfo(profile.level);
            return (
              <div
                key={profile.id}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl ${
                  isMe ? "bg-glow-gold/10 border-2 border-glow-gold/30" : "bg-white shadow-soft"
                }`}
              >
                <span className="font-poppins text-sm font-bold text-glow-text-muted w-6 text-center">
                  #{pos}
                </span>
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: profile.avatar_color ?? DEFAULT_COLOR }}
                >
                  <span className="font-poppins text-sm font-bold text-white">{getInitials(profile.full_name)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-poppins text-sm font-bold text-glow-text truncate">
                    {firstName(profile.full_name)}{isMe && " (tú)"}
                  </p>
                  <p className="font-inter text-[10px] text-glow-text-muted">
                    {info.emoji} Nivel {profile.level} · 🏆 {profile.streak_record} {profile.streak_record === 1 ? "día" : "días"} récord
                  </p>
                </div>
                <span className="font-poppins text-sm font-bold text-glow-gold-dark flex-shrink-0">
                  {profile.xp} XP
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Mensaje motivador al final */}
      {profiles.length > 0 && (
        <p className="font-inter text-xs text-glow-text-muted text-center mt-6">
          ✨ Cada día que guardas subes posiciones
        </p>
      )}

    </div>
  );
}
