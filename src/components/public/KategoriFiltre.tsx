"use client";

import { IKategori } from "@/types";

interface Props {
  kategoriler: IKategori[];
  aktif: string;
  onChange: (slug: string) => void;
}

export default function KategoriFiltre({ kategoriler, aktif, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange("")}
        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
          aktif === ""
            ? "bg-dark text-white"
            : "bg-gray-light text-dark hover:bg-gray-200"
        }`}
      >
        Tümü
      </button>
      {kategoriler.map((kat) => (
        <button
          key={kat._id}
          onClick={() => onChange(kat._id)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            aktif === kat._id
              ? "bg-dark text-white"
              : "bg-gray-light text-dark hover:bg-gray-200"
          }`}
        >
          {kat.name}
        </button>
      ))}
    </div>
  );
}
