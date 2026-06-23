"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function applyReferralCode(code: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No autenticada");

  // Buscar quien tiene ese código
  const { data: inviter } = await supabase
    .from("profiles")
    .select("id, referral_code")
    .eq("referral_code", code.toUpperCase().trim())
    .single();

  if (!inviter) return { error: "Código no válido" };
  if (inviter.id === user.id) return { error: "No puedes usar tu propio código" };

  // Comprobar que no tenga ya un referido
  const { data: me } = await supabase
    .from("profiles")
    .select("referred_by, xp")
    .eq("id", user.id)
    .single();

  if (me?.referred_by) return { error: "Ya usaste un código de invitación" };

  // Guardar referido + dar XP de bienvenida
  await supabase.from("profiles").update({
    referred_by: inviter.id,
    xp: (me?.xp ?? 0) + 50,
  }).eq("id", user.id);

  // Crear entrada en referrals
  await supabase.from("referrals").upsert({
    inviter_id: inviter.id,
    invitee_id: user.id,
    invitee_active_days: 0,
    bonus_given: false,
  }, { onConflict: "invitee_id" });

  revalidatePath("/invitaciones");
  return { success: true };
}

export async function checkReferralBonuses() {
  // Llamado al guardar el día — comprueba si la invitada lleva 7 días activos
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  // Ver si esta usuaria fue referida y el bonus no se ha dado aún
  const { data: referral } = await supabase
    .from("referrals")
    .select("id, inviter_id, bonus_given, invitee_active_days")
    .eq("invitee_id", user.id)
    .single();

  if (!referral || referral.bonus_given) return;

  // Contar días activos de esta usuaria
  const { count } = await supabase
    .from("daily_logs")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  const activeDays = count ?? 0;

  // Actualizar contador
  await supabase.from("referrals").update({ invitee_active_days: activeDays }).eq("id", referral.id);

  // Si llega a 7 días, dar bonus a quien invitó
  if (activeDays >= 7) {
    const { data: inviter } = await supabase
      .from("profiles")
      .select("xp")
      .eq("id", referral.inviter_id)
      .single();

    await supabase.from("profiles").update({
      xp: (inviter?.xp ?? 0) + 75,
    }).eq("id", referral.inviter_id);

    await supabase.from("referrals").update({ bonus_given: true }).eq("id", referral.id);
  }
}
