import dbConnect from "@/lib/db";
import Makale from "@/models/Makale";
import "@/models/Kullanici";
import "@/models/Kategori";
import { SITE_CONFIG, SITE_URL } from "@/lib/site-config";
import { IMakale, IKullanici, IKategori } from "@/types";

export const revalidate = 600; // 10 dk

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<": return "&lt;";
      case ">": return "&gt;";
      case "&": return "&amp;";
      case "'": return "&apos;";
      case '"': return "&quot;";
      default: return c;
    }
  });
}

function firstParagraph(html: string, maxChars = 600): string {
  // İlk <p>...</p> bloğu çek; yoksa ham metin
  const match = html.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
  const para = match ? match[1] : html;
  const text = para.replace(/<[^>]*>/g, "").trim();
  return text.length > maxChars ? text.slice(0, maxChars) + "..." : text;
}

export async function GET() {
  await dbConnect();

  const makalelerRaw = await Makale.find({ status: "yayinda" })
    .populate("author", "name email")
    .populate("category", "name")
    .sort({ createdAt: -1 })
    .limit(50);

  const makaleler = JSON.parse(JSON.stringify(makalelerRaw)) as IMakale[];

  const items = makaleler
    .map((m) => {
      const yazar =
        m.author && typeof m.author === "object" ? (m.author as IKullanici) : null;
      const kategori =
        m.category && typeof m.category === "object"
          ? (m.category as IKategori)
          : null;

      const link = `${SITE_URL}/makale/${m.slug}`;
      const pubDate = new Date(m.createdAt).toUTCString();
      const description =
        escapeXml(m.excerpt) +
        " — " +
        escapeXml(firstParagraph(m.content)) +
        ` <a href="${link}">Devamını sitede oku</a>`;

      return `    <item>
      <title>${escapeXml(m.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pubDate}</pubDate>
      ${kategori ? `<category>${escapeXml(kategori.name)}</category>` : ""}
      ${yazar ? `<author>${escapeXml(yazar.email || "noreply@example.com")} (${escapeXml(yazar.name)})</author>` : ""}
      <description><![CDATA[${description}]]></description>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_CONFIG.fullName)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(SITE_CONFIG.description)}</description>
    <language>${SITE_CONFIG.language}</language>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
