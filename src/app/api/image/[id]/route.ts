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
    data: Buffer;
    contentType: string;
  } | null>();

  if (!doc) {
    return NextResponse.json({ error: "Görsel bulunamadı" }, { status: 404 });
  }

  const body = new Uint8Array(doc.data);

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": doc.contentType || "application/octet-stream",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
