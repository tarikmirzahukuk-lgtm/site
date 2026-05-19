import Link from "next/link";
import Icon from "@/components/public/icons/Icon";
import { SITE_CONFIG } from "@/lib/site-config";

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

export default function Hero() {
  const year = SITE_CONFIG.professional.since;
  return (
    <section className="relative overflow-hidden px-5 md:px-16 pt-16 pb-18 md:pt-[120px] md:pb-[110px]">
      <ColumnBg />
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="kicker mb-5 md:mb-[22px]">
          İstanbul · {year}&apos;ten beri
        </div>
        <h1 className="display max-w-[920px] m-0" style={{ fontSize: "clamp(40px, 6vw, 78px)" }}>
          Ceza Hukukunda{" "}
          <span className="italic-gold">titiz ve içtihat odaklı</span> analiz.
        </h1>
        <p
          className="mt-6 md:mt-8 max-w-[640px] leading-[1.65] font-normal"
          style={{ fontSize: "clamp(16px, 1.5vw, 19px)", color: "var(--color-body)" }}
        >
          Türk ceza hukukunun genel ve özel hükümlerine ilişkin akademik makaleler,
          Yargıtay içtihatlarının değerlendirilmesi ve güncel hukuki tartışmalar.
          Bilgiyi paylaşarak öğrenmek, tartışarak derinleşmek.
        </p>
        <div className="mt-8 md:mt-11 flex flex-wrap gap-3.5">
          <Link href="/#uzmanlik" className="btn-primary">
            İlgi Alanları
            <Icon name="chevron" size={14} color="#0a0d11" />
          </Link>
          <Link href="/hakkimda" className="btn-ghost">
            Hakkımda
          </Link>
        </div>

        {/* Reassurance row */}
        <div className="mt-9 md:mt-14 flex flex-wrap gap-5 md:gap-9 text-[12.5px] tracking-[0.04em]" style={{ color: "var(--color-muted)" }}>
          <span className="flex items-center gap-2">
            <Icon name="shield" size={16} color="var(--color-gold)" />
            Akademik referans
          </span>
          <span className="flex items-center gap-2">
            <Icon name="strategy" size={16} color="var(--color-gold)" />
            Doktrin tartışmaları
          </span>
          <span className="flex items-center gap-2">
            <Icon name="user" size={16} color="var(--color-gold)" />
            Düzenli yayın
          </span>
        </div>
      </div>
    </section>
  );
}
