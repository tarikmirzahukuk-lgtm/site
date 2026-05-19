"use client";

import { useState } from "react";
import MakaleKart from "@/components/public/MakaleKart";
import KategoriFiltre from "@/components/public/KategoriFiltre";
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

  const bosMesaj = aktifKategori
    ? "Bu kategoride henüz makale bulunmuyor."
    : "Henüz makale yayınlanmamış.";

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
      ) : (
        <p className="text-gray-text text-sm text-center py-12">{bosMesaj}</p>
      )}
    </>
  );
}
