import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";
import { getSiteContent } from "@/lib/get-site-content";
import IletisimKarti from "@/components/public/IletisimKarti";
import Icon, { type IconName } from "@/components/public/icons/Icon";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "İletişim",
    description:
      "Tarık Mirza ile iletişim — soru, öneri ve iş birliği teklifleri için e-posta ve sosyal medya üzerinden ulaşın.",
    path: "/iletisim",
  });
}

const SOCIAL_LABELS: {
  key: "linkedin" | "twitter" | "orcid" | "website";
  label: string;
  icon: IconName;
}[] = [
  { key: "linkedin", label: "LinkedIn", icon: "linkedin" },
  { key: "twitter", label: "Twitter / X", icon: "twitter" },
  { key: "orcid", label: "ORCID", icon: "website" },
  { key: "website", label: "Web Sitesi", icon: "website" },
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
        <div className="gold-rule-sm mx-auto mt-6" aria-hidden="true" />
        <p
          className="mx-auto mt-6 max-w-xl text-base leading-relaxed"
          style={{ color: "var(--color-muted)" }}
        >
          Soru, öneri veya iş birliği teklifleri için aşağıdaki kanallardan
          bana ulaşabilirsiniz.
        </p>
      </header>

      <div className="max-w-2xl mx-auto space-y-5">
        <IletisimKarti
          label="E-posta"
          value={c.contact.email}
          href={`mailto:${c.contact.email}`}
          icon="mail"
          copyValue={c.contact.email}
        />

        {c.contact.phone && (
          <IletisimKarti
            label="Telefon"
            value={c.contact.phone}
            href={`tel:${c.contact.phoneRaw || c.contact.phone}`}
            icon="phone"
          />
        )}

        {(c.contact.address.line1 || c.contact.address.line2) && (
          <div className="tablet-card p-6 md:p-7">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 shrink-0" aria-hidden="true">
                <Icon name="pin" size={18} color="var(--color-gold)" />
              </span>
              <div className="min-w-0 flex-1">
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
            </div>
          </div>
        )}

        {SOCIAL_LABELS.filter((s) => c.socials?.[s.key]).map((s) => (
          <IletisimKarti
            key={s.key}
            label={s.label}
            value={c.socials[s.key]}
            href={c.socials[s.key]}
            icon={s.icon}
            external
          />
        ))}
      </div>
    </div>
  );
}
