import Link from "next/link";
import Image from "next/image";
import { IKullanici } from "@/types";

export default function YazarKarti({ yazar }: { yazar: IKullanici }) {
  return (
    <div className="tablet-card p-6 md:p-7 mt-10 flex gap-5 items-start">
      <div
        className="w-16 h-16 flex-shrink-0 flex items-center justify-center overflow-hidden relative"
        style={{
          border: "1px solid var(--color-gold)",
          background: "var(--color-panel-hi)",
        }}
      >
        {yazar.avatar ? (
          <Image
            src={yazar.avatar}
            alt={yazar.name}
            fill
            sizes="64px"
            className="object-cover"
          />
        ) : (
          <span
            className="italic"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 28,
              color: "var(--color-gold)",
              fontWeight: 500,
            }}
          >
            {yazar.name.charAt(0)}
          </span>
        )}
      </div>
      <div className="flex-1">
        <p className="kicker mb-2">Yazar</p>
        <div className="gold-rule-sm mb-3" aria-hidden="true" />
        <h3
          className="text-lg font-semibold mb-2"
          style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}
        >
          {yazar.name}
        </h3>
        {yazar.bio && (
          <p className="text-sm leading-relaxed" style={{ color: "var(--color-body)" }}>
            {yazar.bio}
          </p>
        )}
        {yazar.slug && (
          <Link
            href={`/yazar/${yazar.slug}`}
            className="inline-block mt-3 text-xs uppercase tracking-[0.14em] font-semibold transition-colors hover:text-[var(--color-gold)]"
            style={{ color: "var(--color-gold)" }}
          >
            Yazarın diğer makaleleri →
          </Link>
        )}
      </div>
    </div>
  );
}
