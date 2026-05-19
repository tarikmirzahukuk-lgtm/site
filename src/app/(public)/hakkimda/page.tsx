import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";
import { SITE_CONFIG } from "@/lib/site-config";
import JsonLdScript from "@/components/public/JsonLdScript";
import { personJsonLd } from "@/lib/seo/jsonld";
import { IKullanici } from "@/types";

const HAKKIMDA_DESC =
  "Tarık Mirza — ceza hukuku alanında araştırmalar yapan bir hukuk öğrencisi. Akademik makaleler, Yargıtay kararı değerlendirmeleri ve hukuki analizler.";

export const metadata: Metadata = buildMetadata({
  title: "Hakkımda",
  description: HAKKIMDA_DESC,
  path: "/hakkimda",
});

const hakkimdaYazar: IKullanici = {
  _id: "",
  name: SITE_CONFIG.author.name,
  email: "",
  role: "admin",
  bio: HAKKIMDA_DESC,
  avatar: "",
  slug: "tarik-mirza",
  socials: {},
  createdAt: "",
  updatedAt: "",
};

export default function HakkimdaPage() {
  return (
    <div className="max-w-content mx-auto px-6 py-16">
      <JsonLdScript data={personJsonLd(hakkimdaYazar)} />
      <h1
        className="display text-3xl md:text-4xl mb-8"
        style={{ fontWeight: 600 }}
      >
        Hakkımda
      </h1>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div
          className="w-32 h-32 flex items-center justify-center flex-shrink-0"
          style={{
            border: "1px solid var(--color-gold)",
            background: "var(--color-panel-hi)",
          }}
        >
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
        </div>
        <div className="prose prose-lg prose-invert max-w-none">
          <p className="text-lg leading-relaxed" style={{ color: "var(--color-body)" }}>
            Merhaba, ben <strong>Tarık Mirza</strong>. Ceza hukuku alanında
            araştırmalar yapan bir hukuk öğrencisiyim.
          </p>
          <p className="leading-relaxed" style={{ color: "var(--color-body)" }}>
            Bu platformda ceza hukukunun genel ve özel hükümlerine ilişkin
            akademik makaleler, güncel Yargıtay kararlarının değerlendirmeleri
            ve hukuki analizler paylaşıyorum.
          </p>
          <p className="leading-relaxed" style={{ color: "var(--color-body)" }}>
            Amacım, ceza hukuku alanındaki bilgi birikimimi paylaşarak hem
            hukuk öğrencilerine hem de konuya ilgi duyan herkese faydalı bir
            kaynak oluşturmaktır.
          </p>
        </div>
      </div>
    </div>
  );
}
