"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { IMakale } from "@/types";

export default function MakalelerPage() {
  const [makaleler, setMakaleler] = useState<IMakale[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const fetchMakaleler = async () => {
    const params = new URLSearchParams();
    if (statusFilter) params.set("status", statusFilter);
    const res = await fetch(`/api/makaleler?${params}`);
    const data = await res.json();
    setMakaleler(data.makaleler);
  };

  useEffect(() => {
    fetchMakaleler();
  }, [statusFilter]);

  const handleDelete = async (id: string) => {
    if (!confirm("Bu makaleyi silmek istediğinize emin misiniz?")) return;
    await fetch(`/api/makaleler/${id}`, { method: "DELETE" });
    fetchMakaleler();
  };

  const filtered = makaleler.filter((m) =>
    m.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">Makaleler</h1>
        <Link href="/admin/makaleler/yeni" className="btn-primary">
          Yeni Makale
        </Link>
      </div>
      <div className="flex gap-3 mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Makale ara..."
          className="flex-1 max-w-xs px-3 py-2 border border-gray-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">Tüm Durumlar</option>
          <option value="yayinda">Yayında</option>
          <option value="taslak">Taslak</option>
        </select>
      </div>
      <div className="bg-white rounded-lg border border-gray-border">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-border text-left">
              <th className="px-5 py-3 text-xs font-medium text-gray-text uppercase tracking-wide">
                Başlık
              </th>
              <th className="px-5 py-3 text-xs font-medium text-gray-text uppercase tracking-wide">
                Kategori
              </th>
              <th className="px-5 py-3 text-xs font-medium text-gray-text uppercase tracking-wide">
                Durum
              </th>
              <th className="px-5 py-3 text-xs font-medium text-gray-text uppercase tracking-wide">
                Tarih
              </th>
              <th className="px-5 py-3 text-xs font-medium text-gray-text uppercase tracking-wide">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-border">
            {filtered.map((makale) => (
              <tr
                key={makale._id}
                className="hover:bg-gray-light transition-colors"
              >
                <td className="px-5 py-3">
                  <Link
                    href={`/admin/makaleler/${makale._id}`}
                    className="text-sm font-medium hover:text-primary"
                  >
                    {makale.title}
                  </Link>
                </td>
                <td className="px-5 py-3 text-sm text-gray-text">
                  {typeof makale.category === "object"
                    ? makale.category.name
                    : "\u2014"}
                </td>
                <td className="px-5 py-3">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      makale.status === "yayinda"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-text"
                    }`}
                  >
                    {makale.status === "yayinda" ? "Yayında" : "Taslak"}
                  </span>
                </td>
                <td className="px-5 py-3 text-sm text-gray-text">
                  {formatDate(makale.createdAt)}
                </td>
                <td className="px-5 py-3">
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/makaleler/${makale._id}`}
                      className="text-xs text-primary hover:underline"
                    >
                      Düzenle
                    </Link>
                    <button
                      onClick={() => handleDelete(makale._id)}
                      className="text-xs text-red-600 hover:underline"
                    >
                      Sil
                    </button>
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
