"use client";

import { useEffect, useState } from "react";
import KategoriForm from "@/components/admin/KategoriForm";
import { IKategori } from "@/types";

export default function KategorilerPage() {
  const [kategoriler, setKategoriler] = useState<IKategori[]>([]);
  const [editing, setEditing] = useState<IKategori | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchKategoriler = async () => {
    try {
      const res = await fetch("/api/kategoriler");
      if (!res.ok) {
        setError("Kategoriler yüklenemedi");
        setKategoriler([]);
        return;
      }
      const data = await res.json();
      setKategoriler(Array.isArray(data) ? data : []);
    } catch {
      setError("Ağ hatası");
      setKategoriler([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKategoriler();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Bu kategoriyi silmek istediğinize emin misiniz?")) return;
    setError("");
    const res = await fetch(`/api/kategoriler/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Silinemedi");
      return;
    }
    fetchKategoriler();
  };

  const handleSave = () => {
    setShowForm(false);
    setEditing(null);
    fetchKategoriler();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1
          className="text-xl font-bold text-[var(--color-ink)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Kategoriler
        </h1>
        <button
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
          className="btn-primary"
        >
          Yeni Kategori
        </button>
      </div>

      {error && (
        <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-300 text-sm rounded-md px-4 py-2">
          {error}
        </div>
      )}

      {(showForm || editing) && (
        <div className="mb-6">
          <KategoriForm
            kategori={editing || undefined}
            onSave={handleSave}
            onCancel={() => {
              setShowForm(false);
              setEditing(null);
            }}
          />
        </div>
      )}
      <div className="bg-[var(--color-panel)] rounded-lg border border-[var(--rule-dim)]">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--rule-dim)] text-left">
              <th className="px-5 py-3 text-xs font-medium text-[var(--color-muted)] uppercase tracking-wide">
                Sıra
              </th>
              <th className="px-5 py-3 text-xs font-medium text-[var(--color-muted)] uppercase tracking-wide">
                Ad
              </th>
              <th className="px-5 py-3 text-xs font-medium text-[var(--color-muted)] uppercase tracking-wide">
                Slug
              </th>
              <th className="px-5 py-3 text-xs font-medium text-[var(--color-muted)] uppercase tracking-wide">
                Açıklama
              </th>
              <th className="px-5 py-3 text-xs font-medium text-[var(--color-muted)] uppercase tracking-wide">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--rule-dim)]">
            {kategoriler.map((kat) => (
              <tr
                key={kat._id}
                className="hover:bg-[var(--color-panel-hi)] transition-colors"
              >
                <td className="px-5 py-3 text-sm text-[var(--color-body)]">{kat.order}</td>
                <td className="px-5 py-3 text-sm font-medium text-[var(--color-body)]">{kat.name}</td>
                <td className="px-5 py-3 text-sm text-[var(--color-muted)] font-mono">
                  {kat.slug}
                </td>
                <td className="px-5 py-3 text-sm text-[var(--color-muted)]">
                  {kat.description}
                </td>
                <td className="px-5 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditing(kat);
                        setShowForm(false);
                      }}
                      className="text-xs text-[var(--color-gold)] hover:underline"
                    >
                      Düzenle
                    </button>
                    <button
                      onClick={() => handleDelete(kat._id)}
                      className="text-xs text-red-400 hover:underline"
                    >
                      Sil
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!loading && kategoriler.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-5 py-8 text-center text-sm text-[var(--color-muted)]"
                >
                  Henüz kategori yok.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
