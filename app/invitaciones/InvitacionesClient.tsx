"use client";

import { useState } from "react";
import ShinyTitle from "@/components/ShinyTitle";
import { applyReferralCode } from "./actions";

interface Referral {
  invitee_id: string;
  invitee_active_days: number;
  bonus_given: boolean;
  created_at: string;
}

interface Props {
  referralCode: string;
  referrals: Referral[];
  hasBeenReferred: boolean;
  userName: string;
}

export default function InvitacionesClient({ referralCode, referrals, hasBeenReferred, userName }: Props) {
  const [copied, setCopied] = useState(false);
  const [codeInput, setCodeInput] = useState("");
  const [applying, setApplying] = useState(false);
  const [applyMsg, setApplyMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const first = userName.split(" ")[0];
  const totalInvited = referrals.length;
  const bonusGiven = referrals.filter(r => r.bonus_given).length;
  const xpEarned = bonusGiven * 150;

  function copyCode() {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function shareCode() {
    const text = `¡Únete a Shiny Creators! La app para creadoras de contenido que quieren crecer con constancia ✨\n\nUsa mi código ${referralCode} al registrarte y consigue 50 XP de regalo 🎁\n\nshinycreators.vercel.app`;
    if (navigator.share) {
      navigator.share({ text });
    } else {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  async function handleApply() {
    if (!codeInput.trim()) return;
    setApplying(true);
    setApplyMsg(null);
    const result = await applyReferralCode(codeInput);
    if (result?.error) {
      setApplyMsg({ type: "err", text: result.error });
    } else {
      setApplyMsg({ type: "ok", text: "¡Código aplicado! +50 XP añadidos a tu cuenta 🎉" });
      setCodeInput("");
    }
    setApplying(false);
  }

  return (
    <div className="relative z-10 max-w-sm mx-auto px-6 pt-12 pb-6">

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <a href="/perfil" className="text-glow-text-muted text-lg">←</a>
        <ShinyTitle className="text-2xl" />
      </div>

      <h1 className="font-poppins text-xl font-bold text-glow-text mb-1">🔗 Invita a tus amigas</h1>
      <p className="font-inter text-sm text-glow-text-muted mb-5">
        Cuando una amiga entra con tu código y lleva 7 días activa, las dos ganáis XP.
      </p>

      {/* Resumen XP */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-white rounded-2xl shadow-soft p-3 text-center">
          <p className="font-poppins text-2xl font-bold text-glow-text">{totalInvited}</p>
          <p className="font-inter text-[10px] text-glow-text-muted mt-0.5">Invitadas</p>
        </div>
        <div className="bg-white rounded-2xl shadow-soft p-3 text-center">
          <p className="font-poppins text-2xl font-bold text-glow-text">{bonusGiven}</p>
          <p className="font-inter text-[10px] text-glow-text-muted mt-0.5">Activas 7d</p>
        </div>
        <div className="bg-white rounded-2xl shadow-soft p-3 text-center">
          <p className="font-poppins text-2xl font-bold text-glow-gold-dark">{xpEarned}</p>
          <p className="font-inter text-[10px] text-glow-text-muted mt-0.5">XP ganados</p>
        </div>
      </div>

      {/* Tu código */}
      <div className="bg-white rounded-2xl shadow-soft p-4 mb-4">
        <p className="font-poppins text-xs font-bold text-glow-text-muted uppercase tracking-widest mb-3">
          Tu código de invitación
        </p>
        <div className="flex items-center gap-3 mb-3">
          <div className="flex-1 bg-glow-cream rounded-xl px-4 py-3 text-center">
            <span className="font-poppins text-2xl font-black text-glow-text tracking-widest">
              {referralCode}
            </span>
          </div>
          <button
            onClick={copyCode}
            className="bg-glow-gold/10 border border-glow-gold/30 text-glow-text font-poppins text-xs font-bold px-3 py-3 rounded-xl min-w-[64px]"
          >
            {copied ? "✅" : "Copiar"}
          </button>
        </div>
        <button
          onClick={shareCode}
          className="w-full bg-gradient-to-r from-glow-gold to-glow-pink text-white font-poppins text-sm font-bold py-3 rounded-xl"
        >
          📲 Compartir código
        </button>
      </div>

      {/* Cómo funciona */}
      <div className="bg-glow-cream/60 rounded-2xl p-4 mb-5">
        <p className="font-poppins text-xs font-bold text-glow-text mb-3">¿Cómo funciona?</p>
        <div className="flex flex-col gap-2.5">
          {[
            { emoji: "📲", text: `Comparte tu código ${referralCode} con una amiga creadora` },
            { emoji: "✍️", text: "Ella se registra en Shiny Creators y escribe tu código" },
            { emoji: "🎁", text: "Ella recibe +50 XP de bienvenida al instante" },
            { emoji: "🔥", text: "Cuando lleve 7 días activa, tú recibes +150 XP" },
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="text-lg">{step.emoji}</span>
              <p className="font-inter text-xs text-glow-text leading-snug pt-0.5">{step.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Lista de invitadas */}
      {referrals.length > 0 && (
        <div className="mb-5">
          <p className="font-poppins text-xs font-bold text-glow-text-muted uppercase tracking-widest mb-3">
            Tus invitadas
          </p>
          <div className="flex flex-col gap-2">
            {referrals.map((r, i) => (
              <div key={r.invitee_id} className="bg-white rounded-2xl shadow-soft px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{r.bonus_given ? "🌟" : "🌱"}</span>
                  <div>
                    <p className="font-poppins text-xs font-bold text-glow-text">Creadora {i + 1}</p>
                    <p className="font-inter text-[10px] text-glow-text-muted">
                      {r.invitee_active_days} / 7 días activa
                    </p>
                  </div>
                </div>
                {r.bonus_given ? (
                  <span className="font-inter text-xs font-bold text-glow-gold-dark bg-glow-gold/10 px-2 py-1 rounded-full">
                    +150 XP ✅
                  </span>
                ) : (
                  <div className="flex flex-col items-end gap-1">
                    <div className="w-16 h-1.5 bg-glow-cream rounded-full overflow-hidden">
                      <div
                        className="h-full bg-glow-gold rounded-full"
                        style={{ width: `${Math.min((r.invitee_active_days / 7) * 100, 100)}%` }}
                      />
                    </div>
                    <span className="font-inter text-[10px] text-glow-text-muted">
                      {7 - r.invitee_active_days}d restantes
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Aplicar código de otra */}
      {!hasBeenReferred && (
        <div className="bg-white rounded-2xl shadow-soft p-4">
          <p className="font-poppins text-xs font-bold text-glow-text mb-1">
            ¿Alguien te invitó?
          </p>
          <p className="font-inter text-xs text-glow-text-muted mb-3">
            Escribe su código y recibe +50 XP de bienvenida.
          </p>
          <div className="flex gap-2">
            <input
              value={codeInput}
              onChange={e => setCodeInput(e.target.value.toUpperCase())}
              placeholder="Código de invitación"
              className="flex-1 border border-glow-pink/30 rounded-xl px-3 py-2.5 font-poppins text-sm font-bold text-glow-text tracking-widest placeholder:font-normal placeholder:tracking-normal placeholder:text-glow-text-muted/50 focus:outline-none focus:border-glow-gold"
            />
            <button
              onClick={handleApply}
              disabled={applying || !codeInput.trim()}
              className="bg-glow-gold disabled:opacity-50 text-white font-poppins text-xs font-bold px-4 rounded-xl"
            >
              {applying ? "..." : "Aplicar"}
            </button>
          </div>
          {applyMsg && (
            <p className={`font-inter text-xs mt-2 ${applyMsg.type === "ok" ? "text-green-600" : "text-red-500"}`}>
              {applyMsg.text}
            </p>
          )}
        </div>
      )}

      {hasBeenReferred && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-3 text-center">
          <p className="font-inter text-xs text-green-700">
            ✅ Ya usaste un código de invitación
          </p>
        </div>
      )}

    </div>
  );
}
