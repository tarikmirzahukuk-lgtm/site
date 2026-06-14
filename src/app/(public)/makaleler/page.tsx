import type { Metadata } from "next";
import dbConnect from "@/lib/db";
import Makale from "@/models/Makale";
import Kategori from "@/models/Kategori";
import "@/models/Kullanici";
import KategoriFiltreClient from "@/components/public/KategoriFiltreClient";
import BosDurum from "@/components/public/BosDurum";
import { IMakale, IKategori } from "@/types";
import { buildMetadata } from "@/lib/seo/metadata";
import { SITE_CONFIG } from "@/lib/site-config";

export const metadata: Metadata = buildMetadata({
  title: "Makaleler",
  description: `${SITE_CONFIG.brand} tarafından yayımlanmış tüm ceza hukuku makaleleri — kategoriye göre filtreleyebilirsiniz.`,
  path: "/makaleler",
});

export const revalidate = 300; // 5 dk ISR

async function fetchData(): Promise<{
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
        .limit(100),
      Kategori.find().sort({ order: 1 }),
    ]);
    return {
      makaleler: JSON.parse(JSON.stringify(makalelerRaw)) as IMakale[],
      kategoriler: JSON.parse(JSON.stringify(kategorilerRaw)) as IKategori[],
    };
  } catch (err) {
    console.error("Makaleler index: fetch failed —", err);
    return { makaleler: [], kategoriler: [] };
  }
}

export default async function MakalelerSayfasi() {
  const { makaleler, kategoriler } = await fetchData();

  return (
    <section className="max-w-7xl mx-auto px-5 md:px-16 py-16 md:py-24">
      <div className="kicker mb-3.5 text-center">Arşiv</div>
      <h1
        className="display-monument m-0 mb-5"
        style={{ fontSize: "clamp(36px, 6vw, 64px)" }}
      >
        Tüm <span className="italic-gold">makaleler.</span>
      </h1>
      <div className="gold-rule mx-auto mb-8" aria-hidden="true" />
      <p
        className="max-w-[640px] mx-auto text-center text-base leading-[1.65] mb-10 md:mb-14"
        style={{ color: "var(--color-muted)" }}
      >
        {makaleler.length} yayımlanmış makale. Kategoriye göre filtreleyin veya
        aramak için sayfanın altındaki arşiv linklerini kullanın.
      </p>

      {makaleler.length === 0 ? (
        <BosDurum
          baslik="Henüz makale yayınlanmamış"
          aciklama="Arşiv hazırlanıyor. Yeni çalışmalar yayımlandıkça burada görünecek."
          ctaLabel="Ana sayfaya dön"
          ctaHref="/"
        />
      ) : (
        <KategoriFiltreClient kategoriler={kategoriler} makaleler={makaleler} />
      )}
    </section>
  );
}
