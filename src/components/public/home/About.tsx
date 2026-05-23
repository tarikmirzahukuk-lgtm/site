import Image from "next/image";
import type { ISiteContent } from "@/types";
import { renderAccent } from "@/lib/render-accent";

export default function About({ data }: { data: ISiteContent["about"] }) {
  return (
    <section className="px-5 md:px-16 py-16 md:py-[110px]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[1fr_1.4fr] gap-9 md:gap-[72px] items-center">
        {/* Portrait plaque */}
        <div className="relative">
          <div
            className="aspect-[4/5] relative overflow-hidden flex items-center justify-center"
            style={{ background: "var(--color-panel-hi)", border: "1px solid var(--rule)" }}
          >
            {/* Texture overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(0deg, transparent 0 2px, rgba(212,175,55,0.02) 2px 3px)",
              }}
            />
            {/* Corner ornaments */}
            <span className="absolute top-3.5 left-3.5 w-7 h-7" style={{ borderTop: "1px solid var(--color-gold)", borderLeft: "1px solid var(--color-gold)" }} />
            <span className="absolute top-3.5 right-3.5 w-7 h-7" style={{ borderTop: "1px solid var(--color-gold)", borderRight: "1px solid var(--color-gold)" }} />
            <span className="absolute bottom-3.5 left-3.5 w-7 h-7" style={{ borderBottom: "1px solid var(--color-gold)", borderLeft: "1px solid var(--color-gold)" }} />
            <span className="absolute bottom-3.5 right-3.5 w-7 h-7" style={{ borderBottom: "1px solid var(--color-gold)", borderRight: "1px solid var(--color-gold)" }} />

            {data.portraitImage ? (
              <Image
                src={data.portraitImage}
                alt="Portre"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
            ) : (
              <div className="text-center relative">
                <div className="kicker mb-3.5" style={{ color: "var(--color-muted)" }}>
                  Portre
                </div>
                <div
                  className="italic leading-[0.9]"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 140,
                    color: "var(--color-gold)",
                    fontWeight: 500,
                    letterSpacing: "-0.04em",
                  }}
                >
                  TM
                </div>
                <div className="kicker mt-3.5" style={{ color: "var(--color-muted-dim)", fontWeight: 500 }}>
                  MMXXIV
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Text */}
        <div>
          {data.kicker && <div className="kicker mb-3.5">{data.kicker}</div>}
          <h2 className="display m-0 leading-[1.1]" style={{ fontSize: "clamp(30px, 4.5vw, 46px)" }}>
            {renderAccent(data.heading)}
          </h2>
          <div
            className="prose prose-invert max-w-none mt-6 text-[15.5px] leading-[1.75]"
            style={{ color: "var(--color-body)" }}
            dangerouslySetInnerHTML={{ __html: data.body }}
          />
          {data.stats.length > 0 && (
            <div
              className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4 pt-7 border-t"
              style={{ borderColor: "var(--rule)" }}
            >
              {data.stats.map((s, i) => (
                <div key={i}>
                  <div
                    className="italic"
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 32,
                      color: "var(--color-gold)",
                      fontWeight: 500,
                    }}
                  >
                    {s.value}
                  </div>
                  <div className="text-[12.5px] mt-1" style={{ color: "var(--color-muted)" }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
