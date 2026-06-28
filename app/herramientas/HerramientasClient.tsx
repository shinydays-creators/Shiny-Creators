"use client";

import { useState } from "react";

// ─── CALCULADORA ────────────────────────────────────────────────────────────

const PLATFORMS = [
  { id: "instagram", label: "Instagram" },
  { id: "tiktok", label: "TikTok" },
  { id: "youtube", label: "YouTube" },
  { id: "pinterest", label: "Pinterest" },
];

const CONTENT_TYPES = [
  { id: "post", label: "Post / foto" },
  { id: "reel", label: "Reel / vídeo corto" },
  { id: "story", label: "Stories (pack)" },
  { id: "video", label: "Vídeo largo" },
  { id: "bundle", label: "Pack completo" },
];

const COLLAB_TYPES = [
  { id: "mention", label: "Mención / tag" },
  { id: "review", label: "Reseña de producto" },
  { id: "sponsored", label: "Contenido patrocinado" },
  { id: "ambassador", label: "Embajadora de marca" },
  { id: "gifted", label: "Solo gifted (sin pago)" },
];

function calcPrice(followers: number, views: number, platform: string, contentType: string, collabType: string) {
  if (collabType === "gifted") return null;

  // Base realista mercado español según tramo de seguidores
  function getBase(f: number, plt: string): number {
    const tiers: Record<string, number[][]> = {
      // [hasta, base€]
      youtube:   [[1000,20],[5000,40],[10000,70],[25000,120],[50000,200],[100000,350],[500000,700],[9999999,1200]],
      instagram: [[1000,15],[5000,30],[10000,50],[25000,80],[50000,130],[100000,220],[500000,500],[9999999,900]],
      tiktok:    [[1000,10],[5000,20],[10000,35],[25000,55],[50000,90],[100000,150],[500000,350],[9999999,700]],
      pinterest: [[1000,5],[5000,10],[10000,20],[25000,35],[50000,60],[100000,100],[500000,200],[9999999,400]],
    };
    const t = tiers[plt] ?? tiers.instagram;
    for (const [limit, price] of t) if (f <= limit) return price;
    return 1200;
  }

  const base = getBase(followers, platform);

  // Bonus engagement (solo si supera el 15% de ratio vistas/seguidores)
  const engagementRate = followers > 0 ? views / followers : 0;
  const engBonus = engagementRate > 0.15 ? 1.2 : 1.0;

  // Factor tipo contenido
  const contentFactor: Record<string, number> = {
    post: 0.8, reel: 1.0, story: 0.3, video: 1.0, bundle: 1.6,
  };
  const cf = contentFactor[contentType] ?? 1;

  // Factor tipo colaboración
  const collabFactor: Record<string, number> = {
    mention: 0.35, review: 0.7, sponsored: 1.0, ambassador: 1.5,
  };
  const colF = collabFactor[collabType] ?? 1;

  const rec = base * engBonus * cf * colF;
  const min = Math.round(rec * 0.6 / 5) * 5;
  const recommended = Math.round(rec / 5) * 5;
  const premium = Math.round(rec * 1.5 / 5) * 5;

  return { min: Math.max(min, 25), recommended: Math.max(recommended, 40), premium: Math.max(premium, 60) };
}

function CalcSection() {
  const [platform, setPlatform] = useState("instagram");
  const [followers, setFollowers] = useState("");
  const [views, setViews] = useState("");
  const [contentType, setContentType] = useState("reel");
  const [collabType, setCollabType] = useState("sponsored");
  const [result, setResult] = useState<{ min: number; recommended: number; premium: number } | null | "gifted">(null);

  function calculate() {
    const f = parseInt(followers.replace(/\D/g, "")) || 0;
    const v = parseInt(views.replace(/\D/g, "")) || 0;
    const r = calcPrice(f, v, platform, contentType, collabType);
    setResult(r === null ? "gifted" : r);
  }

  return (
    <div className="bg-white rounded-2xl shadow-soft p-5 mb-4">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl">💰</span>
        <div>
          <h2 className="font-poppins text-base font-bold text-glow-text">Calculadora de tarifas</h2>
          <p className="font-inter text-xs text-glow-text-muted">Descubre cuánto cobrar por una colaboración</p>
        </div>
      </div>

      {/* Plataforma */}
      <div className="mb-4">
        <label className="font-inter text-xs text-glow-text-muted mb-2 block font-medium">Plataforma</label>
        <div className="flex gap-2 flex-wrap">
          {PLATFORMS.map(p => (
            <button key={p.id} onClick={() => setPlatform(p.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-poppins font-semibold border-2 transition-all ${
                platform === p.id ? "border-glow-gold bg-glow-gold/10 text-glow-gold-dark" : "border-glow-cream text-glow-text-muted"
              }`}>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Seguidores y vistas */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="font-inter text-xs text-glow-text-muted mb-1 block font-medium">Seguidores</label>
          <input value={followers} onChange={e => setFollowers(e.target.value)}
            placeholder="Ej: 5000" type="number" inputMode="numeric" className="input-glow text-sm" />
        </div>
        <div>
          <label className="font-inter text-xs text-glow-text-muted mb-1 block font-medium">Vistas medias</label>
          <input value={views} onChange={e => setViews(e.target.value)}
            placeholder="Ej: 800" type="number" inputMode="numeric" className="input-glow text-sm" />
        </div>
      </div>

      {/* Tipo de contenido */}
      <div className="mb-4">
        <label className="font-inter text-xs text-glow-text-muted mb-2 block font-medium">Tipo de contenido</label>
        <div className="flex flex-col gap-1.5">
          {CONTENT_TYPES.map(c => (
            <button key={c.id} onClick={() => setContentType(c.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-left text-sm font-inter border-2 transition-all ${
                contentType === c.id ? "border-glow-gold bg-glow-gold/8 text-glow-text font-medium" : "border-glow-cream text-glow-text-muted"
              }`}>
              {contentType === c.id ? "●" : "○"} {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tipo de colaboración */}
      <div className="mb-5">
        <label className="font-inter text-xs text-glow-text-muted mb-2 block font-medium">Tipo de colaboración</label>
        <div className="flex flex-col gap-1.5">
          {COLLAB_TYPES.map(c => (
            <button key={c.id} onClick={() => setCollabType(c.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-left text-sm font-inter border-2 transition-all ${
                collabType === c.id ? "border-glow-pink bg-glow-pink/10 text-glow-text font-medium" : "border-glow-cream text-glow-text-muted"
              }`}>
              {collabType === c.id ? "●" : "○"} {c.label}
            </button>
          ))}
        </div>
      </div>

      <button onClick={calculate} className="w-full btn-primary text-base">
        Calcular mi tarifa ✨
      </button>

      {/* Resultado */}
      {result && (
        <div className="mt-5">
          {result === "gifted" ? (
            <div className="bg-glow-cream rounded-2xl p-4 text-center">
              <p className="text-2xl mb-2">🎁</p>
              <p className="font-poppins font-bold text-glow-text text-sm">Colaboración gifted</p>
              <p className="font-inter text-xs text-glow-text-muted mt-1 leading-relaxed">
                El gifted no incluye pago económico. Solo acepta si el producto tiene mucho valor para ti o la marca encaja perfectamente con tu audiencia. Tu tiempo vale dinero.
              </p>
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="bg-glow-cream rounded-xl p-3 text-center">
                  <p className="font-inter text-xs text-glow-text-muted mb-1">Mínimo</p>
                  <p className="font-poppins text-xl font-bold text-glow-text">{result.min}€</p>
                </div>
                <div className="bg-glow-gold/10 border-2 border-glow-gold/30 rounded-xl p-3 text-center">
                  <p className="font-inter text-xs text-glow-gold-dark font-semibold mb-1">⭐ Ideal</p>
                  <p className="font-poppins text-xl font-bold text-glow-gold-dark">{result.recommended}€</p>
                </div>
                <div className="bg-glow-pink/10 rounded-xl p-3 text-center">
                  <p className="font-inter text-xs text-glow-text-muted mb-1">Máximo</p>
                  <p className="font-poppins text-xl font-bold text-glow-text">{result.premium}€</p>
                </div>
              </div>
              <div className="bg-glow-cream rounded-xl p-3 space-y-2">
                <p className="font-poppins text-xs font-bold text-glow-text">💡 ¿Cómo usar estos precios?</p>
                <p className="font-inter text-xs text-glow-text-muted leading-relaxed">
                  <span className="font-semibold text-glow-text">Mínimo:</span> Para marcas pequeñas o primeras colaboraciones.
                </p>
                <p className="font-inter text-xs text-glow-text-muted leading-relaxed">
                  <span className="font-semibold text-glow-text">Ideal:</span> Tu precio estándar. No bajes de aquí sin motivo claro.
                </p>
                <p className="font-inter text-xs text-glow-text-muted leading-relaxed">
                  <span className="font-semibold text-glow-text">Máximo:</span> Para marcas grandes o cuando te piden derechos de uso.
                </p>
              </div>
              <p className="font-inter text-[10px] text-glow-text-muted text-center mt-2">
                ✅ Esta calculadora es gratuita para todas las creadoras
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── GENERADOR DE IDEAS ──────────────────────────────────────────────────────

const IDEAS: Record<string, Record<string, string[]>> = {
  instagram: {
    lifestyle: ["Un día en mi vida siendo creadora de contenido", "5 hábitos que cambiaron mi rutina matutina", "Lo que nadie te cuenta sobre vivir de tus redes", "Mi proceso de planificación de contenido (behind the scenes)", "Cómo organizo mi semana para ser constante creando"],
    beauty: ["Mis 3 productos favoritos de menos de 10€", "Rutina de noche honesta (sin filtros)", "Dupes de productos de lujo que realmente funcionan", "Errores de maquillaje que cometí durante años", "Skincare minimalista para principiantes"],
    travel: ["Lo que no te enseñan los viajes de Instagram", "Cómo viajo barato y con estilo", "Mi proceso de planificación de un viaje desde cero", "Destino sorpresa: lo que descubrí en [ciudad]", "Errores que no volveré a cometer viajando sola"],
    fitness: ["Mi rutina honesta cuando no tengo motivación", "Entreno en casa con 0 equipamiento: así lo hago", "Lo que cambié en mi alimentación y los resultados reales", "Semana de entrenamiento completa (sin cortes)", "Mitos del fitness que sigues creyendo"],
    education: ["Lo que aprendí en [tema] en 30 días", "Explico [concepto difícil] en menos de 1 minuto", "Recursos gratuitos que nadie conoce para aprender [tema]", "Mi método para estudiar y retener información", "Preguntas que todos tienen miedo de hacer sobre [tema]"],
    food: ["Receta de 4 ingredientes que sorprende a todos", "Lo que como en un día siendo honesta", "5 desayunos rápidos que preparo en 5 minutos", "Error que todo el mundo comete con [plato típico]", "Meal prep de la semana paso a paso"],
    other: ["Mis 3 errores más grandes como creadora", "Preguntas y respuestas: lo que nunca nadie me pregunta", "Colaboración con [tipo de creadora]: el proceso real", "Tendencia que probé y mi opinión honesta", "Lo que cambiaría si empezara de cero"],
  },
  tiktok: {
    lifestyle: ["POV: llevas un mes siendo constante en redes", "Cosas que hacen las creadoras exitosas antes de las 9am", "Lo que me dije cuando quería dejarlo todo (y seguí)", "5 apps que uso para crear contenido profesional", "Transición: antes y después de organizarme como creadora"],
    beauty: ["Tendencia viral que probé honestamente", "Duet con una tutorial de maquillaje famoso", "Mis productos más usados en formato 60 segundos", "Stitch a comentario polémico de belleza", "GRWM para [ocasión] en tiempo real"],
    travel: ["Cosas que ocultan los vídeos de viajes de TikTok", "POV: llegué a [ciudad] sin plan y esto pasó", "10 segundos de cada día de mi viaje a [destino]", "El truco que uso para viajar barato que nadie comparte", "Expectativa vs realidad: [destino famoso]"],
    fitness: ["Reto de 30 días: día 1 vs día 30", "El ejercicio que más odio pero que más resulta", "Reacción a tendencia fitness viral", "Entrena conmigo en tiempo real (sin cortes)", "Lo que los entrenadores no te dicen"],
    education: ["Explica [tema] como si tuviera 5 años", "Dato sorprendente sobre [tema] que nadie sabe", "Stitch corrigiendo información falsa viral", "Aprende [habilidad] en 60 segundos", "El error más común en [campo]"],
    food: ["Receta viral que mejoré en 3 pasos", "Cocino lo que me pide la audiencia (con giro)", "Expectativa vs realidad de recetas de TikTok", "Cena de menos de 5€ que parece de restaurante", "El ingrediente secreto que cambia el plato"],
    other: ["POV: primera semana tomando en serio las redes", "Respondo comentarios difíciles sin filtros", "Lo que nadie te dice sobre tener seguidores", "Tendencia que adapté a mi nicho de forma creativa", "Story time: mi momento más viral y lo que aprendí"],
  },
  youtube: {
    lifestyle: ["Un día en mi vida siendo completamente honesta", "Reorganicé toda mi vida en un mes: así me fue", "Lo que nadie te cuenta sobre ser creadora de contenido", "Mi proceso creativo completo: de la idea al vídeo publicado", "Minimalismo digital: limpié mis redes y esto pasó"],
    beauty: ["Probé la rutina de [influencer famosa] durante una semana", "Haul de [tienda]: lo que merece la pena y lo que no", "Aprende el look que más me piden paso a paso", "Dupes que usan las maquilladoras profesionales", "Skincare routine honesta: lo que realmente uso"],
    travel: ["Viajar sola por primera vez: guía completa y honesta", "[Destino] en 72 horas con presupuesto real", "Lo que haría diferente si volviera a [destino]", "Cómo planifico un viaje de 0 a reservado", "Errores de viajera primeriza que no cometerás más"],
    fitness: ["Transformación real en 90 días: proceso sin editar", "Rutina completa de [tipo de entrenamiento] para principiantes", "Lo que aprendí entrenando con un profesional durante un mes", "Por qué dejé de hacer [ejercicio popular] y qué hago ahora", "Semana tipo de alimentación y entrenamiento sin filtros"],
    education: ["Todo lo que sé sobre [tema] en un vídeo", "Cómo aprendí [habilidad] en 3 meses desde cero", "Recursos que ojalá hubiera tenido cuando empecé", "Desmontando mitos sobre [tema] con evidencia real", "Mi método de estudio/aprendizaje que realmente funciona"],
    food: ["Lo que como en una semana siendo honesta", "Recetas de batch cooking para toda la semana", "Cocina con lo que tengo en la nevera: reto semanal", "El plato que siempre impresiona y es más fácil de lo que crees", "Aprendí a cocinar [cocina del mundo] desde cero"],
    other: ["Q&A: respondo todo lo que me preguntáis", "Reacciono a mi primer vídeo (cringe garantizado)", "Colaboración con [creadora]: cómo lo organizamos", "Lo que cambiaría si empezara mi canal hoy", "Mis stats reales después de [tiempo] en YouTube"],
  },
};

function IdeasSection() {
  const [platform, setPlatform] = useState("instagram");
  const [niche, setNiche] = useState("lifestyle");
  const [ideas, setIdeas] = useState<string[]>([]);
  const [copied, setCopied] = useState<number | null>(null);

  const NICHES = [
    { id: "lifestyle", label: "🌸 Lifestyle" },
    { id: "beauty", label: "💄 Belleza" },
    { id: "travel", label: "✈️ Viajes" },
    { id: "fitness", label: "💪 Fitness" },
    { id: "education", label: "📚 Educación" },
    { id: "food", label: "🍳 Cocina" },
    { id: "other", label: "✨ Otro" },
  ];

  function generate() {
    const pool = IDEAS[platform]?.[niche] ?? IDEAS.instagram.other;
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    setIdeas(shuffled.slice(0, 5));
  }

  function copyIdea(idea: string, i: number) {
    navigator.clipboard.writeText(idea);
    setCopied(i);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div className="bg-white rounded-2xl shadow-soft p-5 mb-4">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl">💡</span>
        <div>
          <h2 className="font-poppins text-base font-bold text-glow-text">Generador de ideas</h2>
          <p className="font-inter text-xs text-glow-text-muted">Acaba con el bloqueo creativo</p>
        </div>
      </div>

      <div className="mb-4">
        <label className="font-inter text-xs text-glow-text-muted mb-2 block font-medium">Plataforma</label>
        <div className="flex gap-2 flex-wrap">
          {PLATFORMS.filter(p => p.id !== "pinterest").map(p => (
            <button key={p.id} onClick={() => { setPlatform(p.id); setIdeas([]); }}
              className={`px-3 py-1.5 rounded-full text-xs font-poppins font-semibold border-2 transition-all ${
                platform === p.id ? "border-glow-gold bg-glow-gold/10 text-glow-gold-dark" : "border-glow-cream text-glow-text-muted"
              }`}>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-5">
        <label className="font-inter text-xs text-glow-text-muted mb-2 block font-medium">Tu nicho</label>
        <div className="flex flex-wrap gap-2">
          {NICHES.map(n => (
            <button key={n.id} onClick={() => { setNiche(n.id); setIdeas([]); }}
              className={`px-3 py-1.5 rounded-full text-xs font-poppins font-semibold border-2 transition-all ${
                niche === n.id ? "border-glow-pink bg-glow-pink/10 text-glow-text" : "border-glow-cream text-glow-text-muted"
              }`}>
              {n.label}
            </button>
          ))}
        </div>
      </div>

      <button onClick={generate} className="w-full btn-primary text-base mb-4">
        ✨ Generar ideas
      </button>

      {ideas.length > 0 && (
        <div className="flex flex-col gap-2">
          {ideas.map((idea, i) => (
            <div key={i} className="flex items-start gap-3 bg-glow-cream rounded-xl p-3">
              <span className="text-glow-gold-dark font-poppins font-bold text-sm flex-shrink-0 mt-0.5">{i + 1}.</span>
              <p className="font-inter text-sm text-glow-text flex-1 leading-snug">{idea}</p>
              <button onClick={() => copyIdea(idea, i)}
                className="flex-shrink-0 text-xs font-inter text-glow-text-muted hover:text-glow-gold-dark transition-colors">
                {copied === i ? "✓" : "copiar"}
              </button>
            </div>
          ))}
          <button onClick={generate} className="w-full mt-1 py-2.5 rounded-xl border-2 border-glow-gold/30 font-poppins text-sm font-semibold text-glow-gold-dark">
            🔄 Generar otras ideas
          </button>
        </div>
      )}
    </div>
  );
}

// ─── COMPONENTE PRINCIPAL ────────────────────────────────────────────────────

export default function HerramientasClient() {
  const [tab, setTab] = useState<"calc" | "ideas">("calc");

  return (
    <div className="relative z-10 max-w-sm mx-auto px-6 pt-4 pb-6">
      {/* Tabs */}
      <div className="flex bg-white rounded-2xl p-1 shadow-soft mb-5">
        <button onClick={() => setTab("calc")}
          className={`flex-1 py-2.5 rounded-xl font-poppins text-sm font-semibold transition-all ${
            tab === "calc" ? "bg-glow-gold text-white shadow-sm" : "text-glow-text-muted"
          }`}>
          💰 Tarifas
        </button>
        <button onClick={() => setTab("ideas")}
          className={`flex-1 py-2.5 rounded-xl font-poppins text-sm font-semibold transition-all ${
            tab === "ideas" ? "bg-glow-gold text-white shadow-sm" : "text-glow-text-muted"
          }`}>
          💡 Ideas
        </button>
      </div>

      {tab === "calc" ? <CalcSection /> : <IdeasSection />}
    </div>
  );
}
