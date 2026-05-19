import dbConnect from "@/lib/db";
import Kategori from "@/models/Kategori";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import { IKategori } from "@/types";
import { SITE_URL } from "@/lib/site-config";

export const revalidate = 600; // 10 dk — kategoriler nadiren değişir

async function fetchKategoriler(): Promise<IKategori[]> {
  try {
    await dbConnect();
    const raw = await Kategori.find().sort({ order: 1 });
    return JSON.parse(JSON.stringify(raw)) as IKategori[];
  } catch (err) {
    // Mongo erişilemez ise (build-time / outage) boş listeyle yürü
    console.error("PublicLayout: kategori fetch failed —", err);
    return [];
  }
}

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const kategoriler = await fetchKategoriler();

  return (
    <>
      <link
        rel="alternate"
        type="application/rss+xml"
        title="Tarık Mirza · RSS"
        href={`${SITE_URL}/rss.xml`}
      />
      <Header kategoriler={kategoriler} />
      <main>{children}</main>
      <Footer kategoriler={kategoriler} />
    </>
  );
}
