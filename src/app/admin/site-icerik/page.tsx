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

// Yıldız-vurgu kuralının kısa açıklaması (başlık alanlarında tekrar kullanılır).
const VURGU_HELP =
  "İpucu: bir kelimeyi *yıldız* içine alırsan sitede altın renkte çıkar. Örn. “Ceza Hukukunda *titiz* analiz”.";

function Help({ children }: { children?: React.ReactNode }) {
  if (!children) return null;
  return (
    <p className="text-xs text-[var(--color-muted-dim)] mt-1 leading-relaxed">
      {children}
    </p>
  );
}

function Text({
  label,
  value,
  onChange,
  mono,
  help,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  mono?: boolean;
  help?: React.ReactNode;
  placeholder?: string;
}) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <input
        type="text"
        value={value ?? ""}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={mono ? `${inputClass} font-mono` : inputClass}
      />
      <Help>{help}</Help>
    </div>
  );
}

function Area({
  label,
  value,
  onChange,
  help,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  help?: React.ReactNode;
  placeholder?: string;
}) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <textarea
        value={value ?? ""}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className={inputClass}
      />
      <Help>{help}</Help>
    </div>
  );
}

function RichField({
  label,
  help,
  value,
  onChange,
}: {
  label: string;
  help?: React.ReactNode;
  value: string;
  onChange: (html: string) => void;
}) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <Help>{help}</Help>
      <div className="mt-1.5">
        <MakaleEditoru content={value} onChange={onChange} />
      </div>
    </div>
  );
}

function Card({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`${panelClass} space-y-3`}>
      <div>
        <h3 className="text-sm font-semibold text-[var(--color-ink)]">{title}</h3>
        {description && (
          <p className="text-xs text-[var(--color-muted)] mt-1 leading-relaxed">
            {description}
          </p>
        )}
      </div>
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
      <p className="text-red-300 text-sm">{error || "İçerik yüklenemedi"}</p>
    );

  const c = content;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
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
      <p className="text-sm text-[var(--color-muted)] mb-6 max-w-2xl">
        Sitenin tüm yazıları buradan düzenlenir. Bir alanı değiştir, sayfanın
        en üstündeki <strong className="text-[var(--color-ink)]">Kaydet</strong>{" "}
        düğmesine bas — değişiklik anında yayına girer. Her alanın altında
        nerede göründüğünü açıklayan not vardır.
      </p>

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
          <Card
            title="Üst Alan (Hero)"
            description="Ana sayfanın en üstü — ziyaretçinin ilk gördüğü büyük başlık ve tanıtım bölümü."
          >
            <Text label="Üst etiket" value={c.hero.kicker} help="Büyük başlığın hemen üstündeki küçük altın yazı. Örn. “İstanbul · 2024’ten beri”." onChange={(v) => set((c) => ({ ...c, hero: { ...c.hero, kicker: v } }))} />
            <Text label="Büyük başlık" value={c.hero.heading} help={VURGU_HELP} onChange={(v) => set((c) => ({ ...c, hero: { ...c.hero, heading: v } }))} />
            <Area label="Tanıtım metni" value={c.hero.subtext} help="Başlığın altındaki açıklayıcı paragraf." onChange={(v) => set((c) => ({ ...c, hero: { ...c.hero, subtext: v } }))} />
            <div className="grid grid-cols-2 gap-3">
              <Text label="1. Buton — yazı" value={c.hero.primaryCta.label} help="Altın renkli ana buton." onChange={(v) => set((c) => ({ ...c, hero: { ...c.hero, primaryCta: { ...c.hero.primaryCta, label: v } } }))} />
              <Text label="1. Buton — adres" value={c.hero.primaryCta.href} help="Tıklayınca gidilen yer. Örn. “/#uzmanlik”." onChange={(v) => set((c) => ({ ...c, hero: { ...c.hero, primaryCta: { ...c.hero.primaryCta, href: v } } }))} />
              <Text label="2. Buton — yazı" value={c.hero.secondaryCta.label} help="Çerçeveli ikincil buton." onChange={(v) => set((c) => ({ ...c, hero: { ...c.hero, secondaryCta: { ...c.hero.secondaryCta, label: v } } }))} />
              <Text label="2. Buton — adres" value={c.hero.secondaryCta.href} help="Örn. “/hakkimda”." onChange={(v) => set((c) => ({ ...c, hero: { ...c.hero, secondaryCta: { ...c.hero.secondaryCta, href: v } } }))} />
            </div>
            <div>
              <label className={labelClass}>Güven rozetleri</label>
              <ListEditor
                items={c.hero.badges}
                onChange={(v) => set((c) => ({ ...c, hero: { ...c.hero, badges: v } }))}
                note="Butonların altında ikonlu küçük ifadeler (örn. “Akademik referans”). İkonu listeden seç."
                fields={[
                  { key: "icon", label: "İkon", type: "icon" },
                  { key: "label", label: "Yazı", type: "text" },
                ]}
                newItem={{ icon: "shield", label: "" }}
                addLabel="Rozet ekle"
                itemTitle={(it) => it.label || "Yeni rozet"}
              />
            </div>
          </Card>

          <Card
            title="Güven Kartları"
            description="Üst alanın hemen altındaki 4’lü kart şeridi (ikon + başlık + açıklama)."
          >
            <Text label="Üst etiket" value={c.trusts.kicker} help="Bölümün üstündeki küçük altın yazı." onChange={(v) => set((c) => ({ ...c, trusts: { ...c.trusts, kicker: v } }))} />
            <Text label="Bölüm başlığı" value={c.trusts.heading} help={VURGU_HELP} onChange={(v) => set((c) => ({ ...c, trusts: { ...c.trusts, heading: v } }))} />
            <ListEditor
              items={c.trusts.items}
              onChange={(v) => set((c) => ({ ...c, trusts: { ...c.trusts, items: v } }))}
              note="Her kart bir ikon, bir başlık ve kısa bir açıklamadan oluşur."
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

          <Card
            title="İlgi Alanları"
            description="“Çalıştığım konu başlıkları” bölümü — ızgara halinde konu kartları."
          >
            <Text label="Üst etiket" value={c.areas.kicker} help="Bölümün üstündeki küçük altın yazı." onChange={(v) => set((c) => ({ ...c, areas: { ...c.areas, kicker: v } }))} />
            <Text label="Bölüm başlığı" value={c.areas.heading} help={VURGU_HELP} onChange={(v) => set((c) => ({ ...c, areas: { ...c.areas, heading: v } }))} />
            <Area label="Giriş metni" value={c.areas.intro} help="Başlığın yanında görünen kısa açıklama (masaüstünde)." onChange={(v) => set((c) => ({ ...c, areas: { ...c.areas, intro: v } }))} />
            <ListEditor
              items={c.areas.items}
              onChange={(v) => set((c) => ({ ...c, areas: { ...c.areas, items: v } }))}
              note="Her konu bir ikon, başlık ve kısa açıklamadan oluşur. Sırayı ok tuşlarıyla değiştir."
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

          <Card
            title="Süreç Adımları"
            description="“Nasıl çalışıyorum” bölümü — numaralı, sıralı adımlar."
          >
            <Text label="Üst etiket" value={c.process.kicker} help="Bölümün üstündeki küçük altın yazı." onChange={(v) => set((c) => ({ ...c, process: { ...c.process, kicker: v } }))} />
            <Text label="Bölüm başlığı" value={c.process.heading} help={VURGU_HELP} onChange={(v) => set((c) => ({ ...c, process: { ...c.process, heading: v } }))} />
            <Area label="Giriş metni" value={c.process.intro} help="Başlığın altındaki kısa açıklama." onChange={(v) => set((c) => ({ ...c, process: { ...c.process, intro: v } }))} />
            <ListEditor
              items={c.process.items}
              onChange={(v) => set((c) => ({ ...c, process: { ...c.process, items: v } }))}
              note="Her adımın bir numarası (01, 02…), başlığı ve açıklaması var."
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

          <Card
            title="Hakkımda Özeti"
            description="Ana sayfadaki kısa tanıtım + portre + istatistikler. (Tam “Hakkımda” sayfası ayrı sekmededir.)"
          >
            <Text label="Üst etiket" value={c.about.kicker} help="Bölümün üstündeki küçük altın yazı." onChange={(v) => set((c) => ({ ...c, about: { ...c.about, kicker: v } }))} />
            <Text label="Bölüm başlığı" value={c.about.heading} help={VURGU_HELP} onChange={(v) => set((c) => ({ ...c, about: { ...c.about, heading: v } }))} />
            <RichField label="Tanıtım metni" help="Birkaç paragraflık kısa tanıtım. Üstteki araç çubuğuyla biçimlendirebilirsin." value={c.about.body} onChange={(html) => set((c) => ({ ...c, about: { ...c.about, body: html } }))} />
            <ImageField label="Portre görseli" value={c.about.portraitImage} onChange={(url) => set((c) => ({ ...c, about: { ...c.about, portraitImage: url } }))} />
            <Help>Boş bırakırsan “TM” harf logosu görünür.</Help>
            <div>
              <label className={labelClass}>İstatistikler</label>
              <ListEditor
                items={c.about.stats}
                onChange={(v) => set((c) => ({ ...c, about: { ...c.about, stats: v } }))}
                note="Tanıtımın altındaki üç küçük rakam + etiket. Örn. değer “7+”, etiket “Çalışma alanı”."
                fields={[
                  { key: "value", label: "Rakam / değer", type: "text" },
                  { key: "label", label: "Etiket", type: "text" },
                ]}
                newItem={{ value: "", label: "" }}
                addLabel="İstatistik ekle"
                itemTitle={(it) => it.value || "Yeni"}
              />
            </div>
          </Card>

          <Card
            title="Çağrı Bölümü"
            description="Sayfanın altına yakın, okuyucuyu konu önerisi / iletişime yönlendiren vurgulu bölüm."
          >
            <Text label="Üst etiket" value={c.urgent.kicker} help="Bölümün üstündeki küçük altın yazı." onChange={(v) => set((c) => ({ ...c, urgent: { ...c.urgent, kicker: v } }))} />
            <Text label="Bölüm başlığı" value={c.urgent.heading} help={VURGU_HELP} onChange={(v) => set((c) => ({ ...c, urgent: { ...c.urgent, heading: v } }))} />
            <RichField label="Metin" help="Çağrı paragrafı." value={c.urgent.body} onChange={(html) => set((c) => ({ ...c, urgent: { ...c.urgent, body: html } }))} />
            <div className="grid grid-cols-2 gap-3">
              <Text label="E-posta kutusu — etiket" value={c.urgent.emailKanal.label} help="Sağdaki altın kutunun üst yazısı, örn. “E-POSTA”." onChange={(v) => set((c) => ({ ...c, urgent: { ...c.urgent, emailKanal: { ...c.urgent.emailKanal, label: v } } }))} />
              <Text label="E-posta kutusu — gösterilen adres" value={c.urgent.emailKanal.value} help="Kutuda yazan e-posta. (Tıklanınca İletişim sekmesindeki e-posta açılır.)" onChange={(v) => set((c) => ({ ...c, urgent: { ...c.urgent, emailKanal: { ...c.urgent.emailKanal, value: v } } }))} />
              <Text label="2. Buton — yazı" value={c.urgent.secondaryCta.label} help="Çerçeveli ikinci buton." onChange={(v) => set((c) => ({ ...c, urgent: { ...c.urgent, secondaryCta: { ...c.urgent.secondaryCta, label: v } } }))} />
              <Text label="2. Buton — adres" value={c.urgent.secondaryCta.href} help="Örn. “/iletisim”." onChange={(v) => set((c) => ({ ...c, urgent: { ...c.urgent, secondaryCta: { ...c.urgent.secondaryCta, href: v } } }))} />
            </div>
          </Card>

          <Card
            title="Sık Sorulan Sorular"
            description="Ana sayfanın altındaki açılır-kapanır soru–cevap listesi."
          >
            <Text label="Üst etiket" value={c.faq.kicker} help="Bölümün üstündeki küçük altın yazı." onChange={(v) => set((c) => ({ ...c, faq: { ...c.faq, kicker: v } }))} />
            <Text label="Bölüm başlığı" value={c.faq.heading} help={VURGU_HELP} onChange={(v) => set((c) => ({ ...c, faq: { ...c.faq, heading: v } }))} />
            <ListEditor
              items={c.faq.items}
              onChange={(v) => set((c) => ({ ...c, faq: { ...c.faq, items: v } }))}
              note="Her madde bir soru ve cevaptan oluşur."
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
          <Card
            title="Hakkımda Sayfası"
            description="“/hakkimda” adresindeki tam sayfa. (Ana sayfadaki kısa özet ayrı — Ana Sayfa sekmesinde.)"
          >
            <Text label="Sayfa başlığı" value={c.hakkimda.title} help="Sayfanın en üstündeki başlık. Örn. “Hakkımda”." onChange={(v) => set((c) => ({ ...c, hakkimda: { ...c.hakkimda, title: v } }))} />
            <RichField label="Sayfa metni" help="Tam tanıtım yazın. Kalın, italik, başlık, liste, bağlantı ekleyebilirsin." value={c.hakkimda.body} onChange={(html) => set((c) => ({ ...c, hakkimda: { ...c.hakkimda, body: html } }))} />
            <ImageField label="Portre / fotoğraf" value={c.hakkimda.avatarImage} onChange={(url) => set((c) => ({ ...c, hakkimda: { ...c.hakkimda, avatarImage: url } }))} />
            <Help>Boş bırakırsan “T” harf logosu görünür.</Help>
            <Area label="SEO açıklaması" value={c.hakkimda.metaDescription} help="Google’da ve sosyal paylaşımlarda görünen kısa özet (~155 karakter)." onChange={(v) => set((c) => ({ ...c, hakkimda: { ...c.hakkimda, metaDescription: v } }))} />
          </Card>
        </div>
      )}

      {/* --- İLETİŞİM --- */}
      {tab === "iletisim" && (
        <div className="space-y-4 max-w-3xl">
          <Card
            title="İletişim Bilgileri"
            description="Footer’da ve “/iletisim” sayfasında görünür. Şu an örnek (placeholder) değerler — kendi gerçek bilgilerinle değiştir."
          >
            <div className="grid grid-cols-2 gap-3">
              <Text label="Telefon (görünen)" value={c.contact.phone} help="Ekranda görünen biçim. Örn. “+90 555 000 00 00”." onChange={(v) => set((c) => ({ ...c, contact: { ...c.contact, phone: v } }))} />
              <Text label="Telefon (tıklama için)" value={c.contact.phoneRaw} help="Sadece rakamlar; tıklanınca telefonu arar. Örn. “+905550000000”." onChange={(v) => set((c) => ({ ...c, contact: { ...c.contact, phoneRaw: v } }))} />
              <Text label="E-posta" value={c.contact.email} help="İletişim ve çağrı bölümünde kullanılır." onChange={(v) => set((c) => ({ ...c, contact: { ...c.contact, email: v } }))} />
              <Text label="WhatsApp bağlantısı" value={c.contact.whatsapp} help="Tam adres. Örn. “https://wa.me/905550000000”." onChange={(v) => set((c) => ({ ...c, contact: { ...c.contact, whatsapp: v } }))} />
            </div>
            <Text label="Adres — 1. satır" value={c.contact.address.line1} help="Cadde / bina. Footer’da görünür." onChange={(v) => set((c) => ({ ...c, contact: { ...c.contact, address: { ...c.contact.address, line1: v } } }))} />
            <div className="grid grid-cols-2 gap-3">
              <Text label="Adres — 2. satır" value={c.contact.address.line2} help="İlçe / şehir." onChange={(v) => set((c) => ({ ...c, contact: { ...c.contact, address: { ...c.contact.address, line2: v } } }))} />
              <Text label="Posta kodu" value={c.contact.address.postalCode} onChange={(v) => set((c) => ({ ...c, contact: { ...c.contact, address: { ...c.contact.address, postalCode: v } } }))} />
            </div>
          </Card>

          <Card
            title="Mesleki Bilgi"
            description="Arama motorları için yapısal veri ve ana sayfadaki bazı istatistiklerde kullanılır."
          >
            <div className="grid grid-cols-2 gap-3">
              <Text label="Baro / sicil no" value={c.professional.barosicil} help="Varsa baro sicil bilgisi." onChange={(v) => set((c) => ({ ...c, professional: { ...c.professional, barosicil: v } }))} />
              <Text label="Başlangıç yılı" value={String(c.professional.since)} help="Örn. 2024. Bazı istatistikler buradan hesaplanır." onChange={(v) => set((c) => ({ ...c, professional: { ...c.professional, since: parseInt(v) || c.professional.since } }))} />
            </div>
            <Text label="Deneyim etiketi" value={c.professional.experienceLabel} help="Kısa ifade. Örn. “Akademik çalışma”." onChange={(v) => set((c) => ({ ...c, professional: { ...c.professional, experienceLabel: v } }))} />
          </Card>
        </div>
      )}

      {/* --- AYARLAR --- */}
      {tab === "ayarlar" && (
        <div className="space-y-4 max-w-3xl">
          <Card
            title="Menü (Üst Navigasyon)"
            description="Sitenin üstündeki menü bağlantıları. Sırayı ok tuşlarıyla değiştirebilirsin."
          >
            <ListEditor
              items={c.nav}
              onChange={(v) => set((c) => ({ ...c, nav: v }))}
              note="Yazı = menüde görünen kelime. Adres = gidilen yer (örn. “/makaleler” ya da “/#sss”)."
              fields={[
                { key: "label", label: "Yazı", type: "text" },
                { key: "href", label: "Adres", type: "text" },
              ]}
              newItem={{ label: "", href: "" }}
              addLabel="Menü bağlantısı ekle"
              itemTitle={(it) => it.label || "Yeni bağlantı"}
            />
          </Card>

          <Card
            title="Marka & SEO"
            description="Site adı, sloganı ve arama motorlarında görünen varsayılan açıklama."
          >
            <div className="grid grid-cols-2 gap-3">
              <Text label="Marka adı" value={c.seo.brand} help="Tam ad. Örn. “Tarık Mirza”." onChange={(v) => set((c) => ({ ...c, seo: { ...c.seo, brand: v } }))} />
              <Text label="Kısa marka adı" value={c.seo.brandShort} help="Kısaltma. Örn. “T. Mirza”." onChange={(v) => set((c) => ({ ...c, seo: { ...c.seo, brandShort: v } }))} />
            </div>
            <Text label="Slogan" value={c.seo.tagline} help="Marka altında görünen kısa ifade. Örn. “Ceza Hukuku”." onChange={(v) => set((c) => ({ ...c, seo: { ...c.seo, tagline: v } }))} />
            <Area label="Varsayılan SEO açıklaması" value={c.seo.description} help="Google’da görünen genel site açıklaması (~155 karakter)." onChange={(v) => set((c) => ({ ...c, seo: { ...c.seo, description: v } }))} />
          </Card>

          <Card
            title="Yazar Bilgisi"
            description="Google’ın yazar otoritesini (E-A-T) tanıması için kullanılır."
          >
            <div className="grid grid-cols-2 gap-3">
              <Text label="Ad" value={c.author.name} onChange={(v) => set((c) => ({ ...c, author: { ...c.author, name: v } }))} />
              <Text label="Unvan" value={c.author.jobTitle} help="Örn. “Hukuk Öğrencisi · Araştırmacı”." onChange={(v) => set((c) => ({ ...c, author: { ...c.author, jobTitle: v } }))} />
            </div>
            <Area label="Uzmanlık alanları" value={c.author.knowsAbout.join(", ")} help="Virgülle ayır. Örn. “Ceza Hukuku, Türk Ceza Kanunu, İçtihat Hukuku”." onChange={(v) => set((c) => ({ ...c, author: { ...c.author, knowsAbout: v.split(",").map((s) => s.trim()).filter(Boolean) } }))} />
            <Area label="Yazar biyografisi" value={c.author.bio} help="Kısa biyografi (yapısal veride kullanılır)." onChange={(v) => set((c) => ({ ...c, author: { ...c.author, bio: v } }))} />
          </Card>
        </div>
      )}
    </div>
  );
}
