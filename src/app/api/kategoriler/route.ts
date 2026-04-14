import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Kategori from "@/models/Kategori";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  await dbConnect();
  const kategoriler = await Kategori.find().sort({ order: 1 });
  return NextResponse.json(kategoriler);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  await dbConnect();
  const body = await req.json();
  const kategori = await Kategori.create(body);
  return NextResponse.json(kategori, { status: 201 });
}
