import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Upload from "@/models/Upload";

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
]);

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek" }, { status: 400 });
  }

  const file = formData.get("file");

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "Dosya bulunamadı" }, { status: 400 });
  }

  if (file.size === 0) {
    return NextResponse.json({ error: "Dosya boş" }, { status: 400 });
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: "Dosya 5 MB'dan büyük olamaz" },
      { status: 413 }
    );
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: "Sadece JPEG, PNG, WebP, GIF veya AVIF yüklenebilir" },
      { status: 415 }
    );
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  try {
    await dbConnect();
    const doc = await Upload.create({ data: buffer, contentType: file.type });
    // Kalıcı, Vercel dahil her ortamda çalışır; /api/image/[id] ile sunulur.
    return NextResponse.json({ url: `/api/image/${doc._id}` });
  } catch (err) {
    console.error("Upload kaydetme hatası:", err);
    return NextResponse.json(
      { error: "Dosya kaydedilemedi" },
      { status: 500 }
    );
  }
}
