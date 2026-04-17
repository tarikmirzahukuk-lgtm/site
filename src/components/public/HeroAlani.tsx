import Link from "next/link";
import { IMakale, IKategori } from "@/types";
import { formatDate } from "@/lib/utils";

export default function HeroAlani({ makale }: { makale: IMakale }) {
  const kategori = makale.category as IKategori;

  return (
    <section className="border-b border-gray-border">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <p className="kategori-etiketi mb-4">ÖNE ÇIKAN</p>
        <Link href={`/makale/${makale.slug}`} className="group">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-1">
              <h2 className="text-2xl md:text-3xl font-extrabold leading-tight group-hover:text-primary transition-colors">
                {makale.title}
              </h2>
              <p className="text-gray-text mt-4 leading-relaxed">
                {makale.excerpt}
              </p>
              <div className="flex items-center gap-3 mt-4 text-sm text-gray-text">
                <span>{formatDate(makale.createdAt)}</span>
                <span>·</span>
                <span>{makale.readingTime} dk okuma</span>
                {kategori && (
                  <>
                    <span>·</span>
                    <span className="text-primary font-medium">
                      {kategori.name}
                    </span>
                  </>
                )}
              </div>
            </div>
            {makale.coverImage && (
              <div className="w-full md:w-64 h-44 flex-shrink-0 rounded-lg overflow-hidden bg-gray-light">
                <img
                  src={makale.coverImage}
                  alt={makale.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </Link>
      </div>
    </section>
  );
}
