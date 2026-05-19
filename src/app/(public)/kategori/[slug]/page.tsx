import dbConnect from "@/lib/db";
import Kategori from "@/models/Kategori";
import Makale from "@/models/Makale";
import "@/models/Kullanici";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import MakaleKart from "@/components/public/MakaleKart";
import Breadcrumb from "@/components/public/Breadcrumb";
import JsonLdScript from "@/components/public/JsonLdScript";
import { breadcrumbJsonLd } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";
import { SITE_URL } from "@/lib/site-config";
import { IMakale } from "@/types";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await dbConnect();
  const { slug } = await params;
  const kategori = await Kategori.findOne({ slug });
  if (!kategori) return { title: "Bulunamadı" };

  return buildMetadata({
    title: kategori.name,
    description:
      kategori.description ||
      `${kategori.name} kategorisindeki tüm makaleler — Tarık Mirza Ceza Hukuku Notları.`,
    path: `/kategori/${kategori.slug}`,
  });
}

export default async function KategoriSayfasi({ params }: Props) {
  await dbConnect();
  const { slug } = await params;

  const kategori = await Kategori.findOne({ slug });
  if (!kategori) notFound();

  const makalelerRaw = await Makale.find({
    category: kategori._id,
    status: "yayinda",
  })
    .populate("category", "name slug")
    .populate("author", "name avatar")
    .sort({ createdAt: -1 });

  const makaleler = JSON.parse(JSON.stringify(makalelerRaw)) as IMakale[];

  const breadcrumbItems = [
    { name: "Ana Sayfa", href: "/" },
    { name: kategori.name },
  ];

  const breadcrumbAbsolute = [
    { name: "Ana Sayfa", url: SITE_URL },
    { name: kategori.name, url: `${SITE_URL}/kategori/${kategori.slug}` },
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <JsonLdScript data={breadcrumbJsonLd(breadcrumbAbsolute)} />

      <Breadcrumb items={breadcrumbItems} />

      <div className="mb-10">
        <p className="kategori-etiketi mb-2">KATEGORİ</p>
        <h1 className="text-2xl font-extrabold">{kategori.name}</h1>
        {kategori.description && (
          <p className="text-gray-text mt-2">{kategori.description}</p>
        )}
      </div>

      {makaleler.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {makaleler.map((makale) => (
            <MakaleKart key={makale._id} makale={makale} />
          ))}
        </div>
      ) : (
        <p className="text-gray-text text-center py-12">
          Bu kategoride henüz makale bulunmuyor.
        </p>
      )}
    </div>
  );
}
