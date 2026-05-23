import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Makale from "@/models/Makale";
// Side-effect import: populate("category"/"author") için modeller register olmalı
// (Vercel serverless izole fonksiyonlarda zorunlu)
import "@/models/Kategori";
import "@/models/Kullanici";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { slugify, calculateReadingTime } from "@/lib/utils";

export async function GET(req: NextRequest) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const { searchParams } = new URL(req.url);
  const requestedStatus = searchParams.get("status");
  const category = searchParams.get("category");
  const limit = Math.min(parseInt(searchParams.get("limit") || "50") || 50, 100);
  const page = Math.max(parseInt(searchParams.get("page") || "1") || 1, 1);

  const filter: Record<string, unknown> = {};

  // Public visitors can ONLY see published articles, regardless of query param.
  // Authenticated admins can filter by any status (or leave unfiltered for "all").
  if (!session) {
    filter.status = "yayinda";
  } else if (requestedStatus) {
    filter.status = requestedStatus;
  }

  if (category) filter.category = category;

  const skip = (page - 1) * limit;
  const [makaleler, total] = await Promise.all([
    Makale.find(filter)
      .populate("category", "name slug")
      .populate("author", "name avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Makale.countDocuments(filter),
  ]);

  return NextResponse.json({ makaleler, total, page, limit });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  await dbConnect();
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek" }, { status: 400 });
  }

  if (!body.title || !body.excerpt || !body.category) {
    return NextResponse.json(
      { error: "Başlık, özet ve kategori zorunludur" },
      { status: 400 }
    );
  }

  if (!body.slug) {
    body.slug = slugify(String(body.title));
  }

  body.readingTime = calculateReadingTime(String(body.content || ""));
  body.author = (session.user as { id: string }).id;
  if (!Array.isArray(body.faqs)) body.faqs = [];

  try {
    const makale = await Makale.create(body);
    return NextResponse.json(makale, { status: 201 });
  } catch (err: unknown) {
    const error = err as { code?: number; message?: string };
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Bu slug zaten kullanılıyor. Farklı bir slug seçin." },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: error.message || "Makale oluşturulamadı" },
      { status: 500 }
    );
  }
}
