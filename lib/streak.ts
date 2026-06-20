/**
 * Calcula la racha actual a partir de un array de fechas (YYYY-MM-DD).
 * La racha es el número de días consecutivos que incluyen hoy o ayer.
 */
export function calculateStreak(dates: string[]): number {
  if (dates.length === 0) return 0;

  const today = getLocalDate(0);
  const yesterday = getLocalDate(-1);

  const sorted = [...new Set(dates)].sort((a, b) => b.localeCompare(a));

  // La racha debe empezar desde hoy o ayer como máximo
  if (sorted[0] !== today && sorted[0] !== yesterday) return 0;

  let streak = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1] + "T12:00:00");
    const curr = new Date(sorted[i] + "T12:00:00");
    const diff = Math.round((prev.getTime() - curr.getTime()) / 86400000);
    if (diff === 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

/** Devuelve la fecha local en formato YYYY-MM-DD con offset de días */
export function getLocalDate(offsetDays = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toLocaleDateString("en-CA"); // siempre YYYY-MM-DD
}

/** Devuelve los últimos N días en formato YYYY-MM-DD (más reciente primero) */
export function getLastNDays(n: number): string[] {
  return Array.from({ length: n }, (_, i) => getLocalDate(-i));
}

/** Nombre corto del día de la semana en español */
export function shortDayName(dateStr: string): string {
  const names = ["D", "L", "M", "X", "J", "V", "S"];
  const d = new Date(dateStr + "T12:00:00");
  return names[d.getDay()];
}
