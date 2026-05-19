import { SITE_CONFIG } from "@/lib/site-config";

export default function About() {
  const year = SITE_CONFIG.professional.since;
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
          </div>
        </div>

        {/* Text */}
        <div>
          <div className="kicker mb-3.5">Hakkımda</div>
          <h2 className="display m-0 leading-[1.1]" style={{ fontSize: "clamp(30px, 4.5vw, 46px)" }}>
            {SITE_CONFIG.brand}<span className="italic-gold">.</span>
          </h2>
          <div className="mt-6 text-[15.5px] leading-[1.75]" style={{ color: "var(--color-body)" }}>
            <p className="mt-0">
              Hukuk fakültesi öğrencisi ve ceza hukuku alanında araştırmacı.
              {year}&apos;ten bu yana bu platformda düzenli olarak akademik
              makaleler, Yargıtay kararı değerlendirmeleri ve doktrin tartışmaları
              yayınlıyorum.
            </p>
            <p className="mt-4">
              İlgi alanlarım ağır ceza, bilişim ve ekonomik suçlar; CMK&apos;nın
              soruşturma ve kovuşturma evrelerine ilişkin güvenceleri; özel olarak
              da tutukluluk hukukunun uygulamadaki yansımaları.
            </p>
          </div>
          <div
            className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4 pt-7 border-t"
            style={{ borderColor: "var(--rule)" }}
          >
            <div>
              <div
                className="italic"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 32,
                  color: "var(--color-gold)",
                  fontWeight: 500,
                }}
              >
                {new Date().getFullYear() - year + 1}.
              </div>
              <div className="text-[12.5px] mt-1" style={{ color: "var(--color-muted)" }}>
                Yıl · sürekli yazım
              </div>
            </div>
            <div>
              <div
                className="italic"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 32,
                  color: "var(--color-gold)",
                  fontWeight: 500,
                }}
              >
                7+
              </div>
              <div className="text-[12.5px] mt-1" style={{ color: "var(--color-muted)" }}>
                Çalışma alanı
              </div>
            </div>
            <div>
              <div
                className="italic"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 32,
                  color: "var(--color-gold)",
                  fontWeight: 500,
                }}
              >
                100%
              </div>
              <div className="text-[12.5px] mt-1" style={{ color: "var(--color-muted)" }}>
                Bağımsız araştırma
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
