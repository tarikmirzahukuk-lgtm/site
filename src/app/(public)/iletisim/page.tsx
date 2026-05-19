import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "İletişim",
  description:
    "Tarık Mirza ile iletişim — soru, öneri ve iş birliği teklifleri için e-posta ve LinkedIn üzerinden ulaşın.",
  path: "/iletisim",
});

export default function IletisimPage() {
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
          <h3 className="kicker mb-2">
            E-posta
          </h3>
          <a
            href="mailto:tarik@example.com"
            className="transition-colors hover:underline"
            style={{ color: "var(--color-gold)" }}
          >
            tarik@example.com
          </a>
        </div>

        <div className="pcard p-6">
          <h3 className="kicker mb-2">
            LinkedIn
          </h3>
          <p style={{ color: "var(--color-body)" }}>linkedin.com/in/tarikmirza</p>
        </div>
      </div>
    </div>
  );
}
