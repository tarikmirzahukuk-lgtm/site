import dbConnect from "@/lib/db";
import Makale from "@/models/Makale";
import "@/models/Kullanici";
import "@/models/Kategori";
import type { Metadata } from "next";
import MakaleKart from "@/components/public/MakaleKart";
import BosDurum from "@/components/public/BosDurum";
import Breadcrumb from "@/components/public/Breadcrumb";
import JsonLdScript from "@/components/public/JsonLdScript";
import { breadcrumbJsonLd } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";
import { SITE_URL } from "@/lib/site-config";
import { IMakale } from "@/types";

interface Props {
  params: Promise<{ tag: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag: tagRaw } = await params;
  const tag = decodeURIComponent(tagRaw);
  return buildMetadata({
    title: `${tag} etiketli makaleler`,
    description: `${tag} etiketiyle yayınlanmış tüm makaleler — Tarık Mirza Ceza Hukuku Notları.`,
    path: `/etiket/${encodeURIComponent(tag)}`,
  });
}

async function fetchTaglıMakaleler(tag: string): Promise<IMakale[]> {
  try {
    await dbConnect();
    const raw = await Makale.find({
      tags: tag,
      status: "yayinda",
    })
      .populate("category", "name slug")
      .populate("author", "name avatar")
      .sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(raw)) as IMakale[];
  } catch (err) {
    console.error("EtiketSayfasi: fetch failed —", err);
    return [];
  }
}

export default async function EtiketSayfasi({ params }: Props) {
  const { tag: tagRaw } = await params;
  const tag = decodeURIComponent(tagRaw);
  const makaleler = await fetchTaglıMakaleler(tag);

  const breadcrumbItems = [
    { name: "Ana Sayfa", href: "/" },
    { name: `#${tag}` },
  ];

  const breadcrumbAbsolute = [
    { name: "Ana Sayfa", url: SITE_URL },
    { name: `#${tag}`, url: `${SITE_URL}/etiket/${encodeURIComponent(tag)}` },
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <JsonLdScript data={breadcrumbJsonLd(breadcrumbAbsolute)} />

      <Breadcrumb items={breadcrumbItems} />

      <div className="mb-10 text-center">
        <p className="kicker mb-3">ETİKET</p>
        <h1
          className="display-monument"
          style={{ fontSize: "clamp(30px, 5vw, 52px)" }}
        >
          <span className="italic-gold">#</span>{tag}
        </h1>
        <div className="gold-rule mx-auto mt-5" aria-hidden="true" />
        <p className="mt-5" style={{ color: "var(--color-muted)" }}>
          {makaleler.length} makale
        </p>
      </div>

      {makaleler.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {makaleler.map((makale) => (
            <MakaleKart key={makale._id} makale={makale} />
          ))}
        </div>
      ) : (
        <BosDurum
          baslik="Bu etikete ait makale yok"
          aciklama="Bu etiketle eşleşen bir çalışma bulunamadı. Tüm makaleleri inceleyebilirsiniz."
          ctaLabel="Tüm makalelere dön"
          ctaHref="/makaleler"
        />
      )}
    </div>
  );
}
