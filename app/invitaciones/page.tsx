import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import BottomNav from "@/components/BottomNav";
import InvitacionesClient from "./InvitacionesClient";

export default async function InvitacionesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, referral_code, referred_by, xp")
    .eq("id", user.id)
    .single();

  // Generar código si no tiene
  let code = profile?.referral_code;
  if (!code) {
    code = Math.random().toString(36).slice(2, 6).toUpperCase() + Math.random().toString(36).slice(2, 6).toUpperCase();
    await supabase.from("profiles").update({ referral_code: code }).eq("id", user.id);
  }

  const { data: referrals } = await supabase
    .from("referrals")
    .select("invitee_id, invitee_active_days, bonus_given, created_at")
    .eq("inviter_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-glow-gradient pb-24 overflow-hidden">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-glow-gold/15 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-glow-pink/20 blur-3xl" />
      </div>
      <InvitacionesClient
        referralCode={code ?? ""}
        referrals={referrals ?? []}
        hasBeenReferred={!!profile?.referred_by}
        userName={profile?.full_name || user.email?.split("@")[0] || "creadora"}
      />
      <BottomNav />
    </main>
  );
}
