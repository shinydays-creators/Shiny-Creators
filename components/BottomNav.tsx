"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/home",     emoji: "🏠", label: "Inicio"   },
  { href: "/aprender", emoji: "📚", label: "Aprender" },
  { href: "/perfil",   emoji: "👤", label: "Perfil"   },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-t border-glow-pink/20 pb-safe">
      <div className="flex items-center justify-around max-w-sm mx-auto px-4 py-2">
        {ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-2xl transition-all duration-200 ${
                active ? "bg-glow-gold/15" : "hover:bg-glow-cream"
              }`}
            >
              <span className="text-xl">{item.emoji}</span>
              <span className={`font-poppins text-xs font-semibold transition-colors ${
                active ? "text-glow-gold-dark" : "text-glow-text-muted"
              }`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
