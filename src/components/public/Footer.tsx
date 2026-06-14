import Link from "next/link";
import Icon from "@/components/public/icons/Icon";
import type { INavLink, ISiteContent } from "@/types";

export default function Footer({
  nav,
  brand,
  description,
  contact,
  socials,
}: {
  nav: INavLink[];
  brand: string;
  description: string;
  contact: ISiteContent["contact"];
  socials: ISiteContent["socials"];
}) {
  const socialLinks = (
    [
      { key: "linkedin", label: "LinkedIn", icon: "linkedin", href: socials.linkedin },
      { key: "twitter", label: "Twitter", icon: "twitter", href: socials.twitter },
      { key: "website", label: "Web sitesi", icon: "website", href: socials.website },
      { key: "orcid", label: "ORCID", icon: null, href: socials.orcid },
    ] as const
  ).filter((s) => Boolean(s.href));
  return (
    <footer className="border-t" style={{ background: "#080a0e", borderColor: "var(--rule)" }}>
      <div className="max-w-7xl mx-auto px-5 md:px-10 py-12 md:py-[72px]">
        <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr_1fr] gap-9 md:gap-12">
          {/* Brand */}
          <div>
            <div className="gold-rule-sm mb-5" aria-hidden="true" />
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
            {socialLinks.length > 0 && (
              <div className="mt-5 flex gap-2.5">
                {socialLinks.map((s) => (
                  <a
                    key={s.key}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${s.label}'da görüntüle`}
                    className="icon-btn"
                  >
                    {s.icon ? (
                      <Icon name={s.icon} size={17} />
                    ) : (
                      <span aria-hidden="true">ID</span>
                    )}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Menu */}
          <div>
            <div className="kicker mb-3">Menü</div>
            <div className="gold-rule-sm mb-[18px]" aria-hidden="true" />
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
            <div className="kicker mb-3">İletişim</div>
            <div className="gold-rule-sm mb-[18px]" aria-hidden="true" />
            <ul className="space-y-2.5 text-[13.5px] leading-[1.8]" style={{ color: "var(--color-body)" }}>
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
            <div className="kicker mb-3">Sorumluluk Reddi</div>
            <div className="gold-rule-sm mb-[18px]" aria-hidden="true" />
            <p
              className="text-[13.5px] leading-[1.8]"
              style={{ color: "var(--color-muted-dim)" }}
            >
              Bu sitedeki içerikler akademik bilgilendirme amaçlıdır ve hukuki
              tavsiye niteliği taşımaz.
            </p>
          </div>
        </div>

        <div className="gold-rule mx-auto mt-12" aria-hidden="true" />
        <div
          className="mt-6 flex flex-col md:flex-row justify-between gap-3 text-[11.5px] tracking-[0.04em]"
          style={{ color: "var(--color-muted-dim)" }}
        >
          <span>© {new Date().getFullYear()} {brand} · Tüm hakları saklıdır.</span>
          <span style={{ fontFamily: "var(--font-display)" }} className="italic">Akademik blog · Hukuki tavsiye değildir</span>
        </div>
      </div>
    </footer>
  );
}
