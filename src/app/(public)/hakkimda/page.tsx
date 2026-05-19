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
      <h1 className="text-3xl font-extrabold mb-8">Hakkımda</h1>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="w-32 h-32 bg-primary rounded-full flex items-center justify-center text-white font-bold text-4xl flex-shrink-0">
          T
        </div>
        <div className="prose prose-lg max-w-none">
          <p className="text-lg text-dark/80 leading-relaxed">
            Merhaba, ben <strong>Tarık Mirza</strong>. Ceza hukuku alanında
            araştırmalar yapan bir hukuk öğrencisiyim.
          </p>
          <p className="text-dark/80 leading-relaxed">
            Bu platformda ceza hukukunun genel ve özel hükümlerine ilişkin
            akademik makaleler, güncel Yargıtay kararlarının değerlendirmeleri
            ve hukuki analizler paylaşıyorum.
          </p>
          <p className="text-dark/80 leading-relaxed">
            Amacım, ceza hukuku alanındaki bilgi birikimimi paylaşarak hem
            hukuk öğrencilerine hem de konuya ilgi duyan herkese faydalı bir
            kaynak oluşturmaktır.
          </p>
        </div>
      </div>
    </div>
  );
}
