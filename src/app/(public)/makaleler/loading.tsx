import MakaleKartIskelet from "@/components/public/MakaleKartIskelet";

export default function Loading() {
  return (
    <section
      className="max-w-7xl mx-auto px-5 md:px-16 py-16 md:py-24"
      aria-hidden="true"
    >
      <div className="flex flex-col items-center">
        {/* kicker */}
        <div className="skeleton skeleton-line mb-3.5" style={{ width: 90, height: 11 }} />
        {/* başlık */}
        <div className="skeleton skeleton-line mb-5" style={{ width: "min(440px, 80%)", height: 48 }} />
        <div className="gold-rule mx-auto mb-8" aria-hidden="true" />
        {/* açıklama */}
        <div className="skeleton skeleton-line" style={{ width: "min(560px, 90%)", height: 14 }} />
        <div className="skeleton skeleton-line mt-2 mb-10 md:mb-14" style={{ width: "min(400px, 70%)", height: 14 }} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <MakaleKartIskelet key={i} />
        ))}
      </div>
    </section>
  );
}
