import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Makale from "@/models/Makale";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { slugify, calculateReadingTime } from "@/lib/utils";

export async function GET(req: NextRequest) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const category = searchParams.get("category");
  const limit = parseInt(searchParams.get("limit") || "50");
  const page = parseInt(searchParams.get("page") || "1");

  const filter: Record<string, unknown> = {};
  if (status) filter.status = status;
  if (category) filter.category = category;

  const skip = (page - 1) * limit;
  const [makaleler, total] = await Promise.all([
    Makale.find(filter)
      .populate("category", "name slug")
      .populate("author", "name avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Makale.countDocuments(filter),
  ]);

  return NextResponse.json({ makaleler, total, page, limit });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  await dbConnect();
  const body = await req.json();

  if (!body.slug) {
    body.slug = slugify(body.title);
  }

  body.readingTime = calculateReadingTime(body.content || "");
  body.author = (session.user as { id: string }).id;

  const makale = await Makale.create(body);
  return NextResponse.json(makale, { status: 201 });
}
