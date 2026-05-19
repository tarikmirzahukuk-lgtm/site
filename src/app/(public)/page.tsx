import { Suspense } from "react";
import type { Metadata } from "next";
import dbConnect from "@/lib/db";
import Makale from "@/models/Makale";
import Kategori from "@/models/Kategori";
import "@/models/Kullanici";
import HeroAlani from "@/components/public/HeroAlani";
import KategoriFiltreClient from "@/components/public/KategoriFiltreClient";
import { IMakale, IKategori } from "@/types";
import { buildMetadata } from "@/lib/seo/metadata";
import { SITE_CONFIG } from "@/lib/site-config";

export const metadata: Metadata = buildMetadata({
  title: `${SITE_CONFIG.brand} | ${SITE_CONFIG.tagline}`,
  description: SITE_CONFIG.description,
  path: "/",
});

export const revalidate = 300; // 5 dk ISR

async function fetchHomeData(): Promise<{
  makaleler: IMakale[];
  kategoriler: IKategori[];
}> {
  try {
    await dbConnect();
    const [makalelerRaw, kategorilerRaw] = await Promise.all([
      Makale.find({ status: "yayinda" })
        .populate("category", "name slug")
        .populate("author", "name avatar")
        .sort({ createdAt: -1 })
        .limit(50),
      Kategori.find().sort({ order: 1 }),
    ]);

    return {
      makaleler: JSON.parse(JSON.stringify(makalelerRaw)) as IMakale[],
      kategoriler: JSON.parse(JSON.stringify(kategorilerRaw)) as IKategori[],
    };
  } catch (err) {
    console.error("AnaSayfa: data fetch failed —", err);
    return { makaleler: [], kategoriler: [] };
  }
}

export default async function AnaSayfa() {
  const { makaleler, kategoriler } = await fetchHomeData();

  const oneCikan = makaleler[0];
  const digerMakaleler = makaleler.slice(1);

  return (
    <>
      {oneCikan && <HeroAlani makale={oneCikan} />}

      <section className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-lg font-bold">Makaleler</h2>
        </div>

        <Suspense fallback={null}>
          <KategoriFiltreClient
            kategoriler={kategoriler}
            makaleler={digerMakaleler}
          />
        </Suspense>
      </section>
    </>
  );
}
