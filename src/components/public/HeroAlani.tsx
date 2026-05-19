import Link from "next/link";
import Image from "next/image";
import { IMakale, IKategori } from "@/types";
import { formatDate } from "@/lib/utils";

export default function HeroAlani({ makale }: { makale: IMakale }) {
  const kategori =
    makale.category && typeof makale.category === "object"
      ? (makale.category as IKategori)
      : null;

  return (
    <section className="border-b" style={{ borderColor: "var(--rule)" }}>
      <div className="max-w-7xl mx-auto px-5 md:px-10 py-10 md:py-12">
        <p className="kicker mb-4">Öne Çıkan</p>
        <Link href={`/makale/${makale.slug}`} className="group block no-underline">
          <div className="flex flex-col md:flex-row gap-7 md:gap-10 items-start">
            <div className="flex-1">
              <h2
                className="text-2xl md:text-3xl font-extrabold leading-tight group-hover:text-[var(--color-gold)] transition-colors"
                style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}
              >
                {makale.title}
              </h2>
              <p className="mt-4 leading-relaxed" style={{ color: "var(--color-body)" }}>
                {makale.excerpt}
              </p>
              <div className="flex items-center gap-3 mt-4 text-sm" style={{ color: "var(--color-muted)" }}>
                <span>{formatDate(makale.createdAt)}</span>
                <span>·</span>
                <span>{makale.readingTime} dk okuma</span>
                {kategori && (
                  <>
                    <span>·</span>
                    <span className="font-medium" style={{ color: "var(--color-gold)" }}>
                      {kategori.name}
                    </span>
                  </>
                )}
              </div>
            </div>
            {makale.coverImage && (
              <div
                className="w-full md:w-64 h-44 flex-shrink-0 overflow-hidden relative"
                style={{ background: "var(--color-panel-hi)" }}
              >
                <Image
                  src={makale.coverImage}
                  alt={makale.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 256px"
                  className="object-cover"
                  priority
                />
              </div>
            )}
          </div>
        </Link>
      </div>
    </section>
  );
}
