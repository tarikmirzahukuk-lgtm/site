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
    <div className="max-w-content mx-auto px-6 py-16">
      <h1
        className="display text-3xl md:text-4xl mb-4"
        style={{ fontWeight: 600 }}
      >
        İletişim
      </h1>
      <p className="mb-10" style={{ color: "var(--color-muted)" }}>
        Soru, öneri veya iş birliği teklifleri için aşağıdaki kanallardan
        bana ulaşabilirsiniz.
      </p>

      <div className="space-y-6">
        <div className="pcard p-6">
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
          <div className="pcard p-6">
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
          <div className="pcard p-6">
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
          <div key={s.key} className="pcard p-6">
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
