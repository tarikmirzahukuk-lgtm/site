"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import MakaleEditoru from "@/components/admin/MakaleEditoru";
import { IKategori, IMakale } from "@/types";

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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch(`/api/makaleler/${id}`).then((r) => r.json()),
      fetch("/api/kategoriler").then((r) => r.json()),
    ]).then(([makale, kats]: [IMakale, IKategori[]]) => {
      setTitle(makale.title);
      setSlug(makale.slug);
      setExcerpt(makale.excerpt);
      setContent(makale.content);
      setCategory(
        typeof makale.category === "string"
          ? makale.category
          : makale.category._id
      );
      setCoverImage(makale.coverImage);
      setStatus(makale.status);
      setTags(makale.tags.join(", "));
      setKategoriler(kats);
      setLoading(false);
    });
  }, [id]);

  const handleCoverUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (data.url) setCoverImage(data.url);
  };

  const handleSave = async (newStatus?: "taslak" | "yayinda") => {
    setSaving(true);
    await fetch(`/api/makaleler/${id}`, {
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
      }),
    });
    setSaving(false);
    router.push("/admin/makaleler");
  };

  if (loading)
    return <p className="text-gray-text text-sm">Yukleniyor...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold">Makale Duzenle</h1>
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
            Yayinla
          </button>
        </div>
      </div>
      <div className="grid grid-cols-[1fr_280px] gap-5">
        <div className="space-y-3">
          <div className="bg-white border border-gray-border rounded-lg p-4">
            <label className="block text-xs font-medium text-gray-text mb-2 uppercase tracking-wide">
              Baslik
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
              Ozet
            </label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={2}
              className="w-full text-sm border-none focus:outline-none resize-none"
            />
          </div>
          <MakaleEditoru content={content} onChange={setContent} />
        </div>
        <div className="space-y-3">
          <div className="bg-white border border-gray-border rounded-lg p-4">
            <label className="block text-xs font-medium text-gray-text mb-2 uppercase tracking-wide">
              Kapak Gorseli
            </label>
            {coverImage ? (
              <div className="relative">
                <img
                  src={coverImage}
                  alt="Kapak"
                  className="w-full h-32 object-cover rounded-md"
                />
                <button
                  onClick={() => setCoverImage("")}
                  className="absolute top-1 right-1 bg-white rounded-full w-6 h-6 text-xs flex items-center justify-center shadow"
                >
                  x
                </button>
              </div>
            ) : (
              <label className="block h-32 bg-gray-light rounded-md border-2 border-dashed border-gray-border cursor-pointer flex items-center justify-center hover:border-primary transition-colors">
                <div className="text-center">
                  <p className="text-2xl mb-1">+</p>
                  <p className="text-xs text-gray-text">Gorsel yukle</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverUpload}
                  className="hidden"
                />
              </label>
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
              <option value="">Kategori secin</option>
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
                Yayinda
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
              placeholder="virgülle ayirin"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
