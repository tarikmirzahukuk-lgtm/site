/**
 * Tek kaynak: marka adı, URL, varsayılan SEO değerleri.
 * Tüm SEO katmanı bu dosyadan beslenir.
 */

const SITE_URL_RAW = process.env.NEXT_PUBLIC_SITE_URL;

if (!SITE_URL_RAW) {
  throw new Error(
    "NEXT_PUBLIC_SITE_URL env var tanımlı değil. .env.local'e ekleyin."
  );
}

// Trailing slash'ı normalize et
export const SITE_URL = SITE_URL_RAW.replace(/\/$/, "");

export const SITE_CONFIG = {
  url: SITE_URL,
  brand: "Tarık Mirza",
  tagline: "Ceza Hukuku Notları",
  fullName: "Tarık Mirza · Ceza Hukuku Notları",
  description:
    "Ceza hukuku alanında akademik makaleler, içtihat değerlendirmeleri ve güncel hukuki analizler.",
  locale: "tr_TR",
  language: "tr",
  themeColor: "#1a56db",
  backgroundColor: "#ffffff",
  defaultOgImage: `${SITE_URL}/api/og`,
  author: {
    name: "Tarık Mirza",
    jobTitle: "Hukuk Öğrencisi",
    knowsAbout: ["Ceza Hukuku", "Türk Ceza Kanunu", "İçtihat Hukuku"],
  },
} as const;
