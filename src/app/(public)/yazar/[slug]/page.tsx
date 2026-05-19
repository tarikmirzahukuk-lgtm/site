import dbConnect from "@/lib/db";
import Kullanici from "@/models/Kullanici";
import Makale from "@/models/Makale";
import "@/models/Kategori";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import MakaleKart from "@/components/public/MakaleKart";
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

export default async function YazarSayfasi({ params }: Props) {
  await dbConnect();
  const { slug } = await params;

  const yazar = await Kullanici.findOne({ slug });
  if (!yazar) notFound();

  const yazarObj = JSON.parse(JSON.stringify(yazar)) as IKullanici;

  const makalelerRaw = await Makale.find({
    author: yazar._id,
    status: "yayinda",
  })
    .populate("category", "name slug")
    .populate("author", "name avatar")
    .sort({ createdAt: -1 });

  const makaleler = JSON.parse(JSON.stringify(makalelerRaw)) as IMakale[];

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
      <div className="flex flex-col md:flex-row gap-8 items-start mb-12 pb-10 border-b border-gray-border">
        <div className="w-32 h-32 bg-primary rounded-full flex items-center justify-center text-white font-bold text-4xl flex-shrink-0 overflow-hidden">
          {yazarObj.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={yazarObj.avatar}
              alt={yazarObj.name}
              className="w-full h-full object-cover"
            />
          ) : (
            yazarObj.name.charAt(0)
          )}
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-extrabold mb-2">{yazarObj.name}</h1>
          {yazarObj.bio && (
            <p className="text-dark/80 leading-relaxed mb-4">{yazarObj.bio}</p>
          )}
          {hasSocials && (
            <div className="flex flex-wrap gap-3 text-sm">
              {socials.linkedin && (
                <a
                  href={socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer me"
                  className="text-primary hover:underline"
                >
                  LinkedIn
                </a>
              )}
              {socials.twitter && (
                <a
                  href={socials.twitter}
                  target="_blank"
                  rel="noopener noreferrer me"
                  className="text-primary hover:underline"
                >
                  Twitter
                </a>
              )}
              {socials.orcid && (
                <a
                  href={socials.orcid}
                  target="_blank"
                  rel="noopener noreferrer me"
                  className="text-primary hover:underline"
                >
                  ORCID
                </a>
              )}
              {socials.website && (
                <a
                  href={socials.website}
                  target="_blank"
                  rel="noopener noreferrer me"
                  className="text-primary hover:underline"
                >
                  Website
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Articles */}
      <h2 className="text-xl font-bold mb-6">
        {yazarObj.name} tarafından yazılmış makaleler ({makaleler.length})
      </h2>

      {makaleler.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {makaleler.map((makale) => (
            <MakaleKart key={makale._id} makale={makale} />
          ))}
        </div>
      ) : (
        <p className="text-gray-text text-center py-12">
          Bu yazarın henüz yayınlanmış makalesi yok.
        </p>
      )}
    </div>
  );
}
