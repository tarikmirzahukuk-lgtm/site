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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/makaleler?status=yayinda")
        .then((r) => (r.ok ? r.json() : { makaleler: [] }))
        .catch(() => ({ makaleler: [] })),
      fetch("/api/kategoriler")
        .then((r) => (r.ok ? r.json() : []))
        .catch(() => []),
    ])
      .then(([makaleData, katData]) => {
        setMakaleler(
          Array.isArray(makaleData?.makaleler) ? makaleData.makaleler : []
        );
        setKategoriler(Array.isArray(katData) ? katData : []);
      })
      .finally(() => setLoading(false));
  }, []);

  const oneCikan = makaleler[0];
  const digerMakaleler = makaleler.slice(1);

  const filtrelenmis = aktifKategori
    ? digerMakaleler.filter((m) => {
        if (!m.category) return false;
        const catId =
          typeof m.category === "string" ? m.category : m.category._id;
        return catId === aktifKategori;
      })
    : digerMakaleler;

  const bosMesaj = aktifKategori
    ? "Bu kategoride henüz makale bulunmuyor."
    : "Henüz makale yayınlanmamış.";

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
            {loading ? "Yükleniyor..." : bosMesaj}
          </p>
        )}
      </section>
    </>
  );
}
