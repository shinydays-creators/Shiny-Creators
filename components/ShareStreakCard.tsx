"use client";

import { useRef, useState } from "react";
import { levelInfo } from "@/lib/levels";

interface Props {
  streak: number;
  xp: number;
  level: number;
  userName: string;
}

export default function ShareStreakCard({ streak, xp, level, userName }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [shown, setShown] = useState(false);
  const info = levelInfo(level);
  const first = userName.split(" ")[0];

  async function handleDownload() {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: null,
        logging: false,
      });
      const link = document.createElement("a");
      link.download = `shiny-racha-${streak}-dias.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } finally {
      setDownloading(false);
    }
  }

  if (!shown) {
    return (
      <button
        onClick={() => setShown(true)}
        className="w-full flex items-center justify-center gap-2 border-2 border-glow-gold/40 text-glow-text font-poppins text-sm font-bold py-3 rounded-2xl hover:bg-glow-gold/5 transition-all"
      >
        📲 Compartir mi racha
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Tarjeta visual */}
      <div
        ref={cardRef}
        className="relative overflow-hidden rounded-3xl mx-auto"
        style={{
          width: 320,
          height: 480,
          background: "linear-gradient(135deg, #FFF5F8 0%, #FFF8E8 50%, #FFF0F5 100%)",
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        {/* Círculos decorativos */}
        <div style={{
          position: "absolute", top: -40, right: -40,
          width: 160, height: 160,
          borderRadius: "50%",
          background: "rgba(255, 200, 50, 0.15)",
        }} />
        <div style={{
          position: "absolute", bottom: -40, left: -40,
          width: 160, height: 160,
          borderRadius: "50%",
          background: "rgba(255, 150, 180, 0.2)",
        }} />

        <div style={{ position: "relative", zIndex: 1, padding: "28px 28px 20px", height: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>

          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 16 }}>
            <span style={{ fontSize: 16, color: "#C8860A", fontWeight: 700, letterSpacing: 1 }}>✦</span>
            <span style={{ fontSize: 15, fontWeight: 800, color: "#2D1B4E", letterSpacing: 0.5 }}>
              Sh<span style={{ color: "#C8860A" }}>i</span>ny Creators
            </span>
          </div>

          {/* Mascota */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/mascot/happy.png"
            alt="mascota"
            crossOrigin="anonymous"
            style={{ width: 130, height: 130, objectFit: "contain", marginBottom: 8 }}
          />

          {/* Racha principal */}
          <div style={{ textAlign: "center", marginBottom: 10 }}>
            <div style={{ fontSize: 52, fontWeight: 900, color: "#2D1B4E", lineHeight: 1.1 }}>
              🔥 {streak}
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#C8860A", letterSpacing: 1, marginTop: 2 }}>
              {streak === 1 ? "DÍA DE RACHA" : "DÍAS DE RACHA"}
            </div>
          </div>

          {/* Subtítulo */}
          <div style={{
            background: "rgba(200, 134, 10, 0.12)",
            border: "1.5px solid rgba(200, 134, 10, 0.3)",
            borderRadius: 16,
            padding: "8px 20px",
            textAlign: "center",
            marginBottom: 14,
          }}>
            <p style={{ fontSize: 12, color: "#2D1B4E", fontWeight: 600, margin: 0 }}>
              {info.emoji} Nivel {level} · {info.name}
            </p>
            <p style={{ fontSize: 11, color: "#8B7FA8", margin: "2px 0 0" }}>
              {xp} XP acumulados
            </p>
          </div>

          {/* Mensaje */}
          <p style={{ fontSize: 12, color: "#6B5B8A", textAlign: "center", lineHeight: 1.5, marginBottom: 14, padding: "0 8px" }}>
            {streak >= 30
              ? `${first} lleva ${streak} días siendo constante. ✨`
              : streak >= 7
              ? `${first} está construyendo su mejor versión, un día a la vez. ✨`
              : `${first} está empezando su camino como creadora. ✨`}
          </p>

          {/* Footer */}
          <div style={{ marginTop: "auto", textAlign: "center" }}>
            <p style={{ fontSize: 10, color: "#B0A0C8", fontWeight: 600, letterSpacing: 1 }}>
              shinycreators.app
            </p>
          </div>
        </div>
      </div>

      {/* Botones */}
      <button
        onClick={handleDownload}
        disabled={downloading}
        className="w-full bg-gradient-to-r from-glow-gold to-glow-pink text-white font-poppins text-sm font-bold py-3 rounded-2xl disabled:opacity-60"
      >
        {downloading ? "Generando imagen..." : "⬇️ Descargar imagen"}
      </button>
      <button
        onClick={() => setShown(false)}
        className="w-full font-inter text-xs text-glow-text-muted py-1"
      >
        Cerrar
      </button>
    </div>
  );
}
