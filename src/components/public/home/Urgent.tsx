import Link from "next/link";
import Icon from "@/components/public/icons/Icon";
import type { ISiteContent } from "@/types";
import { renderAccent } from "@/lib/render-accent";
import { sanitize } from "@/lib/sanitize";

export default function Urgent({
  data,
  contactEmail,
}: {
  data: ISiteContent["urgent"];
  contactEmail: string;
}) {
  return (
    <section
      className="relative overflow-hidden px-5 md:px-16 py-14 md:py-[88px] border-y"
      style={{
        background: "linear-gradient(180deg, var(--color-bg) 0%, #08090d 100%)",
        borderColor: "var(--rule)",
      }}
    >
      {/* Decorative arch motif */}
      <div className="arch-motif" aria-hidden="true" />
      {/* Gold corner glow */}
      <div
        className="absolute -top-24 -right-24 w-[360px] h-[360px] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, var(--gold-glow) 0%, transparent 70%)",
        }}
      />
      <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-7 md:gap-14 items-center">
        <div>
          <div className="kicker mb-3.5 flex items-center gap-2">
            <Icon name="lightning" size={14} color="var(--color-gold)" />
            {data.kicker}
          </div>
          <div className="gold-rule-sm mb-5" aria-hidden="true" />
          <h2
            className="display-monument m-0 leading-[1.05] text-left"
            style={{ fontSize: "clamp(32px, 5vw, 48px)" }}
          >
            {renderAccent(data.heading)}
          </h2>
          <div
            className="prose prose-invert max-w-[540px] mt-5 text-base leading-[1.65]"
            style={{ color: "var(--color-body)" }}
            dangerouslySetInnerHTML={{ __html: sanitize(data.body) }}
          />
        </div>
        <div className="tablet-card flex flex-col gap-3.5 p-3.5">
          <Link
            href={`mailto:${contactEmail}`}
            className="flex justify-between items-center px-6 py-5 text-sm gap-3.5 font-bold uppercase tracking-[0.16em] no-underline transition-all"
            style={{ background: "var(--color-gold)", color: "#0a0d11" }}
          >
            <span className="flex items-center gap-3.5">
              <Icon name="phone" size={20} color="#0a0d11" />
              <span>
                <span className="block text-[10px] tracking-[0.2em]">
                  {data.emailKanal.label}
                </span>
                <span className="block text-base mt-0.5 font-extrabold tracking-[0.04em]">
                  {contactEmail}
                </span>
              </span>
            </span>
            <Icon name="chevron" size={14} color="#0a0d11" />
          </Link>
          <Link
            href={data.secondaryCta.href}
            className="flex justify-between items-center px-6 py-5 text-sm gap-3.5 font-semibold uppercase tracking-[0.16em] no-underline transition-all"
            style={{
              border: "1px solid var(--color-gold)",
              color: "var(--color-gold)",
            }}
          >
            <span className="flex items-center gap-3.5">
              <Icon name="user" size={20} color="var(--color-gold)" />
              <span>
                <span className="block text-[10px] tracking-[0.2em]">İLETİŞİM</span>
                <span className="block text-base mt-0.5 font-bold tracking-[0.04em]">
                  {data.secondaryCta.label}
                </span>
              </span>
            </span>
            <Icon name="chevron" size={14} color="var(--color-gold)" />
          </Link>
        </div>
      </div>
    </section>
  );
}
