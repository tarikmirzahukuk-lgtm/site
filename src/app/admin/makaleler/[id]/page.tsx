"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import MakaleEditoru from "@/components/admin/MakaleEditoru";
import FaqEditor from "@/components/admin/FaqEditor";
import { IFaq, IKategori, IMakale } from "@/types";

export default function MakaleDuzenlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [kategoriler, setKategoriler] = useState<IKategori[]>([]);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [status, setStatus] = useState<"taslak" | "yayinda">("taslak");
  const [tags, setTags] = useState("");
  const [faqs, setFaqs] = useState<IFaq[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [loadError, setLoadError] = useState("");
  const [uploadError, setUploadError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [makaleRes, katRes] = await Promise.all([
          fetch(`/api/makaleler/${id}`),
          fetch("/api/kategoriler"),
        ]);
        if (!makaleRes.ok) {
          setLoadError("Makale yüklenemedi");
          setLoading(false);
          return;
        }
        const makale: IMakale = await makaleRes.json();
        const kats: IKategori[] = katRes.ok ? await katRes.json() : [];

        setTitle(makale.title ?? "");
        setSlug(makale.slug ?? "");
        setExcerpt(makale.excerpt ?? "");
        setContent(makale.content ?? "");
        setCategory(
          makale.category && typeof makale.category === "object"
            ? makale.category._id
            : (makale.category as string) ?? ""
        );
        setCoverImage(makale.coverImage ?? "");
        setStatus(makale.status ?? "taslak");
        setTags(Array.isArray(makale.tags) ? makale.tags.join(", ") : "");
        setFaqs(Array.isArray(makale.faqs) ? makale.faqs : []);
        setKategoriler(Array.isArray(kats) ? kats : []);
        setLoading(false);
      } catch {
        setLoadError("Ağ hatası");
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleCoverUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setUploadError("");
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.url) {
        setUploadError(data.error || "Görsel yüklenemedi");
        return;
      }
      setCoverImage(data.url);
    } catch {
      setUploadError("Ağ hatası, tekrar deneyin");
    }
  };

  const handleSave = async (newStatus?: "taslak" | "yayinda") => {
    setError("");

    if (!title.trim() || !excerpt.trim() || !category) {
      setError("Başlık, özet ve kategori zorunludur");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`/api/makaleler/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug,
          excerpt,
          content,
          category,
          coverImage,
          status: newStatus || status,
          tags: tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
          faqs: faqs.filter((f) => f.question.trim() && f.answer.trim()),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Makale güncellenemedi");
        setSaving(false);
        return;
      }

      router.push("/admin/makaleler");
    } catch {
      setError("Ağ hatası, tekrar deneyin");
      setSaving(false);
    }
  };

  if (loading)
    return <p className="text-gray-text text-sm">Yükleniyor...</p>;

  if (loadError)
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-md px-4 py-2">
        {loadError}
      </div>
    );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold">Makale Düzenle</h1>
          <p className="text-gray-text text-sm mt-1">{title}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleSave("taslak")}
            disabled={saving}
            className="btn-secondary disabled:opacity-50"
          >
            Taslak Kaydet
          </button>
          <button
            onClick={() => handleSave("yayinda")}
            disabled={saving}
            className="btn-primary disabled:opacity-50"
          >
            Yayınla
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md px-4 py-2">
          {error}
        </div>
      )}

      <div className="grid grid-cols-[1fr_280px] gap-5">
        <div className="space-y-3">
          <div className="bg-white border border-gray-border rounded-lg p-4">
            <label className="block text-xs font-medium text-gray-text mb-2 uppercase tracking-wide">
              Başlık
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-xl font-bold border-b border-gray-border pb-2 focus:outline-none focus:border-primary"
            />
          </div>
          <div className="bg-white border border-gray-border rounded-lg p-4">
            <label className="block text-xs font-medium text-gray-text mb-2 uppercase tracking-wide">
              Özet
            </label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={2}
              className="w-full text-sm border-none focus:outline-none resize-none"
            />
          </div>
          <MakaleEditoru content={content} onChange={setContent} />
          <div className="bg-white border border-gray-border rounded-lg p-4">
            <label className="block text-xs font-medium text-gray-text mb-3 uppercase tracking-wide">
              Sıkça Sorulan Sorular (opsiyonel — SEO için FAQ schema oluşturur)
            </label>
            <FaqEditor value={faqs} onChange={setFaqs} />
          </div>
        </div>
        <div className="space-y-3">
          <div className="bg-white border border-gray-border rounded-lg p-4">
            <label className="block text-xs font-medium text-gray-text mb-2 uppercase tracking-wide">
              Kapak Görseli
            </label>
            {coverImage ? (
              <div className="relative h-32 w-full rounded-md overflow-hidden">
                <Image
                  src={coverImage}
                  alt="Kapak"
                  fill
                  sizes="280px"
                  className="object-cover"
                />
                <button
                  onClick={() => setCoverImage("")}
                  className="absolute top-1 right-1 bg-white rounded-full w-6 h-6 text-xs flex items-center justify-center shadow z-10"
                >
                  x
                </button>
              </div>
            ) : (
              <label className="block h-32 bg-gray-light rounded-md border-2 border-dashed border-gray-border cursor-pointer flex items-center justify-center hover:border-primary transition-colors">
                <div className="text-center">
                  <p className="text-2xl mb-1">+</p>
                  <p className="text-xs text-gray-text">Görsel yükle</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverUpload}
                  className="hidden"
                />
              </label>
            )}
            {uploadError && (
              <p className="text-red-600 text-xs mt-2">{uploadError}</p>
            )}
          </div>
          <div className="bg-white border border-gray-border rounded-lg p-4">
            <label className="block text-xs font-medium text-gray-text mb-2 uppercase tracking-wide">
              Kategori
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Kategori seçin</option>
              {kategoriler.map((k) => (
                <option key={k._id} value={k._id}>
                  {k.name}
                </option>
              ))}
            </select>
          </div>
          <div className="bg-white border border-gray-border rounded-lg p-4">
            <label className="block text-xs font-medium text-gray-text mb-2 uppercase tracking-wide">
              URL (Slug)
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full px-3 py-2 border border-gray-border rounded-md text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="bg-white border border-gray-border rounded-lg p-4">
            <label className="block text-xs font-medium text-gray-text mb-2 uppercase tracking-wide">
              Durum
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setStatus("taslak")}
                className={`px-3 py-1.5 rounded-md text-xs font-medium ${
                  status === "taslak"
                    ? "bg-gray-200 text-dark"
                    : "bg-gray-light text-gray-text"
                }`}
              >
                Taslak
              </button>
              <button
                onClick={() => setStatus("yayinda")}
                className={`px-3 py-1.5 rounded-md text-xs font-medium ${
                  status === "yayinda"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-light text-gray-text"
                }`}
              >
                Yayında
              </button>
            </div>
          </div>
          <div className="bg-white border border-gray-border rounded-lg p-4">
            <label className="block text-xs font-medium text-gray-text mb-2 uppercase tracking-wide">
              Etiketler
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full px-3 py-2 border border-gray-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="virgülle ayırın"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
