"use client";

import { IKategori } from "@/types";

interface Props {
  kategoriler: IKategori[];
  aktif: string;
  onChange: (id: string) => void;
}

export default function KategoriFiltre({ kategoriler, aktif, onChange }: Props) {
  const Pill = ({
    label,
    active,
    onClick,
  }: {
    label: string;
    active: boolean;
    onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      className={`pill ${active ? "pill-active" : ""}`}
    >
      {label}
    </button>
  );

  return (
    <div className="flex flex-wrap gap-2">
      <Pill label="Tümü" active={aktif === ""} onClick={() => onChange("")} />
      {kategoriler.map((k) => (
        <Pill
          key={k._id}
          label={k.name}
          active={aktif === k._id}
          onClick={() => onChange(k._id)}
        />
      ))}
    </div>
  );
}
