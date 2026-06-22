export function calculateLevel(xp: number): number {
  if (xp < 100) return 1;
  if (xp < 300) return 2;
  if (xp < 700) return 3;
  if (xp < 1500) return 4;
  return 5;
}

export function levelInfo(level: number) {
  const levels = [
    { name: "Principiante", emoji: "🌱", next: 100 },
    { name: "Constante", emoji: "⚡", next: 300 },
    { name: "En crecimiento", emoji: "🌟", next: 700 },
    { name: "Profesional", emoji: "💎", next: 1500 },
    { name: "Shiny Creator Elite", emoji: "✨", next: 9999 },
  ];
  return levels[Math.min(level - 1, 4)];
}
