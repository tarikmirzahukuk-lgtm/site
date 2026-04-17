"use client";

import { useState } from "react";
import MakaleKart from "@/components/public/MakaleKart";
import { IMakale } from "@/types";

export default function AramaSayfasi() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<IMakale[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim().length < 2) return;

    setLoading(true);
    const res = await fetch(`/api/ara?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    setResults(data.makaleler);
    setSearched(true);
    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-extrabold mb-6">Makale Ara</h1>

      <form onSubmit={handleSearch} className="flex gap-3 mb-10">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Başlık veya içerik ara..."
          className="flex-1 px-4 py-3 border border-gray-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          autoFocus
        />
        <button
          type="submit"
          disabled={loading}
          className="btn-primary px-6 disabled:opacity-50"
        >
          {loading ? "Aranıyor..." : "Ara"}
        </button>
      </form>

      {searched && (
        <>
          <p className="text-sm text-gray-text mb-6">
            &quot;{query}&quot; için {results.length} sonuç bulundu.
          </p>
          {results.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {results.map((makale) => (
                <MakaleKart key={makale._id} makale={makale} />
              ))}
            </div>
          ) : (
            <p className="text-gray-text text-center py-12">
              Aramanızla eşleşen makale bulunamadı.
            </p>
          )}
        </>
      )}
    </div>
  );
}
