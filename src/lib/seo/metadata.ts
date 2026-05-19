import type { Metadata } from "next";
import { SITE_CONFIG, SITE_URL } from "@/lib/site-config";

interface BuildMetadataOpts {
  title: string;
  description?: string;
  path: string; // /makale/foo  veya /  veya /kategori/bar
  image?: string; // absolute URL beklenir; yoksa default
  type?: "website" | "article";
  publishedTime?: string; // ISO
  modifiedTime?: string; // ISO
  authors?: string[];
  section?: string; // article section (kategori adı)
  tags?: string[];
  noIndex?: boolean;
}

export function buildMetadata(opts: BuildMetadataOpts): Metadata {
  const {
    title,
    description = SITE_CONFIG.description,
    path,
    image = SITE_CONFIG.defaultOgImage,
    type = "website",
    publishedTime,
    modifiedTime,
    authors,
    section,
    tags,
    noIndex = false,
  } = opts;

  const canonical = `${SITE_URL}${path}`;
  const ogImage = image.startsWith("http") ? image : `${SITE_URL}${image}`;

  return {
    title,
    description,
    alternates: { canonical },
    robots: noIndex
      ? { index: false, follow: true }
      : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_CONFIG.fullName,
      locale: SITE_CONFIG.locale,
      type,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      ...(type === "article" && publishedTime && { publishedTime }),
      ...(type === "article" && modifiedTime && { modifiedTime }),
      ...(type === "article" && authors && { authors }),
      ...(type === "article" && section && { section }),
      ...(type === "article" && tags && { tags }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}
