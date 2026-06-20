"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="font-inter text-xs text-glow-text-muted hover:text-glow-text transition-colors px-3 py-1.5 rounded-xl hover:bg-white/50"
    >
      Salir
    </button>
  );
}
