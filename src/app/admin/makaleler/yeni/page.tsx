"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MakaleEditoru from "@/components/admin/MakaleEditoru";
import { slugify } from "@/lib/utils";
import { IKategori } from "@/types";

export default function YeniMakalePage() {
  const router = useRouter();
  const [kategoriler, setKategoriler] = useState<IKategori[]>([]);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/kategoriler")
      .then((r) => r.json())
      .then(setKategoriler);
  }, []);

  const handleTitleChange = (v: string) => {
    setTitle(v);
    setSlug(slugify(v));
  };

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

  const handleSave = async (status: "taslak" | "yayinda") => {
    setLoading(true);
    const res = await fetch("/api/makaleler", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        slug,
        excerpt,
        content,
        category,
        coverImage,
        status,
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      }),
    });
    if (res.ok) router.push("/admin/makaleler");
    setLoading(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold">Yeni Makale</h1>
          <p className="text-gray-text text-sm mt-1">
            Makale olustur ve yayinla
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleSave("taslak")}
            disabled={loading}
            className="btn-secondary disabled:opacity-50"
          >
            Taslak Kaydet
          </button>
          <button
            onClick={() => handleSave("yayinda")}
            disabled={loading}
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
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full text-xl font-bold border-b border-gray-border pb-2 focus:outline-none focus:border-primary"
              placeholder="Makale basligi"
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
              placeholder="Makale ozeti (kart ve SEO icin)"
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
