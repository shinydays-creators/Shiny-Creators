"use client";

import { useState } from "react";
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
  { value: "all",              label: "Todos",          emoji: "✨" },
  { value: "grabar",           label: "Grabar",         emoji: "🎥" },
  { value: "editar",           label: "Editar",         emoji: "✂️" },
  { value: "crecer",           label: "Crecer",         emoji: "📈" },
  { value: "colaboraciones",   label: "Colaboraciones", emoji: "🤝" },
];

function formatBody(text: string) {
  return text.split("\n\n").map((paragraph, i) => {
    // Detecta **negrita**
    const parts = paragraph.split(/\*\*(.*?)\*\*/g);
    return (
      <p key={i} className="font-inter text-sm text-glow-text leading-relaxed mb-3">
        {parts.map((part, j) =>
          j % 2 === 1
            ? <strong key={j} className="font-semibold text-glow-text">{part}</strong>
            : part
        )}
      </p>
    );
  });
}

export default function AprenderClient({ content }: Props) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [showPremium, setShowPremium] = useState(false);

  const filtered = activeCategory === "all"
    ? content
    : content.filter((c) => c.category === activeCategory);

  function handleCardClick(item: ContentItem) {
    if (item.is_premium) {
      setShowPremium(true);
    } else {
      setSelectedItem(item);
    }
  }

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

      {/* Grid de tarjetas */}
      <div className="relative z-10 px-6 grid grid-cols-2 gap-3">
        {filtered.map((item) => (
          <button
            key={item.id}
            onClick={() => handleCardClick(item)}
            className="text-left bg-white rounded-2xl shadow-soft p-4 flex flex-col gap-2 active:scale-95 transition-all duration-200 hover:shadow-soft-lg relative overflow-hidden"
          >
            {/* Badge premium o gratis */}
            <div className={`absolute top-3 right-3 text-xs font-poppins font-semibold px-2 py-0.5 rounded-full ${
              item.is_premium
                ? "bg-glow-gold/20 text-glow-gold-dark"
                : "bg-green-50 text-green-600"
            }`}>
              {item.is_premium ? "🔒 Pro" : "✓ Gratis"}
            </div>

            {/* Emoji */}
            <span className="text-3xl">{item.emoji}</span>

            {/* Título */}
            <p className="font-poppins text-sm font-semibold text-glow-text leading-snug pr-8">
              {item.title}
            </p>

            {/* Preview */}
            <p className="font-inter text-xs text-glow-text-muted leading-relaxed line-clamp-2">
              {item.preview}
            </p>

            {/* Categoría */}
            <span className="font-inter text-xs text-glow-text-muted/60 capitalize mt-auto">
              {item.category}
            </span>

            {/* Overlay candado para premium */}
            {item.is_premium && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center rounded-2xl">
                <div className="text-center">
                  <span className="text-3xl">🔒</span>
                  <p className="font-poppins text-xs font-semibold text-glow-text-muted mt-1">
                    Premium
                  </p>
                </div>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Modal de artículo gratuito */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center"
          onClick={() => setSelectedItem(null)}
        >
          <div className="absolute inset-0 bg-glow-text/40 backdrop-blur-sm" />
          <div
            className="relative z-10 w-full max-w-sm bg-white rounded-t-3xl shadow-soft-lg max-h-[85vh] overflow-y-auto animate-fade-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white px-6 pt-4 pb-3 border-b border-glow-pink/20">
              <div className="w-10 h-1 bg-glow-pink/40 rounded-full mx-auto mb-3" />
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 text-glow-text-muted hover:text-glow-text text-xl"
              >
                ✕
              </button>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">{selectedItem.emoji}</span>
                <span className="font-inter text-xs text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded-full">
                  ✓ Gratis
                </span>
              </div>
              <h2 className="font-poppins text-lg font-bold text-glow-text leading-snug">
                {selectedItem.title}
              </h2>
            </div>

            <div className="px-6 py-5">
              {selectedItem.body
                ? formatBody(selectedItem.body)
                : <p className="font-inter text-sm text-glow-text-muted">{selectedItem.preview}</p>
              }
            </div>
          </div>
        </div>
      )}

      {/* Modal premium */}
      {showPremium && <PremiumModal onClose={() => setShowPremium(false)} />}
    </>
  );
}
