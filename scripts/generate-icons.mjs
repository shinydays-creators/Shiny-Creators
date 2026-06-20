// Script para generar los iconos PWA mínimos
// Ejecutar: node scripts/generate-icons.mjs
// Requiere: npm install canvas (solo para generar, no es dependencia de producción)

import { createCanvas } from "canvas";
import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const iconsDir = join(__dirname, "../public/icons");
mkdirSync(iconsDir, { recursive: true });

function drawGlowIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext("2d");

  // Fondo crema
  ctx.fillStyle = "#FFF7FB";
  ctx.beginPath();
  ctx.roundRect(0, 0, size, size, size * 0.22);
  ctx.fill();

  // Estrella dorada centrada
  const cx = size / 2;
  const cy = size / 2;
  const outerR = size * 0.38;
  const innerR = size * 0.18;
  const points = 5;

  ctx.fillStyle = "#FBCB6A";
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const angle = (i * Math.PI) / points - Math.PI / 2;
    const r = i % 2 === 0 ? outerR : innerR;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();

  // Brillo
  ctx.fillStyle = "rgba(255,255,255,0.45)";
  ctx.beginPath();
  ctx.ellipse(cx - outerR * 0.15, cy - outerR * 0.25, outerR * 0.2, outerR * 0.12, -0.4, 0, Math.PI * 2);
  ctx.fill();

  return canvas;
}

[192, 512].forEach((size) => {
  const canvas = drawGlowIcon(size);
  const buffer = canvas.toBuffer("image/png");
  writeFileSync(join(iconsDir, `icon-${size}.png`), buffer);
  console.log(`✅ icon-${size}.png generado`);
});

// Apple touch icon (180x180)
const appleCanvas = drawGlowIcon(180);
writeFileSync(join(iconsDir, "apple-touch-icon.png"), appleCanvas.toBuffer("image/png"));
console.log("✅ apple-touch-icon.png generado");
