import BottomNav from "@/components/BottomNav";

export default function PerfilLoading() {
  return (
    <main className="min-h-screen bg-glow-gradient pb-24">
      <div className="max-w-sm mx-auto px-6 pt-12">
        <div className="h-8 w-40 bg-white/60 rounded-xl animate-pulse mb-6" />
        <div className="bg-white rounded-2xl shadow-soft p-5 mb-4 animate-pulse">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-glow-cream" />
            <div className="flex-1">
              <div className="h-5 w-32 bg-glow-cream rounded mb-2" />
              <div className="h-3 w-24 bg-glow-cream rounded" />
            </div>
          </div>
        </div>
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-16 bg-white rounded-2xl shadow-soft animate-pulse mb-3" />
        ))}
      </div>
      <BottomNav />
    </main>
  );
}
