"use client";

import { useEffect, useState } from "react";
import { IKullanici, ISocials } from "@/types";
import YazarSosyalForm from "@/components/admin/YazarSosyalForm";

export default function YazarlarPage() {
  const [yazarlar, setYazarlar] = useState<IKullanici[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "yazar">("yazar");
  const [bio, setBio] = useState("");
  const [socials, setSocials] = useState<ISocials>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [listError, setListError] = useState("");

  const fetchYazarlar = async () => {
    try {
      const res = await fetch("/api/yazarlar");
      if (!res.ok) {
        setListError("Yazarlar yüklenemedi");
        setYazarlar([]);
        return;
      }
      const data = await res.json();
      setYazarlar(Array.isArray(data) ? data : []);
    } catch {
      setListError("Ağ hatası");
      setYazarlar([]);
    }
  };

  useEffect(() => {
    fetchYazarlar();
  }, []);

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setRole("yazar");
    setBio("");
    setSocials({});
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !password) {
      setError("Ad, e-posta ve şifre zorunludur");
      return;
    }
    if (password.length < 6) {
      setError("Şifre en az 6 karakter olmalı");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/yazarlar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role, bio, socials }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Yazar oluşturulamadı");
        setLoading(false);
        return;
      }

      setLoading(false);
      setShowForm(false);
      resetForm();
      fetchYazarlar();
    } catch {
      setError("Ağ hatası, tekrar deneyin");
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">Yazarlar</h1>
        <button
          onClick={() => {
            setShowForm(true);
            setError("");
          }}
          className="btn-primary"
        >
          Yeni Yazar
        </button>
      </div>

      {listError && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md px-4 py-2">
          {listError}
        </div>
      )}

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg border border-gray-border p-5 space-y-4 mb-6"
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-text mb-1.5 uppercase tracking-wide">
                Ad
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-text mb-1.5 uppercase tracking-wide">
                E-posta
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-text mb-1.5 uppercase tracking-wide">
                Şifre
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                className="w-full px-3 py-2 border border-gray-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-text mb-1.5 uppercase tracking-wide">
                Rol
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as "admin" | "yazar")}
                className="w-full px-3 py-2 border border-gray-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="yazar">Yazar</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-text mb-1.5 uppercase tracking-wide">
              Biyografi
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-text mb-2 uppercase tracking-wide">
              Sosyal Bağlantılar (opsiyonel — E-A-T sinyali için)
            </label>
            <YazarSosyalForm value={socials} onChange={setSocials} />
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary disabled:opacity-50"
            >
              {loading ? "Kaydediliyor..." : "Oluştur"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                resetForm();
              }}
              className="btn-secondary"
            >
              İptal
            </button>
          </div>
        </form>
      )}
      <div className="bg-white rounded-lg border border-gray-border">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-border text-left">
              <th className="px-5 py-3 text-xs font-medium text-gray-text uppercase tracking-wide">Ad</th>
              <th className="px-5 py-3 text-xs font-medium text-gray-text uppercase tracking-wide">E-posta</th>
              <th className="px-5 py-3 text-xs font-medium text-gray-text uppercase tracking-wide">Rol</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-border">
            {yazarlar.map((y) => (
              <tr key={y._id} className="hover:bg-gray-light transition-colors">
                <td className="px-5 py-3 text-sm font-medium">{y.name}</td>
                <td className="px-5 py-3 text-sm text-gray-text">{y.email}</td>
                <td className="px-5 py-3">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      y.role === "admin"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-text"
                    }`}
                  >
                    {y.role === "admin" ? "Admin" : "Yazar"}
                  </span>
                </td>
              </tr>
            ))}
            {yazarlar.length === 0 && !listError && (
              <tr>
                <td colSpan={3} className="px-5 py-8 text-center text-sm text-gray-text">
                  Henüz yazar yok.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
