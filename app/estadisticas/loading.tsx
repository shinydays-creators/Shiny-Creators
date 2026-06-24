import BottomNav from "@/components/BottomNav";

export default function EstadisticasLoading() {
  return (
    <main className="min-h-screen bg-glow-gradient pb-24">
      <div className="max-w-sm mx-auto px-6 pt-12">
        <div className="h-8 w-48 bg-white/60 rounded-xl animate-pulse mb-6" />
        <div className="grid grid-cols-2 gap-3 mb-5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 bg-white rounded-2xl shadow-soft animate-pulse" />
          ))}
        </div>
        <div className="h-32 bg-white rounded-2xl shadow-soft animate-pulse mb-4" />
        <div className="h-40 bg-white rounded-2xl shadow-soft animate-pulse mb-4" />
        <div className="h-32 bg-white rounded-2xl shadow-soft animate-pulse" />
      </div>
      <BottomNav />
    </main>
  );
}
