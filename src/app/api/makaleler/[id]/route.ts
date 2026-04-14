import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Makale from "@/models/Makale";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { calculateReadingTime } from "@/lib/utils";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  const { id } = await params;
  const makale = await Makale.findById(id)
    .populate("category", "name slug")
    .populate("author", "name avatar bio");
  if (!makale) {
    return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });
  }
  return NextResponse.json(makale);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  await dbConnect();
  const { id } = await params;
  const body = await req.json();

  if (body.content) {
    body.readingTime = calculateReadingTime(body.content);
  }

  const makale = await Makale.findByIdAndUpdate(id, body, { new: true })
    .populate("category", "name slug")
    .populate("author", "name avatar");
  if (!makale) {
    return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });
  }
  return NextResponse.json(makale);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  await dbConnect();
  const { id } = await params;
  await Makale.findByIdAndDelete(id);
  return NextResponse.json({ message: "Silindi" });
}
