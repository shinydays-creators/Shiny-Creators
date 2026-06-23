"use client";

import { useState } from "react";
import ShinyTitle from "@/components/ShinyTitle";
import { saveCapsuleGoals, saveReflection } from "./actions";

const MONTH_NAMES = [
  "Enero","Febrero","Marzo","Abril","Mayo","Junio",
  "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
];

const MOODS = [
  { id: "amazing",  emoji: "🌟", label: "Increíble" },
  { id: "good",     emoji: "😊", label: "Bien" },
  { id: "ok",       emoji: "😐", label: "Regular" },
  { id: "hard",     emoji: "💪", label: "Duro pero aprendí" },
  { id: "restart",  emoji: "🔄", label: "Necesito reiniciarme" },
];

interface Capsule {
  id: string;
  month: string;
  goals: string[];
  intention: string | null;
  reflection: string | null;
  mood_end: string | null;
  reflected_at: string | null;
}

interface Props {
  capsules: Capsule[];
  userName: string;
}

function currentMonth() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function formatMonth(month: string) {
  const [year, m] = month.split("-");
  return `${MONTH_NAMES[parseInt(m) - 1]} ${year}`;
}

function isPastMonth(month: string) {
  return month < currentMonth();
}

export default function CapsuleClient({ capsules, userName }: Props) {
  const thisMonth = currentMonth();
  const thisCapsule = capsules.find(c => c.month === thisMonth);
  const pastCapsules = capsules.filter(c => c.month !== thisMonth);
  const pendingReflection = pastCapsules.find(c => !c.reflected_at && c.goals.length > 0);

  // Estados para el formulario de objetivos
  const [goals, setGoals] = useState<string[]>(thisCapsule?.goals ?? ["", "", ""]);
  const [intention, setIntention] = useState(thisCapsule?.intention ?? "");
  const [savingGoals, setSavingGoals] = useState(false);
  const [goalsSaved, setGoalsSaved] = useState(!!thisCapsule?.goals?.length);

  // Estados para la reflexión
  const [reflectingOn, setReflectingOn] = useState<string | null>(null);
  const [reflection, setReflection] = useState("");
  const [mood, setMood] = useState("");
  const [savingReflection, setSavingReflection] = useState(false);

  // Capsulas pasadas expandidas
  const [expanded, setExpanded] = useState<string | null>(null);

  const first = userName.split(" ")[0];

  async function handleSaveGoals() {
    const filled = goals.filter(g => g.trim());
    if (filled.length === 0) return;
    setSavingGoals(true);
    await saveCapsuleGoals(thisMonth, filled, intention);
    setSavingGoals(false);
    setGoalsSaved(true);
  }

  async function handleSaveReflection() {
    if (!reflectingOn || !reflection.trim() || !mood) return;
    setSavingReflection(true);
    await saveReflection(reflectingOn, reflection, mood);
    setSavingReflection(false);
    setReflectingOn(null);
    setReflection("");
    setMood("");
  }

  return (
    <div className="relative z-10 max-w-sm mx-auto px-6 pt-12 pb-6">

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <a href="/perfil" className="text-glow-text-muted text-lg">←</a>
        <ShinyTitle className="text-2xl" />
      </div>

      <h1 className="font-poppins text-xl font-bold text-glow-text mb-1">🕰️ Cápsula del tiempo</h1>
      <p className="font-inter text-sm text-glow-text-muted mb-6">
        Tus objetivos de cada mes, guardados para siempre.
      </p>

      {/* Reflexión pendiente del mes anterior */}
      {pendingReflection && reflectingOn !== pendingReflection.month && (
        <div className="bg-glow-gold/10 border-2 border-glow-gold/40 rounded-2xl p-4 mb-5">
          <p className="font-poppins text-sm font-bold text-glow-text mb-1">
            ✨ {formatMonth(pendingReflection.month)} ha terminado
          </p>
          <p className="font-inter text-xs text-glow-text-muted mb-3">
            ¿Cómo fue? Tómate un momento para reflexionar sobre ese mes.
          </p>
          <button
            onClick={() => setReflectingOn(pendingReflection.month)}
            className="w-full bg-glow-gold text-white font-poppins text-sm font-bold py-2.5 rounded-xl"
          >
            Reflexionar sobre ese mes
          </button>
        </div>
      )}

      {/* Formulario de reflexión */}
      {reflectingOn && (
        <div className="bg-white rounded-2xl shadow-soft p-4 mb-5">
          <p className="font-poppins text-sm font-bold text-glow-text mb-1">
            Reflexión — {formatMonth(reflectingOn)}
          </p>
          {/* Objetivos que se pusieron */}
          {capsules.find(c => c.month === reflectingOn)?.goals.map((g, i) => (
            <div key={i} className="flex items-start gap-2 mb-1">
              <span className="text-glow-gold text-sm mt-0.5">✦</span>
              <p className="font-inter text-xs text-glow-text-muted">{g}</p>
            </div>
          ))}
          <div className="mt-3 mb-3">
            <p className="font-inter text-xs font-semibold text-glow-text mb-2">¿Cómo fue este mes?</p>
            <div className="flex flex-wrap gap-2">
              {MOODS.map(m => (
                <button
                  key={m.id}
                  onClick={() => setMood(m.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-inter font-semibold transition-all ${
                    mood === m.id
                      ? "bg-glow-gold/20 border-glow-gold text-glow-text"
                      : "border-glow-pink/30 text-glow-text-muted"
                  }`}
                >
                  {m.emoji} {m.label}
                </button>
              ))}
            </div>
          </div>
          <textarea
            value={reflection}
            onChange={e => setReflection(e.target.value)}
            placeholder="Cuéntate a ti misma cómo fue realmente este mes. Sin filtros."
            rows={4}
            className="w-full border border-glow-pink/30 rounded-xl px-3 py-2.5 font-inter text-sm text-glow-text placeholder:text-glow-text-muted/50 focus:outline-none focus:border-glow-gold resize-none"
          />
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => { setReflectingOn(null); setReflection(""); setMood(""); }}
              className="flex-1 border border-glow-pink/30 text-glow-text-muted font-poppins text-sm py-2 rounded-xl"
            >
              Cancelar
            </button>
            <button
              onClick={handleSaveReflection}
              disabled={savingReflection || !reflection.trim() || !mood}
              className="flex-1 bg-glow-gold disabled:opacity-50 text-white font-poppins text-sm font-bold py-2 rounded-xl"
            >
              {savingReflection ? "Guardando..." : "Guardar reflexión"}
            </button>
          </div>
        </div>
      )}

      {/* Cápsula del mes actual */}
      <div className="bg-white rounded-2xl shadow-soft p-4 mb-5">
        <div className="flex items-center justify-between mb-3">
          <p className="font-poppins text-sm font-bold text-glow-text">
            📅 {formatMonth(thisMonth)}
          </p>
          <span className="font-inter text-xs bg-glow-pink/20 text-glow-text px-2 py-0.5 rounded-full">
            Este mes
          </span>
        </div>

        {goalsSaved ? (
          <>
            <p className="font-inter text-xs text-glow-text-muted mb-2">Tus objetivos de este mes:</p>
            {goals.filter(g => g.trim()).map((g, i) => (
              <div key={i} className="flex items-start gap-2 mb-2">
                <span className="text-glow-gold font-bold text-sm mt-0.5">✦</span>
                <p className="font-inter text-sm text-glow-text">{g}</p>
              </div>
            ))}
            {intention && (
              <div className="mt-3 pt-3 border-t border-glow-cream">
                <p className="font-inter text-xs text-glow-text-muted italic">"{intention}"</p>
              </div>
            )}
            <button
              onClick={() => setGoalsSaved(false)}
              className="mt-3 font-inter text-xs text-glow-text-muted underline"
            >
              Editar objetivos
            </button>
          </>
        ) : (
          <>
            <p className="font-inter text-xs text-glow-text-muted mb-3">
              ¿Qué quieres conseguir este mes, {first}?
            </p>
            {[0, 1, 2].map(i => (
              <input
                key={i}
                value={goals[i] ?? ""}
                onChange={e => {
                  const updated = [...goals];
                  updated[i] = e.target.value;
                  setGoals(updated);
                }}
                placeholder={
                  i === 0 ? "Objetivo 1 (ej: publicar 4 vídeos)" :
                  i === 1 ? "Objetivo 2 (ej: llegar a 52K suscriptores)" :
                  "Objetivo 3 — opcional"
                }
                className="w-full border border-glow-pink/30 rounded-xl px-3 py-2.5 font-inter text-sm text-glow-text placeholder:text-glow-text-muted/50 focus:outline-none focus:border-glow-gold mb-2"
              />
            ))}
            <input
              value={intention}
              onChange={e => setIntention(e.target.value)}
              placeholder="Una palabra o frase que define este mes para ti (opcional)"
              className="w-full border border-glow-pink/30 rounded-xl px-3 py-2.5 font-inter text-sm text-glow-text placeholder:text-glow-text-muted/50 focus:outline-none focus:border-glow-gold mb-3"
            />
            <button
              onClick={handleSaveGoals}
              disabled={savingGoals || goals.filter(g => g.trim()).length === 0}
              className="w-full bg-gradient-to-r from-glow-gold to-glow-pink disabled:opacity-50 text-white font-poppins text-sm font-bold py-3 rounded-xl"
            >
              {savingGoals ? "Guardando..." : "✨ Guardar mis objetivos"}
            </button>
          </>
        )}
      </div>

      {/* Cápsulas pasadas */}
      {pastCapsules.length > 0 && (
        <div>
          <p className="font-poppins text-xs font-bold text-glow-text-muted uppercase tracking-widest mb-3">
            Meses anteriores
          </p>
          <div className="flex flex-col gap-3">
            {pastCapsules.map(cap => {
              const moodInfo = MOODS.find(m => m.id === cap.mood_end);
              const isOpen = expanded === cap.month;
              return (
                <div key={cap.month} className="bg-white rounded-2xl shadow-soft overflow-hidden">
                  <button
                    onClick={() => setExpanded(isOpen ? null : cap.month)}
                    className="w-full flex items-center justify-between px-4 py-3"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">{moodInfo ? moodInfo.emoji : "🕰️"}</span>
                      <p className="font-poppins text-sm font-bold text-glow-text">{formatMonth(cap.month)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {cap.reflected_at ? (
                        <span className="font-inter text-xs text-green-500 font-semibold">Reflexionado</span>
                      ) : (
                        <span className="font-inter text-xs text-glow-text-muted">Sin reflexión</span>
                      )}
                      <span className="text-glow-text-muted text-sm">{isOpen ? "↑" : "↓"}</span>
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 border-t border-glow-cream">
                      <p className="font-inter text-xs text-glow-text-muted mt-3 mb-2">Objetivos:</p>
                      {cap.goals.map((g, i) => (
                        <div key={i} className="flex items-start gap-2 mb-1.5">
                          <span className="text-glow-gold text-sm mt-0.5">✦</span>
                          <p className="font-inter text-sm text-glow-text">{g}</p>
                        </div>
                      ))}
                      {cap.intention && (
                        <p className="font-inter text-xs text-glow-text-muted italic mt-2">"{cap.intention}"</p>
                      )}
                      {cap.reflection && (
                        <div className="mt-3 pt-3 border-t border-glow-cream">
                          <p className="font-inter text-xs text-glow-text-muted mb-1">Tu reflexión:</p>
                          <p className="font-inter text-sm text-glow-text">{cap.reflection}</p>
                          {moodInfo && (
                            <p className="font-inter text-xs text-glow-text-muted mt-1">
                              {moodInfo.emoji} {moodInfo.label}
                            </p>
                          )}
                        </div>
                      )}
                      {!cap.reflected_at && (
                        <button
                          onClick={() => setReflectingOn(cap.month)}
                          className="mt-3 w-full border border-glow-gold text-glow-gold font-poppins text-xs font-bold py-2 rounded-xl"
                        >
                          Reflexionar sobre este mes
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Estado vacío si no hay nada */}
      {pastCapsules.length === 0 && goalsSaved && (
        <div className="text-center py-6">
          <p className="text-3xl mb-2">🌱</p>
          <p className="font-inter text-sm text-glow-text-muted">
            Esta es tu primera cápsula. El mes que viene podrás reflexionar sobre este mes.
          </p>
        </div>
      )}

    </div>
  );
}
