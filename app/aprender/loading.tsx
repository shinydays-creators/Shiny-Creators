export default function AprenderLoading() {
  return (
    <main className="min-h-screen bg-glow-gradient pb-24">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-glow-gold/15 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-glow-pink/20 blur-3xl" />
      </div>

      <header className="relative z-10 px-6 pt-12 pb-2">
        <div className="h-7 w-40 bg-glow-cream rounded-full animate-pulse mb-3" />
        <div className="h-8 w-36 bg-glow-cream rounded-xl animate-pulse" />
        <div className="h-4 w-48 bg-glow-cream rounded-full animate-pulse mt-2" />
      </header>

      {/* Tabs skeleton */}
      <div className="px-6 py-4 flex gap-2 overflow-hidden">
        {[80, 72, 72, 88, 100].map((w, i) => (
          <div key={i} className="flex-shrink-0 h-8 rounded-full bg-glow-cream animate-pulse" style={{ width: w }} />
        ))}
      </div>

      {/* Cards skeleton */}
      <div className="px-6 flex flex-col gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-2xl shadow-soft p-4 flex items-center gap-4 animate-pulse">
            <div className="w-10 h-10 rounded-xl bg-glow-cream flex-shrink-0" />
            <div className="flex-1">
              <div className="h-4 bg-glow-cream rounded-full mb-2 w-3/4" />
              <div className="h-3 bg-glow-cream rounded-full w-full" />
              <div className="h-3 bg-glow-cream rounded-full w-2/3 mt-1" />
            </div>
            <div className="w-5 h-5 bg-glow-cream rounded-full flex-shrink-0" />
          </div>
        ))}
      </div>
    </main>
  );
}
