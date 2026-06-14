import type { ISiteContent } from "@/types";
import { renderAccent } from "@/lib/render-accent";
import { toRoman } from "@/lib/utils";

export default function Process({ data }: { data: ISiteContent["process"] }) {
  return (
    <section
      id="surec"
      className="px-5 md:px-16 py-16 md:py-[110px] border-y"
      style={{ background: "var(--color-panel)", borderColor: "var(--rule)" }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 md:mb-16">
          {data.kicker && (
            <div className="kicker mb-3.5 stagger-item" style={{ ["--i" as string]: 0 }}>
              {data.kicker}
            </div>
          )}
          <h2
            className="display-monument m-0 mx-auto stagger-item"
            style={{ fontSize: "clamp(30px, 4.5vw, 46px)", ["--i" as string]: 0 }}
          >
            {renderAccent(data.heading)}
          </h2>
          <div
            className="gold-rule-sm mx-auto mt-6 rule-draw-center"
            style={{ ["--i" as string]: 1 }}
            aria-hidden="true"
          />
          {data.intro && (
            <p
              className="max-w-[540px] mx-auto mt-6 text-[15px] leading-[1.65] stagger-item"
              style={{ color: "var(--color-muted)", ["--i" as string]: 1 }}
            >
              {data.intro}
            </p>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 relative">
          {/* Horizontal connector line (desktop only) — soldan çizilerek akar */}
          <div
            className="hidden md:block absolute top-8 left-[12%] right-[12%] h-px pointer-events-none connector-draw"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, var(--rule) 12%, var(--rule) 88%, transparent 100%)",
              ["--i" as string]: 1,
            }}
          />
          {data.items.map((s, i) => (
            <div
              key={i}
              className={`relative flex md:flex-col gap-5 md:gap-0 items-start md:items-center text-left md:text-center md:px-5 py-6 md:py-0 stagger-item ${
                i > 0 ? "md:border-0 border-t md:border-t-0" : ""
              }`}
              style={{
                ["--i" as string]: i + 1,
                ...(i > 0 ? { borderColor: "var(--rule-dim)" } : {}),
              }}
            >
              <div
                className="roman-index w-16 h-16 flex items-center justify-center relative z-10 italic flex-shrink-0 md:mb-5 node-set"
                style={{
                  background: "var(--color-bg)",
                  border: "1px solid var(--color-gold)",
                  fontSize: 24,
                  fontWeight: 500,
                  ["--i" as string]: i + 1,
                }}
              >
                {toRoman(i + 1)}
              </div>
              <div>
                <div
                  className="text-xl font-semibold mb-1.5"
                  style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}
                >
                  {s.title}
                </div>
                <p
                  className="text-[13.5px] leading-[1.6] m-0 max-w-[240px]"
                  style={{ color: "var(--color-muted)" }}
                >
                  {s.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
