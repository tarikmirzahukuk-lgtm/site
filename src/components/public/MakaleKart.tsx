import Link from "next/link";
import Image from "next/image";
import { IMakale, IKategori } from "@/types";
import MakaleKartTilt from "@/components/public/MakaleKartTilt";

export default function MakaleKart({ makale }: { makale: IMakale }) {
  const kategori =
    makale.category && typeof makale.category === "object"
      ? (makale.category as IKategori)
      : null;

  return (
    <Link href={`/makale/${makale.slug}`} className="group block no-underline h-full">
      <MakaleKartTilt className="h-full">
      <article className="tablet-card relative overflow-hidden h-full flex flex-col">
        <span className="roman-watermark" aria-hidden="true">
          §
        </span>
        {makale.coverImage ? (
          <div className="h-44 overflow-hidden relative" style={{ background: "var(--color-panel-hi)" }}>
            <Image
              src={makale.coverImage}
              alt={makale.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover group-hover:scale-105 transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            />
          </div>
        ) : (
          <div className="h-44" style={{ background: "var(--color-panel-hi)" }} />
        )}
        <div className="p-6 flex-1 flex flex-col relative z-10">
          {kategori && <p className="kicker mb-2">{kategori.name}</p>}
          <h3
            className="text-lg font-semibold leading-snug mb-2 transition-colors group-hover:text-[var(--color-gold)]"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}
          >
            {makale.title}
          </h3>
          <p className="text-sm leading-relaxed line-clamp-2 mb-3" style={{ color: "var(--color-muted)" }}>
            {makale.excerpt}
          </p>
          <p className="text-xs mt-auto" style={{ color: "var(--color-muted-dim)" }}>
            {makale.readingTime} dk okuma
          </p>
        </div>
      </article>
      </MakaleKartTilt>
    </Link>
  );
}
