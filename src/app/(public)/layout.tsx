import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import { SITE_URL } from "@/lib/site-config";

export const revalidate = 600; // 10 dk

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <link
        rel="alternate"
        type="application/rss+xml"
        title="Tarık Mirza · RSS"
        href={`${SITE_URL}/rss.xml`}
      />
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
