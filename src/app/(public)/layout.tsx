import dbConnect from "@/lib/db";
import Kategori from "@/models/Kategori";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import { IKategori } from "@/types";
import { SITE_URL } from "@/lib/site-config";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await dbConnect();
  const kategorilerRaw = await Kategori.find().sort({ order: 1 });
  const kategoriler = JSON.parse(
    JSON.stringify(kategorilerRaw)
  ) as IKategori[];

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
