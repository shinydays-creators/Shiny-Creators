import ShinyTitle from "@/components/ShinyTitle";
import BottomNav from "@/components/BottomNav";

export default function HomeLoading() {
  return (
    <main className="min-h-screen bg-glow-gradient flex flex-col overflow-hidden pb-24">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-glow-gold/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-glow-pink/25 blur-3xl" />
      </div>

      <header className="relative z-10 flex items-center justify-between px-6 pt-12 pb-2">
        <ShinyTitle className="text-2xl" />
      </header>

      <div className="relative z-10 flex-1 px-6 pb-10 max-w-sm mx-auto w-full">
        {/* Saludo skeleton */}
        <div className="text-center pt-2 mb-5">
          <div className="h-8 w-48 bg-white/60 rounded-xl mx-auto animate-pulse" />
          <div className="h-4 w-32 bg-white/40 rounded-lg mx-auto mt-2 animate-pulse" />
        </div>

        {/* Banner skeleton */}
        <div className="h-16 bg-white/60 rounded-2xl animate-pulse mb-5" />

        {/* XP card skeleton */}
        <div className="bg-white rounded-2xl shadow-soft p-4 mb-5 animate-pulse">
          <div className="flex justify-between mb-3">
            <div className="h-4 w-32 bg-glow-cream rounded-lg" />
            <div className="h-4 w-16 bg-glow-cream rounded-lg" />
          </div>
          <div className="h-2 bg-glow-cream rounded-full" />
        </div>

        {/* 7 días skeleton */}
        <div className="bg-white rounded-2xl shadow-soft p-4 mb-5 animate-pulse">
          <div className="h-3 w-24 bg-glow-cream rounded mx-auto mb-3" />
          <div className="flex justify-around">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className="w-8 h-8 rounded-xl bg-glow-cream" />
                <div className="w-4 h-2 rounded bg-glow-cream" />
              </div>
            ))}
          </div>
        </div>

        {/* Actividades skeleton */}
        <div className="bg-white rounded-2xl shadow-soft p-4 animate-pulse">
          <div className="h-3 w-32 bg-glow-cream rounded mb-3" />
          <div className="grid grid-cols-2 gap-2">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-10 bg-glow-cream rounded-xl" />
            ))}
          </div>
        </div>
      </div>

      <BottomNav />
    </main>
  );
}
