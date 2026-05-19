import { SITE_CONFIG, SITE_URL } from "@/lib/site-config";
import type { IMakale, IKullanici, IKategori } from "@/types";

type JsonLd = Record<string, unknown>;

/**
 * Organization (publisher) — root layout'a inject edilir.
 */
export function organizationJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_CONFIG.fullName,
    url: SITE_URL,
    logo: `${SITE_URL}/icon.png`,
  };
}

/**
 * Article — makale detay sayfası.
 */
export function articleJsonLd(makale: IMakale): JsonLd | null {
  const yazar =
    makale.author && typeof makale.author === "object"
      ? (makale.author as IKullanici)
      : null;
  const kategori =
    makale.category && typeof makale.category === "object"
      ? (makale.category as IKategori)
      : null;

  if (!yazar) return null;

  const ogImage = `${SITE_URL}/api/og?id=${makale._id}&v=${encodeURIComponent(
    makale.updatedAt
  )}`;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: makale.title,
    description: makale.excerpt,
    image: ogImage,
    datePublished: makale.createdAt,
    dateModified: makale.updatedAt,
    author: {
      "@type": "Person",
      name: yazar.name,
      url: yazar.slug ? `${SITE_URL}/yazar/${yazar.slug}` : undefined,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_CONFIG.fullName,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/icon.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/makale/${makale.slug}`,
    },
    articleSection: kategori?.name,
    keywords: makale.tags?.join(", "),
    timeRequired: `PT${makale.readingTime}M`,
    inLanguage: SITE_CONFIG.language,
  };
}

/**
 * BreadcrumbList — makale ve kategori sayfalarında.
 */
export function breadcrumbJsonLd(
  items: { name: string; url: string }[]
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Person — yazar detay sayfası + hakkımda sayfası.
 */
export function personJsonLd(yazar: IKullanici): JsonLd {
  const sameAs: string[] = [];
  if (yazar.socials?.linkedin) sameAs.push(yazar.socials.linkedin);
  if (yazar.socials?.twitter) sameAs.push(yazar.socials.twitter);
  if (yazar.socials?.orcid) sameAs.push(yazar.socials.orcid);
  if (yazar.socials?.website) sameAs.push(yazar.socials.website);

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: yazar.name,
    description: yazar.bio || undefined,
    image: yazar.avatar || undefined,
    url: yazar.slug ? `${SITE_URL}/yazar/${yazar.slug}` : SITE_URL,
    jobTitle: SITE_CONFIG.author.jobTitle,
    knowsAbout: SITE_CONFIG.author.knowsAbout,
    ...(sameAs.length > 0 && { sameAs }),
  };
}

/**
 * FAQPage — makale.faqs doluysa.
 */
export function faqJsonLd(
  faqs: { question: string; answer: string }[]
): JsonLd | null {
  if (!faqs || faqs.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}
