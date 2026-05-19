import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Makale from "@/models/Makale";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { calculateReadingTime } from "@/lib/utils";
import mongoose from "mongoose";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Geçersiz id" }, { status: 400 });
  }

  const session = await getServerSession(authOptions);
  const makale = await Makale.findById(id)
    .populate("category", "name slug")
    .populate("author", "name avatar bio");

  if (!makale) {
    return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });
  }

  // Drafts are only visible to authenticated admins.
  if (makale.status !== "yayinda" && !session) {
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

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Geçersiz id" }, { status: 400 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek" }, { status: 400 });
  }

  if (typeof body.content === "string") {
    body.readingTime = calculateReadingTime(body.content);
  }

  // Never let the client overwrite the author.
  delete body.author;

  try {
    const makale = await Makale.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    })
      .populate("category", "name slug")
      .populate("author", "name avatar");
    if (!makale) {
      return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });
    }
    return NextResponse.json(makale);
  } catch (err: unknown) {
    const error = err as { code?: number; message?: string };
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Bu slug zaten kullanılıyor" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: error.message || "Güncellenemedi" },
      { status: 500 }
    );
  }
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

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Geçersiz id" }, { status: 400 });
  }

  const deleted = await Makale.findByIdAndDelete(id);
  if (!deleted) {
    return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });
  }
  return NextResponse.json({ message: "Silindi" });
}
