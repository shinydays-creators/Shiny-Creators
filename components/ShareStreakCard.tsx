"use client";

import { useRef, useState, useEffect } from "react";
import { levelInfo } from "@/lib/levels";

interface Props {
  streak: number;
  xp: number;
  level: number;
  userName: string;
}

const W = 360;
const H = 540;
const SCALE = 3; // render a 3x para nitidez

export default function ShareStreakCard({ streak, xp, level, userName }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [shown, setShown] = useState(false);
  const [rendered, setRendered] = useState(false);
  const info = levelInfo(level);
  const first = userName.split(" ")[0];

  const message = streak >= 30
    ? `${first} lleva ${streak} días siendo constante.`
    : streak >= 7
    ? `${first} está construyendo su mejor versión, un día a la vez.`
    : `${first} está empezando su camino como creadora.`;

  useEffect(() => {
    if (!shown) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = W * SCALE;
    canvas.height = H * SCALE;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(SCALE, SCALE);

    const img = new Image();
    img.src = "/mascot/happy.png";
    img.onload = () => draw(ctx, img);
    img.onerror = () => draw(ctx, null);
  }, [shown, streak, xp, level, userName]);

  function draw(ctx: CanvasRenderingContext2D, mascot: HTMLImageElement | null) {
    // Fondo
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, "#FFF5F8");
    bg.addColorStop(0.5, "#FFFBEE");
    bg.addColorStop(1, "#FFF0F5");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Círculo decorativo top-right
    const gr1 = ctx.createRadialGradient(W + 40, -40, 0, W + 40, -40, 160);
    gr1.addColorStop(0, "rgba(255,200,50,0.18)");
    gr1.addColorStop(1, "rgba(255,200,50,0)");
    ctx.fillStyle = gr1;
    ctx.beginPath();
    ctx.arc(W + 40, -40, 160, 0, Math.PI * 2);
    ctx.fill();

    // Círculo decorativo bottom-left
    const gr2 = ctx.createRadialGradient(-40, H + 40, 0, -40, H + 40, 160);
    gr2.addColorStop(0, "rgba(255,150,180,0.22)");
    gr2.addColorStop(1, "rgba(255,150,180,0)");
    ctx.fillStyle = gr2;
    ctx.beginPath();
    ctx.arc(-40, H + 40, 160, 0, Math.PI * 2);
    ctx.fill();

    // Logo — ✦ Sh[ı+estrella]ny Creators
    ctx.textAlign = "left";
    ctx.font = "800 16px Arial";
    const logoY = 48;

    const starPrefixW = ctx.measureText("✦ ").width;
    const shW = ctx.measureText("Sh").width;
    const dotlessIW = ctx.measureText("ı").width; // i sin punto U+0131
    const restW = ctx.measureText("ny Creators").width;
    const totalLogoW = starPrefixW + shW + dotlessIW + restW;
    let lx = W / 2 - totalLogoW / 2;

    // ✦ dorado
    ctx.fillStyle = "#C8860A";
    ctx.fillText("✦ ", lx, logoY);
    lx += starPrefixW;

    // "Sh" oscuro
    ctx.fillStyle = "#2D1B4E";
    ctx.fillText("Sh", lx, logoY);
    lx += shW;

    // "ı" oscuro (sin punto)
    ctx.fillStyle = "#2D1B4E";
    ctx.fillText("ı", lx, logoY);

    // Estrellita dorada encima como punto (offsetY ajustado)
    ctx.font = "700 8px Arial";
    ctx.fillStyle = "#C8860A";
    ctx.fillText("✦", lx + dotlessIW / 2 - 4, logoY - 10);

    lx += dotlessIW;

    // "ny Creators" oscuro
    ctx.font = "800 16px Arial";
    ctx.fillStyle = "#2D1B4E";
    ctx.fillText("ny Creators", lx, logoY);
    ctx.textAlign = "center";

    // Mascota con halo dorado
    const cx = W / 2;
    const cy = 180;
    const r = 72;

    // Halo dorado sutil detrás de la mascota
    const halo1 = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 1.4);
    halo1.addColorStop(0, "rgba(251,203,106,0.4)");
    halo1.addColorStop(0.5, "rgba(251,203,106,0.12)");
    halo1.addColorStop(1, "rgba(251,203,106,0)");
    ctx.fillStyle = halo1;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.4, 0, Math.PI * 2);
    ctx.fill();

    if (mascot) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(mascot, cx - r, cy - r, r * 2, r * 2);
      ctx.restore();

      // Fade suave en el borde del círculo
      const fade = ctx.createRadialGradient(cx, cy, r * 0.6, cx, cy, r);
      fade.addColorStop(0, "rgba(255,251,240,0)");
      fade.addColorStop(0.7, "rgba(255,251,240,0)");
      fade.addColorStop(1, "rgba(255,251,240,0.9)");
      ctx.fillStyle = fade;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Número de racha grande
    ctx.font = "900 72px 'Arial Black', Arial";
    ctx.fillStyle = "#2D1B4E";
    ctx.textAlign = "center";
    ctx.fillText(`${streak}`, cx + 22, 302);

    // Emoji fuego — separado y alineado
    ctx.font = "56px Arial";
    ctx.fillText("🔥", cx - 46, 302);

    // Texto DÍAS DE RACHA
    ctx.font = "bold 13px Arial";
    ctx.fillStyle = "#C8860A";
    ctx.letterSpacing = "2px";
    ctx.fillText(streak === 1 ? "DÍA DE RACHA" : "DÍAS DE RACHA", cx, 326);
    ctx.letterSpacing = "0px";

    // Pastilla nivel + XP
    const pill = { x: cx - 100, y: 344, w: 200, h: 46, r: 16 };
    ctx.fillStyle = "rgba(200,134,10,0.1)";
    ctx.strokeStyle = "rgba(200,134,10,0.3)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(pill.x, pill.y, pill.w, pill.h, pill.r);
    ctx.fill();
    ctx.stroke();

    ctx.font = "bold 13px Arial";
    ctx.fillStyle = "#2D1B4E";
    ctx.fillText(`${info.emoji} Nivel ${level} · ${info.name}`, cx, 366);
    ctx.font = "12px Arial";
    ctx.fillStyle = "#8B7FA8";
    ctx.fillText(`${xp} XP acumulados`, cx, 382);

    // Mensaje
    ctx.font = "13px Arial";
    ctx.fillStyle = "#6B5B8A";
    wrapText(ctx, message + " ✨", cx, 420, 280, 20);

    // Footer
    ctx.font = "11px Arial";
    ctx.fillStyle = "#B0A0C8";
    ctx.fillText("shinycreators.vercel.app", cx, H - 24);

    setRendered(true);
  }

  function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxW: number, lineH: number) {
    const words = text.split(" ");
    let line = "";
    for (const word of words) {
      const test = line ? line + " " + word : word;
      if (ctx.measureText(test).width > maxW && line) {
        ctx.fillText(line, x, y);
        line = word;
        y += lineH;
      } else {
        line = test;
      }
    }
    ctx.fillText(line, x, y);
  }

  function handleDownload() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `shiny-racha-${streak}-dias.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
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
    <div className="flex flex-col gap-3 items-center">
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        className="rounded-3xl shadow-lg w-full max-w-xs"
      />
      <button
        onClick={handleDownload}
        disabled={!rendered}
        className="w-full bg-gradient-to-r from-glow-gold to-glow-pink text-white font-poppins text-sm font-bold py-3 rounded-2xl disabled:opacity-50"
      >
        ⬇️ Descargar imagen
      </button>
      <button
        onClick={() => { setShown(false); setRendered(false); }}
        className="font-inter text-xs text-glow-text-muted"
      >
        Cerrar
      </button>
    </div>
  );
}
