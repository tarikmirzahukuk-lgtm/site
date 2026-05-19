# SEO Katmanı — Tasarım Belgesi

**Tarih:** 2026-04-25
**Proje:** tarik-site (Tarık Mirza · Ceza Hukuku Notları)
**Durum:** Onaylandı, implementasyon planı bekleniyor

---

## 1. Arka Plan ve Motivasyon

Platform şu an public yayında olmasına rağmen Google ve sosyal platformlar tarafından **görünmez durumda**:

- Ana sayfa client-side rendering yapıyor — arama botları boş HTML görüyor.
- `sitemap.xml`, `robots.txt`, RSS, JSON-LD yok.
- Sayfa başlıkları dışında hiçbir meta tag set edilmemiş; `og:image`, `twitter:card`, canonical hiçbir sayfada yok.
- Hukuk içeriği Google için YMYL (Your Money Your Life) kategorisinde — yazar otoritesi (E-A-T) sıralamayı doğrudan etkiliyor, ama site hiçbir yapısal veri yayınlamıyor.

Bu tasarım, **tek bir feature dalı altında** SEO katmanını tam olarak inşa eder: arama keşfi, sosyal paylaşım kartları, yapısal veri, marka asset'leri, RSS feed ve gerekli yeni rotalar.

## 2. Hedefler ve Hedef-Dışılar

### Hedefler

- Google Search Console'da indexed sayfa sayısı ≥ tüm yayında makale sayısı + kategoriler + statik sayfalar.
- Lighthouse SEO skoru ≥ 95.
- WhatsApp / Twitter / LinkedIn paylaşımında marka tutarlı OG kart görüntülenir.
- Her makale Google'da `Article` rich result için uygun yapısal veri sunar.
- Yazar E-A-T sinyali maksimum: dedicated author page + sameAs sosyal linkler.
- Tag-tabanlı long-tail keyword'ler için yeni `/etiket/[tag]` rotası.
- RSS feed üzerinden güç okuyucu (avukat / akademisyen) takibi mümkün.

### Hedef-dışılar

- Sayfa hızı optimizasyonu (Core Web Vitals dışında bir performance work).
- Çoklu dil desteği (hreflang) — site sadece Türkçe.
- AMP sürümleri — gerek yok.
- Newsletter / e-posta abonelik — ayrı bir spec'in konusu.
- Comments / engagement — ayrı bir spec'in konusu.

## 3. Kapsam

### 3.1 Crawlability & Indexation

| Çıktı | Kaynak | Davranış |
|---|---|---|
| `app/sitemap.ts` | Next native sitemap | Mongo'dan dinamik üretim: ana sayfa, yayında makaleler, kategoriler, etiketler (distinct), yazarlar, statik sayfalar |
| `app/robots.ts` | Next native robots | `User-agent: *` allow `/`; disallow `/admin`, `/api`, `/_next`, `/ara`; sitemap referansı |
| `metadataBase` | Root layout | `process.env.NEXT_PUBLIC_SITE_URL` ile set edilir; OG/Twitter URL'lerinin absolute olması için |
| `/ara` noindex | `metadata.robots = { index: false, follow: true }` | Arama sonuç sayfaları indexlenmemeli, ama link'leri takip edilebilir |
| Header kategori menüsü | Server component (`KategoriDropdown`) | Mongo'dan tüm kategoriler, header'da dropdown |
| Footer kategori listesi | Server component (`FooterKategoriler`) | Mongo'dan tüm kategoriler, footer'da sütun |

### 3.2 Meta Tags

| Dosya | Sorumluluk |
|---|---|
| `lib/site-config.ts` | Tek kaynak: `SITE_URL`, `BRAND_NAME`, `TAGLINE`, `DEFAULT_OG_IMAGE`, `THEME_COLOR`, `LOCALE` |
| `lib/seo/metadata.ts` | `buildMetadata({ title, description, path, image?, type?, publishedTime?, authors? })` → `Metadata` döner |

Her public sayfa `buildMetadata()` çağırır. Sonuç her sayfada:

- `<title>` (template ile suffix'lenir)
- `description` (per-page benzersiz, 150-160 karakter)
- `alternates.canonical` (absolute URL)
- `openGraph`: `title`, `description`, `url`, `siteName`, `locale: "tr_TR"`, `images: [og:image URL]`, `type` (default `"website"`, makale için `"article"`)
- `twitter`: `card: "summary_large_image"`, `title`, `description`, `images`
- Makale-spesifik: `openGraph.publishedTime`, `openGraph.modifiedTime`, `openGraph.authors`, `openGraph.section`

### 3.3 Structured Data (JSON-LD)

`lib/seo/jsonld.ts` aşağıdaki generator'ları içerir:

```ts
articleJsonLd(makale: IMakale, opts: { siteUrl: string }): ArticleSchema
breadcrumbJsonLd(items: { name: string; url: string }[]): BreadcrumbListSchema
personJsonLd(yazar: IKullanici, opts: { siteUrl: string }): PersonSchema
organizationJsonLd(opts: { siteUrl: string }): OrganizationSchema
faqJsonLd(faqs: { question: string; answer: string }[]): FAQPageSchema
```

Render: `<JsonLdScript data={...} />` client-safe component.

Hangi sayfa hangi schema'ları enjekte eder:

| Sayfa | Schema'lar |
|---|---|
| Root layout | `Organization` (publisher) |
| Makale detay | `Article` + `BreadcrumbList` + `FAQPage` (varsa) |
| Kategori detay | `BreadcrumbList` |
| Yazar detay | `Person` (full E-A-T with sameAs) |
| Hakkımda | `Person` (ana yazar) |

`Article` schema alanları: `@type`, `headline`, `description`, `image`, `datePublished`, `dateModified`, `author` (Person ref), `publisher` (Organization ref), `mainEntityOfPage`, `articleSection` (kategori), `keywords` (tags), `timeRequired` (ISO 8601 duration — `PT{readingTime}M`), `inLanguage: "tr"`.

### 3.4 Performance & Rendering

| Değişiklik | Konum | Etki |
|---|---|---|
| `(public)/page.tsx` server component'e dönüş | `src/app/(public)/page.tsx` | Server'da Mongo'dan makale + kategori fetch; initial HTML dolu gelir, Google indexler |
| Tüm `<img>` → `next/image` | 6 dosya (bkz. Phase 1b) | Lazy load + srcset + WebP + CLS önleme |
| Inter font `latin-ext` subset | `src/app/layout.tsx` | Türkçe karakter render fix (ş, ğ, ı) |
| `viewport.themeColor` | Root layout | Mobil Chrome adres çubuğu rengi marka rengine sabitlenir |

### 3.5 Social / OG Card

`/api/og` route (`app/api/og/route.tsx`):

- Runtime: Edge (`export const runtime = "edge"`).
- Query: `?id=<makale_id>`.
- Mongo'dan minimal projection: `title`, `category.name`, `author.name`, `createdAt`, `coverImage` (cover varsa background blend için).
- Render: `@vercel/og`'in `ImageResponse` API'si, JSX template.
- Cache: `Cache-Control: public, max-age=31536000, immutable, s-maxage=31536000`; cache key URL'inde `v=<updatedAt timestamp>` query param ile bust edilir.
- Boyut: 1200×630 PNG.
- Default kart: makale bulunamazsa marka + tagline ile geri döner (404 yerine 200).

**OG kart görsel template'i ayrı bir araçta (Claude Canvas) tasarlanıyor.** Bu spec sadece JSX skeleton bırakıyor; tasarım hazır olunca o JSX yerleşecek. Template'in alacağı dinamik field'lar:

- `title` (string, max ~80 karakter, wrap'lanır)
- `categoryName` (string, opsiyonel)
- `authorName` (string)
- `dateFormatted` (string, "15 Mayıs 2026")
- `readingTime` (string, "12 dk")

### 3.6 Brand Assets

| Dosya | Çıktı |
|---|---|
| `app/icon.tsx` | 32×32 PNG (Next native dynamic icon) |
| `app/apple-icon.tsx` | 180×180 iOS home screen icon |
| `app/manifest.ts` | Web App Manifest — `name`, `short_name`, `description`, `theme_color`, `background_color`, `icons` |

Bu üç dosya da `lib/site-config.ts`'i kaynak olarak kullanır — tek noktadan değiştirilir.

### 3.7 RSS Feed

`app/rss.xml/route.ts`:

- RSS 2.0 spesifikasyonuna uygun XML.
- `Content-Type: application/rss+xml; charset=utf-8`.
- En son 50 yayında makale.
- Hibrit içerik: her `<item>` içinde `<description>` = `excerpt` + ilk paragraf (~200 kelime), sonunda `<a href="<canonical>">Devamını sitede oku</a>` linki.
- `<author>` = `yazar.email (yazar.name)` formatı (RSS standardı).
- `<category>` = makale kategorisi.
- `<pubDate>` = RFC 822 format.
- `<guid isPermaLink="true">` = makale canonical URL.
- Channel level: `<title>`, `<description>`, `<link>`, `<language>tr</language>`, `<atom:link rel="self" href="/rss.xml"/>`.
- Cache: `revalidate: 600` (10 dakika).

Link verme: Public layout'ta `<link rel="alternate" type="application/rss+xml" href="/rss.xml" />` — feed reader'lar otomatik bulur.

### 3.8 Yeni Rotalar

#### `/etiket/[tag]/page.tsx`

- Server component.
- Param decode (`decodeURIComponent`) — Türkçe karakter destekli.
- Mongo: `Makale.find({ tags: tag, status: "yayinda" })` populate ile.
- 0 makale → "Bu etikete ait makale yok" mesajı + sayfanın kendisi 200 ile döner (soft 404 önlemek için).
- `generateMetadata`: `title`, `description: "{tag} etiketli makaleler"`, canonical, JSON-LD breadcrumb.
- `MakaleKart` grid'i kullanır.

#### `/yazar/[slug]/page.tsx`

- Server component.
- Slug = `slugify(yazar.name)`. **Önemli:** `Kullanici` modeline `slug` field eklenecek (unique, otomatik üretim), zaten audit fix gibi düşünülebilir.
- **Slug çakışması:** Aynı `name`'e sahip iki yazar slug çakışması yaratır. Pre-save hook çakışma durumunda `slug-2`, `slug-3`... olarak suffix ekler. Realistik durum tek-yazar, ama edge case kapsanmış olur.
- Render: yazar profili (avatar, bio, sosyal linkler), yazdığı makaleler listesi.
- `generateMetadata`: title `"{name} | Yazarlar"`, description = bio'nun ilk 160 karakteri.
- JSON-LD: full `Person` schema with sameAs.

### 3.9 Veri Modeli Değişiklikleri

#### `Kullanici` modeli

Yeni alanlar:

```ts
slug: { type: String, unique: true, required: true }  // otomatik slugify(name)
socials: {
  linkedin?: string,
  twitter?: string,
  orcid?: string,
  website?: string,
}
```

Migration: mevcut kullanıcılar için `slug` alanı eksik — Mongoose pre-save hook ile `slug` üret, bir kerelik migration script ile geriye dönük doldur.

#### `Makale` modeli

Yeni alan:

```ts
faqs?: [{
  question: string,
  answer: string,  // HTML olabilir, sanitize edilmeli
}]
```

Boş array default. Admin'de TipTap-style basit editor (`FaqEditor.tsx`).

### 3.10 Admin UI Değişiklikleri

| Konum | Değişiklik |
|---|---|
| `admin/yazarlar/page.tsx` form | `socials` field group eklendi (4 input: linkedin, twitter, orcid, website) |
| `admin/makaleler/yeni` ve `[id]` formları | `FaqEditor.tsx` alt-form'u — opsiyonel "Sıkça Sorulan Sorular" bölümü |
| `api/yazarlar/route.ts` | POST body'sinde `socials` accept; URL format validasyonu (basit: `https?://...`) |
| `api/makaleler/route.ts` ve `[id]/route.ts` | POST/PUT body'sinde `faqs` accept; array yapı validasyonu |

## 4. Dosya Yapısı

```
src/
├── lib/
│   ├── site-config.ts                  YENİ
│   └── seo/
│       ├── jsonld.ts                   YENİ
│       └── metadata.ts                 YENİ
│
├── models/
│   ├── Kullanici.ts                    DEĞİŞ (slug + socials)
│   └── Makale.ts                       DEĞİŞ (faqs)
│
├── components/
│   ├── public/
│   │   ├── JsonLdScript.tsx            YENİ
│   │   ├── Breadcrumb.tsx              YENİ
│   │   ├── KategoriDropdown.tsx        YENİ
│   │   └── FooterKategoriler.tsx       YENİ
│   └── admin/
│       ├── YazarSosyalForm.tsx         YENİ
│       └── FaqEditor.tsx               YENİ
│
└── app/
    ├── layout.tsx                       DEĞİŞ (metadataBase, themeColor, latin-ext, Org JSON-LD)
    ├── sitemap.ts                       YENİ
    ├── robots.ts                        YENİ
    ├── manifest.ts                      YENİ
    ├── icon.tsx                         YENİ
    ├── apple-icon.tsx                   YENİ
    │
    ├── rss.xml/
    │   └── route.ts                    YENİ
    │
    ├── api/
    │   └── og/
    │       └── route.tsx               YENİ (Edge)
    │
    └── (public)/
        ├── layout.tsx                   DEĞİŞ (Header dropdown, Footer kategoriler, RSS link)
        ├── page.tsx                     DEĞİŞ (client → server)
        ├── hakkimda/page.tsx            DEĞİŞ (Person JSON-LD, description)
        ├── iletisim/page.tsx            DEĞİŞ (description)
        ├── ara/page.tsx                 DEĞİŞ (noindex)
        ├── etiket/[tag]/page.tsx        YENİ
        ├── yazar/[slug]/page.tsx        YENİ
        ├── kategori/[slug]/page.tsx     DEĞİŞ (breadcrumb, full meta)
        └── makale/[slug]/page.tsx       DEĞİŞ (JSON-LD, Breadcrumb, full meta, og:image API'ye)
```

Toplam: **20 yeni dosya**, **9 değişen dosya**.

## 5. Veri Akışı

### 5.1 Makale Paylaşıldığında

```
Kullanıcı WhatsApp'ta /makale/<slug> link'ini paylaşır
  ↓
WhatsApp GET /makale/<slug>
  ↓
Next.js server component:
  1. dbConnect()
  2. Makale.findOne({ slug, status: "yayinda" }).populate("author category")
  3. generateMetadata() → buildMetadata({
       title: makale.title,
       description: makale.excerpt,
       path: `/makale/${slug}`,
       image: `${SITE_URL}/api/og?id=${makale._id}&v=${updatedAtMs}`,
       type: "article",
       publishedTime: makale.createdAt,
       modifiedTime: makale.updatedAt,
       authors: [makale.author.name],
     })
  4. Render:
     <JsonLdScript data={articleJsonLd(makale, opts)} />
     <JsonLdScript data={breadcrumbJsonLd([
        { name: "Ana Sayfa", url: SITE_URL },
        { name: kategori.name, url: `${SITE_URL}/kategori/${kategori.slug}` },
        { name: makale.title, url: `${SITE_URL}/makale/${makale.slug}` },
     ])} />
     {makale.faqs?.length > 0 && <JsonLdScript data={faqJsonLd(makale.faqs)} />}
     <Breadcrumb items={...} />
     <article>...</article>
  ↓
WhatsApp HTML'i parse eder, <meta property="og:image"> URL'ini bulur
  ↓
WhatsApp GET /api/og?id=<id>&v=<updatedAt>
  ↓
Edge runtime route:
  1. id'yi al, Mongo'dan minimal makale fetch
  2. ImageResponse JSX render
  3. Response headers: Cache-Control: immutable, max-age=31536000
  ↓
1200×630 PNG döner — WhatsApp önizlemede gösterir
```

### 5.2 Google Bot Keşfi

```
Googlebot GET /robots.txt
  ↓ "Sitemap: https://.../sitemap.xml"
Googlebot GET /sitemap.xml
  ↓
sitemap.ts execute:
  1. dbConnect()
  2. Promise.all([
       Makale.find({ status: "yayinda" }).select("slug updatedAt").lean(),
       Kategori.find().select("slug updatedAt").lean(),
       Kullanici.find({ role: "yazar" /* veya tümü */ }).select("slug updatedAt").lean(),
       Makale.distinct("tags"),
     ])
  3. URLSet array build edilir, statik sayfalar (ana sayfa, hakkımda, iletişim) eklenir
  4. Next.js MetadataRoute.Sitemap döner
  ↓
Googlebot her URL'i sırayla GET eder
  ↓
Her makale sayfasında initial HTML dolu (server-rendered),
JSON-LD parse edilir, Article schema indexlenir,
Rich result eligibility kazanılır
```

### 5.3 RSS Reader Akışı

```
Feed reader GET /rss.xml
  ↓
rss.xml/route.ts:
  1. dbConnect()
  2. Makale.find({ status: "yayinda" }).sort({ createdAt: -1 }).limit(50).populate("author category")
  3. XML build (her makale için title, link, description (excerpt + first <p>), pubDate, guid, category)
  4. Response: Content-Type application/rss+xml
  ↓
Reader önizleme + okuma deneyimi sunar
```

## 6. Hata Senaryoları ve Sağlamlık

| Durum | Davranış |
|---|---|
| `NEXT_PUBLIC_SITE_URL` env yoksa | Build'de fail; `site-config.ts` startup'ta throw eder ("SITE_URL env zorunlu") |
| Mongo build sırasında erişilemez (sitemap) | `revalidate: 3600` set edilir; build-time'da boş sitemap döner, ISR ile düzelir |
| `/api/og` makale bulamazsa | Default branded card döner (200 OK), error log'lanır |
| `/api/og` Mongo timeout | 5 saniyelik timeout, sonra default card döner |
| Yazar `slug`'ı eksik (legacy data) | Pre-save hook her save'de garanti eder; bir kerelik migration script eski yazarları doldurur |
| `Kullanici.socials` URL'i geçersiz | Admin form'da basit regex check; geçersizse `sameAs` array'ine eklenmez |
| `Makale.faqs` array boşsa veya undefined | FAQ JSON-LD inject edilmez (boş array Google'a karşı sinyal kirletmesi yapmaz) |
| `Makale.faqs[i].answer` HTML içeriyor | RSS / FAQ schema render'da escape edilir; admin-only girdi olsa da XSS riski sıfırlanır |
| Etiket sayfası 0 makale (silinmiş tüm makaleler) | 200 ile boş state göster ("Bu etikete ait makale yok"), sayfayı 404 yapma |
| Orphan kategori / author makale | Audit fix'leri zaten devrede; `Article` schema'da author null ise schema enjekte edilmez (Google'a yarım veri vermek yerine hiç verme) |
| `og:image` 404 / 500 | WhatsApp/Twitter image-less önizleme gösterir, sayfa hâlâ paylaşılabilir |
| Sitemap > 50.000 URL | İleri vadede sitemap index'e geçilir; şu an için bu eşik uzak |

## 7. Implementation Faseları

### Phase 1 — Core SEO (bu PR'ın ana parçası)

3.1, 3.2, 3.3, 3.4 (sadece server component conversion + font + themeColor), 3.5, 3.6, 3.7, 3.8, 3.9, 3.10. **20 yeni dosya + 9 değişen dosya** (bkz. §4). Bu sayım Phase 1b'deki image migration ek değişikliklerini içermez — aynı 5 dosya Phase 1b'de tekrar dokunulacak.

**Çıkış kriteri:**

- `next build` temiz.
- `tsc --noEmit` temiz.
- Manuel smoke: `/sitemap.xml`, `/robots.txt`, `/rss.xml`, `/api/og?id=<existing>` çalışır.
- Lighthouse SEO ≥ 90.
- Google Rich Results Test makale URL'inde Article + Breadcrumb tanır.

### Phase 1b — Image Migration (Phase 1 merge sonrası follow-up PR)

3.4'ün ikinci yarısı: tüm `<img>` → `next/image`. Tek başına merge edilebilir, SEO logic'i bağımsız.

**Etkilenen dosyalar:**

- `src/app/(public)/makale/[slug]/page.tsx` (2 yer: avatar + cover)
- `src/components/public/HeroAlani.tsx`
- `src/components/public/MakaleKart.tsx`
- `src/app/admin/makaleler/yeni/page.tsx` (kapak görseli önizleme)
- `src/app/admin/makaleler/[id]/page.tsx` (kapak görseli önizleme)
- `next.config.ts` — local `/uploads/` için domain config gerekmez ama production'da CDN kullanılırsa lazım

**Çıkış kriteri:**

- Tüm `<img>` tag'leri taşındı.
- Layout shift (CLS) testleri temiz.
- Build temiz.

## 8. Test Stratejisi

### 8.1 Otomatik (CI hazır olduğunda)

- `tsc --noEmit` — tip güvenliği.
- `next build` — build'in temiz olduğu.
- Birim test yok (mevcut projede test altyapısı kurulmamış, ayrı bir spec'in konusu).

### 8.2 Manuel smoke

Phase 1 merge öncesi her PR'da bu listeyi koş:

1. `/sitemap.xml` — beklenen URL sayısı + tüm makaleler listede.
2. `/robots.txt` — `Disallow: /admin`, `Disallow: /api`, `Disallow: /ara`, `Sitemap: ...` satırı var.
3. `/rss.xml` — XML valid, makale sırası createdAt desc, her item'da link + pubDate + guid.
4. `/api/og?id=<existing-makale-id>` — 1200×630 PNG, branded.
5. `/api/og?id=<non-existing>` — default card döner (200).
6. Bir makale sayfasının source'unda `<script type="application/ld+json">` 2–3 blok (Article + Breadcrumb + opt FAQ).
7. `/etiket/<tag>` — listede makaleler var, breadcrumb görünüyor.
8. `/yazar/<slug>` — bio + sosyal linkler render, Person schema kaynak HTML'inde.

### 8.3 Dış doğrulama

Phase 1 merge sonrası bir kerelik:

- https://search.google.com/test/rich-results — örnek makale URL → Article + BreadcrumbList tanınır.
- https://cards-dev.twitter.com/validator — Twitter card preview doğru görünür.
- https://developers.facebook.com/tools/debug/ — OG kart preview doğru görünür.
- PageSpeed Insights / Lighthouse — SEO skoru ≥ 95.

## 9. Çevre Değişkenleri (env vars)

Bu spec aşağıdaki yeni env var'ı zorunlu kılar:

```
NEXT_PUBLIC_SITE_URL=https://tarikmirza.com   # absolute URL, trailing slash yok
```

`.env.local.example` dosyasına eklenir; production deploy'unda Vercel/Netlify env'ine girilir.

## 10. Açık Sorular / Sonraki İşler

Bu spec'in dışında, ileride ele alınacak:

- **OG kart template'inin nihai tasarımı** — Canvas'ta yapılıyor, hazır olunca `/api/og/route.tsx` içine yerleşecek. Template change'i bu PR'a girmez (visual asset, separate concern).
- **Sayfa hızı optimizasyonu** — ayrı bir performance spec.
- **Yargıtay kararı / dava numarası için custom schema** — `LegalCase` schema fırsatı, sonraki bir SEO genişletme.
- **`hreflang`** — site çoklu dile geçerse.
- **CMS-side preview** — admin'de bir makaleyi yayınlamadan önce sosyal kart önizlemesi göstermek.
- **TipTap içerik server-side sanitization** — DOMPurify benzeri, güvenlik spec'i.

## 11. Migration Notları

Phase 1 deploy öncesi tek manuel adım:

1. Production env'ine `NEXT_PUBLIC_SITE_URL` ekle.
2. Mongo'da bir kerelik script: tüm mevcut `Kullanici`'lerin `slug` alanını `slugify(name)` ile doldur (`scripts/backfill-yazar-slugs.ts` — implementation aşamasında yazılır).

Geri uyumluluk: yeni `socials` ve `faqs` field'ları tamamen opsiyonel, mevcut data hiç dokunulmadan yaşamaya devam eder.
