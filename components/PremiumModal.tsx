"use client";

import MascotStar from "@/components/MascotStar";

interface PremiumModalProps {
  onClose: () => void;
}

const FEATURES = [
  { emoji: "📚", text: "Acceso a toda la biblioteca de tutoriales" },
  { emoji: "🎯", text: "Estrategias paso a paso para crecer" },
  { emoji: "💰", text: "Guías de monetización y brand deals" },
  { emoji: "📄", text: "Plantillas listas para usar" },
  { emoji: "🔥", text: "Contenido nuevo cada semana" },
];

export default function PremiumModal({ onClose }: PremiumModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      onClick={onClose}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-glow-text/40 backdrop-blur-sm" />

      {/* Panel */}
      <div
        className="relative z-10 w-full max-w-sm bg-white rounded-t-3xl shadow-soft-lg p-6 pb-10 animate-fade-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Tirador */}
        <div className="w-10 h-1 bg-glow-pink/40 rounded-full mx-auto mb-4" />

        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-glow-text-muted hover:text-glow-text text-xl leading-none"
        >
          ✕
        </button>

        {/* Mascota */}
        <MascotStar mood="excited" size={90} className="mx-auto mb-3" />

        {/* Título */}
        <h2 className="font-poppins text-xl font-bold text-glow-text text-center">
          ¡Desbloquea todo el contenido! ✨
        </h2>
        <p className="font-inter text-sm text-glow-text-muted text-center mt-2 mb-5">
          Con Shiny Creators Premium accedes a todo lo que necesitas para crecer de verdad.
        </p>

        {/* Características */}
        <div className="space-y-3 mb-6">
          {FEATURES.map((f) => (
            <div key={f.text} className="flex items-center gap-3">
              <span className="text-xl flex-shrink-0">{f.emoji}</span>
              <p className="font-inter text-sm text-glow-text">{f.text}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button className="btn-primary w-full text-base">
          Ver planes ✨
        </button>
        <button
          onClick={onClose}
          className="w-full text-center font-inter text-sm text-glow-text-muted mt-3 py-2"
        >
          Ahora no
        </button>
      </div>
    </div>
  );
}
