"use client";

import { useState } from "react";
import { slugify } from "@/lib/utils";
import { IKategori } from "@/types";

interface Props {
  kategori?: IKategori;
  onSave: () => void;
  onCancel: () => void;
}

export default function KategoriForm({ kategori, onSave, onCancel }: Props) {
  const [name, setName] = useState(kategori?.name || "");
  const [slug, setSlug] = useState(kategori?.slug || "");
  const [description, setDescription] = useState(kategori?.description || "");
  const [order, setOrder] = useState<number>(kategori?.order ?? 0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleNameChange = (value: string) => {
    setName(value);
    if (!kategori) setSlug(slugify(value));
  };

  const handleOrderChange = (raw: string) => {
    if (raw === "") {
      setOrder(0);
      return;
    }
    const parsed = parseInt(raw, 10);
    setOrder(Number.isNaN(parsed) ? 0 : parsed);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !slug.trim()) {
      setError("Ad ve slug zorunludur");
      return;
    }

    setLoading(true);
    const url = kategori
      ? `/api/kategoriler/${kategori._id}`
      : "/api/kategoriler";
    const method = kategori ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          slug: slug.trim(),
          description,
          order,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Kaydedilemedi");
        setLoading(false);
        return;
      }

      setLoading(false);
      onSave();
    } catch {
      setError("Ağ hatası, tekrar deneyin");
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-3 py-2 bg-[var(--color-panel-hi)] border border-[var(--rule-dim)] text-[var(--color-ink)] rounded-md text-sm focus:outline-none focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)] placeholder:text-[var(--color-muted-dim)]";
  const labelClass =
    "block text-xs font-medium text-[var(--color-muted)] mb-1.5 uppercase tracking-wide";

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[var(--color-panel)] rounded-lg border border-[var(--rule-dim)] p-5 space-y-4"
    >
      <div>
        <label className={labelClass}>Kategori Adı</label>
        <input
          type="text"
          value={name}
          onChange={(e) => handleNameChange(e.target.value)}
          className={inputClass}
          required
        />
      </div>
      <div>
        <label className={labelClass}>Slug</label>
        <input
          type="text"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className={`${inputClass} font-mono`}
          required
        />
      </div>
      <div>
        <label className={labelClass}>Açıklama</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className={inputClass}
        />
      </div>
      <div>
        <label className={labelClass}>Sıra</label>
        <input
          type="number"
          value={Number.isNaN(order) ? 0 : order}
          onChange={(e) => handleOrderChange(e.target.value)}
          className={`w-24 px-3 py-2 bg-[var(--color-panel-hi)] border border-[var(--rule-dim)] text-[var(--color-ink)] rounded-md text-sm focus:outline-none focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)]`}
        />
      </div>
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <div className="flex gap-2 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="btn-primary disabled:opacity-50"
        >
          {loading ? "Kaydediliyor..." : kategori ? "Güncelle" : "Oluştur"}
        </button>
        <button type="button" onClick={onCancel} className="btn-secondary">
          İptal
        </button>
      </div>
    </form>
  );
}
