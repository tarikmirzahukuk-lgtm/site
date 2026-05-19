import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import dbConnect from "@/lib/db";
import Makale from "@/models/Makale";
import { SITE_CONFIG } from "@/lib/site-config";

export const runtime = "nodejs"; // Edge runtime ileride etkinleştirilecek (Mongo Edge'de henüz yok)

const W = 1200;
const H = 630;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  let title: string = SITE_CONFIG.fullName;
  let subtitle: string = SITE_CONFIG.tagline;
  let categoryName: string = "";
  let authorName: string = SITE_CONFIG.author.name;
  let dateText: string = "";

  if (id) {
    try {
      await dbConnect();
      const makale = await Makale.findById(id)
        .populate<{ category: { name: string } }>("category", "name")
        .populate<{ author: { name: string } }>("author", "name")
        .lean();

      if (makale && typeof makale === "object" && "title" in makale) {
        const m = makale as unknown as {
          title: string;
          category?: { name: string };
          author?: { name: string };
          createdAt: Date;
        };
        title = m.title;
        subtitle = "";
        categoryName = m.category?.name || "";
        authorName = m.author?.name || SITE_CONFIG.author.name;
        dateText = new Date(m.createdAt).toLocaleDateString("tr-TR", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });
      }
    } catch (err) {
      console.error("OG route — makale fetch error", err);
      // default'a düş
    }
  }

  // === SKELETON TEMPLATE ===
  // OG kart görsel tasarımı Claude Canvas'ta yapılıyor.
  // Final template hazırlandığında bu JSX bloğu değiştirilecek.
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: SITE_CONFIG.themeColor,
          color: "white",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px 70px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 22,
            opacity: 0.85,
          }}
        >
          <div style={{ display: "flex" }}>
            {categoryName ? categoryName.toUpperCase() : "CEZA HUKUKU"}
          </div>
          <div style={{ display: "flex" }}>{SITE_CONFIG.fullName}</div>
        </div>

        <div
          style={{
            fontSize: title.length > 60 ? 56 : 68,
            fontWeight: 800,
            lineHeight: 1.1,
            display: "flex",
          }}
        >
          {title}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 22,
            opacity: 0.85,
          }}
        >
          <div style={{ display: "flex" }}>{authorName}</div>
          <div style={{ display: "flex" }}>
            {dateText || subtitle}
          </div>
        </div>
      </div>
    ),
    {
      width: W,
      height: H,
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable, s-maxage=31536000",
      },
    }
  );
}
