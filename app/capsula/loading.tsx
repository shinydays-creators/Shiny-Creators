export default function CapsuleLoading() {
  return (
    <main className="min-h-screen bg-glow-gradient pb-24">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-glow-gold/15 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-glow-pink/20 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-sm mx-auto px-6 pt-12 pb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-6 h-6 bg-glow-cream rounded animate-pulse" />
          <div className="h-7 w-40 bg-glow-cream rounded-full animate-pulse" />
        </div>

        <div className="h-7 w-48 bg-glow-cream rounded-xl animate-pulse mb-2" />
        <div className="h-4 w-64 bg-glow-cream rounded-full animate-pulse mb-5" />

        <div className="bg-white rounded-3xl shadow-soft p-5 animate-pulse">
          <div className="h-5 w-40 bg-glow-cream rounded-full mb-4" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-11 bg-glow-cream rounded-xl mb-3" />
          ))}
          <div className="h-11 bg-glow-cream rounded-xl mb-4" />
          <div className="h-12 bg-glow-gold/20 rounded-xl" />
        </div>
      </div>
    </main>
  );
}
