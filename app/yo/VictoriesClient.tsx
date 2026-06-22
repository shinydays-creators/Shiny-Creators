"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import ShinyTitle from "@/components/ShinyTitle";
import { levelInfo } from "@/lib/levels";
import { addVictory, deleteVictory } from "./actions";

const CATEGORIES = [
  { id: "milestone",  emoji: "🏆", label: "Hito de seguidores" },
  { id: "content",    emoji: "🎬", label: "Contenido" },
  { id: "collab",     emoji: "🤝", label: "Colaboración" },
  { id: "personal",   emoji: "🦋", label: "Logro personal" },
  { id: "community",  emoji: "💬", label: "Comunidad" },
  { id: "streak",     emoji: "🔥", label: "Racha" },
  { id: "money",      emoji: "💰", label: "Ingresos" },
  { id: "other",      emoji: "✨", label: "Otro" },
];

const QUICK_VICTORIES = [
  { title: "Publiqué mi primer vídeo", category: "content" },
  { title: "Conseguí mis primeros 100 seguidores", category: "milestone" },
  { title: "Alcancé 1.000 visualizaciones", category: "milestone" },
  { title: "Recibí mi primer email de una marca", category: "collab" },
  { title: "Envié mi primer pitch a una marca", category: "collab" },
  { title: "Conseguí mi primera colaboración", category: "collab" },
  { title: "Alcancé una racha de 7 días", category: "streak" },
  { title: "Alcancé una racha de 30 días", category: "streak" },
  { title: "Terminé mi media kit", category: "personal" },
];

interface Victory {
  id: string;
  title: string;
  description?: string;
  note?: string;
  category: string;
  created_at: string;
}

interface Props {
  victories: Victory[];
  userName: string;
  xp: number;
  level: number;
  streakRecord: number;
  email: string;
}

export default function VictoriesClient({ victories: initial, userName, xp, level, streakRecord, email }: Props) {
  const router = useRouter();
  const [victories, setVictories] = useState<Victory[]>(initial);
  const [showForm, setShowForm] = useState(false);
  const [showQuick, setShowQuick] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [note, setNote] = useState("");
  const [category, setCategory] = useState("personal");

  const info = levelInfo(level);
  const displayName = userName || email.split("@")[0];

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" });
  }

  function getCatInfo(id: string) {
    return CATEGORIES.find(c => c.id === id) ?? { emoji: "✨", label: "Otro" };
  }

  async function handleSave() {
    if (!title.trim()) return;
    setSaving(true);
    const result = await addVictory({ title: title.trim(), description: description.trim() || undefined, note: note.trim() || undefined, category });
    if (result?.success) {
      setTitle(""); setDescription(""); setNote(""); setCategory("personal");
      setShowForm(false);
      startTransition(() => router.refresh());
    }
    setSaving(false);
  }

  async function handleQuickAdd(v: { title: string; category: string }) {
    const result = await addVictory({ title: v.title, category: v.category });
    if (result?.success) {
      setShowQuick(false);
      startTransition(() => router.refresh());
    }
  }

  async function handleDelete(id: string) {
    await deleteVictory(id);
    setVictories(prev => prev.filter(v => v.id !== id));
  }

  return (
    <div className="relative z-10 max-w-sm mx-auto px-6 pt-12">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <ShinyTitle className="text-2xl" />
      </div>

      {/* Resumen */}
      <div className="bg-white rounded-3xl shadow-soft-lg p-5 mb-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-glow-gold to-glow-pink flex items-center justify-center flex-shrink-0">
            <span className="text-2xl">{info.emoji}</span>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-poppins text-lg font-bold text-glow-text truncate">{displayName}</h2>
            <p className="font-inter text-xs text-glow-text-muted">Nivel {level} · {info.name}</p>
            <p className="font-inter text-xs text-glow-text-muted">{xp} XP · 🏆 {streakRecord} días de racha</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-4">
          <div className="bg-glow-cream rounded-xl p-3 text-center">
            <p className="font-poppins text-2xl font-bold text-glow-text">{victories.length}</p>
            <p className="font-inter text-xs text-glow-text-muted">victorias 🎉</p>
          </div>
          <div className="bg-glow-gold/10 rounded-xl p-3 text-center">
            <p className="font-poppins text-2xl font-bold text-glow-gold-dark">{xp}</p>
            <p className="font-inter text-xs text-glow-text-muted">XP ganados ✨</p>
          </div>
        </div>
      </div>

      {/* Botones añadir */}
      <div className="flex gap-2 mb-4">
        <button onClick={() => { setShowQuick(true); setShowForm(false); }}
          className="flex-1 py-3 rounded-2xl bg-glow-gold/10 border-2 border-glow-gold/30 font-poppins text-sm font-semibold text-glow-gold-dark">
          ⚡ Victoria rápida
        </button>
        <button onClick={() => { setShowForm(true); setShowQuick(false); }}
          className="flex-1 btn-primary py-3 text-sm">
          + Nueva victoria
        </button>
      </div>

      {/* Victorias rápidas */}
      {showQuick && (
        <div className="bg-white rounded-2xl shadow-soft p-4 mb-4">
          <p className="font-poppins text-sm font-bold text-glow-text mb-3">Elige una victoria:</p>
          <div className="flex flex-col gap-2">
            {QUICK_VICTORIES.map((v, i) => (
              <button key={i} onClick={() => handleQuickAdd(v)}
                className="flex items-center gap-3 p-3 rounded-xl bg-glow-cream text-left active:scale-95 transition-transform">
                <span className="text-lg">{getCatInfo(v.category).emoji}</span>
                <span className="font-inter text-sm text-glow-text">{v.title}</span>
              </button>
            ))}
          </div>
          <button onClick={() => setShowQuick(false)} className="w-full mt-3 font-inter text-sm text-glow-text-muted">Cancelar</button>
        </div>
      )}

      {/* Formulario personalizado */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-soft p-4 mb-4">
          <p className="font-poppins text-sm font-bold text-glow-text mb-4">Tu victoria 🎉</p>

          <div className="mb-3">
            <label className="font-inter text-xs text-glow-text-muted mb-1 block">Categoría</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(c => (
                <button key={c.id} onClick={() => setCategory(c.id)}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-inter font-medium border-2 transition-all ${
                    category === c.id ? "border-glow-gold bg-glow-gold/10 text-glow-gold-dark" : "border-glow-cream text-glow-text-muted"
                  }`}>
                  {c.emoji} {c.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-3">
            <label className="font-inter text-xs text-glow-text-muted mb-1 block">¿Qué lograste? *</label>
            <input value={title} onChange={e => setTitle(e.target.value)}
              placeholder="Ej: Conseguí mi primera colaboración"
              className="input-glow text-sm" maxLength={100} />
          </div>

          <div className="mb-3">
            <label className="font-inter text-xs text-glow-text-muted mb-1 block">Descripción (opcional)</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)}
              placeholder="Cuéntame más detalles..."
              className="input-glow text-sm resize-none" rows={2} maxLength={300} />
          </div>

          <div className="mb-4">
            <label className="font-inter text-xs text-glow-text-muted mb-1 block">Nota personal (opcional)</label>
            <textarea value={note} onChange={e => setNote(e.target.value)}
              placeholder="¿Cómo te sientes? ¿Qué significa para ti?"
              className="input-glow text-sm resize-none" rows={2} maxLength={300} />
          </div>

          <div className="flex gap-2">
            <button onClick={handleSave} disabled={saving || !title.trim()} className="flex-1 btn-primary py-2.5 text-sm disabled:opacity-40">
              {saving ? "Guardando..." : "🎉 Guardar victoria"}
            </button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2.5 rounded-2xl border-2 border-glow-pink/30 font-poppins text-sm text-glow-text-muted">
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Línea temporal de victorias */}
      <div className="mb-4">
        <p className="font-poppins text-xs font-semibold text-glow-text-muted uppercase tracking-widest mb-4">
          🏆 Tu muro de victorias
        </p>

        {victories.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-soft p-6 text-center">
            <p className="text-4xl mb-3">🌱</p>
            <p className="font-poppins font-semibold text-glow-text text-sm">Aquí vivirán tus victorias</p>
            <p className="font-inter text-xs text-glow-text-muted mt-1 leading-relaxed">
              Cada logro cuenta, por pequeño que sea. ¡Añade tu primera victoria!
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {victories.map((v, i) => {
              const cat = getCatInfo(v.category);
              return (
                <div key={v.id} className="relative flex gap-3">
                  {/* Línea temporal */}
                  <div className="flex flex-col items-center">
                    <div className="w-9 h-9 rounded-full bg-glow-gold/15 border-2 border-glow-gold/40 flex items-center justify-center flex-shrink-0 z-10">
                      <span className="text-base">{cat.emoji}</span>
                    </div>
                    {i < victories.length - 1 && (
                      <div className="w-0.5 flex-1 bg-glow-pink/20 mt-1 min-h-4" />
                    )}
                  </div>

                  {/* Tarjeta */}
                  <div className="flex-1 bg-white rounded-2xl shadow-soft p-4 mb-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="font-poppins text-sm font-bold text-glow-text leading-snug">{v.title}</p>
                        <p className="font-inter text-xs text-glow-text-muted mt-0.5">{cat.label} · {formatDate(v.created_at)}</p>
                      </div>
                      <button onClick={() => handleDelete(v.id)} className="text-glow-text-muted/40 hover:text-glow-pink transition-colors flex-shrink-0 text-lg leading-none">
                        ×
                      </button>
                    </div>
                    {v.description && (
                      <p className="font-inter text-xs text-glow-text mt-2 leading-relaxed">{v.description}</p>
                    )}
                    {v.note && (
                      <div className="mt-2 bg-glow-cream rounded-xl p-2.5">
                        <p className="font-inter text-xs text-glow-text-muted italic leading-relaxed">"{v.note}"</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Links */}
      <div className="flex flex-col gap-2 mb-4">
        <a href="/perfil" className="w-full py-3 rounded-2xl border-2 border-glow-pink/30 font-poppins text-sm font-semibold text-glow-text text-center">
          👤 Ver mi perfil creator
        </a>
        <a href="/auth/login" onClick={async e => {
          e.preventDefault();
          const { createClient } = await import("@/lib/supabase/client");
          await createClient().auth.signOut();
          window.location.href = "/";
        }} className="font-inter text-sm text-glow-text-muted text-center py-2">
          Cerrar sesión
        </a>
      </div>

    </div>
  );
}
