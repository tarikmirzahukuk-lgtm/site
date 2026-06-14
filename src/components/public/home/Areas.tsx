import Icon from "@/components/public/icons/Icon";
import type { IconName } from "@/components/public/icons/Icon";
import type { ISiteContent } from "@/types";
import { renderAccent } from "@/lib/render-accent";
import { toRoman } from "@/lib/utils";

export default function Areas({ data }: { data: ISiteContent["areas"] }) {
  return (
    <section id="uzmanlik" className="px-5 md:px-16 py-16 md:py-[110px]">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-baseline justify-between flex-wrap gap-4 mb-9 md:mb-12">
          <div>
            {data.kicker && (
              <div className="kicker mb-3.5 stagger-item" style={{ ["--i" as string]: 0 }}>
                {data.kicker}
              </div>
            )}
            <h2
              className="display m-0 stagger-item"
              style={{ fontSize: "clamp(30px, 4.5vw, 46px)", ["--i" as string]: 0 }}
            >
              {renderAccent(data.heading)}
            </h2>
          </div>
          {data.intro && (
            <p
              className="hidden md:block text-sm max-w-[360px] m-0 leading-[1.65] stagger-item"
              style={{ color: "var(--color-muted)", ["--i" as string]: 1 }}
            >
              {data.intro}
            </p>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 md:gap-[18px]">
          {data.items.map((a, i) => (
            <article
              key={i}
              className={`tablet-card p-6 md:p-[30px] flex flex-col min-h-[180px] md:min-h-[220px] stagger-item ${
                i === 6 ? "md:col-start-2" : ""
              }`}
              style={{ ["--i" as string]: i + 1 }}
            >
              <div className="flex items-center justify-between mb-5">
                <div
                  className="w-11 h-11 flex items-center justify-center"
                  style={{ border: "1px solid var(--rule)" }}
                >
                  <Icon name={a.icon as IconName} size={20} color="var(--color-gold)" />
                </div>
                <span className="roman-index engrave-in" style={{ ["--i" as string]: i + 1 }}>
                  {toRoman(i + 1)}
                </span>
              </div>
              <div
                className="text-[22px] font-semibold mb-2"
                style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}
              >
                {a.title}
              </div>
              <p className="text-[13.5px] leading-[1.6] m-0 flex-1" style={{ color: "var(--color-muted)" }}>
                {a.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
