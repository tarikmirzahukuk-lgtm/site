import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
]);
const ALLOWED_EXTS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"]);

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

  const rawExt = path.extname(file.name || "").toLowerCase();
  const ext = ALLOWED_EXTS.has(rawExt) ? rawExt : ".jpg";

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const filename = `${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 10)}${ext}`;
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  const filepath = path.join(uploadsDir, filename);

  try {
    await mkdir(uploadsDir, { recursive: true });
    await writeFile(filepath, buffer);
  } catch (err) {
    console.error("Upload yazma hatası:", err);
    return NextResponse.json(
      { error: "Dosya kaydedilemedi" },
      { status: 500 }
    );
  }

  return NextResponse.json({ url: `/uploads/${filename}` });
}
