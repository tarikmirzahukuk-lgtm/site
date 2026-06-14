import dbConnect from "@/lib/db";
import Kullanici from "@/models/Kullanici";
import Makale from "@/models/Makale";
import "@/models/Kategori";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import MakaleKart from "@/components/public/MakaleKart";
import BosDurum from "@/components/public/BosDurum";
import Breadcrumb from "@/components/public/Breadcrumb";
import JsonLdScript from "@/components/public/JsonLdScript";
import { personJsonLd, breadcrumbJsonLd } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";
import { SITE_URL } from "@/lib/site-config";
import { IMakale, IKullanici } from "@/types";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await dbConnect();
  const { slug } = await params;
  const yazar = await Kullanici.findOne({ slug });
  if (!yazar) return { title: "Bulunamadı" };

  return buildMetadata({
    title: yazar.name,
    description:
      yazar.bio?.slice(0, 160) ||
      `${yazar.name} — Tarık Mirza Ceza Hukuku Notları yazarı.`,
    path: `/yazar/${slug}`,
  });
}

async function fetchYazarSayfasi(slug: string): Promise<
  | { yazar: IKullanici; makaleler: IMakale[] }
  | null
  | "error"
> {
  try {
    await dbConnect();
    const yazar = await Kullanici.findOne({ slug });
    if (!yazar) return null;
    const yazarObj = JSON.parse(JSON.stringify(yazar)) as IKullanici;

    const makalelerRaw = await Makale.find({
      author: yazar._id,
      status: "yayinda",
    })
      .populate("category", "name slug")
      .populate("author", "name avatar")
      .sort({ createdAt: -1 });

    const makaleler = JSON.parse(JSON.stringify(makalelerRaw)) as IMakale[];
    return { yazar: yazarObj, makaleler };
  } catch (err) {
    console.error("YazarSayfasi: fetch failed —", err);
    return "error";
  }
}

export default async function YazarSayfasi({ params }: Props) {
  const { slug } = await params;
  const data = await fetchYazarSayfasi(slug);

  if (data === null) notFound();
  if (data === "error") {
    return (
      <div className="max-w-content mx-auto px-6 py-20 md:py-28">
        <BosDurum
          baslik="Yazar bilgileri yüklenemedi"
          aciklama="Bu yazarın profili şu anda görüntülenemiyor. Tüm makalelere göz atabilir ya da daha sonra tekrar deneyebilirsiniz."
          ctaLabel="Tüm makalelere dön"
          ctaHref="/makaleler"
        />
      </div>
    );
  }

  const { yazar: yazarObj, makaleler } = data;

  const breadcrumbItems = [
    { name: "Ana Sayfa", href: "/" },
    { name: yazarObj.name },
  ];

  const breadcrumbAbsolute = [
    { name: "Ana Sayfa", url: SITE_URL },
    { name: yazarObj.name, url: `${SITE_URL}/yazar/${slug}` },
  ];

  const socials = yazarObj.socials || {};
  const hasSocials =
    socials.linkedin || socials.twitter || socials.orcid || socials.website;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <JsonLdScript data={personJsonLd(yazarObj)} />
      <JsonLdScript data={breadcrumbJsonLd(breadcrumbAbsolute)} />

      <Breadcrumb items={breadcrumbItems} />

      {/* Profile */}
      <div className="flex flex-col md:flex-row gap-8 items-start mb-12 pb-10 border-b" style={{ borderColor: "var(--rule-dim)" }}>
        <div
          className="relative w-32 h-32 flex items-center justify-center flex-shrink-0 overflow-hidden"
          style={{ border: "1px solid var(--color-gold)", background: "var(--color-panel-hi)" }}
        >
          {yazarObj.avatar ? (
            <Image
              src={yazarObj.avatar}
              alt={yazarObj.name}
              fill
              sizes="128px"
              className="object-cover"
            />
          ) : (
            <span
              className="italic"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 48,
                color: "var(--color-gold)",
                fontWeight: 500,
              }}
            >
              {yazarObj.name.charAt(0)}
            </span>
          )}
        </div>
        <div className="flex-1">
          <h1
            className="display-monument text-left"
            style={{ fontSize: "clamp(30px, 5vw, 48px)", marginBottom: "0.5rem" }}
          >
            {yazarObj.name}
          </h1>
          {yazarObj.bio && (
            <p className="leading-relaxed mb-4" style={{ color: "var(--color-body)" }}>{yazarObj.bio}</p>
          )}
          {hasSocials && (
            <div className="flex flex-wrap gap-3 text-sm">
              {socials.linkedin && (
                <a
                  href={socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer me"
                  className="transition-colors hover:underline"
                  style={{ color: "var(--color-gold)" }}
                >
                  LinkedIn
                </a>
              )}
              {socials.twitter && (
                <a
                  href={socials.twitter}
                  target="_blank"
                  rel="noopener noreferrer me"
                  className="transition-colors hover:underline"
                  style={{ color: "var(--color-gold)" }}
                >
                  Twitter
                </a>
              )}
              {socials.orcid && (
                <a
                  href={socials.orcid}
                  target="_blank"
                  rel="noopener noreferrer me"
                  className="transition-colors hover:underline"
                  style={{ color: "var(--color-gold)" }}
                >
                  ORCID
                </a>
              )}
              {socials.website && (
                <a
                  href={socials.website}
                  target="_blank"
                  rel="noopener noreferrer me"
                  className="transition-colors hover:underline"
                  style={{ color: "var(--color-gold)" }}
                >
                  Website
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Articles */}
      <div className="mb-6">
        <div className="gold-rule-sm mb-3" aria-hidden="true" />
        <h2
          className="text-xl font-semibold"
          style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}
        >
          {yazarObj.name} tarafından yazılmış makaleler ({makaleler.length})
        </h2>
      </div>

      {makaleler.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {makaleler.map((makale) => (
            <MakaleKart key={makale._id} makale={makale} />
          ))}
        </div>
      ) : (
        <p className="text-center py-12" style={{ color: "var(--color-muted)" }}>
          Bu yazarın henüz yayınlanmış makalesi yok.
        </p>
      )}
    </div>
  );
}
