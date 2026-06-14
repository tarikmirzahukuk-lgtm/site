export default function Loading() {
  return (
    <article aria-hidden="true">
      {/* Header */}
      <div className="max-w-content mx-auto px-6 pt-12">
        {/* breadcrumb */}
        <div className="skeleton skeleton-line mb-8" style={{ width: 220, height: 12 }} />

        <div className="flex flex-col items-center text-center mt-8">
          {/* kicker */}
          <div className="skeleton skeleton-line mb-5" style={{ width: 120, height: 11 }} />

          {/* title bars */}
          <div className="skeleton skeleton-line" style={{ width: "85%", height: 36 }} />
          <div className="skeleton skeleton-line mt-3" style={{ width: "62%", height: 36 }} />

          {/* excerpt */}
          <div className="skeleton skeleton-line mt-6" style={{ width: "70%", height: 14 }} />
          <div className="skeleton skeleton-line mt-2" style={{ width: "54%", height: 14 }} />

          {/* meta row */}
          <div className="flex items-center justify-center gap-3 mt-7">
            <div className="skeleton" style={{ width: 36, height: 36 }} />
            <div className="skeleton skeleton-line" style={{ width: 90, height: 12 }} />
            <div className="skeleton skeleton-line" style={{ width: 70, height: 12 }} />
          </div>

          <div className="gold-rule mx-auto mt-8" aria-hidden="true" />
        </div>
      </div>

      {/* Cover placeholder */}
      <div className="max-w-content-wide mx-auto px-6 my-8">
        <div className="skeleton w-full" style={{ height: 320 }} />
      </div>

      {/* Prose lines */}
      <div className="max-w-content-wide mx-auto px-6">
        <div className="max-w-content space-y-3">
          {[92, 98, 86, 95, 70, 90, 96, 80].map((w, i) => (
            <div
              key={i}
              className="skeleton skeleton-line"
              style={{ width: `${w}%` }}
            />
          ))}
        </div>
      </div>
    </article>
  );
}
