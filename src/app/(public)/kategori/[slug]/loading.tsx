import MakaleKartIskelet from "@/components/public/MakaleKartIskelet";

export default function Loading() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12" aria-hidden="true">
      {/* breadcrumb */}
      <div className="skeleton skeleton-line mb-8" style={{ width: 200, height: 12 }} />

      <div className="mb-10 flex flex-col items-center">
        {/* kicker */}
        <div className="skeleton skeleton-line mb-3" style={{ width: 90, height: 11 }} />
        {/* başlık */}
        <div className="skeleton skeleton-line" style={{ width: "min(380px, 75%)", height: 40 }} />
        <div className="gold-rule mx-auto mt-5" aria-hidden="true" />
        {/* açıklama */}
        <div className="skeleton skeleton-line mt-5" style={{ width: "min(480px, 85%)", height: 14 }} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <MakaleKartIskelet key={i} />
        ))}
      </div>
    </div>
  );
}
