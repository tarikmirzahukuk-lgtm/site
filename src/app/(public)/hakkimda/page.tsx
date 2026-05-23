import type { Metadata } from "next";
import Image from "next/image";
import { buildMetadata } from "@/lib/seo/metadata";
import JsonLdScript from "@/components/public/JsonLdScript";
import { personJsonLd } from "@/lib/seo/jsonld";
import { getSiteContent } from "@/lib/get-site-content";
import { IKullanici } from "@/types";

export async function generateMetadata(): Promise<Metadata> {
  const c = await getSiteContent();
  return buildMetadata({
    title: c.hakkimda.title || "Hakkımda",
    description: c.hakkimda.metaDescription,
    path: "/hakkimda",
  });
}

export default async function HakkimdaPage() {
  const c = await getSiteContent();

  const hakkimdaYazar: IKullanici = {
    _id: "",
    name: c.author.name || c.seo.brand,
    email: "",
    role: "admin",
    bio: c.author.bio || c.hakkimda.metaDescription,
    avatar: c.hakkimda.avatarImage,
    slug: "tarik-mirza",
    socials: {},
    createdAt: "",
    updatedAt: "",
  };

  return (
    <div className="max-w-content mx-auto px-6 py-16">
      <JsonLdScript data={personJsonLd(hakkimdaYazar)} />
      <h1
        className="display text-3xl md:text-4xl mb-8"
        style={{ fontWeight: 600 }}
      >
        {c.hakkimda.title || "Hakkımda"}
      </h1>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div
          className="relative w-32 h-32 flex items-center justify-center flex-shrink-0 overflow-hidden"
          style={{
            border: "1px solid var(--color-gold)",
            background: "var(--color-panel-hi)",
          }}
        >
          {c.hakkimda.avatarImage ? (
            <Image
              src={c.hakkimda.avatarImage}
              alt={c.author.name || c.seo.brand}
              fill
              className="object-cover"
              sizes="128px"
            />
          ) : (
            <span
              className="italic"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 48,
                color: "var(--color-gold)",
                fontWeight: 500,
              }}
            >
              T
            </span>
          )}
        </div>
        <div
          className="prose prose-lg prose-invert max-w-none [&_p]:leading-relaxed [&>p:first-child]:text-lg"
          style={{ color: "var(--color-body)" }}
          dangerouslySetInnerHTML={{ __html: c.hakkimda.body }}
        />
      </div>
    </div>
  );
}
