"use client";

import { useState } from "react";

type Mood = "happy" | "excited" | "neutral" | "sleepy";

interface MascotStarProps {
  mood?: Mood;
  size?: number;
  className?: string;
  animate?: boolean;
}

function StarSVGFallback({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width={size} height={size}>
      <path
        d="M24 4 L27.5 15.5 L39.5 15.5 L29.5 22.5 L33 34 L24 27 L15 34 L18.5 22.5 L8.5 15.5 L20.5 15.5 Z"
        fill="url(#goldGrad)" stroke="#F0B84A" strokeWidth="0.5"
      />
      <defs>
        <linearGradient id="goldGrad" x1="8" y1="4" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FDE68A" /><stop offset="1" stopColor="#FBCB6A" />
        </linearGradient>
      </defs>
      <ellipse cx="20" cy="14" rx="3" ry="2" fill="white" opacity="0.4" />
      <path d="M20 26 Q24 30 28 26" stroke="#3A2E32" strokeWidth="2" strokeLinecap="round" fill="none" />
      <circle cx="19" cy="21" r="2.5" fill="#3A2E32" />
      <circle cx="29" cy="21" r="2.5" fill="#3A2E32" />
    </svg>
  );
}

export default function MascotStar({
  mood = "happy",
  size = 120,
  className = "",
  animate = false,
}: MascotStarProps) {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <div
      className={`relative inline-flex items-center justify-center ${animate ? "animate-float" : ""} ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Halo dorado muy sutil y muy difuminado detrás */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: size * 0.5,
          height: size * 0.5,
          background: "radial-gradient(circle, rgba(251,203,106,0.5) 0%, transparent 70%)",
          filter: `blur(${size * 0.22}px)`,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />

      {imgFailed ? (
        <StarSVGFallback size={size} />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`/mascot/${mood}.png`}
          alt="Mascota Shiny Creators"
          width={size}
          height={size}
          style={{
            width: size,
            height: size,
            objectFit: "cover",
            objectPosition: "center center",
            borderRadius: "50%",
            WebkitMaskImage:
              "radial-gradient(circle at 50% 50%, black 40%, rgba(0,0,0,0.6) 58%, transparent 72%)",
            maskImage:
              "radial-gradient(circle at 50% 50%, black 40%, rgba(0,0,0,0.6) 58%, transparent 72%)",
          }}
          onError={() => setImgFailed(true)}
        />
      )}
    </div>
  );
}
