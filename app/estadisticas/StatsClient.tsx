"use client";

import ShinyTitle from "@/components/ShinyTitle";
import { calculateStreak, getLastNDays } from "@/lib/streak";
import { levelInfo } from "@/lib/levels";

const ACTIVITY_INFO: Record<string, { emoji: string; label: string; color: string }> = {
  publish:   { emoji: "📤", label: "Publicar",     color: "bg-glow-gold" },
  record:    { emoji: "🎬", label: "Grabar",        color: "bg-glow-pink" },
  edit:      { emoji: "✂️", label: "Editar",        color: "bg-purple-300" },
  learn:     { emoji: "📚", label: "Aprender",      color: "bg-blue-300" },
  collab:    { emoji: "🤝", label: "Colaborar",     color: "bg-green-300" },
  plan:      { emoji: "📅", label: "Planificar",    color: "bg-orange-300" },
  ideas:     { emoji: "💡", label: "Ideas",         color: "bg-yellow-300" },
  community: { emoji: "💬", label: "Comunidad",     color: "bg-pink-300" },
  challenge: { emoji: "⭐", label: "Reto diario",   color: "bg-amber-400" },
};

interface Log {
  log_date: string;
  activities: string[];
  challenge_completed: boolean;
}

interface Props {
  logs: Log[];
  xp: number;
  level: number;
  streakRecord: number;
  userName: string;
}

export default function StatsClient({ logs, xp, level, streakRecord, userName }: Props) {
  const logDates = logs.map(l => l.log_date);
  const streak = calculateStreak(logDates);
  const info = levelInfo(level);

  // Días activos totales
  const totalDays = logs.length;

  // Retos completados
  const challengesDone = logs.filter(l => l.challenge_completed).length;

  // Conteo por actividad
  const activityCount: Record<string, number> = {};
  for (const log of logs) {
    for (const act of (log.activities ?? [])) {
      activityCount[act] = (activityCount[act] ?? 0) + 1;
    }
  }
  const maxCount = Math.max(...Object.values(activityCount), 1);

  // Actividad de los últimos 12 semanas (mapa de calor simple)
  const last84 = getLastNDays(84).reverse();
  const logSet = new Set(logDates);

  // Actividad por mes (últimos 6 meses)
  const monthlyData: Record<string, number> = {};
  for (const log of logs) {
    const month = log.log_date.slice(0, 7);
    monthlyData[month] = (monthlyData[month] ?? 0) + 1;
  }
  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    return d.toISOString().slice(0, 7);
  });
  const maxMonthly = Math.max(...last6Months.map(m => monthlyData[m] ?? 0), 1);

  const monthNames: Record<string, string> = {
    "01": "Ene", "02": "Feb", "03": "Mar", "04": "Abr",
    "05": "May", "06": "Jun", "07": "Jul", "08": "Ago",
    "09": "Sep", "10": "Oct", "11": "Nov", "12": "Dic",
  };

  return (
    <div className="relative z-10 max-w-sm mx-auto px-6 pt-12 pb-6">

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <a href="/perfil" className="text-glow-text-muted text-lg">←</a>
        <ShinyTitle className="text-2xl" />
      </div>

      <h1 className="font-poppins text-xl font-bold text-glow-text mb-1">Tus estadísticas 📊</h1>
      <p className="font-inter text-sm text-glow-text-muted mb-5">Todo el trabajo que has hecho, visible.</p>

      {/* Números principales */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-white rounded-2xl shadow-soft p-4 text-center">
          <p className="font-poppins text-4xl font-bold text-glow-text">{totalDays}</p>
          <p className="font-inter text-xs text-glow-text-muted mt-1">📅 Días activos</p>
        </div>
        <div className="bg-white rounded-2xl shadow-soft p-4 text-center">
          <p className="font-poppins text-4xl font-bold text-glow-text">{streak}</p>
          <p className="font-inter text-xs text-glow-text-muted mt-1">🔥 Racha actual</p>
        </div>
        <div className="bg-white rounded-2xl shadow-soft p-4 text-center">
          <p className="font-poppins text-4xl font-bold text-glow-text">{streakRecord}</p>
          <p className="font-inter text-xs text-glow-text-muted mt-1">🏆 Mejor racha</p>
        </div>
        <div className="bg-white rounded-2xl shadow-soft p-4 text-center">
          <p className="font-poppins text-4xl font-bold text-glow-text">{challengesDone}</p>
          <p className="font-inter text-xs text-glow-text-muted mt-1">⭐ Retos hechos</p>
        </div>
      </div>

      {/* Nivel y XP */}
      <div className="bg-white rounded-2xl shadow-soft p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">{info.emoji}</span>
            <div>
              <p className="font-poppins text-sm font-bold text-glow-text">Nivel {level} — {info.name}</p>
              <p className="font-inter text-xs text-glow-text-muted">{xp} XP totales</p>
            </div>
          </div>
        </div>
        <div className="h-2.5 bg-glow-cream rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-glow-gold to-glow-pink rounded-full transition-all"
            style={{ width: `${Math.min(((xp - [0,100,300,700,1500][Math.min(level-1,4)]) / ([100,300,700,1500,9999][Math.min(level-1,4)] - [0,100,300,700,1500][Math.min(level-1,4)])) * 100, 100)}%` }}
          />
        </div>
      </div>

      {/* Mapa de actividad — últimas 12 semanas */}
      <div className="bg-white rounded-2xl shadow-soft p-4 mb-4">
        <p className="font-poppins text-xs font-bold text-glow-text-muted uppercase tracking-widest mb-3">
          Últimas 12 semanas
        </p>
        <div className="grid gap-1" style={{ gridTemplateColumns: "repeat(12, 1fr)" }}>
          {Array.from({ length: 12 }, (_, week) => (
            <div key={week} className="flex flex-col gap-1">
              {Array.from({ length: 7 }, (_, day) => {
                const idx = week * 7 + day;
                const date = last84[idx];
                const active = date ? logSet.has(date) : false;
                return (
                  <div
                    key={day}
                    className={`w-full aspect-square rounded-sm ${active ? "bg-glow-gold" : "bg-glow-cream"}`}
                  />
                );
              })}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 mt-2 justify-end">
          <div className="w-3 h-3 rounded-sm bg-glow-cream" />
          <span className="font-inter text-xs text-glow-text-muted">Sin actividad</span>
          <div className="w-3 h-3 rounded-sm bg-glow-gold" />
          <span className="font-inter text-xs text-glow-text-muted">Activa</span>
        </div>
      </div>

      {/* Barras por mes */}
      <div className="bg-white rounded-2xl shadow-soft p-4 mb-4">
        <p className="font-poppins text-xs font-bold text-glow-text-muted uppercase tracking-widest mb-4">
          Días activos por mes
        </p>
        <div className="flex items-end gap-2 h-24">
          {last6Months.map(month => {
            const count = monthlyData[month] ?? 0;
            const pct = Math.round((count / maxMonthly) * 100);
            const monthNum = month.slice(5, 7);
            return (
              <div key={month} className="flex-1 flex flex-col items-center gap-1">
                <span className="font-inter text-xs font-semibold text-glow-text">{count > 0 ? count : ""}</span>
                <div className="w-full bg-glow-cream rounded-t-lg overflow-hidden flex items-end" style={{ height: "64px" }}>
                  <div
                    className="w-full bg-gradient-to-t from-glow-gold to-glow-pink rounded-t-lg transition-all"
                    style={{ height: `${Math.max(pct, count > 0 ? 8 : 0)}%` }}
                  />
                </div>
                <span className="font-inter text-xs text-glow-text-muted">{monthNames[monthNum]}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Actividades más frecuentes */}
      {Object.keys(activityCount).length > 0 && (
        <div className="bg-white rounded-2xl shadow-soft p-4 mb-4">
          <p className="font-poppins text-xs font-bold text-glow-text-muted uppercase tracking-widest mb-4">
            Lo que más haces
          </p>
          <div className="flex flex-col gap-3">
            {Object.entries(activityCount)
              .sort((a, b) => b[1] - a[1])
              .map(([act, count]) => {
                const info = ACTIVITY_INFO[act];
                if (!info) return null;
                const pct = Math.round((count / maxCount) * 100);
                return (
                  <div key={act}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{info.emoji}</span>
                        <span className="font-inter text-sm text-glow-text">{info.label}</span>
                      </div>
                      <span className="font-inter text-xs font-semibold text-glow-text-muted">{count} días</span>
                    </div>
                    <div className="h-2 bg-glow-cream rounded-full overflow-hidden">
                      <div className={`h-full ${info.color} rounded-full`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Mensaje motivador */}
      <div className="bg-glow-gold/10 border-2 border-glow-gold/30 rounded-2xl p-4 text-center">
        <p className="font-poppins text-sm font-bold text-glow-text mb-1">
          {totalDays === 0
            ? "¡Tu historia empieza hoy! 🌱"
            : totalDays < 7
            ? `¡Llevas ${totalDays} días construyendo algo increíble! 💪`
            : totalDays < 30
            ? `${totalDays} días de trabajo real. Eso no lo borra nadie. 🔥`
            : `${totalDays} días siendo constante. Eres una máquina. 🏆`}
        </p>
        <p className="font-inter text-xs text-glow-text-muted">
          Cada día que registras es un día que nadie te puede quitar.
        </p>
      </div>

    </div>
  );
}
