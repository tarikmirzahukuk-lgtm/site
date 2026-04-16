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
  const [order, setOrder] = useState(kategori?.order || 0);
  const [loading, setLoading] = useState(false);

  const handleNameChange = (value: string) => {
    setName(value);
    if (!kategori) setSlug(slugify(value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const url = kategori ? `/api/kategoriler/${kategori._id}` : "/api/kategoriler";
    const method = kategori ? "PUT" : "POST";
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, slug, description, order }),
    });
    setLoading(false);
    onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-border p-5 space-y-4">
      <div>
        <label className="block text-xs font-medium text-gray-text mb-1.5 uppercase tracking-wide">Kategori Adı</label>
        <input type="text" value={name} onChange={(e) => handleNameChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" required />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-text mb-1.5 uppercase tracking-wide">Slug</label>
        <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)}
          className="w-full px-3 py-2 border border-gray-border rounded-md text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" required />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-text mb-1.5 uppercase tracking-wide">Açıklama</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2}
          className="w-full px-3 py-2 border border-gray-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-text mb-1.5 uppercase tracking-wide">Sıra</label>
        <input type="number" value={order} onChange={(e) => setOrder(parseInt(e.target.value))}
          className="w-24 px-3 py-2 border border-gray-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
      </div>
      <div className="flex gap-2 pt-2">
        <button type="submit" disabled={loading} className="btn-primary disabled:opacity-50">
          {loading ? "Kaydediliyor..." : kategori ? "Güncelle" : "Oluştur"}
        </button>
        <button type="button" onClick={onCancel} className="btn-secondary">İptal</button>
      </div>
    </form>
  );
}
