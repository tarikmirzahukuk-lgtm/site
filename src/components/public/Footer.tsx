import Link from "next/link";
import Icon from "@/components/public/icons/Icon";
import type { INavLink, ISiteContent } from "@/types";

export default function Footer({
  nav,
  brand,
  description,
  contact,
}: {
  nav: INavLink[];
  brand: string;
  description: string;
  contact: ISiteContent["contact"];
}) {
  return (
    <footer className="border-t" style={{ background: "#080a0e", borderColor: "var(--rule)" }}>
      <div className="max-w-7xl mx-auto px-5 md:px-10 py-12 md:py-[72px]">
        <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr_1fr] gap-9 md:gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3">
              <span
                className="w-[38px] h-[38px] flex items-center justify-center text-[22px] font-medium italic"
                style={{
                  border: "1px solid var(--color-gold)",
                  color: "var(--color-gold)",
                  fontFamily: "var(--font-display)",
                }}
              >
                T
              </span>
              <div>
                <div className="text-[17px] font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}>
                  {brand}
                </div>
                <div className="text-[10.5px] mt-0.5 uppercase tracking-[0.22em]" style={{ color: "var(--color-muted)" }}>
                  Ceza Hukuku Araştırmaları
                </div>
              </div>
            </div>
            <p className="mt-5 text-[13.5px] max-w-sm leading-[1.7]" style={{ color: "var(--color-muted)" }}>
              {description}
            </p>
            <div className="mt-5 flex gap-2.5">
              {[
                { t: "Lk", href: "#" },
                { t: "In", href: "#" },
                { t: "X", href: "#" },
              ].map((s) => (
                <a
                  key={s.t}
                  href={s.href}
                  className="icon-btn"
                >
                  {s.t}
                </a>
              ))}
            </div>
          </div>

          {/* Menu */}
          <div>
            <div className="kicker mb-[18px]">Menü</div>
            <ul className="space-y-1.5 text-[13.5px]" style={{ color: "var(--color-ink)" }}>
              {nav.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="plink">
                    {n.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/rss.xml" className="plink">
                  RSS
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <div className="kicker mb-[18px]">İletişim</div>
            <ul className="space-y-2.5 text-[13.5px] leading-[1.8]" style={{ color: "var(--color-body)" }}>
              <li className="flex gap-2.5">
                <Icon name="pillar" size={16} color="var(--color-gold)" />
                <span>
                  {contact.address.line1}
                  <br />
                  {contact.address.line2}
                </span>
              </li>
              <li className="flex gap-2.5">
                <Icon name="phone" size={16} color="var(--color-gold)" />
                {contact.phone}
              </li>
              <li className="flex gap-2.5">
                <span className="w-4 text-center" style={{ color: "var(--color-gold)" }}>
                  @
                </span>
                {contact.email}
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <div className="kicker mb-[18px]">Hukuki</div>
            <ul className="space-y-1.5 text-[13.5px]" style={{ color: "var(--color-muted)" }}>
              <li>
                <Link href="#" className="plink" style={{ color: "var(--color-muted)" }}>
                  KVKK Aydınlatma
                </Link>
              </li>
              <li>
                <Link href="#" className="plink" style={{ color: "var(--color-muted)" }}>
                  Gizlilik Politikası
                </Link>
              </li>
              <li>
                <Link href="#" className="plink" style={{ color: "var(--color-muted)" }}>
                  Çerez Politikası
                </Link>
              </li>
              <li>
                <Link href="#" className="plink" style={{ color: "var(--color-muted)" }}>
                  Sorumluluk Reddi
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div
          className="mt-12 pt-6 border-t flex flex-col md:flex-row justify-between gap-3 text-[11.5px] tracking-[0.04em]"
          style={{ borderColor: "var(--rule-dim)", color: "var(--color-muted-dim)" }}
        >
          <span>© {new Date().getFullYear()} {brand} · Tüm hakları saklıdır.</span>
          <span>Akademik blog · Hukuki tavsiye değildir</span>
        </div>
      </div>
    </footer>
  );
}
