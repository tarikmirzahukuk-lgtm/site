import MakaleKartIskelet from "@/components/public/MakaleKartIskelet";

export default function Loading() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12" aria-hidden="true">
      {/* breadcrumb */}
      <div className="skeleton skeleton-line mb-8" style={{ width: 200, height: 12 }} />

      {/* profil */}
      <div
        className="flex flex-col md:flex-row gap-8 items-start mb-12 pb-10 border-b"
        style={{ borderColor: "var(--rule-dim)" }}
      >
        <div className="skeleton w-32 h-32 flex-shrink-0" />
        <div className="flex-1 w-full">
          <div className="skeleton skeleton-line" style={{ width: "min(320px, 60%)", height: 40 }} />
          <div className="skeleton skeleton-line mt-5" style={{ width: "100%", height: 14 }} />
          <div className="skeleton skeleton-line mt-2" style={{ width: "80%", height: 14 }} />
          <div className="mt-5 flex gap-3">
            <div className="skeleton skeleton-line" style={{ width: 70, height: 14 }} />
            <div className="skeleton skeleton-line" style={{ width: 70, height: 14 }} />
          </div>
        </div>
      </div>

      {/* başlık */}
      <div className="mb-6">
        <div className="gold-rule-sm mb-3" aria-hidden="true" />
        <div className="skeleton skeleton-line" style={{ width: "min(420px, 80%)", height: 24 }} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <MakaleKartIskelet key={i} />
        ))}
      </div>
    </div>
  );
}
