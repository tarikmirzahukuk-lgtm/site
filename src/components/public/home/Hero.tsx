import Link from "next/link";
import Icon from "@/components/public/icons/Icon";
import type { IconName } from "@/components/public/icons/Icon";
import type { ISiteContent } from "@/types";
import { renderAccent } from "@/lib/render-accent";

function ColumnBg() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 1440 720"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="vfade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#D4AF37" stopOpacity="0" />
          <stop offset="0.5" stopColor="#D4AF37" stopOpacity="0.07" />
          <stop offset="1" stopColor="#D4AF37" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0.55, 0.66, 0.77, 0.88].map((x, i) => (
        <rect key={i} x={`${x * 100}%`} y="0" width="1" height="100%" fill="url(#vfade)" />
      ))}
      {[0.58, 0.68, 0.79].map((x, i) => (
        <rect key={i} x={`${x * 100}%`} y="120" width="48" height="500" fill="#D4AF37" opacity="0.035" />
      ))}
      <rect x="55%" y="100" width="45%" height="2" fill="#D4AF37" opacity="0.11" />
      <rect x="55%" y="620" width="45%" height="2" fill="#D4AF37" opacity="0.11" />
    </svg>
  );
}

export default function Hero({ data }: { data: ISiteContent["hero"] }) {
  return (
    <section className="relative overflow-hidden px-5 md:px-16 pt-16 pb-18 md:pt-[120px] md:pb-[110px]">
      <ColumnBg />
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="kicker mb-5 md:mb-[22px] hero-enter hero-enter-1">
          {data.kicker}
        </div>
        <h1 className="display max-w-[920px] m-0 hero-enter hero-enter-2" style={{ fontSize: "clamp(40px, 6vw, 78px)" }}>
          {renderAccent(data.heading)}
        </h1>
        <p
          className="mt-6 md:mt-8 max-w-[640px] leading-[1.65] font-normal hero-enter hero-enter-3"
          style={{ fontSize: "clamp(16px, 1.5vw, 19px)", color: "var(--color-body)" }}
        >
          {data.subtext}
        </p>
        <div className="mt-8 md:mt-11 flex flex-wrap gap-3.5 hero-enter hero-enter-4">
          <Link href={data.primaryCta.href} className="btn-primary">
            {data.primaryCta.label}
            <Icon name="chevron" size={14} color="#0a0d11" />
          </Link>
          <Link href={data.secondaryCta.href} className="btn-ghost">
            {data.secondaryCta.label}
          </Link>
        </div>

        {/* Reassurance row */}
        <div className="mt-9 md:mt-14 flex flex-wrap gap-5 md:gap-9 text-[12.5px] tracking-[0.04em] hero-enter hero-enter-4" style={{ color: "var(--color-muted)" }}>
          {data.badges.map((b, i) => (
            <span key={i} className="flex items-center gap-2">
              <Icon name={b.icon as IconName} size={16} color="var(--color-gold)" />
              {b.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
