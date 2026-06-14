import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";
import { getSiteContent } from "@/lib/get-site-content";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "İletişim",
    description:
      "Tarık Mirza ile iletişim — soru, öneri ve iş birliği teklifleri için e-posta ve sosyal medya üzerinden ulaşın.",
    path: "/iletisim",
  });
}

const SOCIAL_LABELS: { key: "linkedin" | "twitter" | "orcid" | "website"; label: string }[] = [
  { key: "linkedin", label: "LinkedIn" },
  { key: "twitter", label: "Twitter / X" },
  { key: "orcid", label: "ORCID" },
  { key: "website", label: "Web Sitesi" },
];

export default async function IletisimPage() {
  const c = await getSiteContent();
  return (
    <div className="max-w-content mx-auto px-6 py-16 md:py-20">
      <header className="text-center mb-12 md:mb-16">
        <p className="kicker mb-4">İletişim</p>
        <h1
          className="display-monument"
          style={{ fontSize: "clamp(2.4rem, 6vw, 4rem)" }}
        >
          Bana <span className="italic-gold">ulaşın</span>
        </h1>
        <div className="gold-rule-sm mx-auto mt-6" />
        <p
          className="mx-auto mt-6 max-w-xl text-base leading-relaxed"
          style={{ color: "var(--color-muted)" }}
        >
          Soru, öneri veya iş birliği teklifleri için aşağıdaki kanallardan
          bana ulaşabilirsiniz.
        </p>
      </header>

      <div className="max-w-2xl mx-auto space-y-5">
        <div className="tablet-card p-6 md:p-7">
          <h3 className="kicker mb-2">E-posta</h3>
          <a
            href={`mailto:${c.contact.email}`}
            className="transition-colors hover:underline"
            style={{ color: "var(--color-gold)" }}
          >
            {c.contact.email}
          </a>
        </div>

        {c.contact.phone && (
          <div className="tablet-card p-6 md:p-7">
            <h3 className="kicker mb-2">Telefon</h3>
            <a
              href={`tel:${c.contact.phoneRaw || c.contact.phone}`}
              className="transition-colors hover:underline"
              style={{ color: "var(--color-gold)" }}
            >
              {c.contact.phone}
            </a>
          </div>
        )}

        {(c.contact.address.line1 || c.contact.address.line2) && (
          <div className="tablet-card p-6 md:p-7">
            <h3 className="kicker mb-2">Adres</h3>
            <p style={{ color: "var(--color-body)" }}>
              {c.contact.address.line1}
              {c.contact.address.line2 && (
                <>
                  <br />
                  {c.contact.address.line2}
                </>
              )}
            </p>
          </div>
        )}

        {SOCIAL_LABELS.filter((s) => c.socials?.[s.key]).map((s) => (
          <div key={s.key} className="tablet-card p-6 md:p-7">
            <h3 className="kicker mb-2">{s.label}</h3>
            <a
              href={c.socials[s.key]}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:underline break-all"
              style={{ color: "var(--color-gold)" }}
            >
              {c.socials[s.key]}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
