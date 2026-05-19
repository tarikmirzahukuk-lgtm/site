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
      className="px-4 py-2 text-xs uppercase tracking-[0.14em] font-semibold transition-all"
      style={
        active
          ? { background: "var(--color-gold)", color: "#0a0d11", border: "1px solid var(--color-gold)" }
          : {
              background: "transparent",
              color: "var(--color-muted)",
              border: "1px solid var(--rule-dim)",
            }
      }
      onMouseEnter={(e) => {
        if (!active) e.currentTarget.style.borderColor = "var(--rule)";
      }}
      onMouseLeave={(e) => {
        if (!active) e.currentTarget.style.borderColor = "var(--rule-dim)";
      }}
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
