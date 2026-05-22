"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { IMakale } from "@/types";

export default function MakalelerPage() {
  const [makaleler, setMakaleler] = useState<IMakale[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchMakaleler = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.set("status", statusFilter);
      const res = await fetch(`/api/makaleler?${params}`);
      if (!res.ok) {
        setError("Makaleler yüklenemedi");
        setMakaleler([]);
        return;
      }
      const data = await res.json();
      setMakaleler(Array.isArray(data?.makaleler) ? data.makaleler : []);
      setError("");
    } catch {
      setError("Ağ hatası");
      setMakaleler([]);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchMakaleler();
  }, [fetchMakaleler]);

  const handleDelete = async (id: string) => {
    if (!confirm("Bu makaleyi silmek istediğinize emin misiniz?")) return;
    setError("");
    const res = await fetch(`/api/makaleler/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Silinemedi");
      return;
    }
    fetchMakaleler();
  };

  const filtered = makaleler.filter((m) =>
    m.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1
          className="text-xl font-bold text-[var(--color-ink)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Makaleler
        </h1>
        <Link href="/admin/makaleler/yeni" className="btn-primary">
          Yeni Makale
        </Link>
      </div>

      {error && (
        <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-300 text-sm rounded-md px-4 py-2">
          {error}
        </div>
      )}

      <div className="flex gap-3 mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Makale ara..."
          className="flex-1 max-w-xs px-3 py-2 bg-[var(--color-panel-hi)] border border-[var(--rule-dim)] text-[var(--color-ink)] rounded-md text-sm focus:outline-none focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)] placeholder:text-[var(--color-muted-dim)]"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 bg-[var(--color-panel-hi)] border border-[var(--rule-dim)] text-[var(--color-ink)] rounded-md text-sm focus:outline-none focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)]"
        >
          <option value="">Tüm Durumlar</option>
          <option value="yayinda">Yayında</option>
          <option value="taslak">Taslak</option>
        </select>
      </div>
      <div className="bg-[var(--color-panel)] rounded-lg border border-[var(--rule-dim)]">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--rule-dim)] text-left">
              <th className="px-5 py-3 text-xs font-medium text-[var(--color-muted)] uppercase tracking-wide">
                Başlık
              </th>
              <th className="px-5 py-3 text-xs font-medium text-[var(--color-muted)] uppercase tracking-wide">
                Kategori
              </th>
              <th className="px-5 py-3 text-xs font-medium text-[var(--color-muted)] uppercase tracking-wide">
                Durum
              </th>
              <th className="px-5 py-3 text-xs font-medium text-[var(--color-muted)] uppercase tracking-wide">
                Tarih
              </th>
              <th className="px-5 py-3 text-xs font-medium text-[var(--color-muted)] uppercase tracking-wide">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--rule-dim)]">
            {filtered.map((makale) => (
              <tr
                key={makale._id}
                className="hover:bg-[var(--color-panel-hi)] transition-colors"
              >
                <td className="px-5 py-3">
                  <Link
                    href={`/admin/makaleler/${makale._id}`}
                    className="text-sm font-medium text-[var(--color-body)] hover:text-[var(--color-gold)]"
                  >
                    {makale.title}
                  </Link>
                </td>
                <td className="px-5 py-3 text-sm text-[var(--color-muted)]">
                  {makale.category &&
                  typeof makale.category === "object"
                    ? makale.category.name
                    : "—"}
                </td>
                <td className="px-5 py-3">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      makale.status === "yayinda"
                        ? "bg-green-500/15 text-green-400"
                        : "bg-[var(--color-panel-hi)] text-[var(--color-muted)]"
                    }`}
                  >
                    {makale.status === "yayinda" ? "Yayında" : "Taslak"}
                  </span>
                </td>
                <td className="px-5 py-3 text-sm text-[var(--color-muted)]">
                  {formatDate(makale.createdAt)}
                </td>
                <td className="px-5 py-3">
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/makaleler/${makale._id}`}
                      className="text-xs text-[var(--color-gold)] hover:underline"
                    >
                      Düzenle
                    </Link>
                    <button
                      onClick={() => handleDelete(makale._id)}
                      className="text-xs text-red-400 hover:underline"
                    >
                      Sil
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!loading && filtered.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-5 py-8 text-center text-sm text-[var(--color-muted)]"
                >
                  {search
                    ? "Aramanızla eşleşen makale bulunamadı."
                    : "Henüz makale yok."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
