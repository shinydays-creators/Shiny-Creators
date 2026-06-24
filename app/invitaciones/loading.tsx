export default function InvitacionesLoading() {
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

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl shadow-soft p-3 text-center animate-pulse">
              <div className="h-7 w-8 bg-glow-cream rounded mx-auto mb-1" />
              <div className="h-3 bg-glow-cream rounded-full w-12 mx-auto" />
            </div>
          ))}
        </div>

        {/* Código */}
        <div className="bg-white rounded-2xl shadow-soft p-4 mb-4 animate-pulse">
          <div className="h-4 w-36 bg-glow-cream rounded-full mb-3" />
          <div className="flex gap-3 mb-3">
            <div className="flex-1 h-14 bg-glow-cream rounded-xl" />
            <div className="w-16 h-14 bg-glow-cream rounded-xl" />
          </div>
          <div className="h-12 bg-glow-cream rounded-xl" />
        </div>
      </div>
    </main>
  );
}
