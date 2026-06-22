"use server";

import { createClient } from "@/lib/supabase/server";

export async function addVictory(data: {
  title: string;
  description?: string;
  note?: string;
  category: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "No hay sesión" };

  const { error } = await supabase.from("victories").insert({
    user_id: user.id,
    title: data.title,
    description: data.description ?? null,
    note: data.note ?? null,
    category: data.category,
  });

  return error ? { error: error.message } : { success: true };
}

export async function deleteVictory(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "No hay sesión" };

  const { error } = await supabase
    .from("victories")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  return error ? { error: error.message } : { success: true };
}
