import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import { SITE_URL } from "@/lib/site-config";
import { getSiteContent } from "@/lib/get-site-content";

export const revalidate = 600; // 10 dk

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const c = await getSiteContent();
  return (
    <>
      <link
        rel="alternate"
        type="application/rss+xml"
        title="Tarık Mirza · RSS"
        href={`${SITE_URL}/rss.xml`}
      />
      <Header nav={c.nav} brand={c.seo.brand} tagline={c.seo.tagline} />
      <main id="main-content">{children}</main>
      <Footer
        nav={c.nav}
        brand={c.seo.brand}
        description={c.seo.description}
        contact={c.contact}
        socials={c.socials}
      />
    </>
  );
}
