import type { MetadataRoute } from "next";
import dbConnect from "@/lib/db";
import Makale from "@/models/Makale";
import Kategori from "@/models/Kategori";
import Kullanici from "@/models/Kullanici";
import { SITE_URL } from "@/lib/site-config";

export const revalidate = 3600; // 1 saat

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await dbConnect();

  const now = new Date();

  // Statik sayfalar
  const staticUrls: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${SITE_URL}/hakkimda`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    { url: `${SITE_URL}/iletisim`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  // Makaleler, kategoriler, yazarlar, etiketler paralel
  const [makaleler, kategoriler, yazarlar, tags] = await Promise.all([
    Makale.find({ status: "yayinda" })
      .select("slug updatedAt")
      .lean<{ slug: string; updatedAt: Date }[]>(),
    Kategori.find()
      .select("slug updatedAt")
      .lean<{ slug: string; updatedAt: Date }[]>(),
    Kullanici.find({ slug: { $exists: true, $ne: "" } })
      .select("slug updatedAt")
      .lean<{ slug: string; updatedAt: Date }[]>(),
    Makale.distinct("tags", { status: "yayinda" }),
  ]);

  const makaleUrls: MetadataRoute.Sitemap = makaleler.map((m) => ({
    url: `${SITE_URL}/makale/${m.slug}`,
    lastModified: m.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const kategoriUrls: MetadataRoute.Sitemap = kategoriler.map((k) => ({
    url: `${SITE_URL}/kategori/${k.slug}`,
    lastModified: k.updatedAt,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const yazarUrls: MetadataRoute.Sitemap = yazarlar.map((y) => ({
    url: `${SITE_URL}/yazar/${y.slug}`,
    lastModified: y.updatedAt,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  const tagUrls: MetadataRoute.Sitemap = (tags as string[])
    .filter((t) => t && t.length > 0)
    .map((t) => ({
      url: `${SITE_URL}/etiket/${encodeURIComponent(t)}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.4,
    }));

  return [...staticUrls, ...makaleUrls, ...kategoriUrls, ...yazarUrls, ...tagUrls];
}
