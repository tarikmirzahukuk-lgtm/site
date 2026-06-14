"use client";

import { useRef, useState } from "react";
import MakaleKart from "@/components/public/MakaleKart";
import BosDurum from "@/components/public/BosDurum";
import AramaOnerileri from "@/components/public/AramaOnerileri";
import Icon from "@/components/public/icons/Icon";
import { IMakale } from "@/types";

export default function AraClient() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<IMakale[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const runSearch = async (term: string) => {
    setError("");
    if (term.trim().length < 2) {
      setError("En az 2 karakter girin");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/ara?q=${encodeURIComponent(term)}`);
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    runSearch(query);
  };

  const handleClear = () => {
    setQuery("");
    setSearched(false);
    setError("");
    inputRef.current?.focus();
  };

  const handleOneri = (kelime: string) => {
    setQuery(kelime);
    runSearch(kelime);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-16 md:py-20">
      <header className="text-center mb-10">
        <p className="kicker mb-4">Arşiv</p>
        <h1
          className="display-monument"
          style={{ fontSize: "clamp(2rem, 5vw, 3.25rem)" }}
        >
          Makale <span className="italic-gold">ara</span>
        </h1>
        <div className="gold-rule-sm mx-auto mt-6" aria-hidden="true" />
      </header>

      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSearch} className="flex gap-3 mb-4">
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Başlık veya içerik ara..."
              aria-label="Makale ara"
              className="w-full px-4 py-3 text-sm"
              style={{
                background: "var(--color-panel)",
                border: "1px solid var(--rule-dim)",
                color: "var(--color-ink)",
                paddingRight: query ? 48 : undefined,
              }}
              autoFocus
            />
            {query && (
              <button
                type="button"
                onClick={handleClear}
                aria-label="Aramayı temizle"
                className="ara-temizle absolute top-0 right-0 flex h-full w-11 items-center justify-center"
                style={{ color: "var(--color-muted)" }}
              >
                <Icon name="close" size={18} />
              </button>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary px-6 disabled:opacity-50"
          >
            {loading ? "Aranıyor..." : "Ara"}
          </button>
        </form>

        {/* Yükleniyor — nabız satır göstergesi */}
        {loading && (
          <div className="mb-4" aria-hidden="true">
            <div className="skeleton skeleton-line" style={{ width: "100%", height: 12 }} />
            <div className="skeleton skeleton-line mt-2" style={{ width: "60%", height: 12 }} />
          </div>
        )}

        {/* Erişilebilirlik — durum duyuruları */}
        <div aria-live="polite" className="sr-only">
          {loading
            ? "Kelimeler taranıyor"
            : error
              ? error
              : searched
                ? `${query} için ${results.length} sonuç bulundu.`
                : ""}
        </div>

        {error && (
          <div
            role="alert"
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
          <p className="text-sm" style={{ color: "var(--color-muted)" }}>
            &quot;{query}&quot; için {results.length} sonuç bulundu.
          </p>
        )}

        {!searched && !loading && <AramaOnerileri onSec={handleOneri} />}
      </div>

      {searched && !error && (
        <div className="mt-8">
          {results.length > 0 ? (
            <>
              <div className="gold-rule mx-auto mb-8" aria-hidden="true" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {results.map((makale) => (
                  <MakaleKart key={makale._id} makale={makale} />
                ))}
              </div>
            </>
          ) : (
            <BosDurum
              baslik="Eşleşen makale yok"
              aciklama="Aramanızla eşleşen bir çalışma bulunamadı. Farklı bir kelime deneyin ya da arşivin tümüne göz atın."
              ctaLabel="Makaleler arşivine göz at"
              ctaHref="/makaleler"
            />
          )}
        </div>
      )}
    </div>
  );
}
