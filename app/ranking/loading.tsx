export default function RankingLoading() {
  return (
    <main className="min-h-screen bg-glow-gradient pb-24">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-glow-gold/15 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-glow-pink/20 blur-3xl" />
      </div>

      <header className="relative z-10 px-6 pt-12 pb-4">
        <div className="h-7 w-40 bg-glow-cream rounded-full animate-pulse mb-3" />
        <div className="h-8 w-44 bg-glow-cream rounded-xl animate-pulse" />
        <div className="h-4 w-56 bg-glow-cream rounded-full animate-pulse mt-2" />
      </header>

      <div className="relative z-10 max-w-sm mx-auto px-6">
        {/* Mi posición */}
        <div className="h-14 bg-glow-gold/10 rounded-2xl animate-pulse mb-5" />

        {/* Podio */}
        <div className="flex items-end justify-center gap-3 mb-6">
          <div className="flex-1 flex flex-col items-center gap-1">
            <div className="w-14 h-14 rounded-full bg-glow-cream animate-pulse" />
            <div className="w-full h-12 bg-glow-pink/20 rounded-t-xl animate-pulse mt-2" />
          </div>
          <div className="flex-1 flex flex-col items-center gap-1">
            <div className="w-16 h-16 rounded-full bg-glow-cream animate-pulse" />
            <div className="w-full h-16 bg-glow-gold/20 rounded-t-xl animate-pulse mt-2" />
          </div>
          <div className="flex-1 flex flex-col items-center gap-1">
            <div className="w-14 h-14 rounded-full bg-glow-cream animate-pulse" />
            <div className="w-full h-8 bg-glow-cream rounded-t-xl animate-pulse mt-2" />
          </div>
        </div>

        {/* Lista */}
        <div className="flex flex-col gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-white rounded-2xl shadow-soft px-4 py-3 flex items-center gap-3 animate-pulse">
              <div className="w-6 h-4 bg-glow-cream rounded" />
              <div className="w-9 h-9 rounded-full bg-glow-cream" />
              <div className="flex-1">
                <div className="h-4 bg-glow-cream rounded-full w-24 mb-1" />
                <div className="h-3 bg-glow-cream rounded-full w-32" />
              </div>
              <div className="h-4 w-12 bg-glow-cream rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
