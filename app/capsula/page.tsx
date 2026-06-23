import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import BottomNav from "@/components/BottomNav";
import CapsuleClient from "./CapsuleClient";

export default async function CapsulePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: capsules } = await supabase
    .from("monthly_capsules")
    .select("*")
    .eq("user_id", user.id)
    .order("month", { ascending: false });

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  return (
    <main className="min-h-screen bg-glow-gradient pb-24 overflow-hidden">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-glow-gold/15 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-glow-pink/20 blur-3xl" />
      </div>
      <CapsuleClient
        capsules={capsules ?? []}
        userName={profile?.full_name || user.email?.split("@")[0] || "creadora"}
      />
      <BottomNav />
    </main>
  );
}
