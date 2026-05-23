"use client";

import { useEffect, useState } from "react";
import MakaleEditoru from "@/components/admin/MakaleEditoru";
import ListEditor from "@/components/admin/site-icerik/ListEditor";
import ImageField from "@/components/admin/site-icerik/ImageField";
import { inputClass, labelClass, panelClass } from "@/components/admin/site-icerik/ui";
import type { ISiteContent } from "@/types";

type Tab = "anasayfa" | "hakkimda" | "iletisim" | "ayarlar";

const TABS: { id: Tab; label: string }[] = [
  { id: "anasayfa", label: "Ana Sayfa" },
  { id: "hakkimda", label: "Hakkımda" },
  { id: "iletisim", label: "İletişim" },
  { id: "ayarlar", label: "Ayarlar" },
];

// --- küçük alan bileşenleri ---
function Text({
  label,
  value,
  onChange,
  mono,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  mono?: boolean;
}) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <input
        type="text"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className={mono ? `${inputClass} font-mono` : inputClass}
      />
    </div>
  );
}

function Area({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <textarea
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className={inputClass}
      />
    </div>
  );
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`${panelClass} space-y-3`}>
      <h3 className="text-sm font-semibold text-[var(--color-ink)]">{title}</h3>
      {children}
    </div>
  );
}

export default function SiteIcerikPage() {
  const [content, setContent] = useState<ISiteContent | null>(null);
  const [tab, setTab] = useState<Tab>("anasayfa");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetch("/api/site-content")
      .then((r) => r.json())
      .then((data) => setContent(data))
      .catch(() => setError("İçerik yüklenemedi"))
      .finally(() => setLoading(false));
  }, []);

  const set = (updater: (c: ISiteContent) => ISiteContent) =>
    setContent((c) => (c ? updater(c) : c));

  const save = async () => {
    if (!content) return;
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/site-content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Kaydedilemedi");
      } else {
        setContent(data);
        setSuccess("Kaydedildi. Değişiklikler yayında.");
      }
    } catch {
      setError("Kaydedilemedi");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return <p className="text-[var(--color-muted)] text-sm">Yükleniyor...</p>;
  if (!content)
    return (
      <p className="text-red-300 text-sm">
        {error || "İçerik yüklenemedi"}
      </p>
    );

  const c = content;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1
          className="text-xl font-bold text-[var(--color-ink)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Site İçeriği
        </h1>
        <button
          onClick={save}
          disabled={saving}
          className="btn-primary disabled:opacity-50"
        >
          {saving ? "Kaydediliyor..." : "Kaydet"}
        </button>
      </div>

      {error && (
        <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-300 text-sm rounded-md px-4 py-2">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 bg-green-500/10 border border-green-500/30 text-green-400 text-sm rounded-md px-4 py-2">
          {success}
        </div>
      )}

      {/* Sekmeler */}
      <div className="flex gap-1 mb-6 border-b border-[var(--rule-dim)]">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 text-sm font-medium -mb-px border-b-2 transition-colors ${
              tab === t.id
                ? "border-[var(--color-gold)] text-[var(--color-gold)]"
                : "border-transparent text-[var(--color-muted)] hover:text-[var(--color-ink)]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* --- ANA SAYFA --- */}
      {tab === "anasayfa" && (
        <div className="space-y-4 max-w-3xl">
          <Card title="Hero (üst alan)">
            <Text label="Kicker" value={c.hero.kicker} onChange={(v) => set((c) => ({ ...c, hero: { ...c.hero, kicker: v } }))} />
            <Text label="Başlık (vurgu için *...*)" value={c.hero.heading} onChange={(v) => set((c) => ({ ...c, hero: { ...c.hero, heading: v } }))} />
            <Area label="Alt metin" value={c.hero.subtext} onChange={(v) => set((c) => ({ ...c, hero: { ...c.hero, subtext: v } }))} />
            <div className="grid grid-cols-2 gap-3">
              <Text label="1. Buton metni" value={c.hero.primaryCta.label} onChange={(v) => set((c) => ({ ...c, hero: { ...c.hero, primaryCta: { ...c.hero.primaryCta, label: v } } }))} />
              <Text label="1. Buton link" value={c.hero.primaryCta.href} onChange={(v) => set((c) => ({ ...c, hero: { ...c.hero, primaryCta: { ...c.hero.primaryCta, href: v } } }))} />
              <Text label="2. Buton metni" value={c.hero.secondaryCta.label} onChange={(v) => set((c) => ({ ...c, hero: { ...c.hero, secondaryCta: { ...c.hero.secondaryCta, label: v } } }))} />
              <Text label="2. Buton link" value={c.hero.secondaryCta.href} onChange={(v) => set((c) => ({ ...c, hero: { ...c.hero, secondaryCta: { ...c.hero.secondaryCta, href: v } } }))} />
            </div>
            <label className={labelClass}>Rozetler</label>
            <ListEditor
              items={c.hero.badges}
              onChange={(v) => set((c) => ({ ...c, hero: { ...c.hero, badges: v } }))}
              fields={[
                { key: "icon", label: "İkon", type: "icon" },
                { key: "label", label: "Metin", type: "text" },
              ]}
              newItem={{ icon: "shield", label: "" }}
              addLabel="Rozet ekle"
            />
          </Card>

          <Card title="Güven Kartları (Trusts)">
            <Text label="Kicker" value={c.trusts.kicker} onChange={(v) => set((c) => ({ ...c, trusts: { ...c.trusts, kicker: v } }))} />
            <Text label="Başlık (*...*)" value={c.trusts.heading} onChange={(v) => set((c) => ({ ...c, trusts: { ...c.trusts, heading: v } }))} />
            <ListEditor
              items={c.trusts.items}
              onChange={(v) => set((c) => ({ ...c, trusts: { ...c.trusts, items: v } }))}
              fields={[
                { key: "icon", label: "İkon", type: "icon" },
                { key: "title", label: "Başlık", type: "text" },
                { key: "description", label: "Açıklama", type: "textarea" },
              ]}
              newItem={{ icon: "shield", title: "", description: "" }}
              addLabel="Kart ekle"
              itemTitle={(it) => it.title || "Yeni kart"}
            />
          </Card>

          <Card title="İlgi Alanları (Areas)">
            <Text label="Kicker" value={c.areas.kicker} onChange={(v) => set((c) => ({ ...c, areas: { ...c.areas, kicker: v } }))} />
            <Text label="Başlık (*...*)" value={c.areas.heading} onChange={(v) => set((c) => ({ ...c, areas: { ...c.areas, heading: v } }))} />
            <Area label="Giriş metni" value={c.areas.intro} onChange={(v) => set((c) => ({ ...c, areas: { ...c.areas, intro: v } }))} />
            <ListEditor
              items={c.areas.items}
              onChange={(v) => set((c) => ({ ...c, areas: { ...c.areas, items: v } }))}
              fields={[
                { key: "icon", label: "İkon", type: "icon" },
                { key: "title", label: "Başlık", type: "text" },
                { key: "description", label: "Açıklama", type: "textarea" },
              ]}
              newItem={{ icon: "gavel", title: "", description: "" }}
              addLabel="Alan ekle"
              itemTitle={(it) => it.title || "Yeni alan"}
            />
          </Card>

          <Card title="Süreç (Process)">
            <Text label="Kicker" value={c.process.kicker} onChange={(v) => set((c) => ({ ...c, process: { ...c.process, kicker: v } }))} />
            <Text label="Başlık (*...*)" value={c.process.heading} onChange={(v) => set((c) => ({ ...c, process: { ...c.process, heading: v } }))} />
            <Area label="Giriş metni" value={c.process.intro} onChange={(v) => set((c) => ({ ...c, process: { ...c.process, intro: v } }))} />
            <ListEditor
              items={c.process.items}
              onChange={(v) => set((c) => ({ ...c, process: { ...c.process, items: v } }))}
              fields={[
                { key: "number", label: "Numara", type: "text" },
                { key: "title", label: "Başlık", type: "text" },
                { key: "description", label: "Açıklama", type: "textarea" },
              ]}
              newItem={{ number: "", title: "", description: "" }}
              addLabel="Adım ekle"
              itemTitle={(it) => it.title || "Yeni adım"}
            />
          </Card>

          <Card title="Hakkımda Özeti (About)">
            <Text label="Kicker" value={c.about.kicker} onChange={(v) => set((c) => ({ ...c, about: { ...c.about, kicker: v } }))} />
            <Text label="Başlık (*...*)" value={c.about.heading} onChange={(v) => set((c) => ({ ...c, about: { ...c.about, heading: v } }))} />
            <div>
              <label className={labelClass}>Metin</label>
              <MakaleEditoru content={c.about.body} onChange={(html) => set((c) => ({ ...c, about: { ...c.about, body: html } }))} />
            </div>
            <ImageField label="Portre görseli" value={c.about.portraitImage} onChange={(url) => set((c) => ({ ...c, about: { ...c.about, portraitImage: url } }))} />
            <label className={labelClass}>İstatistikler</label>
            <ListEditor
              items={c.about.stats}
              onChange={(v) => set((c) => ({ ...c, about: { ...c.about, stats: v } }))}
              fields={[
                { key: "value", label: "Değer", type: "text" },
                { key: "label", label: "Etiket", type: "text" },
              ]}
              newItem={{ value: "", label: "" }}
              addLabel="İstatistik ekle"
              itemTitle={(it) => it.value || "Yeni"}
            />
          </Card>

          <Card title="Çağrı Bölümü (Urgent)">
            <Text label="Kicker" value={c.urgent.kicker} onChange={(v) => set((c) => ({ ...c, urgent: { ...c.urgent, kicker: v } }))} />
            <Text label="Başlık (*...*)" value={c.urgent.heading} onChange={(v) => set((c) => ({ ...c, urgent: { ...c.urgent, heading: v } }))} />
            <div>
              <label className={labelClass}>Metin</label>
              <MakaleEditoru content={c.urgent.body} onChange={(html) => set((c) => ({ ...c, urgent: { ...c.urgent, body: html } }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Text label="E-posta etiketi" value={c.urgent.emailKanal.label} onChange={(v) => set((c) => ({ ...c, urgent: { ...c.urgent, emailKanal: { ...c.urgent.emailKanal, label: v } } }))} />
              <Text label="E-posta (gösterilen)" value={c.urgent.emailKanal.value} onChange={(v) => set((c) => ({ ...c, urgent: { ...c.urgent, emailKanal: { ...c.urgent.emailKanal, value: v } } }))} />
              <Text label="2. Buton metni" value={c.urgent.secondaryCta.label} onChange={(v) => set((c) => ({ ...c, urgent: { ...c.urgent, secondaryCta: { ...c.urgent.secondaryCta, label: v } } }))} />
              <Text label="2. Buton link" value={c.urgent.secondaryCta.href} onChange={(v) => set((c) => ({ ...c, urgent: { ...c.urgent, secondaryCta: { ...c.urgent.secondaryCta, href: v } } }))} />
            </div>
          </Card>

          <Card title="SSS (FAQ)">
            <Text label="Kicker" value={c.faq.kicker} onChange={(v) => set((c) => ({ ...c, faq: { ...c.faq, kicker: v } }))} />
            <Text label="Başlık (*...*)" value={c.faq.heading} onChange={(v) => set((c) => ({ ...c, faq: { ...c.faq, heading: v } }))} />
            <ListEditor
              items={c.faq.items}
              onChange={(v) => set((c) => ({ ...c, faq: { ...c.faq, items: v } }))}
              fields={[
                { key: "question", label: "Soru", type: "text" },
                { key: "answer", label: "Cevap", type: "textarea" },
              ]}
              newItem={{ question: "", answer: "" }}
              addLabel="Soru ekle"
              itemTitle={(it) => it.question || "Yeni soru"}
            />
          </Card>
        </div>
      )}

      {/* --- HAKKIMDA --- */}
      {tab === "hakkimda" && (
        <div className="space-y-4 max-w-3xl">
          <Card title="Hakkımda Sayfası">
            <Text label="Başlık" value={c.hakkimda.title} onChange={(v) => set((c) => ({ ...c, hakkimda: { ...c.hakkimda, title: v } }))} />
            <div>
              <label className={labelClass}>Metin</label>
              <MakaleEditoru content={c.hakkimda.body} onChange={(html) => set((c) => ({ ...c, hakkimda: { ...c.hakkimda, body: html } }))} />
            </div>
            <ImageField label="Portre / avatar" value={c.hakkimda.avatarImage} onChange={(url) => set((c) => ({ ...c, hakkimda: { ...c.hakkimda, avatarImage: url } }))} />
            <Area label="SEO açıklaması (meta description)" value={c.hakkimda.metaDescription} onChange={(v) => set((c) => ({ ...c, hakkimda: { ...c.hakkimda, metaDescription: v } }))} />
          </Card>
        </div>
      )}

      {/* --- İLETİŞİM --- */}
      {tab === "iletisim" && (
        <div className="space-y-4 max-w-3xl">
          <Card title="İletişim Bilgileri">
            <div className="grid grid-cols-2 gap-3">
              <Text label="Telefon (gösterilen)" value={c.contact.phone} onChange={(v) => set((c) => ({ ...c, contact: { ...c.contact, phone: v } }))} />
              <Text label="Telefon (ham, tel: için)" value={c.contact.phoneRaw} onChange={(v) => set((c) => ({ ...c, contact: { ...c.contact, phoneRaw: v } }))} />
              <Text label="E-posta" value={c.contact.email} onChange={(v) => set((c) => ({ ...c, contact: { ...c.contact, email: v } }))} />
              <Text label="WhatsApp linki" value={c.contact.whatsapp} onChange={(v) => set((c) => ({ ...c, contact: { ...c.contact, whatsapp: v } }))} />
            </div>
            <Text label="Adres satır 1" value={c.contact.address.line1} onChange={(v) => set((c) => ({ ...c, contact: { ...c.contact, address: { ...c.contact.address, line1: v } } }))} />
            <div className="grid grid-cols-2 gap-3">
              <Text label="Adres satır 2" value={c.contact.address.line2} onChange={(v) => set((c) => ({ ...c, contact: { ...c.contact, address: { ...c.contact.address, line2: v } } }))} />
              <Text label="Posta kodu" value={c.contact.address.postalCode} onChange={(v) => set((c) => ({ ...c, contact: { ...c.contact, address: { ...c.contact.address, postalCode: v } } }))} />
            </div>
          </Card>

          <Card title="Mesleki Bilgi">
            <div className="grid grid-cols-2 gap-3">
              <Text label="Baro / sicil" value={c.professional.barosicil} onChange={(v) => set((c) => ({ ...c, professional: { ...c.professional, barosicil: v } }))} />
              <Text label="Başlangıç yılı" value={String(c.professional.since)} onChange={(v) => set((c) => ({ ...c, professional: { ...c.professional, since: parseInt(v) || c.professional.since } }))} />
            </div>
            <Text label="Deneyim etiketi" value={c.professional.experienceLabel} onChange={(v) => set((c) => ({ ...c, professional: { ...c.professional, experienceLabel: v } }))} />
          </Card>
        </div>
      )}

      {/* --- AYARLAR --- */}
      {tab === "ayarlar" && (
        <div className="space-y-4 max-w-3xl">
          <Card title="Menü (navigasyon)">
            <ListEditor
              items={c.nav}
              onChange={(v) => set((c) => ({ ...c, nav: v }))}
              fields={[
                { key: "label", label: "Etiket", type: "text" },
                { key: "href", label: "Link", type: "text" },
              ]}
              newItem={{ label: "", href: "" }}
              addLabel="Menü öğesi ekle"
              itemTitle={(it) => it.label || "Yeni link"}
            />
          </Card>

          <Card title="Marka & SEO">
            <div className="grid grid-cols-2 gap-3">
              <Text label="Marka adı" value={c.seo.brand} onChange={(v) => set((c) => ({ ...c, seo: { ...c.seo, brand: v } }))} />
              <Text label="Kısa marka" value={c.seo.brandShort} onChange={(v) => set((c) => ({ ...c, seo: { ...c.seo, brandShort: v } }))} />
            </div>
            <Text label="Slogan (tagline)" value={c.seo.tagline} onChange={(v) => set((c) => ({ ...c, seo: { ...c.seo, tagline: v } }))} />
            <Area label="SEO açıklaması (varsayılan)" value={c.seo.description} onChange={(v) => set((c) => ({ ...c, seo: { ...c.seo, description: v } }))} />
          </Card>

          <Card title="Yazar (E-A-T)">
            <div className="grid grid-cols-2 gap-3">
              <Text label="Ad" value={c.author.name} onChange={(v) => set((c) => ({ ...c, author: { ...c.author, name: v } }))} />
              <Text label="Unvan" value={c.author.jobTitle} onChange={(v) => set((c) => ({ ...c, author: { ...c.author, jobTitle: v } }))} />
            </div>
            <Area label="Bilgi alanları (virgülle ayır)" value={c.author.knowsAbout.join(", ")} onChange={(v) => set((c) => ({ ...c, author: { ...c.author, knowsAbout: v.split(",").map((s) => s.trim()).filter(Boolean) } }))} />
            <Area label="Yazar biyografisi" value={c.author.bio} onChange={(v) => set((c) => ({ ...c, author: { ...c.author, bio: v } }))} />
          </Card>
        </div>
      )}
    </div>
  );
}
