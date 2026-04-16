"use client";

import { useEffect, useState } from "react";
import KategoriForm from "@/components/admin/KategoriForm";
import { IKategori } from "@/types";

export default function KategorilerPage() {
  const [kategoriler, setKategoriler] = useState<IKategori[]>([]);
  const [editing, setEditing] = useState<IKategori | null>(null);
  const [showForm, setShowForm] = useState(false);

  const fetchKategoriler = async () => {
    const res = await fetch("/api/kategoriler");
    const data = await res.json();
    setKategoriler(data);
  };

  useEffect(() => { fetchKategoriler(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Bu kategoriyi silmek istediğinize emin misiniz?")) return;
    await fetch(`/api/kategoriler/${id}`, { method: "DELETE" });
    fetchKategoriler();
  };

  const handleSave = () => { setShowForm(false); setEditing(null); fetchKategoriler(); };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">Kategoriler</h1>
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="btn-primary">Yeni Kategori</button>
      </div>
      {(showForm || editing) && (
        <div className="mb-6">
          <KategoriForm kategori={editing || undefined} onSave={handleSave}
            onCancel={() => { setShowForm(false); setEditing(null); }} />
        </div>
      )}
      <div className="bg-white rounded-lg border border-gray-border">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-border text-left">
              <th className="px-5 py-3 text-xs font-medium text-gray-text uppercase tracking-wide">Sıra</th>
              <th className="px-5 py-3 text-xs font-medium text-gray-text uppercase tracking-wide">Ad</th>
              <th className="px-5 py-3 text-xs font-medium text-gray-text uppercase tracking-wide">Slug</th>
              <th className="px-5 py-3 text-xs font-medium text-gray-text uppercase tracking-wide">Açıklama</th>
              <th className="px-5 py-3 text-xs font-medium text-gray-text uppercase tracking-wide">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-border">
            {kategoriler.map((kat) => (
              <tr key={kat._id} className="hover:bg-gray-light transition-colors">
                <td className="px-5 py-3 text-sm">{kat.order}</td>
                <td className="px-5 py-3 text-sm font-medium">{kat.name}</td>
                <td className="px-5 py-3 text-sm text-gray-text font-mono">{kat.slug}</td>
                <td className="px-5 py-3 text-sm text-gray-text">{kat.description}</td>
                <td className="px-5 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => { setEditing(kat); setShowForm(false); }} className="text-xs text-primary hover:underline">Düzenle</button>
                    <button onClick={() => handleDelete(kat._id)} className="text-xs text-red-600 hover:underline">Sil</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
