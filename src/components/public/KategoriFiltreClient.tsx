"use client";

import { useState } from "react";
import MakaleKart from "@/components/public/MakaleKart";
import KategoriFiltre from "@/components/public/KategoriFiltre";
import BosDurum from "@/components/public/BosDurum";
import { IMakale, IKategori } from "@/types";

export default function KategoriFiltreClient({
  kategoriler,
  makaleler,
}: {
  kategoriler: IKategori[];
  makaleler: IMakale[];
}) {
  const [aktifKategori, setAktifKategori] = useState("");

  const filtrelenmis = aktifKategori
    ? makaleler.filter((m) => {
        if (!m.category) return false;
        const catId =
          typeof m.category === "string" ? m.category : m.category._id;
        return catId === aktifKategori;
      })
    : makaleler;

  return (
    <>
      <div className="mb-8">
        <KategoriFiltre
          kategoriler={kategoriler}
          aktif={aktifKategori}
          onChange={setAktifKategori}
        />
      </div>

      {filtrelenmis.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtrelenmis.map((makale) => (
            <MakaleKart key={makale._id} makale={makale} />
          ))}
        </div>
      ) : aktifKategori ? (
        <BosDurum
          baslik="Bu kategoride makale yok"
          aciklama="Başka bir kategori seçebilir veya tüm makaleleri görüntüleyebilirsiniz."
          ctaLabel="Tümünü göster"
          onCta={() => setAktifKategori("")}
        />
      ) : (
        <BosDurum
          baslik="Henüz makale yok"
          aciklama="Yakında ilk makaleler yayımlanacak."
        />
      )}
    </>
  );
}
