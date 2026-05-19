import dbConnect from "@/lib/db";
import Makale from "@/models/Makale";
import "@/models/Kullanici";
import "@/models/Kategori";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/utils";
import IcindekilerTablosu from "@/components/public/IcindekilerTablosu";
import PaylasimButonlari from "@/components/public/PaylasimButonlari";
import YazarKarti from "@/components/public/YazarKarti";
import IlgiliMakaleler from "@/components/public/IlgiliMakaleler";
import { IMakale, IKullanici, IKategori } from "@/types";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  await dbConnect();
  const { slug } = await params;
  const makale = await Makale.findOne({ slug, status: "yayinda" });
  if (!makale) return { title: "Bulunamadı" };
  return {
    title: makale.title,
    description: makale.excerpt,
  };
}

export default async function MakaleDetay({ params }: Props) {
  await dbConnect();
  const { slug } = await params;

  const makale = await Makale.findOne({ slug, status: "yayinda" })
    .populate("category", "name slug")
    .populate("author", "name avatar bio");

  if (!makale) notFound();

  const makaleObj = JSON.parse(JSON.stringify(makale)) as IMakale;

  // Null-safe: category or author may have been deleted (orphan).
  const yazar =
    makaleObj.author && typeof makaleObj.author === "object"
      ? (makaleObj.author as IKullanici)
      : null;
  const kategori =
    makaleObj.category && typeof makaleObj.category === "object"
      ? (makaleObj.category as IKategori)
      : null;

  // İçerikteki h2/h3'lere id ekle (TOC için)
  let headingIndex = 0;
  const contentWithIds = makaleObj.content.replace(
    /<(h[23])>/g,
    (_match, tag) => {
      const id = `heading-${headingIndex}`;
      headingIndex++;
      return `<${tag} id="${id}">`;
    }
  );

  // İlgili makaleler (kategori orphan değilse)
  let ilgiliMakaleler: IMakale[] = [];
  if (makale.category) {
    const ilgiliRaw = await Makale.find({
      category: makale.category._id ?? makale.category,
      status: "yayinda",
      _id: { $ne: makale._id },
    })
      .populate("category", "name slug")
      .populate("author", "name avatar")
      .limit(2);

    ilgiliMakaleler = JSON.parse(JSON.stringify(ilgiliRaw)) as IMakale[];
  }

  return (
    <article>
      {/* Header */}
      <div className="max-w-content mx-auto px-6 pt-12">
        {kategori && (
          <p className="kategori-etiketi mb-4">{kategori.name}</p>
        )}
        <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">
          {makaleObj.title}
        </h1>
        <p className="text-lg text-gray-text mt-4 leading-relaxed">
          {makaleObj.excerpt}
        </p>

        {/* Meta */}
        <div className="flex items-center gap-4 mt-6 pb-6 border-b border-gray-border">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold overflow-hidden">
            {yazar?.avatar ? (
              <img
                src={yazar.avatar}
                alt={yazar.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              yazar?.name?.charAt(0) ?? "?"
            )}
          </div>
          <div>
            <p className="text-sm font-semibold">
              {yazar?.name ?? "Anonim"}
            </p>
            <p className="text-xs text-gray-text">
              {formatDate(makaleObj.createdAt)} · {makaleObj.readingTime} dk
              okuma
            </p>
          </div>
          <div className="ml-auto">
            <PaylasimButonlari
              title={makaleObj.title}
              slug={makaleObj.slug}
            />
          </div>
        </div>
      </div>

      {/* Cover Image */}
      {makaleObj.coverImage && (
        <div className="max-w-content-wide mx-auto px-6 my-8">
          <img
            src={makaleObj.coverImage}
            alt={makaleObj.title}
            className="w-full rounded-xl object-cover max-h-96"
          />
        </div>
      )}

      {/* Content + TOC */}
      <div className="max-w-content-wide mx-auto px-6 flex gap-12">
        <div
          className="prose prose-lg max-w-content flex-1
            prose-headings:text-dark prose-headings:font-bold
            prose-h2:text-xl prose-h2:mt-10 prose-h2:mb-4
            prose-h3:text-lg prose-h3:mt-8 prose-h3:mb-3
            prose-p:text-dark/80 prose-p:leading-[1.85]
            prose-blockquote:border-l-primary prose-blockquote:bg-blue-50/50 prose-blockquote:rounded-r-md prose-blockquote:py-3 prose-blockquote:not-italic
            prose-li:text-dark/80
            prose-a:text-primary prose-a:no-underline hover:prose-a:underline
            prose-img:rounded-lg"
          dangerouslySetInnerHTML={{ __html: contentWithIds }}
        />
        <IcindekilerTablosu content={makaleObj.content} />
      </div>

      {/* Author Card & Related */}
      <div className="max-w-content mx-auto px-6 pb-16">
        {yazar && <YazarKarti yazar={yazar} />}
        <IlgiliMakaleler makaleler={ilgiliMakaleler} />
      </div>
    </article>
  );
}
