import Icon from "@/components/public/icons/Icon";
import type { IconName } from "@/components/public/icons/Icon";
import type { ISiteContent } from "@/types";
import { renderAccent } from "@/lib/render-accent";
import { toRoman } from "@/lib/utils";

export default function Trusts({ data }: { data: ISiteContent["trusts"] }) {
  return (
    <section
      className="px-5 md:px-16 py-14 md:py-[88px] border-y"
      style={{ background: "var(--color-panel)", borderColor: "var(--rule)" }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          {data.kicker && <div className="kicker mb-3.5">{data.kicker}</div>}
          <h2
            className="display-monument m-0 mx-auto max-w-[760px]"
            style={{ fontSize: "clamp(30px, 4vw, 44px)" }}
          >
            {renderAccent(data.heading)}
          </h2>
          <div className="gold-rule mx-auto mt-6" aria-hidden="true" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5 md:gap-5 mt-9 md:mt-14">
          {data.items.map((t, i) => (
            <div key={i} className="tablet-card p-6 md:p-7 relative">
              <span className="roman-watermark" aria-hidden="true">
                {toRoman(i + 1)}
              </span>
              <div
                className="w-12 h-12 flex items-center justify-center mb-5"
                style={{ border: "1px solid var(--rule)" }}
              >
                <Icon name={t.icon as IconName} size={22} color="var(--color-gold)" />
              </div>
              <div
                className="text-xl font-semibold mb-2.5"
                style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}
              >
                {t.title}
              </div>
              <p className="text-[13.5px] leading-[1.6] m-0" style={{ color: "var(--color-muted)" }}>
                {t.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
