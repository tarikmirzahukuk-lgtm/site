import dbConnect from "@/lib/db";
import Makale from "@/models/Makale";
import "@/models/Kullanici";
import "@/models/Kategori";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { formatDate, toRoman } from "@/lib/utils";
import IcindekilerTablosu from "@/components/public/IcindekilerTablosu";
import PaylasimButonlari from "@/components/public/PaylasimButonlari";
import YazarKarti from "@/components/public/YazarKarti";
import IlgiliMakaleler from "@/components/public/IlgiliMakaleler";
import Breadcrumb from "@/components/public/Breadcrumb";
import JsonLdScript from "@/components/public/JsonLdScript";
import {
  articleJsonLd,
  breadcrumbJsonLd,
  faqJsonLd,
} from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";
import { sanitize } from "@/lib/sanitize";
import { SITE_URL } from "@/lib/site-config";
import Image from "next/image";
import Link from "next/link";
import { IMakale, IKullanici, IKategori } from "@/types";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await dbConnect();
  const { slug } = await params;
  const makale = await Makale.findOne({ slug, status: "yayinda" })
    .populate("author", "name")
    .populate("category", "name");
  if (!makale) return { title: "Bulunamadı" };

  const obj = JSON.parse(JSON.stringify(makale)) as IMakale;
  const yazar =
    obj.author && typeof obj.author === "object" ? (obj.author as IKullanici) : null;
  const kategori =
    obj.category && typeof obj.category === "object"
      ? (obj.category as IKategori)
      : null;

  return buildMetadata({
    title: obj.title,
    description: obj.excerpt,
    path: `/makale/${obj.slug}`,
    image: `${SITE_URL}/api/og?id=${obj._id}&v=${encodeURIComponent(
      obj.updatedAt
    )}`,
    type: "article",
    publishedTime: obj.createdAt,
    modifiedTime: obj.updatedAt,
    authors: yazar ? [yazar.name] : undefined,
    section: kategori?.name,
    tags: obj.tags,
  });
}

export default async function MakaleDetay({ params }: Props) {
  await dbConnect();
  const { slug } = await params;

  const makale = await Makale.findOne({ slug, status: "yayinda" })
    .populate("category", "name slug")
    .populate("author", "name avatar bio slug socials");

  if (!makale) notFound();

  const makaleObj = JSON.parse(JSON.stringify(makale)) as IMakale;

  const yazar =
    makaleObj.author && typeof makaleObj.author === "object"
      ? (makaleObj.author as IKullanici)
      : null;
  const kategori =
    makaleObj.category && typeof makaleObj.category === "object"
      ? (makaleObj.category as IKategori)
      : null;

  // İçerikteki h2/h3'lere id ekle (TOC için)
  let headingIndex = 0;
  const contentWithIds = makaleObj.content.replace(
    /<(h[23])>/g,
    (_match, tag) => {
      const id = `heading-${headingIndex}`;
      headingIndex++;
      return `<${tag} id="${id}">`;
    }
  );

  // İlgili makaleler
  let ilgiliMakaleler: IMakale[] = [];
  if (makale.category) {
    const ilgiliRaw = await Makale.find({
      category: makale.category._id ?? makale.category,
      status: "yayinda",
      _id: { $ne: makale._id },
    })
      .populate("category", "name slug")
      .populate("author", "name avatar")
      .limit(2);

    ilgiliMakaleler = JSON.parse(JSON.stringify(ilgiliRaw)) as IMakale[];
  }

  // Breadcrumb items
  const breadcrumbItems = [
    { name: "Ana Sayfa", href: "/" },
    ...(kategori
      ? [{ name: kategori.name, href: `/kategori/${kategori.slug}` }]
      : []),
    { name: makaleObj.title }, // son item href'siz
  ];

  const breadcrumbAbsolute = [
    { name: "Ana Sayfa", url: SITE_URL },
    ...(kategori
      ? [
          {
            name: kategori.name,
            url: `${SITE_URL}/kategori/${kategori.slug}`,
          },
        ]
      : []),
    { name: makaleObj.title, url: `${SITE_URL}/makale/${makaleObj.slug}` },
  ];

  return (
    <article>
      <JsonLdScript data={articleJsonLd(makaleObj)} />
      <JsonLdScript data={breadcrumbJsonLd(breadcrumbAbsolute)} />
      <JsonLdScript data={faqJsonLd(makaleObj.faqs)} />

      {/* Header */}
      <div className="max-w-content mx-auto px-6 pt-12">
        <Breadcrumb items={breadcrumbItems} />

        <div className="text-center mt-8">
          {kategori && <p className="kicker mb-5">{kategori.name}</p>}
          <h1
            className="display-monument"
            style={{ fontSize: "clamp(2rem, 5vw, 3.4rem)" }}
          >
            {makaleObj.title}
          </h1>
          <p
            className="text-lg mt-6 leading-relaxed max-w-2xl mx-auto"
            style={{ color: "var(--color-muted)" }}
          >
            {makaleObj.excerpt}
          </p>

          {/* Meta satırı: yazar · tarih · okuma süresi */}
          <div
            className="flex items-center justify-center gap-3 mt-7 text-sm flex-wrap"
            style={{ color: "var(--color-muted)" }}
          >
            {yazar?.slug ? (
              <Link
                href={`/yazar/${yazar.slug}`}
                className="group inline-flex items-center gap-3"
              >
                <div
                  className="w-9 h-9 flex items-center justify-center overflow-hidden relative flex-shrink-0"
                  style={{ border: "1px solid var(--color-gold)", background: "var(--color-panel-hi)" }}
                >
                  {yazar.avatar ? (
                    <Image
                      src={yazar.avatar}
                      alt={yazar.name}
                      fill
                      sizes="36px"
                      className="object-cover"
                    />
                  ) : (
                    <span style={{ fontFamily: "var(--font-display)", color: "var(--color-gold)", fontWeight: 500 }}>
                      {yazar.name?.charAt(0) ?? "?"}
                    </span>
                  )}
                </div>
                <span
                  className="plink font-semibold group-hover:text-[var(--color-gold)] group-hover:after:scale-x-100"
                  style={{ color: "var(--color-ink)" }}
                >
                  {yazar.name}
                </span>
              </Link>
            ) : (
              <>
                <div
                  className="w-9 h-9 flex items-center justify-center overflow-hidden relative flex-shrink-0"
                  style={{ border: "1px solid var(--color-gold)", background: "var(--color-panel-hi)" }}
                >
                  {yazar?.avatar ? (
                    <Image
                      src={yazar.avatar}
                      alt={yazar.name}
                      fill
                      sizes="36px"
                      className="object-cover"
                    />
                  ) : (
                    <span style={{ fontFamily: "var(--font-display)", color: "var(--color-gold)", fontWeight: 500 }}>
                      {yazar?.name?.charAt(0) ?? "?"}
                    </span>
                  )}
                </div>
                <span className="font-semibold" style={{ color: "var(--color-ink)" }}>
                  {yazar?.name ?? "Anonim"}
                </span>
              </>
            )}
            <span style={{ color: "var(--color-muted-dim)" }}>·</span>
            <time dateTime={makaleObj.createdAt}>{formatDate(makaleObj.createdAt)}</time>
            <span style={{ color: "var(--color-muted-dim)" }}>·</span>
            <span>{makaleObj.readingTime} dk okuma</span>
          </div>

          <div className="gold-rule mx-auto mt-8" aria-hidden="true" />

          {/* Paylaşım */}
          <div className="flex justify-center mt-6">
            <PaylasimButonlari title={makaleObj.title} slug={makaleObj.slug} />
          </div>
        </div>
      </div>

      {/* Cover Image */}
      {makaleObj.coverImage && (
        <div className="max-w-content-wide mx-auto px-6 my-8">
          <Image
            src={makaleObj.coverImage}
            alt={makaleObj.title}
            width={1200}
            height={384}
            sizes="(max-width: 768px) 100vw, 780px"
            className="w-full object-cover"
            style={{ maxHeight: 384, height: "auto" }}
            priority
          />
        </div>
      )}

      {/* Content + TOC */}
      <div className="max-w-content-wide mx-auto px-6 flex gap-12">
        <div
          className="dropcap prose prose-lg prose-invert max-w-content flex-1
            prose-headings:font-display prose-headings:font-semibold
            prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4
            prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
            prose-p:leading-[1.85]
            prose-blockquote:border-l-[var(--color-gold)] prose-blockquote:bg-[var(--color-panel)] prose-blockquote:py-3 prose-blockquote:not-italic
            prose-a:text-[var(--color-gold)] prose-a:no-underline hover:prose-a:underline
            prose-strong:text-[var(--color-ink)]
            prose-code:text-[var(--color-gold)]
            prose-img:rounded-none"
          style={{ color: "var(--color-body)" }}
          dangerouslySetInnerHTML={{ __html: sanitize(contentWithIds) }}
        />
        <IcindekilerTablosu content={makaleObj.content} />
      </div>

      {/* FAQ Section */}
      {makaleObj.faqs && makaleObj.faqs.length > 0 && (
        <section className="max-w-content mx-auto px-6 mt-16">
          <p className="kicker mb-3">Sıkça Sorulan Sorular</p>
          <h2 className="display text-2xl mb-2">Merak Edilenler</h2>
          <div className="gold-rule-sm mb-7" aria-hidden="true" />
          <div className="space-y-4">
            {makaleObj.faqs.map((faq, idx) => (
              <details
                key={idx}
                className="article-faq p-4"
                style={{
                  background: "var(--color-panel)",
                  border: "1px solid var(--rule-dim)",
                }}
              >
                <summary
                  className="font-semibold cursor-pointer"
                  style={{ color: "var(--color-ink)" }}
                >
                  <span className="flex items-baseline gap-3.5">
                    <span className="roman-index shrink-0" aria-hidden="true">
                      {toRoman(idx + 1)}
                    </span>
                    <span>{faq.question}</span>
                  </span>
                </summary>
                <div
                  className="mt-3 leading-relaxed"
                  style={{ color: "var(--color-body)" }}
                  dangerouslySetInnerHTML={{ __html: sanitize(faq.answer) }}
                />
              </details>
            ))}
          </div>
        </section>
      )}

      {/* Author Card & Related */}
      <div className="max-w-content mx-auto px-6 pb-16">
        {yazar && <YazarKarti yazar={yazar} />}
        <IlgiliMakaleler makaleler={ilgiliMakaleler} />
      </div>
    </article>
  );
}
