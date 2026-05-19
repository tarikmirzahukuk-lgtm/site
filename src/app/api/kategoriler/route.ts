import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Kategori from "@/models/Kategori";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  await dbConnect();
  const kategoriler = await Kategori.find().sort({ order: 1, name: 1 });
  return NextResponse.json(kategoriler);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role?: string }).role !== "admin") {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  await dbConnect();
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek" }, { status: 400 });
  }

  if (!body.name || !body.slug) {
    return NextResponse.json(
      { error: "Ad ve slug zorunludur" },
      { status: 400 }
    );
  }

  try {
    const kategori = await Kategori.create(body);
    return NextResponse.json(kategori, { status: 201 });
  } catch (err: unknown) {
    const error = err as { code?: number; message?: string };
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Bu slug zaten kullanılıyor" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: error.message || "Kategori oluşturulamadı" },
      { status: 500 }
    );
  }
}
