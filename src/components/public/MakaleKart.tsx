import Link from "next/link";
import Image from "next/image";
import { IMakale, IKategori } from "@/types";

export default function MakaleKart({ makale }: { makale: IMakale }) {
  const kategori =
    makale.category && typeof makale.category === "object"
      ? (makale.category as IKategori)
      : null;

  return (
    <Link href={`/makale/${makale.slug}`} className="group">
      <article className="border border-gray-border rounded-lg overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
        {makale.coverImage ? (
          <div className="h-44 bg-gray-light overflow-hidden relative">
            <Image
              src={makale.coverImage}
              alt={makale.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        ) : (
          <div className="h-44 bg-gray-light" />
        )}
        <div className="p-5">
          {kategori && (
            <p className="kategori-etiketi mb-2">{kategori.name}</p>
          )}
          <h3 className="font-bold text-dark leading-snug group-hover:text-primary transition-colors">
            {makale.title}
          </h3>
          <p className="text-sm text-gray-text mt-2 leading-relaxed line-clamp-2">
            {makale.excerpt}
          </p>
          <p className="text-xs text-gray-text mt-3">
            {makale.readingTime} dk okuma
          </p>
        </div>
      </article>
    </Link>
  );
}
