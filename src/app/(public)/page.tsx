"use client";

import { useEffect, useState } from "react";
import HeroAlani from "@/components/public/HeroAlani";
import MakaleKart from "@/components/public/MakaleKart";
import KategoriFiltre from "@/components/public/KategoriFiltre";
import { IMakale, IKategori } from "@/types";

export default function AnaSayfa() {
  const [makaleler, setMakaleler] = useState<IMakale[]>([]);
  const [kategoriler, setKategoriler] = useState<IKategori[]>([]);
  const [aktifKategori, setAktifKategori] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/makaleler?status=yayinda").then((r) => r.json()),
      fetch("/api/kategoriler").then((r) => r.json()),
    ]).then(([makaleData, katData]) => {
      setMakaleler(makaleData.makaleler);
      setKategoriler(katData);
    });
  }, []);

  const oneCikan = makaleler[0];
  const digerMakaleler = makaleler.slice(1);

  const filtrelenmis = aktifKategori
    ? digerMakaleler.filter((m) => {
        const catId =
          typeof m.category === "string" ? m.category : m.category._id;
        return catId === aktifKategori;
      })
    : digerMakaleler;

  return (
    <>
      {oneCikan && <HeroAlani makale={oneCikan} />}

      <section className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-lg font-bold">Makaleler</h2>
        </div>

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
          <p className="text-gray-text text-sm text-center py-12">
            Bu kategoride henüz makale bulunmuyor.
          </p>
        )}
      </section>
    </>
  );
}
