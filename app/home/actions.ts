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

  // Ver qué había guardado antes hoy (para calcular solo XP nuevo)
  const { data: existing } = await supabase
    .from("daily_logs")
    .select("activities, challenge_completed")
    .eq("user_id", user.id)
    .eq("log_date", today)
    .single();

  const previousActivities: string[] = existing?.activities ?? [];
  const previousChallenge: boolean = existing?.challenge_completed ?? false;

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

  // Solo sumar XP por actividades NUEVAS respecto a lo ya guardado
  const newActivities = activities.filter(a => !previousActivities.includes(a));
  const challengeIsNew = challengeCompleted && !previousChallenge;
  const xpGained = newActivities.length * XP_PER_ACTIVITY + (challengeIsNew ? XP_CHALLENGE : 0);
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

