/**
 * Tek kaynak: marka adı, URL, varsayılan SEO değerleri.
 * Tüm SEO katmanı ve premium tasarım bu dosyadan beslenir.
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
  brandShort: "T. Mirza",
  tagline: "Ceza Hukuku",
  fullName: "Tarık Mirza · Ceza Hukuku",
  description:
    "Ceza hukuku alanında titiz akademik çalışma; içtihat değerlendirmeleri ve hukuki analizler.",
  locale: "tr_TR",
  language: "tr",
  themeColor: "#D4AF37",
  backgroundColor: "#0B0F14",
  defaultOgImage: `${SITE_URL}/api/og`,

  // İletişim (placeholder — gerçek bilgi girilince güncellenir)
  contact: {
    phone: "+90 000 000 00 00",
    phoneShort: "0000",
    phoneRaw: "+900000000000",
    whatsapp: "https://wa.me/900000000000",
    email: "tarik@example.com",
    address: {
      line1: "Adres bilgisi",
      line2: "İstanbul",
      postalCode: "00000",
    },
  },

  // Avukatlık bilgileri (placeholder)
  professional: {
    barosicil: "TBD",
    since: 2024,
    experienceLabel: "Akademik çalışma",
  },

  author: {
    name: "Tarık Mirza",
    jobTitle: "Hukuk Öğrencisi · Araştırmacı",
    knowsAbout: ["Ceza Hukuku", "Türk Ceza Kanunu", "İçtihat Hukuku"],
  },
} as const;
