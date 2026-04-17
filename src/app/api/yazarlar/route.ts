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
  const body = await req.json();
  body.password = await bcrypt.hash(body.password, 12);
  const yazar = await Kullanici.create(body);
  const result = yazar.toObject();
  delete (result as unknown as Record<string, unknown>).password;
  return NextResponse.json(result, { status: 201 });
}
