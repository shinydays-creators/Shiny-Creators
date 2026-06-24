"use client";

import { useState } from "react";
import Link from "next/link";
import PremiumModal from "@/components/PremiumModal";

interface ContentItem {
  id: string;
  title: string;
  category: string;
  emoji: string;
  preview: string;
  body: string | null;
  is_premium: boolean;
  order_index: number;
}

interface Props {
  content: ContentItem[];
}

const CATEGORIES = [
  { value: "all",            label: "Todos",          emoji: "✨" },
  { value: "grabar",         label: "Grabar",         emoji: "🎥" },
  { value: "editar",         label: "Editar",         emoji: "✂️" },
  { value: "crecer",         label: "Crecer",         emoji: "📈" },
  { value: "colaboraciones", label: "Colaboraciones", emoji: "🤝" },
];

export default function AprenderClient({ content }: Props) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [showPremium, setShowPremium] = useState(false);

  const filtered = activeCategory === "all"
    ? content
    : content.filter((c) => c.category === activeCategory);

  return (
    <>
      {/* Tabs de categorías */}
      <div className="relative z-10 flex gap-2 overflow-x-auto px-6 py-4 scrollbar-hide">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setActiveCategory(cat.value)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full font-poppins text-xs font-semibold transition-all duration-200 ${
              activeCategory === cat.value
                ? "bg-glow-gold text-glow-text shadow-glow"
                : "bg-white/70 text-glow-text-muted hover:bg-white"
            }`}
          >
            <span>{cat.emoji}</span>
            {cat.label}
          </button>
        ))}
      </div>

      {/* Lista de tarjetas — 1 columna */}
      <div className="relative z-10 px-6 flex flex-col gap-3">
        {filtered.map((item) =>
          item.is_premium ? (
            <button
              key={item.id}
              onClick={() => setShowPremium(true)}
              className="text-left bg-white rounded-2xl shadow-soft p-4 flex items-center gap-4 relative overflow-hidden opacity-75"
            >
              <span className="text-3xl flex-shrink-0">{item.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="font-poppins text-sm font-bold text-glow-text leading-snug truncate">
                  {item.title}
                </p>
                <p className="font-inter text-xs text-glow-text-muted mt-0.5 line-clamp-2 leading-relaxed">
                  {item.preview}
                </p>
              </div>
              <span className="flex-shrink-0 font-poppins text-xs font-semibold bg-glow-gold/20 text-glow-gold-dark px-2 py-1 rounded-full">
                🔒 Pro
              </span>
            </button>
          ) : (
            <Link
              key={item.id}
              href={`/aprender/${item.id}`}
              className="bg-white rounded-2xl shadow-soft p-4 flex items-center gap-4 active:scale-95 transition-all duration-200"
            >
              <span className="text-3xl flex-shrink-0">{item.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="font-poppins text-sm font-bold text-glow-text leading-snug">
                  {item.title}
                </p>
                <p className="font-inter text-xs text-glow-text-muted mt-0.5 line-clamp-2 leading-relaxed">
                  {item.preview}
                </p>
              </div>
              <span className="flex-shrink-0 text-glow-text-muted text-lg">→</span>
            </Link>
          )
        )}

        {filtered.length === 0 && (
          <div className="text-center py-10">
            <p className="text-3xl mb-2">📭</p>
            <p className="font-inter text-sm text-glow-text-muted">
              No hay artículos en esta categoría aún.
            </p>
          </div>
        )}
      </div>

      {showPremium && <PremiumModal onClose={() => setShowPremium(false)} />}
    </>
  );
}
