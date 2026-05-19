import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";
import AraClient from "./AraClient";

export const metadata: Metadata = buildMetadata({
  title: "Makale Ara",
  description: "Tarık Mirza arşivinde başlık veya içerik ara.",
  path: "/ara",
  noIndex: true,
});

export default function AraPage() {
  return <AraClient />;
}
