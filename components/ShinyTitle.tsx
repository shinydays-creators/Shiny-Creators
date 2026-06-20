interface ShinyTitleProps {
  className?: string;
}

// Renderiza "Shiny Creators" con la i sin punto y una estrellita dorada encima
export default function ShinyTitle({ className = "" }: ShinyTitleProps) {
  return (
    <span className={`font-poppins font-bold tracking-tight text-glow-text ${className}`}>
      Sh
      <span className="relative inline-block">
        {/* ı = letra i sin punto (U+0131) */}
        ı
        {/* Estrellita dorada posicionada donde iría el punto */}
        <span
          className="absolute left-1/2 -translate-x-1/2 text-glow-gold leading-none pointer-events-none select-none"
          style={{ top: "-0.22em", fontSize: "0.38em" }}
          aria-hidden="true"
        >
          ✦
        </span>
      </span>
      ny Creators
    </span>
  );
}
