import Link from "next/link";

export default function BosDurum({
  baslik,
  aciklama,
  ctaLabel,
  ctaHref,
  onCta,
}: {
  baslik: string;
  aciklama?: string;
  ctaLabel?: string;
  ctaHref?: string;
  onCta?: () => void;
}) {
  return (
    <div
      className="relative mx-auto max-w-md overflow-hidden px-8 py-14 text-center"
      style={{
        background: "var(--color-panel)",
        border: "1px solid var(--rule-dim)",
        borderTop: "2px solid var(--color-gold)",
      }}
    >
      <span
        className="block leading-none"
        aria-hidden="true"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 44,
          color: "rgba(212, 175, 55, 0.5)",
        }}
      >
        §
      </span>

      <h2
        className="mt-4 text-xl"
        style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}
      >
        {baslik}
      </h2>

      <div className="gold-rule-sm mx-auto mt-4" aria-hidden="true" />

      {aciklama && (
        <p
          className="mx-auto mt-4 max-w-xs text-sm leading-relaxed"
          style={{ color: "var(--color-muted)" }}
        >
          {aciklama}
        </p>
      )}

      {ctaLabel && onCta && (
        <button
          type="button"
          onClick={onCta}
          className="btn-ghost mt-7"
          style={{ minHeight: 44 }}
        >
          {ctaLabel}
        </button>
      )}

      {ctaLabel && ctaHref && !onCta && (
        <Link href={ctaHref} className="btn-ghost mt-7" style={{ minHeight: 44 }}>
          {ctaLabel}
        </Link>
      )}
    </div>
  );
}
