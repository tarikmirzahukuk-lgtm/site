"use client";

import { useState } from "react";
import Image from "next/image";
import { labelClass } from "./ui";

export default function ImageField({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Yükleme başarısız");
      } else {
        onChange(data.url);
      }
    } catch {
      setError("Yükleme başarısız");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      {label && <label className={labelClass}>{label}</label>}
      {value ? (
        <div className="relative h-32 w-32 rounded-md overflow-hidden">
          <Image src={value} alt="" fill className="object-cover" sizes="128px" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-1 right-1 bg-[var(--color-panel)] rounded-full w-6 h-6 text-xs flex items-center justify-center shadow z-10 text-[var(--color-ink)]"
          >
            x
          </button>
        </div>
      ) : (
        <label className="block h-32 w-32 bg-[var(--color-panel-hi)] rounded-md border-2 border-dashed border-[var(--rule-dim)] cursor-pointer flex items-center justify-center hover:border-[var(--color-gold)] transition-colors">
          <div className="text-center">
            <p className="text-2xl mb-1 text-[var(--color-muted)]">+</p>
            <p className="text-xs text-[var(--color-muted)]">
              {uploading ? "Yükleniyor..." : "Görsel yükle"}
            </p>
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleFile}
            disabled={uploading}
            className="hidden"
          />
        </label>
      )}
      {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
    </div>
  );
}
