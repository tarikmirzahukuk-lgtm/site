import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/db";
import Kullanici from "@/models/Kullanici";
import Makale from "@/models/Makale";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcryptjs";

interface Props {
  params: Promise<{ id: string }>;
}

function isValidId(id: string): boolean {
  return mongoose.Types.ObjectId.isValid(id);
}

export async function GET(_req: NextRequest, { params }: Props) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const { id } = await params;
  if (!isValidId(id))
    return NextResponse.json({ error: "Geçersiz ID" }, { status: 400 });

  await dbConnect();
  const yazar = await Kullanici.findById(id).select("-password");
  if (!yazar)
    return NextResponse.json({ error: "Yazar bulunamadı" }, { status: 404 });

  return NextResponse.json(yazar);
}

export async function PUT(req: NextRequest, { params }: Props) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role?: string }).role !== "admin")
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const { id } = await params;
  if (!isValidId(id))
    return NextResponse.json({ error: "Geçersiz ID" }, { status: 400 });

  await dbConnect();

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek" }, { status: 400 });
  }

  if (!body.name || !body.email) {
    return NextResponse.json(
      { error: "Ad ve e-posta zorunludur" },
      { status: 400 }
    );
  }

  // Şifre opsiyonel: dolu ise validate + hash, boş ise dokunma
  if (body.password) {
    if (String(body.password).length < 6) {
      return NextResponse.json(
        { error: "Şifre en az 6 karakter olmalı" },
        { status: 400 }
      );
    }
    body.password = await bcrypt.hash(String(body.password), 12);
  } else {
    delete body.password;
  }

  // Güvenlik: slug stabil — name değişse bile mevcut slug korunur
  delete body.slug;

  // socials URL validation
  const URL_RE = /^https?:\/\/.+/;
  if (body.socials && typeof body.socials === "object") {
    const s = body.socials as Record<string, unknown>;
    for (const key of ["linkedin", "twitter", "orcid", "website"]) {
      if (s[key] && !URL_RE.test(String(s[key]))) {
        delete s[key];
      }
    }
  }

  try {
    const yazar = await Kullanici.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!yazar)
      return NextResponse.json({ error: "Yazar bulunamadı" }, { status: 404 });

    return NextResponse.json(yazar);
  } catch (err: unknown) {
    const error = err as { code?: number; message?: string };
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Bu e-posta zaten kayıtlı" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: error.message || "Yazar güncellenemedi" },
      { status: 500 }
    );
  }
}

export async function DELETE(_req: NextRequest, { params }: Props) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role?: string }).role !== "admin")
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const { id } = await params;
  if (!isValidId(id))
    return NextResponse.json({ error: "Geçersiz ID" }, { status: 400 });

  // Self-delete protection
  const sessionUserId = (session.user as { id?: string }).id;
  if (sessionUserId === id) {
    return NextResponse.json(
      { error: "Kendi hesabınızı silemezsiniz" },
      { status: 400 }
    );
  }

  await dbConnect();

  // Cascade reject: bağlı makale varsa engelle
  const makaleCount = await Makale.countDocuments({ author: id });
  if (makaleCount > 0) {
    return NextResponse.json(
      {
        error: `Bu yazara bağlı ${makaleCount} makale var. Önce makaleleri başka bir yazara aktarın veya silin.`,
      },
      { status: 409 }
    );
  }

  const yazar = await Kullanici.findByIdAndDelete(id);
  if (!yazar)
    return NextResponse.json({ error: "Yazar bulunamadı" }, { status: 404 });

  return NextResponse.json({ ok: true });
}
