import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import dbConnect from "@/lib/db";
import SiteContent from "@/models/SiteContent";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { SITE_CONTENT_TAG } from "@/lib/get-site-content";
import { SITE_CONTENT_DEFAULTS } from "@/lib/site-content-defaults";

export async function GET() {
  await dbConnect();
  const doc = await SiteContent.findOne({ key: "main" }).lean();
  return NextResponse.json(
    doc ? JSON.parse(JSON.stringify(doc)) : SITE_CONTENT_DEFAULTS
  );
}

export async function PUT(req: NextRequest) {
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

  // Sunucu tarafı/sistem alanlarını gövdeden temizle.
  delete body._id;
  delete body.key;
  delete body.createdAt;
  delete body.updatedAt;
  delete body.__v;

  try {
    const doc = await SiteContent.findOneAndUpdate(
      { key: "main" },
      { $set: { ...body, key: "main" } },
      { upsert: true, new: true, runValidators: true }
    ).lean();
    // expire:0 => anında geçersiz kıl; admin değişikliği ilk ziyarette taze görür
    // (route handler'da updateTag kullanılamaz; bu eşdeğer read-your-own-writes davranışı).
    revalidateTag(SITE_CONTENT_TAG, { expire: 0 });
    return NextResponse.json(JSON.parse(JSON.stringify(doc)));
  } catch (err: unknown) {
    const e = err as { message?: string };
    return NextResponse.json(
      { error: e.message || "Kaydedilemedi" },
      { status: 500 }
    );
  }
}
