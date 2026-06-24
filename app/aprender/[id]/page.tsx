import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import BottomNav from "@/components/BottomNav";
import ShinyTitle from "@/components/ShinyTitle";
import Link from "next/link";

function formatBody(text: string) {
  return text.split("\n\n").map((paragraph, i) => {
    const parts = paragraph.split(/\*\*(.*?)\*\*/g);
    return (
      <p key={i} className="font-inter text-base text-glow-text leading-relaxed mb-4">
        {parts.map((part, j) =>
          j % 2 === 1
            ? <strong key={j} className="font-semibold text-glow-text">{part}</strong>
            : part
        )}
      </p>
    );
  });
}

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: item } = await supabase
    .from("content_library")
    .select("*")
    .eq("id", id)
    .single();

  if (!item) notFound();
  if (item.is_premium) redirect("/aprender");

  return (
    <main className="min-h-screen bg-glow-gradient pb-24 overflow-hidden">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-glow-gold/15 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-glow-pink/20 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-sm mx-auto px-6 pt-12 pb-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link href="/aprender" className="text-glow-text-muted text-lg">←</Link>
          <ShinyTitle className="text-2xl" />
        </div>

        {/* Artículo */}
        <div className="bg-white rounded-3xl shadow-soft p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-3xl">{item.emoji}</span>
            <span className="font-inter text-xs text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded-full">
              ✓ Gratis
            </span>
            <span className="font-inter text-xs text-glow-text-muted capitalize bg-glow-cream px-2 py-0.5 rounded-full">
              {item.category}
            </span>
          </div>

          <h1 className="font-poppins text-xl font-bold text-glow-text leading-snug mb-4">
            {item.title}
          </h1>

          <div className="border-t border-glow-cream pt-4">
            {item.body
              ? formatBody(item.body)
              : <p className="font-inter text-base text-glow-text-muted">{item.preview}</p>
            }
          </div>
        </div>

        <Link
          href="/aprender"
          className="mt-5 flex items-center justify-center gap-2 w-full border-2 border-glow-gold/40 text-glow-text font-poppins text-sm font-bold py-3 rounded-2xl"
        >
          ← Volver a Aprender
        </Link>
      </div>

      <BottomNav />
    </main>
  );
}
