"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function GirisPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("E-posta veya şifre hatalı.");
      setLoading(false);
    } else {
      router.push("/admin");
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          {/* Gold monogram */}
          <div className="inline-flex items-center justify-center w-[38px] h-[38px] border border-[var(--color-gold)] rounded mb-4">
            <span
              className="text-[var(--color-gold)] text-xl italic"
              style={{ fontFamily: "var(--font-display)" }}
            >
              T
            </span>
          </div>
          <h1
            className="text-2xl font-bold text-[var(--color-ink)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Tarık Mirza
          </h1>
          <p className="text-[var(--color-muted)] text-sm mt-1">Yönetim Paneli</p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="bg-[var(--color-panel)] rounded-lg border border-[var(--rule)] p-6 space-y-4"
        >
          <div>
            <label className="block text-xs font-medium text-[var(--color-muted)] mb-1.5 uppercase tracking-wide">
              E-posta
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-[var(--color-panel-hi)] border border-[var(--rule-dim)] text-[var(--color-ink)] rounded-md text-sm focus:outline-none focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)] placeholder:text-[var(--color-muted-dim)]"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--color-muted)] mb-1.5 uppercase tracking-wide">
              Şifre
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-[var(--color-panel-hi)] border border-[var(--rule-dim)] text-[var(--color-ink)] rounded-md text-sm focus:outline-none focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)] placeholder:text-[var(--color-muted-dim)]"
              required
            />
          </div>
          {error && (
            <p className="text-red-300 text-sm">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-2.5 disabled:opacity-50"
          >
            {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
          </button>
        </form>
      </div>
    </div>
  );
}
