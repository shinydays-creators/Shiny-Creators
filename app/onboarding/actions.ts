"use server";

import { createClient } from "@/lib/supabase/server";

export async function saveOnboardingAction(data: Record<string, string>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "No hay sesión activa" };
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      onboarding_done:    true,
      platform:           data.platform        ?? null,
      platform_custom:    data.platform_custom  ?? null,
      current_followers:  data.followers        ?? null,
      can_edit:           data.editing          ?? null,
      biggest_challenge:  data.challenge        ?? null,
      goal_followers:     data.goal             ?? null,
      content_reason:     data.reason           ?? null,
      posting_frequency:  data.frequency        ?? null,
      time_available:     data.time             ?? null,
      niche:              data.niche            ?? null,
      niche_custom:       data.niche_custom      ?? null,
      goal_3months:       data.goal3m           ?? null,
    })
    .eq("id", user.id);

  if (error) {
    console.error("Error guardando onboarding:", error);
    return { error: error.message };
  }

  return { success: true };
}
