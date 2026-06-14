export default function MakaleKartIskelet() {
  return (
    <div className="tablet-card relative overflow-hidden h-full flex flex-col" aria-hidden="true">
      {/* görsel */}
      <div className="skeleton h-44" />
      <div className="p-6 flex-1 flex flex-col">
        {/* kcategory kicker */}
        <div className="skeleton skeleton-line mb-3" style={{ width: 100, height: 11 }} />
        {/* başlık */}
        <div className="skeleton skeleton-line" style={{ width: "90%", height: 18 }} />
        <div className="skeleton skeleton-line mt-2" style={{ width: "60%", height: 18 }} />
        {/* özet */}
        <div className="skeleton skeleton-line mt-4" style={{ width: "100%" }} />
        <div className="skeleton skeleton-line mt-2" style={{ width: "75%" }} />
        {/* okuma süresi */}
        <div className="mt-auto pt-4">
          <div className="skeleton skeleton-line" style={{ width: 80, height: 11 }} />
        </div>
      </div>
    </div>
  );
}
