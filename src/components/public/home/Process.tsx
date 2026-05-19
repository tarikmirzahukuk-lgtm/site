import { STEPS } from "@/lib/site-data";

export default function Process() {
  return (
    <section
      id="surec"
      className="px-5 md:px-16 py-16 md:py-[110px] border-y"
      style={{ background: "var(--color-panel)", borderColor: "var(--rule)" }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 md:mb-16">
          <div className="kicker mb-3.5">Yaklaşım</div>
          <h2 className="display m-0" style={{ fontSize: "clamp(30px, 4.5vw, 46px)" }}>
            Nasıl <span className="italic-gold">çalışıyorum.</span>
          </h2>
          <p
            className="max-w-[540px] mx-auto mt-4 text-[15px] leading-[1.65]"
            style={{ color: "var(--color-muted)" }}
          >
            Net bir başlangıç, titiz bir okuma, dosyaya/konuya özel bir analiz.
            Süreç boyunca şeffaf düşünme.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 relative">
          {/* Horizontal connector line (desktop only) */}
          <div
            className="hidden md:block absolute top-8 left-[12%] right-[12%] h-px pointer-events-none"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, var(--rule) 12%, var(--rule) 88%, transparent 100%)",
            }}
          />
          {STEPS.map((s, i) => (
            <div
              key={i}
              className={`relative flex md:flex-col gap-5 md:gap-0 items-start md:items-center text-left md:text-center md:px-5 py-6 md:py-0 ${
                i > 0 ? "md:border-0 border-t md:border-t-0" : ""
              }`}
              style={i > 0 ? { borderColor: "var(--rule-dim)" } : {}}
            >
              <div
                className="w-16 h-16 flex items-center justify-center relative z-10 italic flex-shrink-0 md:mb-5"
                style={{
                  background: "var(--color-bg)",
                  border: "1px solid var(--color-gold)",
                  color: "var(--color-gold)",
                  fontFamily: "var(--font-display)",
                  fontSize: 24,
                  fontWeight: 500,
                }}
              >
                {s.number}
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
