import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/db";
import Upload from "@/models/Upload";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Geçersiz görsel" }, { status: 400 });
  }

  await dbConnect();
  const doc = await Upload.findById(id).lean<{
    // .lean() Buffer alanını çoğu zaman BSON Binary olarak döner (Node Buffer değil),
    // bu yüzden tipi gevşek tutup aşağıda iki ihtimali de ele alıyoruz.
    data: Buffer | { buffer: Buffer };
    contentType: string;
  } | null>();

  if (!doc) {
    return NextResponse.json({ error: "Görsel bulunamadı" }, { status: 404 });
  }

  // Mongoose .lean() Buffer alanını BSON Binary olarak döndürdüğünde gerçek baytlar
  // .buffer içindedir; doğrudan new Uint8Array(Binary) 0 bayt verir. Her iki durumu da karşıla.
  const bytes = Buffer.isBuffer(doc.data) ? doc.data : doc.data.buffer;
  const body = new Uint8Array(bytes);

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": doc.contentType || "application/octet-stream",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
