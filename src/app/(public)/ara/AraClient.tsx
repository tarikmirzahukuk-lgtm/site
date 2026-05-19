"use client";

import { useState } from "react";
import MakaleKart from "@/components/public/MakaleKart";
import { IMakale } from "@/types";

export default function AraClient() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<IMakale[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (query.trim().length < 2) {
      setError("En az 2 karakter girin");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/ara?q=${encodeURIComponent(query)}`);
      if (!res.ok) {
        setError("Arama başarısız oldu");
        setResults([]);
        setSearched(true);
        return;
      }
      const data = await res.json();
      setResults(Array.isArray(data?.makaleler) ? data.makaleler : []);
      setSearched(true);
    } catch {
      setError("Ağ hatası, tekrar deneyin");
      setResults([]);
      setSearched(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1
        className="display text-2xl md:text-3xl mb-6"
        style={{ fontWeight: 600 }}
      >
        Makale Ara
      </h1>

      <form onSubmit={handleSearch} className="flex gap-3 mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Başlık veya içerik ara..."
          className="flex-1 px-4 py-3 text-sm focus:outline-none"
          style={{
            background: "var(--color-panel)",
            border: "1px solid var(--rule-dim)",
            color: "var(--color-ink)",
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = "var(--color-gold)"; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = "var(--rule-dim)"; }}
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

      {error && (
        <div
          className="mb-6 text-sm px-4 py-2"
          style={{
            background: "var(--color-panel)",
            border: "1px solid var(--rule-dim)",
            color: "#f87171",
          }}
        >
          {error}
        </div>
      )}

      {searched && !error && (
        <>
          <p className="text-sm mb-6" style={{ color: "var(--color-muted)" }}>
            &quot;{query}&quot; için {results.length} sonuç bulundu.
          </p>
          {results.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {results.map((makale) => (
                <MakaleKart key={makale._id} makale={makale} />
              ))}
            </div>
          ) : (
            <p className="text-center py-12" style={{ color: "var(--color-muted)" }}>
              Aramanızla eşleşen makale bulunamadı.
            </p>
          )}
        </>
      )}
    </div>
  );
}
