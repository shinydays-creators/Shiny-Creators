"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { calculateStreak } from "@/lib/streak";
import ShinyTitle from "@/components/ShinyTitle";
import Avatar from "@/components/Avatar";

// ─── Labels legibles ──────────────────────────────────────────────────────────

const PLATFORM_LABEL: Record<string, string> = {
  youtube: "YouTube 🎥", tiktok: "TikTok 🎵",
  instagram: "Instagram 📸", pinterest: "Pinterest 📌",
};
const FOLLOWERS_LABEL: Record<string, string> = {
  "0-100": "0 – 100", "100-1k": "100 – 1.000",
  "1k-10k": "1K – 10K", "10k+": "10K+",
};
const GOAL_LABEL: Record<string, string> = {
  "1k": "1.000", "10k": "10.000", "100k": "100.000", "1m": "1.000.000",
};
const EDIT_LABEL: Record<string, string> = {
  pro: "Soy pro 🎬", yes: "Me defiendo ✂️",
  "a-bit": "Un poco 📱", no: "Nada aún 🙈",
};
const FREQ_LABEL: Record<string, string> = {
  none: "No publico aún 😅", random: "Sin regularidad ⚡",
  monthly: "1-2 veces al mes", weekly: "1-2 veces a la semana",
  daily: "Casi cada día 🔥",
};

function formatTags(raw: string | null): string[] {
  if (!raw) return [];
  return raw.split(",").filter(Boolean);
}

// ─── Colores disponibles ──────────────────────────────────────────────────────

const AVATAR_COLORS = [
  "#F5C400", // dorado
  "#F97FAB", // rosa
  "#A78BFA", // violeta
  "#34D399", // verde
  "#60A5FA", // azul
  "#FB923C", // naranja
  "#F87171", // rojo suave
  "#2D1B4E", // morado oscuro
];

// ─── Fila de info ─────────────────────────────────────────────────────────────

function InfoRow({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="flex items-start justify-between gap-4 py-2.5 border-b border-glow-pink/10 last:border-0">
      <span className="font-inter text-xs text-glow-text-muted flex-shrink-0">{label}</span>
      <span className="font-inter text-sm text-glow-text text-right">{value}</span>
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  profile: Record<string, any>;
  email: string;
  logDates: string[];
}

export default function PerfilClient({ profile, email, logDates }: Props) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [fullName, setFullName] = useState(profile.full_name ?? "");
  const [saved, setSaved] = useState(false);
  const [avatarColor, setAvatarColor] = useState(profile.avatar_color ?? "#F5C400");
  const [pickingColor, setPickingColor] = useState(false);

  const displayName = fullName || email.split("@")[0];
  const streak = calculateStreak(logDates);
  const record = profile.streak_record ?? 0;

  const challenges = formatTags(profile.biggest_challenge);
  const reasons = formatTags(profile.content_reason);
  const niches = formatTags(profile.niche);
  const goals3m = formatTags(profile.goal_3months);

  const CHALLENGE_LABEL: Record<string, string> = {
    ideas: "💡 Ideas", consistency: "📅 Constancia", editing: "🎞️ Edición",
    algorithm: "📊 Algoritmo", time: "⏰ Tiempo", confidence: "🦋 Confianza",
    gear: "📷 Equipo", oncamera: "🎤 Cámara",
  };
  const REASON_LABEL: Record<string, string> = {
    passion: "❤️ Pasión", income: "💰 Dinero", brand: "🌟 Marca personal",
    community: "🤝 Comunidad", fun: "🎉 Diversión",
    inspire: "✨ Inspirar", voice: "🎤 Opinión",
  };
  const NICHE_LABEL: Record<string, string> = {
    lifestyle: "🌸 Lifestyle", beauty: "💄 Belleza", travel: "✈️ Viajes",
    fitness: "💪 Fitness", food: "🍳 Cocina", gaming: "🎮 Gaming",
    education: "📚 Educación",
  };
  const GOAL3M_LABEL: Record<string, string> = {
    consistency: "📅 Publicar con constancia", milestone: "⭐ Primer hito",
    "brand-deal": "🤝 Brand deal", monetize: "💰 Monetizar",
    quality: "🎬 Mejorar calidad", confidence: "🦋 Ganar confianza",
  };

  async function handleSave() {
    setSaving(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("profiles")
        .update({ full_name: fullName, avatar_color: avatarColor })
        .eq("id", user.id);
    }
    setSaving(false);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function handleColorChange(color: string) {
    setAvatarColor(color);
    setPickingColor(false);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("profiles").update({ avatar_color: color }).eq("id", user.id);
    }
  }

  return (
    <div className="relative z-10 max-w-sm mx-auto px-6 pt-12">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <ShinyTitle className="text-2xl" />
        {saved && (
          <span className="font-inter text-xs text-green-600 font-semibold bg-green-50 px-3 py-1 rounded-full">
            ✓ Guardado
          </span>
        )}
      </div>

      {/* Tarjeta de perfil principal */}
      <div className="bg-white rounded-3xl shadow-soft-lg p-5 mb-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar name={displayName} color={avatarColor} size="lg" />
            <button
              onClick={() => setPickingColor(p => !p)}
              className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full shadow border border-glow-pink/20 flex items-center justify-center text-xs"
            >
              🎨
            </button>
            {pickingColor && (
              <div className="absolute top-full left-0 mt-2 bg-white rounded-2xl shadow-lg p-3 z-20 flex flex-wrap gap-2 w-44">
                {AVATAR_COLORS.map(c => (
                  <button
                    key={c}
                    onClick={() => handleColorChange(c)}
                    className="w-8 h-8 rounded-full border-2 transition-transform hover:scale-110"
                    style={{
                      backgroundColor: c,
                      borderColor: c === avatarColor ? "#2D1B4E" : "transparent",
                    }}
                  />
                ))}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            {editing ? (
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Tu nombre"
                className="input-glow text-base py-2"
                autoFocus
              />
            ) : (
              <h2 className="font-poppins text-xl font-bold text-glow-text truncate">
                {displayName}
              </h2>
            )}
            <p className="font-inter text-xs text-glow-text-muted mt-0.5 truncate">{email}</p>
            {profile.platform && (
              <span className="inline-block mt-1.5 font-inter text-xs font-semibold text-glow-gold-dark bg-glow-gold/10 px-2 py-0.5 rounded-full">
                {profile.platform_custom || PLATFORM_LABEL[profile.platform] || profile.platform}
              </span>
            )}
          </div>
        </div>

        {/* Botones editar / guardar */}
        <div className="mt-4 flex gap-2">
          {editing ? (
            <>
              <button onClick={handleSave} disabled={saving}
                className="flex-1 btn-primary py-2.5 text-sm">
                {saving ? "Guardando..." : "Guardar ✓"}
              </button>
              <button onClick={() => { setEditing(false); setFullName(profile.full_name ?? ""); }}
                className="px-4 py-2.5 rounded-2xl border-2 border-glow-pink/30 font-poppins text-sm font-semibold text-glow-text-muted">
                Cancelar
              </button>
            </>
          ) : (
            <button onClick={() => setEditing(true)}
              className="flex-1 py-2.5 rounded-2xl border-2 border-glow-gold/40 font-poppins text-sm font-semibold text-glow-text hover:bg-glow-gold/5 transition-colors">
              ✏️ Editar nombre
            </button>
          )}
        </div>
      </div>

      {/* Stats de racha */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-white rounded-2xl shadow-soft p-4 text-center">
          <p className="font-poppins text-3xl font-bold text-glow-text">{streak}</p>
          <p className="font-inter text-xs text-glow-text-muted mt-1">🔥 Racha actual</p>
        </div>
        <div className="bg-white rounded-2xl shadow-soft p-4 text-center">
          <p className="font-poppins text-3xl font-bold text-glow-text">{Math.max(streak, record)}</p>
          <p className="font-inter text-xs text-glow-text-muted mt-1">🏆 Récord</p>
        </div>
      </div>

      {/* Tu camino */}
      {(profile.current_followers || profile.goal_followers) && (
        <div className="bg-white rounded-2xl shadow-soft p-4 mb-4">
          <p className="font-poppins text-xs font-semibold text-glow-text-muted uppercase tracking-widest mb-3">
            Tu camino ✨
          </p>
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-glow-cream rounded-xl p-2.5 text-center">
              <p className="font-inter text-xs text-glow-text-muted">Ahora</p>
              <p className="font-poppins font-bold text-glow-text text-lg">
                {FOLLOWERS_LABEL[profile.current_followers] ?? profile.current_followers}
              </p>
            </div>
            <span className="text-xl">→</span>
            <div className="flex-1 bg-glow-gold/10 rounded-xl p-2.5 text-center border border-glow-gold/20">
              <p className="font-inter text-xs text-glow-text-muted">Meta</p>
              <p className="font-poppins font-bold text-glow-gold-dark text-lg">
                {GOAL_LABEL[profile.goal_followers] ?? profile.goal_followers}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Info del onboarding */}
      <div className="bg-white rounded-2xl shadow-soft p-4 mb-4">
        <p className="font-poppins text-xs font-semibold text-glow-text-muted uppercase tracking-widest mb-2">
          Tu perfil creator
        </p>
        <InfoRow label="Edición" value={EDIT_LABEL[profile.can_edit] ?? profile.can_edit} />
        <InfoRow label="Frecuencia" value={FREQ_LABEL[profile.posting_frequency] ?? profile.posting_frequency} />
        <InfoRow label="Tiempo al día" value={({
          "under1h": "Menos de 1 hora",
          "1-2h": "1-2 horas",
          "3-4h": "3-4 horas",
          fulltime: "Tiempo completo ✨",
        } as Record<string, string>)[profile.time_available] ?? profile.time_available} />

        {niches.length > 0 && (
          <div className="py-2.5 border-b border-glow-pink/10">
            <p className="font-inter text-xs text-glow-text-muted mb-1.5">Nicho</p>
            <div className="flex flex-wrap gap-1.5">
              {niches.map((n) => (
                <span key={n} className="font-inter text-xs bg-glow-cream text-glow-text px-2.5 py-1 rounded-full">
                  {NICHE_LABEL[n] ?? n}
                </span>
              ))}
              {profile.niche_custom && (
                <span className="font-inter text-xs bg-glow-cream text-glow-text px-2.5 py-1 rounded-full">
                  ✏️ {profile.niche_custom}
                </span>
              )}
            </div>
          </div>
        )}

        {challenges.length > 0 && (
          <div className="py-2.5 border-b border-glow-pink/10">
            <p className="font-inter text-xs text-glow-text-muted mb-1.5">Retos</p>
            <div className="flex flex-wrap gap-1.5">
              {challenges.map((c) => (
                <span key={c} className="font-inter text-xs bg-glow-pink/15 text-glow-text px-2.5 py-1 rounded-full">
                  {CHALLENGE_LABEL[c] ?? c}
                </span>
              ))}
            </div>
          </div>
        )}

        {reasons.length > 0 && (
          <div className="py-2.5 border-b border-glow-pink/10">
            <p className="font-inter text-xs text-glow-text-muted mb-1.5">Por qué creas</p>
            <div className="flex flex-wrap gap-1.5">
              {reasons.map((r) => (
                <span key={r} className="font-inter text-xs bg-glow-gold/10 text-glow-text px-2.5 py-1 rounded-full">
                  {REASON_LABEL[r] ?? r}
                </span>
              ))}
            </div>
          </div>
        )}

        {goals3m.length > 0 && (
          <div className="py-2.5">
            <p className="font-inter text-xs text-glow-text-muted mb-1.5">Metas en 3 meses</p>
            <div className="flex flex-wrap gap-1.5">
              {goals3m.map((g) => (
                <span key={g} className="font-inter text-xs bg-glow-cream text-glow-text px-2.5 py-1 rounded-full">
                  {GOAL3M_LABEL[g] ?? g}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Actualizar perfil */}
      <div className="text-center mb-3">
        <a
          href="/onboarding"
          className="inline-block w-full py-3 rounded-2xl border-2 border-glow-pink/30 font-poppins text-sm font-semibold text-glow-text hover:bg-glow-pink/5 transition-colors text-center"
        >
          🔄 Actualizar mi perfil creator
        </a>
      </div>

      {/* Invitaciones */}
      <a href="/invitaciones" className="block bg-white rounded-2xl shadow-soft p-4 mb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🔗</span>
          <div>
            <p className="font-poppins text-sm font-bold text-glow-text">Invitar amigas</p>
            <p className="font-inter text-xs text-glow-text-muted">Comparte tu código y gana XP</p>
          </div>
        </div>
        <span className="text-glow-text-muted text-lg">→</span>
      </a>

      {/* Cápsula del tiempo */}
      <a href="/capsula" className="block bg-white rounded-2xl shadow-soft p-4 mb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🕰️</span>
          <div>
            <p className="font-poppins text-sm font-bold text-glow-text">Cápsula del tiempo</p>
            <p className="font-inter text-xs text-glow-text-muted">Objetivos mensuales y reflexiones</p>
          </div>
        </div>
        <span className="text-glow-text-muted text-lg">→</span>
      </a>

      {/* Estadísticas */}
      <a href="/estadisticas" className="block bg-white rounded-2xl shadow-soft p-4 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">📊</span>
          <div>
            <p className="font-poppins text-sm font-bold text-glow-text">Mis estadísticas</p>
            <p className="font-inter text-xs text-glow-text-muted">Actividad, rachas y progreso</p>
          </div>
        </div>
        <span className="text-glow-text-muted text-lg">→</span>
      </a>

      {/* Botón cerrar sesión */}
      <div className="text-center pb-4">
        <a href="/auth/login"
          onClick={async (e) => {
            e.preventDefault();
            const supabase = createClient();
            await supabase.auth.signOut();
            window.location.href = "/";
          }}
          className="font-inter text-sm text-glow-text-muted hover:text-glow-text transition-colors"
        >
          Cerrar sesión
        </a>
      </div>

    </div>
  );
}
