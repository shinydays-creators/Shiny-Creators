import BottomNav from "@/components/BottomNav";

export default function YoLoading() {
  return (
    <main className="min-h-screen bg-glow-gradient pb-24">
      <div className="max-w-sm mx-auto px-6 pt-12">
        <div className="h-8 w-40 bg-white/60 rounded-xl animate-pulse mb-6" />
        <div className="h-28 bg-white rounded-2xl shadow-soft animate-pulse mb-4" />
        <div className="h-6 w-32 bg-white/60 rounded animate-pulse mb-3" />
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-16 bg-white rounded-2xl shadow-soft animate-pulse mb-3" />
        ))}
      </div>
      <BottomNav />
    </main>
  );
}
