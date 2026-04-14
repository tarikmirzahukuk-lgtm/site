import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Makale from "@/models/Makale";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");

  if (!q || q.trim().length < 2) {
    return NextResponse.json({ makaleler: [] });
  }

  await dbConnect();

  const makaleler = await Makale.find(
    {
      status: "yayinda",
      $or: [
        { title: { $regex: q, $options: "i" } },
        { excerpt: { $regex: q, $options: "i" } },
        { content: { $regex: q, $options: "i" } },
      ],
    }
  )
    .populate("category", "name slug")
    .populate("author", "name avatar")
    .sort({ createdAt: -1 })
    .limit(20);

  return NextResponse.json({ makaleler });
}
