import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { SITE_CONFIG, SITE_URL } from "@/lib/site-config";
import JsonLdScript from "@/components/public/JsonLdScript";
import { organizationJsonLd } from "@/lib/seo/jsonld";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_CONFIG.brand} | ${SITE_CONFIG.tagline}`,
    template: `%s | ${SITE_CONFIG.brand}`,
  },
  description: SITE_CONFIG.description,
  applicationName: SITE_CONFIG.fullName,
  authors: [{ name: SITE_CONFIG.author.name, url: SITE_URL }],
  creator: SITE_CONFIG.author.name,
  publisher: SITE_CONFIG.fullName,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: SITE_CONFIG.themeColor,
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang={SITE_CONFIG.language} className={`${inter.variable} ${playfair.variable}`}>
      <body>
        <a href="#main-content" className="skip-link">
          İçeriğe atla
        </a>
        <JsonLdScript data={organizationJsonLd()} />
        {children}
      </body>
    </html>
  );
}
