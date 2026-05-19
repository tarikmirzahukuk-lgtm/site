import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Kullanici from "@/models/Kullanici";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  await dbConnect();
  const yazarlar = await Kullanici.find()
    .select("-password")
    .sort({ createdAt: -1 });
  return NextResponse.json(yazarlar);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role?: string }).role !== "admin")
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  await dbConnect();

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek" }, { status: 400 });
  }

  if (!body.name || !body.email || !body.password) {
    return NextResponse.json(
      { error: "Ad, e-posta ve şifre zorunludur" },
      { status: 400 }
    );
  }

  if (String(body.password).length < 6) {
    return NextResponse.json(
      { error: "Şifre en az 6 karakter olmalı" },
      { status: 400 }
    );
  }

  body.password = await bcrypt.hash(String(body.password), 12);

  try {
    const yazar = await Kullanici.create(body);
    const result = yazar.toObject();
    delete (result as unknown as Record<string, unknown>).password;
    return NextResponse.json(result, { status: 201 });
  } catch (err: unknown) {
    const error = err as { code?: number; message?: string };
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Bu e-posta zaten kayıtlı" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: error.message || "Yazar oluşturulamadı" },
      { status: 500 }
    );
  }
}
