"use client";

const ONERILER = [
  "ceza muhakemesi",
  "tutuklama",
  "uzlaştırma",
  "beraat",
  "istinaf",
  "savunma",
];

export default function AramaOnerileri({
  onSec,
}: {
  onSec: (kelime: string) => void;
}) {
  return (
    <div className="mt-8 text-center">
      <h2
        className="text-base mb-4"
        style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}
      >
        Ne aramak istersiniz?
      </h2>
      <div className="gold-rule-sm mx-auto mb-6" aria-hidden="true" />
      <div className="flex flex-wrap justify-center gap-2">
        {ONERILER.map((kelime) => (
          <button
            key={kelime}
            type="button"
            onClick={() => onSec(kelime)}
            className="pill"
          >
            {kelime}
          </button>
        ))}
      </div>
    </div>
  );
}
