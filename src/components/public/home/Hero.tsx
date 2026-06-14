import Link from "next/link";
import Icon from "@/components/public/icons/Icon";
import type { IconName } from "@/components/public/icons/Icon";
import type { ISiteContent } from "@/types";
import { renderAccent } from "@/lib/render-accent";

function ArchMotif() {
  return (
    <svg
      className="arch-motif"
      aria-hidden="true"
      viewBox="0 0 1440 760"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="hero-arch-stroke" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#D4AF37" stopOpacity="0.32" />
          <stop offset="1" stopColor="#D4AF37" stopOpacity="0.04" />
        </linearGradient>
        <linearGradient id="hero-arch-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#D4AF37" stopOpacity="0" />
          <stop offset="0.5" stopColor="#D4AF37" stopOpacity="0.05" />
          <stop offset="1" stopColor="#D4AF37" stopOpacity="0" />
        </linearGradient>
      </defs>

      <path
        d="M 420 760 L 420 320 A 300 300 0 0 1 1020 320 L 1020 760"
        fill="none"
        stroke="url(#hero-arch-stroke)"
        strokeWidth="1.5"
      />
      <path
        d="M 470 760 L 470 320 A 250 250 0 0 1 970 320 L 970 760"
        fill="url(#hero-arch-fill)"
        stroke="#D4AF37"
        strokeOpacity="0.08"
        strokeWidth="1"
      />

      {[300, 360, 1080, 1140].map((x, i) => (
        <rect key={i} x={x} y="200" width="2" height="560" fill="#D4AF37" opacity="0.06" />
      ))}

      <rect x="716" y="56" width="8" height="34" fill="#D4AF37" opacity="0.22" />

      <rect x="420" y="200" width="600" height="1" fill="#D4AF37" opacity="0.07" />
      <rect x="470" y="720" width="500" height="1" fill="#D4AF37" opacity="0.07" />
    </svg>
  );
}

export default function Hero({ data }: { data: ISiteContent["hero"] }) {
  return (
    <section className="relative overflow-hidden px-5 md:px-16 pt-16 pb-18 md:pt-[120px] md:pb-[110px]">
      <ArchMotif />
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <div className="kicker mb-5 md:mb-[22px] hero-enter hero-enter-1">
          {data.kicker}
        </div>
        <div className="gold-rule-sm mx-auto mb-6 md:mb-8 hero-enter hero-enter-1" aria-hidden="true" />
        <h1
          className="display-monument m-0 hero-enter hero-enter-2"
          style={{ fontSize: "clamp(44px, 7vw, 84px)" }}
        >
          {renderAccent(data.heading)}
        </h1>
        <p
          className="mt-6 md:mt-8 max-w-[640px] mx-auto leading-[1.65] font-normal hero-enter hero-enter-3"
          style={{ fontSize: "clamp(16px, 1.5vw, 19px)", color: "var(--color-body)" }}
        >
          {data.subtext}
        </p>
        <div className="mt-8 md:mt-11 flex flex-wrap justify-center gap-3.5 hero-enter hero-enter-4">
          <Link href={data.primaryCta.href} className="btn-primary">
            {data.primaryCta.label}
            <Icon name="chevron" size={14} color="#0a0d11" />
          </Link>
          <Link href={data.secondaryCta.href} className="btn-ghost">
            {data.secondaryCta.label}
          </Link>
        </div>

        {/* Reassurance row */}
        <div className="mt-9 md:mt-14 flex flex-wrap justify-center gap-5 md:gap-9 text-[12.5px] tracking-[0.04em] hero-enter hero-enter-4" style={{ color: "var(--color-muted)" }}>
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
