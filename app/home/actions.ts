"use server";

import { createClient } from "@/lib/supabase/server";
import { getLocalDate } from "@/lib/streak";
import { calculateLevel } from "@/lib/levels";
import { checkReferralBonuses } from "@/app/invitaciones/actions";

const XP_PER_ACTIVITY = 10;
const XP_CHALLENGE = 20;

export async function logDailyActivities(activities: string[], challengeCompleted: boolean, _challengeText: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "No hay sesión" };

  const today = getLocalDate();

  // Upsert del log de hoy
  const { error } = await supabase
    .from("daily_logs")
    .upsert({
      user_id: user.id,
      log_date: today,
      activities,
      challenge_completed: challengeCompleted,
    }, { onConflict: "user_id,log_date" });

  if (error) return { error: error.message };

  // Calcular y actualizar XP
  const xpGained = activities.length * XP_PER_ACTIVITY + (challengeCompleted ? XP_CHALLENGE : 0);
  if (xpGained > 0) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("xp, level, streak_record")
      .eq("id", user.id)
      .single();

    const currentXp = (profile?.xp ?? 0) + xpGained;
    const newLevel = calculateLevel(currentXp);

    await supabase
      .from("profiles")
      .update({ xp: currentXp, level: newLevel })
      .eq("id", user.id);
  }

  // Comprobar bonus de invitación en background (no bloquea el guardado)
  checkReferralBonuses().catch(() => {});

  return { success: true, xpGained };
}

export async function updateStreakRecord(newRecord: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from("profiles").update({ streak_record: newRecord }).eq("id", user.id);
}

