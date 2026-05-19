"use client";

import { useEffect, useState } from "react";
import { IKullanici, ISocials } from "@/types";
import YazarSosyalForm from "@/components/admin/YazarSosyalForm";

export default function YazarlarPage() {
  const [yazarlar, setYazarlar] = useState<IKullanici[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
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
      setListError("");
    } catch {
      setListError("Ağ hatası");
      setYazarlar([]);
    }
  };

  useEffect(() => {
    fetchYazarlar();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setEmail("");
    setPassword("");
    setRole("yazar");
    setBio("");
    setSocials({});
    setError("");
  };

  const handleNew = () => {
    resetForm();
    setShowForm(true);
  };

  const handleEdit = (y: IKullanici) => {
    setEditingId(y._id);
    setName(y.name);
    setEmail(y.email);
    setPassword(""); // password is never pre-filled
    setRole(y.role);
    setBio(y.bio || "");
    setSocials(y.socials || {});
    setError("");
    setShowForm(true);
  };

  const handleDelete = async (y: IKullanici) => {
    if (
      !confirm(
        `${y.name} adlı yazarı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`
      )
    )
      return;
    setListError("");
    try {
      const res = await fetch(`/api/yazarlar/${y._id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setListError(data.error || "Silinemedi");
        return;
      }
      fetchYazarlar();
    } catch {
      setListError("Ağ hatası");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim()) {
      setError("Ad ve e-posta zorunludur");
      return;
    }
    // password zorunlu yalnızca create'de
    if (!editingId && !password) {
      setError("Şifre zorunludur");
      return;
    }
    if (password && password.length < 6) {
      setError("Şifre en az 6 karakter olmalı");
      return;
    }

    setLoading(true);
    try {
      const url = editingId ? `/api/yazarlar/${editingId}` : "/api/yazarlar";
      const method = editingId ? "PUT" : "POST";
      const body: Record<string, unknown> = {
        name,
        email,
        role,
        bio,
        socials,
      };
      // password sadece dolu ise gönder (PUT'ta opsiyonel)
      if (password) body.password = password;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(
          data.error || (editingId ? "Güncellenemedi" : "Yazar oluşturulamadı")
        );
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
        <button onClick={handleNew} className="btn-primary">
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
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-sm">
              {editingId ? "Yazarı Düzenle" : "Yeni Yazar"}
            </h2>
            {editingId && (
              <span className="text-xs text-gray-text">
                Slug değişmez — URL stabil kalır
              </span>
            )}
          </div>
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
                Şifre {editingId && <span className="text-gray-text normal-case">(boş bırak = değişmez)</span>}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={editingId ? undefined : 6}
                className="w-full px-3 py-2 border border-gray-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                required={!editingId}
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
              {loading
                ? "Kaydediliyor..."
                : editingId
                ? "Güncelle"
                : "Oluştur"}
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
              <th className="px-5 py-3 text-xs font-medium text-gray-text uppercase tracking-wide">İşlemler</th>
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
                <td className="px-5 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(y)}
                      className="text-xs text-primary hover:underline"
                    >
                      Düzenle
                    </button>
                    <button
                      onClick={() => handleDelete(y)}
                      className="text-xs text-red-600 hover:underline"
                    >
                      Sil
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {yazarlar.length === 0 && !listError && (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-sm text-gray-text">
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
