"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function saveCapsuleGoals(month: string, goals: string[], intention: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No autenticada");

  await supabase.from("monthly_capsules").upsert({
    user_id: user.id,
    month,
    goals,
    intention,
  }, { onConflict: "user_id,month" });

  revalidatePath("/capsula");
}

export async function saveReflection(month: string, reflection: string, mood: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No autenticada");

  await supabase.from("monthly_capsules").update({
    reflection,
    mood_end: mood,
    reflected_at: new Date().toISOString(),
  }).eq("user_id", user.id).eq("month", month);

  revalidatePath("/capsula");
}
