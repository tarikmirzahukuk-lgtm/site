# SEO Katmanı Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Tarık Mirza ceza hukuku platformuna tam SEO katmanı ekle — crawlability, structured data, branded social cards, RSS, brand assets, yeni rotalar (etiket + yazar) ve admin UI eklemeleri.

**Architecture:** Next.js 16 App Router native API'lerini (sitemap, robots, metadata, ImageResponse) kullanan single-source-of-truth pattern. Tüm SEO config'i `lib/site-config.ts`'ten gelir, tüm sayfa metadata'sı `buildMetadata()` helper'ından üretilir, tüm structured data `lib/seo/jsonld.ts` generator'larından çıkar. OG image template ayrı bir araçta (Claude Canvas) tasarlanıyor — biz skeleton JSX bırakıyoruz, görsel hazırlanınca yerine geçer.

**Tech Stack:** Next.js 16.2.3 (App Router, Turbopack), TypeScript strict, Mongoose 9, `@vercel/og` (Edge runtime ImageResponse), Tailwind v4, `@tailwindcss/typography`.

**Spec:** `docs/superpowers/specs/2026-04-25-seo-katmani-design.md`

**Test Strategy Note:** Bu projede şu an unit test altyapısı yok (spec §8.1). Her task'ın doğrulaması: (a) `npx tsc --noEmit` temiz, (b) ilgili sayfa/endpoint için manuel smoke test (curl veya tarayıcı), (c) etkilenen route'ta `next build` warning vermez. Bu adımlar her task'ta açıkça yazılı.

---

## Phase 1 — Core SEO

### Task 1: Setup — bağımlılık ve env

**Files:**
- Modify: `package.json` (via npm install)
- Create: `.env.local.example`

- [ ] **Step 1: `@vercel/og` paketini kur**

```bash
npm install @vercel/og@^0.6.8
```

- [ ] **Step 2: `.env.local.example` dosyası oluştur**

`C:\Users\maest\Documents\tarik-site\.env.local.example`:

```
# MongoDB
MONGODB_URI=mongodb://localhost:27017/tarik-site

# NextAuth
NEXTAUTH_SECRET=change-me-to-random-string
NEXTAUTH_URL=http://localhost:3000

# Site (SEO katmanı için zorunlu)
# Production URL — absolute, trailing slash YOK
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

- [ ] **Step 3: `.env.local`'e `NEXT_PUBLIC_SITE_URL` ekle**

`C:\Users\maest\Documents\tarik-site\.env.local` dosyasının sonuna ekle (yoksa oluştur — diğer key'leri elinde olanlardan koru):

```
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

- [ ] **Step 4: Doğrulama**

```bash
npx tsc --noEmit
```

Beklenen: çıktı yok (temiz).

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json .env.local.example
git commit -m "chore: add @vercel/og + NEXT_PUBLIC_SITE_URL env var"
```

---

### Task 2: Site Config — tek kaynak

**Files:**
- Create: `src/lib/site-config.ts`

- [ ] **Step 1: `site-config.ts` yaz**

`C:\Users\maest\Documents\tarik-site\src\lib\site-config.ts`:

```ts
/**
 * Tek kaynak: marka adı, URL, varsayılan SEO değerleri.
 * Tüm SEO katmanı bu dosyadan beslenir.
 */

const SITE_URL_RAW = process.env.NEXT_PUBLIC_SITE_URL;

if (!SITE_URL_RAW) {
  throw new Error(
    "NEXT_PUBLIC_SITE_URL env var tanımlı değil. .env.local'e ekleyin."
  );
}

// Trailing slash'ı normalize et
export const SITE_URL = SITE_URL_RAW.replace(/\/$/, "");

export const SITE_CONFIG = {
  url: SITE_URL,
  brand: "Tarık Mirza",
  tagline: "Ceza Hukuku Notları",
  fullName: "Tarık Mirza · Ceza Hukuku Notları",
  description:
    "Ceza hukuku alanında akademik makaleler, içtihat değerlendirmeleri ve güncel hukuki analizler.",
  locale: "tr_TR",
  language: "tr",
  themeColor: "#1a56db",
  backgroundColor: "#ffffff",
  defaultOgImage: `${SITE_URL}/api/og`, // makale id yoksa default kart
  author: {
    name: "Tarık Mirza",
    jobTitle: "Hukuk Öğrencisi",
    knowsAbout: ["Ceza Hukuku", "Türk Ceza Kanunu", "İçtihat Hukuku"],
  },
} as const;
```

- [ ] **Step 2: Doğrulama**

```bash
npx tsc --noEmit
```

Beklenen: temiz.

- [ ] **Step 3: Commit**

```bash
git add src/lib/site-config.ts
git commit -m "feat(seo): add site-config single source of truth"
```

---

### Task 3: SEO Helper — `buildMetadata`

**Files:**
- Create: `src/lib/seo/metadata.ts`

- [ ] **Step 1: `buildMetadata()` helper yaz**

`C:\Users\maest\Documents\tarik-site\src\lib\seo\metadata.ts`:

```ts
import type { Metadata } from "next";
import { SITE_CONFIG, SITE_URL } from "@/lib/site-config";

interface BuildMetadataOpts {
  title: string;
  description?: string;
  path: string; // /makale/foo  veya /  veya /kategori/bar
  image?: string; // absolute URL beklenir; yoksa default
  type?: "website" | "article";
  publishedTime?: string; // ISO
  modifiedTime?: string; // ISO
  authors?: string[];
  section?: string; // article section (kategori adı)
  tags?: string[];
  noIndex?: boolean;
}

export function buildMetadata(opts: BuildMetadataOpts): Metadata {
  const {
    title,
    description = SITE_CONFIG.description,
    path,
    image = SITE_CONFIG.defaultOgImage,
    type = "website",
    publishedTime,
    modifiedTime,
    authors,
    section,
    tags,
    noIndex = false,
  } = opts;

  const canonical = `${SITE_URL}${path}`;
  const ogImage = image.startsWith("http") ? image : `${SITE_URL}${image}`;

  return {
    title,
    description,
    alternates: { canonical },
    robots: noIndex
      ? { index: false, follow: true }
      : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_CONFIG.fullName,
      locale: SITE_CONFIG.locale,
      type,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      ...(type === "article" && publishedTime && { publishedTime }),
      ...(type === "article" && modifiedTime && { modifiedTime }),
      ...(type === "article" && authors && { authors }),
      ...(type === "article" && section && { section }),
      ...(type === "article" && tags && { tags }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}
```

- [ ] **Step 2: Doğrulama**

```bash
npx tsc --noEmit
```

Beklenen: temiz.

- [ ] **Step 3: Commit**

```bash
git add src/lib/seo/metadata.ts
git commit -m "feat(seo): add buildMetadata helper"
```

---

### Task 4: JSON-LD Generators

**Files:**
- Create: `src/lib/seo/jsonld.ts`

- [ ] **Step 1: `jsonld.ts` yaz — tüm schema generator'lar**

`C:\Users\maest\Documents\tarik-site\src\lib\seo\jsonld.ts`:

```ts
import { SITE_CONFIG, SITE_URL } from "@/lib/site-config";
import type { IMakale, IKullanici, IKategori } from "@/types";

type JsonLd = Record<string, unknown>;

/**
 * Organization (publisher) — root layout'a inject edilir.
 */
export function organizationJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_CONFIG.fullName,
    url: SITE_URL,
    logo: `${SITE_URL}/icon.png`,
  };
}

/**
 * Article — makale detay sayfası.
 */
export function articleJsonLd(makale: IMakale): JsonLd | null {
  const yazar =
    makale.author && typeof makale.author === "object"
      ? (makale.author as IKullanici)
      : null;
  const kategori =
    makale.category && typeof makale.category === "object"
      ? (makale.category as IKategori)
      : null;

  // Yazar yoksa schema kirletmek yerine hiç verme
  if (!yazar) return null;

  const ogImage = `${SITE_URL}/api/og?id=${makale._id}&v=${encodeURIComponent(
    makale.updatedAt
  )}`;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: makale.title,
    description: makale.excerpt,
    image: ogImage,
    datePublished: makale.createdAt,
    dateModified: makale.updatedAt,
    author: {
      "@type": "Person",
      name: yazar.name,
      url: yazar.slug ? `${SITE_URL}/yazar/${yazar.slug}` : undefined,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_CONFIG.fullName,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/icon.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/makale/${makale.slug}`,
    },
    articleSection: kategori?.name,
    keywords: makale.tags?.join(", "),
    timeRequired: `PT${makale.readingTime}M`,
    inLanguage: SITE_CONFIG.language,
  };
}

/**
 * BreadcrumbList — makale ve kategori sayfalarında.
 */
export function breadcrumbJsonLd(
  items: { name: string; url: string }[]
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Person — yazar detay sayfası + hakkımda sayfası.
 */
export function personJsonLd(yazar: IKullanici): JsonLd {
  const sameAs: string[] = [];
  if (yazar.socials?.linkedin) sameAs.push(yazar.socials.linkedin);
  if (yazar.socials?.twitter) sameAs.push(yazar.socials.twitter);
  if (yazar.socials?.orcid) sameAs.push(yazar.socials.orcid);
  if (yazar.socials?.website) sameAs.push(yazar.socials.website);

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: yazar.name,
    description: yazar.bio || undefined,
    image: yazar.avatar || undefined,
    url: yazar.slug ? `${SITE_URL}/yazar/${yazar.slug}` : SITE_URL,
    jobTitle: SITE_CONFIG.author.jobTitle,
    knowsAbout: SITE_CONFIG.author.knowsAbout,
    ...(sameAs.length > 0 && { sameAs }),
  };
}

/**
 * FAQPage — makale.faqs doluysa.
 */
export function faqJsonLd(
  faqs: { question: string; answer: string }[]
): JsonLd | null {
  if (!faqs || faqs.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}
```

- [ ] **Step 2: Doğrulama**

```bash
npx tsc --noEmit
```

Beklenen: `Property 'socials' does not exist on type 'IKullanici'` + `Property 'updatedAt' does not exist on type 'IMakale'` (FAQ field referansları için de uyarı olabilir). Bu beklenen — sonraki task'larda type'ları güncelleyince düzelecek.

- [ ] **Step 3: Geçici workaround — type cast ile derle**

`src/lib/seo/jsonld.ts` dosyasında `yazar.socials?.X` ve `makale.updatedAt` referanslarını şimdilik bırak; tipler Task 6-9'da düzelecek. Commit'i Task 9'dan sonra yapacağız.

`(SKIPPED — bu task Task 9'da birleşik commit'le kapanır.)`

---

### Task 5: JsonLdScript Component

**Files:**
- Create: `src/components/public/JsonLdScript.tsx`

- [ ] **Step 1: Component yaz**

`C:\Users\maest\Documents\tarik-site\src\components\public\JsonLdScript.tsx`:

```tsx
/**
 * JSON-LD <script> render helper. Server component, escape edilmiş JSON.
 */
export default function JsonLdScript({
  data,
}: {
  data: Record<string, unknown> | null;
}) {
  if (!data) return null;

  // < karakterini güvenli encode et (XSS önleme — admin-only girdi olsa da)
  const json = JSON.stringify(data).replace(/</g, "\\u003c");

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
```

- [ ] **Step 2: Doğrulama**

```bash
npx tsc --noEmit
```

Beklenen: Task 4'teki aynı type uyarıları (henüz fix edilmedi).

- [ ] **Step 3: Bu commit Task 9'da birleşik atılacak — ŞİMDİLİK COMMITLEME.**

---

### Task 6: Kullanici Model — slug + socials + timestamps

**Files:**
- Modify: `src/models/Kullanici.ts`

- [ ] **Step 1: Schema'ya alanlar ekle**

`C:\Users\maest\Documents\tarik-site\src\models\Kullanici.ts` dosyasını TAMAMEN şu içerikle değiştir:

```ts
import mongoose, { Schema, Document, Model } from "mongoose";
import { slugify } from "@/lib/utils";

export interface ISocials {
  linkedin?: string;
  twitter?: string;
  orcid?: string;
  website?: string;
}

export interface IKullaniciDoc extends Document {
  name: string;
  email: string;
  password: string;
  role: "admin" | "yazar";
  bio: string;
  avatar: string;
  slug: string;
  socials: ISocials;
  createdAt: Date;
  updatedAt: Date;
}

const SocialsSchema = new Schema<ISocials>(
  {
    linkedin: { type: String, default: "" },
    twitter: { type: String, default: "" },
    orcid: { type: String, default: "" },
    website: { type: String, default: "" },
  },
  { _id: false }
);

const KullaniciSchema = new Schema<IKullaniciDoc>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "yazar"], default: "yazar" },
    bio: { type: String, default: "" },
    avatar: { type: String, default: "" },
    slug: { type: String, unique: true, sparse: true, index: true },
    socials: { type: SocialsSchema, default: () => ({}) },
  },
  { timestamps: true }
);

// Pre-save hook: slug yoksa name'den üret, çakışmada -2, -3... suffix ekle
KullaniciSchema.pre("save", async function (next) {
  if (!this.slug && this.name) {
    const base = slugify(this.name);
    let candidate = base;
    let i = 2;
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;
    while (
      await (self.constructor as Model<IKullaniciDoc>).findOne({
        slug: candidate,
        _id: { $ne: self._id },
      })
    ) {
      candidate = `${base}-${i++}`;
    }
    this.slug = candidate;
  }
  next();
});

const Kullanici: Model<IKullaniciDoc> =
  mongoose.models.Kullanici ||
  mongoose.model<IKullaniciDoc>("Kullanici", KullaniciSchema);

export default Kullanici;
```

- [ ] **Step 2: Doğrulama**

```bash
npx tsc --noEmit
```

Beklenen: Önceki uyarılar + bu dosyada hata yok. Eğer `mongoose.models.Kullanici` reuse uyarısı çıkarsa zaten existing model cache'liyse pre-save hook eklenmez — production'da bir kerelik server restart yetiyor.

- [ ] **Step 3: Commit'i Task 9'da birleşik at.**

---

### Task 7: Kategori Model — timestamps

**Files:**
- Modify: `src/models/Kategori.ts`

- [ ] **Step 1: Schema'ya timestamps ekle**

`C:\Users\maest\Documents\tarik-site\src\models\Kategori.ts` dosyasını TAMAMEN şu içerikle değiştir:

```ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IKategoriDoc extends Document {
  name: string;
  slug: string;
  description: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const KategoriSchema = new Schema<IKategoriDoc>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, default: "" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Kategori: Model<IKategoriDoc> =
  mongoose.models.Kategori ||
  mongoose.model<IKategoriDoc>("Kategori", KategoriSchema);

export default Kategori;
```

- [ ] **Step 2: Doğrulama**

```bash
npx tsc --noEmit
```

Beklenen: hata yok bu dosya için.

- [ ] **Step 3: Commit Task 9'da birleşik.**

---

### Task 8: Makale Model — faqs

**Files:**
- Modify: `src/models/Makale.ts`

- [ ] **Step 1: Schema'ya faqs ekle**

`C:\Users\maest\Documents\tarik-site\src\models\Makale.ts` dosyasını TAMAMEN şu içerikle değiştir:

```ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IFaq {
  question: string;
  answer: string;
}

export interface IMakaleDoc extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: mongoose.Types.ObjectId;
  author: mongoose.Types.ObjectId;
  status: "taslak" | "yayinda";
  readingTime: number;
  tags: string[];
  faqs: IFaq[];
  createdAt: Date;
  updatedAt: Date;
}

const FaqSchema = new Schema<IFaq>(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
  },
  { _id: false }
);

const MakaleSchema = new Schema<IMakaleDoc>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String, required: true },
    content: { type: String, default: "" },
    coverImage: { type: String, default: "" },
    category: { type: Schema.Types.ObjectId, ref: "Kategori", required: true },
    author: { type: Schema.Types.ObjectId, ref: "Kullanici", required: true },
    status: { type: String, enum: ["taslak", "yayinda"], default: "taslak" },
    readingTime: { type: Number, default: 1 },
    tags: [{ type: String }],
    faqs: { type: [FaqSchema], default: [] },
  },
  { timestamps: true }
);

MakaleSchema.index({ title: "text", content: "text" });

const Makale: Model<IMakaleDoc> =
  mongoose.models.Makale ||
  mongoose.model<IMakaleDoc>("Makale", MakaleSchema);

export default Makale;
```

- [ ] **Step 2: Doğrulama**

```bash
npx tsc --noEmit
```

Beklenen: Hata bu dosyada yok; Task 4'te jsonld.ts'deki `faqs` referansları artık geçerli tip alıyor.

- [ ] **Step 3: Commit Task 9'da birleşik.**

---

### Task 9: Types update + ilk birleşik commit

**Files:**
- Modify: `src/types/index.ts`

- [ ] **Step 1: Type'ları güncelle**

`C:\Users\maest\Documents\tarik-site\src\types\index.ts` dosyasını TAMAMEN şu içerikle değiştir:

```ts
export interface IFaq {
  question: string;
  answer: string;
}

export interface ISocials {
  linkedin?: string;
  twitter?: string;
  orcid?: string;
  website?: string;
}

export interface IMakale {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: IKategori | string;
  author: IKullanici | string;
  status: "taslak" | "yayinda";
  readingTime: number;
  tags: string[];
  faqs: IFaq[];
  createdAt: string;
  updatedAt: string;
}

export interface IKategori {
  _id: string;
  name: string;
  slug: string;
  description: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface IKullanici {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "yazar";
  bio: string;
  avatar: string;
  slug: string;
  socials: ISocials;
  createdAt: string;
  updatedAt: string;
}
```

- [ ] **Step 2: Doğrulama — full typecheck**

```bash
npx tsc --noEmit
```

Beklenen: temiz. Eğer admin formlarında `name?` gibi opsiyoneller şikayet ederse o dosyaları sonraki task'larda zaten dokunacağız.

- [ ] **Step 3: SEO foundation katmanını birleşik commit et**

```bash
git add src/lib/site-config.ts src/lib/seo/metadata.ts src/lib/seo/jsonld.ts src/components/public/JsonLdScript.tsx src/models/Kullanici.ts src/models/Kategori.ts src/models/Makale.ts src/types/index.ts
git commit -m "feat(seo): foundation — site-config, metadata + jsonld helpers, model + type updates"
```

---

### Task 10: Yazar slug backfill script

**Files:**
- Create: `scripts/backfill-yazar-slugs.ts`

- [ ] **Step 1: Backfill script yaz**

`C:\Users\maest\Documents\tarik-site\scripts\backfill-yazar-slugs.ts`:

```ts
/**
 * Mevcut Kullanici kayıtlarında slug yoksa slugify(name) ile doldur.
 * Çakışmada -2, -3... suffix ekler.
 *
 * Çalıştır: npx tsx scripts/backfill-yazar-slugs.ts
 */

import "dotenv/config";
import mongoose from "mongoose";
import Kullanici from "../src/models/Kullanici";
import { slugify } from "../src/lib/utils";

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI env yok");

  await mongoose.connect(uri);
  console.log("Mongo bağlandı");

  const kullanicilar = await Kullanici.find({
    $or: [{ slug: { $exists: false } }, { slug: "" }, { slug: null }],
  });

  console.log(`${kullanicilar.length} yazar için slug üretilecek`);

  for (const k of kullanicilar) {
    const base = slugify(k.name);
    let candidate = base;
    let i = 2;
    while (
      await Kullanici.findOne({ slug: candidate, _id: { $ne: k._id } })
    ) {
      candidate = `${base}-${i++}`;
    }
    k.slug = candidate;
    await k.save();
    console.log(`  ${k.name} → ${candidate}`);
  }

  console.log("Tamam.");
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
```

- [ ] **Step 2: tsx kur (henüz yoksa)**

```bash
npm install --save-dev tsx dotenv
```

- [ ] **Step 3: package.json'a script ekle**

`package.json`'ın `scripts` blokunu şu hale getir (mevcut script'leri koru):

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint",
  "migrate:yazar-slugs": "tsx scripts/backfill-yazar-slugs.ts"
}
```

- [ ] **Step 4: Script çalıştır**

```bash
npm run migrate:yazar-slugs
```

Beklenen: "Tamam." mesajı + her yazar için "<name> → <slug>" satırı. Mongo'da yazar yoksa `0 yazar için slug üretilecek` çıkar — sorun değil.

- [ ] **Step 5: Commit**

```bash
git add scripts/backfill-yazar-slugs.ts package.json package-lock.json
git commit -m "feat(seo): yazar slug backfill migration script"
```

---

### Task 11: Root layout — metadataBase + themeColor + latin-ext + Org JSON-LD

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Layout'u güncelle**

`C:\Users\maest\Documents\tarik-site\src\app\layout.tsx` dosyasını TAMAMEN şu içerikle değiştir:

```tsx
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import "./globals.css";
import { SITE_CONFIG, SITE_URL } from "@/lib/site-config";
import JsonLdScript from "@/components/public/JsonLdScript";
import { organizationJsonLd } from "@/lib/seo/jsonld";

const inter = Inter({ subsets: ["latin", "latin-ext"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_CONFIG.brand} | ${SITE_CONFIG.tagline}`,
    template: `%s | ${SITE_CONFIG.brand}`,
  },
  description: SITE_CONFIG.description,
  applicationName: SITE_CONFIG.fullName,
  authors: [{ name: SITE_CONFIG.author.name, url: SITE_URL }],
  creator: SITE_CONFIG.author.name,
  publisher: SITE_CONFIG.fullName,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: SITE_CONFIG.themeColor,
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang={SITE_CONFIG.language}>
      <body className={inter.className}>
        <JsonLdScript data={organizationJsonLd()} />
        {children}
      </body>
    </html>
  );
}
```

> **Not:** Eğer mevcut layout'ta `SessionProvider` import'u yoksa (NextAuth client'tan sarmalı bir provider üst seviyede), o satırı sil — kaynaktan import oluşturmaya gerek yok. Yukarıdaki kod NextAuth provider sarmasını çıkardı; mevcut auth flow zaten her sayfada bağımsız çalışıyor (proxy.ts üzerinden).

`SessionProvider` import'unu **sil** (yanlışlıkla kalmamış olsun):

`import { SessionProvider } from "next-auth/react";` satırını dosyadan kaldır.

- [ ] **Step 2: Doğrulama**

```bash
npx tsc --noEmit
```

Beklenen: temiz.

- [ ] **Step 3: Dev server'ı yeniden başlat ve smoke test**

```bash
npm run dev
```

Tarayıcıda `http://localhost:3000/` aç, "View Page Source" yap. Şunları kontrol et:

- `<html lang="tr">`
- `<meta name="theme-color" content="#1a56db">`
- `<link rel="canonical">` yok (root layout'ta değil, sayfa-bazlı)
- `<script type="application/ld+json">` Organization schema ile dolu

- [ ] **Step 4: Commit**

```bash
git add src/app/layout.tsx
git commit -m "feat(seo): root layout — metadataBase, themeColor, latin-ext, org jsonld"
```

---

### Task 12: Brand assets — icon, apple-icon, manifest

**Files:**
- Create: `src/app/icon.tsx`
- Create: `src/app/apple-icon.tsx`
- Create: `src/app/manifest.ts`

- [ ] **Step 1: `icon.tsx` yaz — 32×32 dynamic icon**

`C:\Users\maest\Documents\tarik-site\src\app\icon.tsx`:

```tsx
import { ImageResponse } from "next/og";
import { SITE_CONFIG } from "@/lib/site-config";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 22,
          background: SITE_CONFIG.themeColor,
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontWeight: 800,
          borderRadius: 6,
        }}
      >
        T
      </div>
    ),
    { ...size }
  );
}
```

- [ ] **Step 2: `apple-icon.tsx` yaz — 180×180**

`C:\Users\maest\Documents\tarik-site\src\app\apple-icon.tsx`:

```tsx
import { ImageResponse } from "next/og";
import { SITE_CONFIG } from "@/lib/site-config";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 110,
          background: SITE_CONFIG.themeColor,
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontWeight: 800,
        }}
      >
        T
      </div>
    ),
    { ...size }
  );
}
```

- [ ] **Step 3: `manifest.ts` yaz**

`C:\Users\maest\Documents\tarik-site\src\app\manifest.ts`:

```ts
import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/site-config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_CONFIG.fullName,
    short_name: SITE_CONFIG.brand,
    description: SITE_CONFIG.description,
    start_url: "/",
    display: "standalone",
    background_color: SITE_CONFIG.backgroundColor,
    theme_color: SITE_CONFIG.themeColor,
    icons: [
      { src: "/icon", sizes: "32x32", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
```

- [ ] **Step 4: Doğrulama**

```bash
npx tsc --noEmit
```

Beklenen: temiz.

- [ ] **Step 5: Dev server'da smoke**

`http://localhost:3000/icon` → PNG döner (mavi T)
`http://localhost:3000/apple-icon` → PNG döner
`http://localhost:3000/manifest.webmanifest` → JSON döner

- [ ] **Step 6: Commit**

```bash
git add src/app/icon.tsx src/app/apple-icon.tsx src/app/manifest.ts
git commit -m "feat(seo): brand assets — icon, apple-icon, manifest"
```

---

### Task 13: robots.ts

**Files:**
- Create: `src/app/robots.ts`

- [ ] **Step 1: Robots config yaz**

`C:\Users\maest\Documents\tarik-site\src\app\robots.ts`:

```ts
import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/", "/api/", "/_next/", "/ara"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
```

- [ ] **Step 2: Doğrulama**

```bash
npx tsc --noEmit
```

Beklenen: temiz.

- [ ] **Step 3: Smoke**

```bash
curl http://localhost:3000/robots.txt
```

Beklenen çıktı:

```
User-Agent: *
Allow: /
Disallow: /admin
Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Disallow: /ara

Host: http://localhost:3000
Sitemap: http://localhost:3000/sitemap.xml
```

- [ ] **Step 4: Commit**

```bash
git add src/app/robots.ts
git commit -m "feat(seo): robots.txt with admin/api/search disallow"
```

---

### Task 14: sitemap.ts

**Files:**
- Create: `src/app/sitemap.ts`

- [ ] **Step 1: Dinamik sitemap yaz**

`C:\Users\maest\Documents\tarik-site\src\app\sitemap.ts`:

```ts
import type { MetadataRoute } from "next";
import dbConnect from "@/lib/db";
import Makale from "@/models/Makale";
import Kategori from "@/models/Kategori";
import Kullanici from "@/models/Kullanici";
import { SITE_URL } from "@/lib/site-config";

export const revalidate = 3600; // 1 saat

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await dbConnect();

  const now = new Date();

  // Statik sayfalar
  const staticUrls: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${SITE_URL}/hakkimda`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    { url: `${SITE_URL}/iletisim`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  // Makaleler, kategoriler, yazarlar, etiketler paralel
  const [makaleler, kategoriler, yazarlar, tags] = await Promise.all([
    Makale.find({ status: "yayinda" })
      .select("slug updatedAt")
      .lean<{ slug: string; updatedAt: Date }[]>(),
    Kategori.find()
      .select("slug updatedAt")
      .lean<{ slug: string; updatedAt: Date }[]>(),
    Kullanici.find({ slug: { $exists: true, $ne: "" } })
      .select("slug updatedAt")
      .lean<{ slug: string; updatedAt: Date }[]>(),
    Makale.distinct("tags", { status: "yayinda" }),
  ]);

  const makaleUrls: MetadataRoute.Sitemap = makaleler.map((m) => ({
    url: `${SITE_URL}/makale/${m.slug}`,
    lastModified: m.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const kategoriUrls: MetadataRoute.Sitemap = kategoriler.map((k) => ({
    url: `${SITE_URL}/kategori/${k.slug}`,
    lastModified: k.updatedAt,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const yazarUrls: MetadataRoute.Sitemap = yazarlar.map((y) => ({
    url: `${SITE_URL}/yazar/${y.slug}`,
    lastModified: y.updatedAt,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  const tagUrls: MetadataRoute.Sitemap = (tags as string[])
    .filter((t) => t && t.length > 0)
    .map((t) => ({
      url: `${SITE_URL}/etiket/${encodeURIComponent(t)}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.4,
    }));

  return [...staticUrls, ...makaleUrls, ...kategoriUrls, ...yazarUrls, ...tagUrls];
}
```

- [ ] **Step 2: Doğrulama**

```bash
npx tsc --noEmit
```

Beklenen: temiz.

- [ ] **Step 3: Smoke**

```bash
curl http://localhost:3000/sitemap.xml
```

Beklenen: Valid XML, en az 3 statik URL (ana sayfa, hakkımda, iletişim). Veritabanında makale/kategori/yazar varsa onlar da listede.

- [ ] **Step 4: Commit**

```bash
git add src/app/sitemap.ts
git commit -m "feat(seo): dynamic sitemap.xml (makale + kategori + yazar + etiket)"
```

---

### Task 15: OG Image Route — skeleton template

**Files:**
- Create: `src/app/api/og/route.tsx`

- [ ] **Step 1: OG route yaz — Edge runtime + JSX skeleton**

`C:\Users\maest\Documents\tarik-site\src\app\api\og\route.tsx`:

```tsx
import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import dbConnect from "@/lib/db";
import Makale from "@/models/Makale";
import { SITE_CONFIG } from "@/lib/site-config";

export const runtime = "nodejs"; // Edge runtime ileride etkinleştirilecek (Mongo Edge'de henüz yok)

const W = 1200;
const H = 630;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  let title = SITE_CONFIG.fullName;
  let subtitle = SITE_CONFIG.tagline;
  let categoryName = "";
  let authorName = SITE_CONFIG.author.name;
  let dateText = "";

  if (id) {
    try {
      await dbConnect();
      const makale = await Makale.findById(id)
        .populate<{ category: { name: string } }>("category", "name")
        .populate<{ author: { name: string } }>("author", "name")
        .lean();

      if (makale && typeof makale === "object" && "title" in makale) {
        const m = makale as unknown as {
          title: string;
          category?: { name: string };
          author?: { name: string };
          createdAt: Date;
        };
        title = m.title;
        subtitle = "";
        categoryName = m.category?.name || "";
        authorName = m.author?.name || SITE_CONFIG.author.name;
        dateText = new Date(m.createdAt).toLocaleDateString("tr-TR", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });
      }
    } catch (err) {
      console.error("OG route — makale fetch error", err);
      // default'a düş
    }
  }

  // === SKELETON TEMPLATE ===
  // OG kart görsel tasarımı Claude Canvas'ta yapılıyor.
  // Final template hazırlandığında bu JSX bloğu değiştirilecek.
  // Skeleton: marka renginde, başlık + meta minimal yerleşim.
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: SITE_CONFIG.themeColor,
          color: "white",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px 70px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 22,
            opacity: 0.85,
          }}
        >
          <div style={{ display: "flex" }}>
            {categoryName ? categoryName.toUpperCase() : "CEZA HUKUKU"}
          </div>
          <div style={{ display: "flex" }}>{SITE_CONFIG.fullName}</div>
        </div>

        <div
          style={{
            fontSize: title.length > 60 ? 56 : 68,
            fontWeight: 800,
            lineHeight: 1.1,
            display: "flex",
          }}
        >
          {title}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 22,
            opacity: 0.85,
          }}
        >
          <div style={{ display: "flex" }}>{authorName}</div>
          <div style={{ display: "flex" }}>
            {dateText || subtitle}
          </div>
        </div>
      </div>
    ),
    {
      width: W,
      height: H,
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable, s-maxage=31536000",
      },
    }
  );
}
```

> **Not:** Edge runtime + Mongoose şu an uyumlu değil (Mongoose Node.js-only). `runtime = "nodejs"` ile çalışıyoruz, cache header ile CDN-level cache devrede. Mongoose Edge desteklerse `nodejs` → `edge` çevirisi yapılır.

- [ ] **Step 2: Doğrulama**

```bash
npx tsc --noEmit
```

Beklenen: temiz.

- [ ] **Step 3: Smoke**

```bash
curl -I http://localhost:3000/api/og
```

Beklenen: `Content-Type: image/png` + `Cache-Control: public, max-age=31536000, immutable`.

Tarayıcıda `http://localhost:3000/api/og` aç → skeleton kart görülür (mavi zemin, "Tarık Mirza · Ceza Hukuku Notları" başlık).

Mongo'da makale varsa: `http://localhost:3000/api/og?id=<bir-makale-id>` → o makalenin başlığı + yazarı + kategorisi gösteren kart.

- [ ] **Step 4: Commit**

```bash
git add src/app/api/og/route.tsx
git commit -m "feat(seo): /api/og route — branded card skeleton (template TBD)"
```

---

### Task 16: Homepage server component conversion

**Files:**
- Modify: `src/app/(public)/page.tsx`

- [ ] **Step 1: Homepage'i server component yap**

`C:\Users\maest\Documents\tarik-site\src\app\(public)\page.tsx` dosyasını TAMAMEN şu içerikle değiştir:

```tsx
import { Suspense } from "react";
import type { Metadata } from "next";
import dbConnect from "@/lib/db";
import Makale from "@/models/Makale";
import Kategori from "@/models/Kategori";
import "@/models/Kullanici";
import HeroAlani from "@/components/public/HeroAlani";
import MakaleKart from "@/components/public/MakaleKart";
import KategoriFiltreClient from "@/components/public/KategoriFiltreClient";
import { IMakale, IKategori } from "@/types";
import { buildMetadata } from "@/lib/seo/metadata";
import { SITE_CONFIG } from "@/lib/site-config";

export const metadata: Metadata = buildMetadata({
  title: `${SITE_CONFIG.brand} | ${SITE_CONFIG.tagline}`,
  description: SITE_CONFIG.description,
  path: "/",
});

export const revalidate = 300; // 5 dk ISR

export default async function AnaSayfa() {
  await dbConnect();

  const [makalelerRaw, kategorilerRaw] = await Promise.all([
    Makale.find({ status: "yayinda" })
      .populate("category", "name slug")
      .populate("author", "name avatar")
      .sort({ createdAt: -1 })
      .limit(50),
    Kategori.find().sort({ order: 1 }),
  ]);

  const makaleler = JSON.parse(JSON.stringify(makalelerRaw)) as IMakale[];
  const kategoriler = JSON.parse(JSON.stringify(kategorilerRaw)) as IKategori[];

  const oneCikan = makaleler[0];
  const digerMakaleler = makaleler.slice(1);

  return (
    <>
      {oneCikan && <HeroAlani makale={oneCikan} />}

      <section className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-lg font-bold">Makaleler</h2>
        </div>

        <Suspense fallback={null}>
          <KategoriFiltreClient
            kategoriler={kategoriler}
            makaleler={digerMakaleler}
          />
        </Suspense>
      </section>
    </>
  );
}
```

- [ ] **Step 2: Client-side filter component'i oluştur**

Filter ve grid client-side interaktif, ondan onu ayrı bir client component'e taşı.

`C:\Users\maest\Documents\tarik-site\src\components\public\KategoriFiltreClient.tsx`:

```tsx
"use client";

import { useState } from "react";
import MakaleKart from "@/components/public/MakaleKart";
import KategoriFiltre from "@/components/public/KategoriFiltre";
import { IMakale, IKategori } from "@/types";

export default function KategoriFiltreClient({
  kategoriler,
  makaleler,
}: {
  kategoriler: IKategori[];
  makaleler: IMakale[];
}) {
  const [aktifKategori, setAktifKategori] = useState("");

  const filtrelenmis = aktifKategori
    ? makaleler.filter((m) => {
        if (!m.category) return false;
        const catId =
          typeof m.category === "string" ? m.category : m.category._id;
        return catId === aktifKategori;
      })
    : makaleler;

  const bosMesaj = aktifKategori
    ? "Bu kategoride henüz makale bulunmuyor."
    : "Henüz makale yayınlanmamış.";

  return (
    <>
      <div className="mb-8">
        <KategoriFiltre
          kategoriler={kategoriler}
          aktif={aktifKategori}
          onChange={setAktifKategori}
        />
      </div>

      {filtrelenmis.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtrelenmis.map((makale) => (
            <MakaleKart key={makale._id} makale={makale} />
          ))}
        </div>
      ) : (
        <p className="text-gray-text text-sm text-center py-12">{bosMesaj}</p>
      )}
    </>
  );
}
```

- [ ] **Step 3: Doğrulama**

```bash
npx tsc --noEmit
```

Beklenen: temiz.

- [ ] **Step 4: Smoke**

`http://localhost:3000/` aç, "View Page Source" yap. Makaleler `<h3>` başlıklarıyla HTML'de görünmeli (önceden boş div'di). `<title>`, `<meta name="description">`, `<link rel="canonical">` set edilmiş olmalı.

- [ ] **Step 5: Commit**

```bash
git add src/app/(public)/page.tsx src/components/public/KategoriFiltreClient.tsx
git commit -m "feat(seo): convert homepage to server component for SSR/indexing"
```

---

### Task 17: Hakkımda — metadata + Person JSON-LD

**Files:**
- Modify: `src/app/(public)/hakkimda/page.tsx`

- [ ] **Step 1: Hakkımda sayfasını güncelle**

`C:\Users\maest\Documents\tarik-site\src\app\(public)\hakkimda\page.tsx` dosyasını TAMAMEN şu içerikle değiştir:

```tsx
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";
import { SITE_CONFIG } from "@/lib/site-config";
import JsonLdScript from "@/components/public/JsonLdScript";
import { personJsonLd } from "@/lib/seo/jsonld";
import { IKullanici } from "@/types";

const HAKKIMDA_DESC =
  "Tarık Mirza — ceza hukuku alanında araştırmalar yapan bir hukuk öğrencisi. Akademik makaleler, Yargıtay kararı değerlendirmeleri ve hukuki analizler.";

export const metadata: Metadata = buildMetadata({
  title: "Hakkımda",
  description: HAKKIMDA_DESC,
  path: "/hakkimda",
});

const hakkimdaYazar: IKullanici = {
  _id: "",
  name: SITE_CONFIG.author.name,
  email: "",
  role: "admin",
  bio: HAKKIMDA_DESC,
  avatar: "",
  slug: "tarik-mirza",
  socials: {},
  createdAt: "",
  updatedAt: "",
};

export default function HakkimdaPage() {
  return (
    <div className="max-w-content mx-auto px-6 py-16">
      <JsonLdScript data={personJsonLd(hakkimdaYazar)} />
      <h1 className="text-3xl font-extrabold mb-8">Hakkımda</h1>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="w-32 h-32 bg-primary rounded-full flex items-center justify-center text-white font-bold text-4xl flex-shrink-0">
          T
        </div>
        <div className="prose prose-lg max-w-none">
          <p className="text-lg text-dark/80 leading-relaxed">
            Merhaba, ben <strong>Tarık Mirza</strong>. Ceza hukuku alanında
            araştırmalar yapan bir hukuk öğrencisiyim.
          </p>
          <p className="text-dark/80 leading-relaxed">
            Bu platformda ceza hukukunun genel ve özel hükümlerine ilişkin
            akademik makaleler, güncel Yargıtay kararlarının değerlendirmeleri
            ve hukuki analizler paylaşıyorum.
          </p>
          <p className="text-dark/80 leading-relaxed">
            Amacım, ceza hukuku alanındaki bilgi birikimimi paylaşarak hem
            hukuk öğrencilerine hem de konuya ilgi duyan herkese faydalı bir
            kaynak oluşturmaktır.
          </p>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Doğrulama**

```bash
npx tsc --noEmit
```

Beklenen: temiz.

- [ ] **Step 3: Smoke**

`http://localhost:3000/hakkimda` aç, source'ta `<script type="application/ld+json">` ile Person schema görünür.

- [ ] **Step 4: Commit**

```bash
git add src/app/(public)/hakkimda/page.tsx
git commit -m "feat(seo): hakkimda — buildMetadata + Person JSON-LD"
```

---

### Task 18: İletişim — metadata

**Files:**
- Modify: `src/app/(public)/iletisim/page.tsx`

- [ ] **Step 1: İletişim metadata güncelle**

`C:\Users\maest\Documents\tarik-site\src\app\(public)\iletisim\page.tsx` dosyasında `metadata` export'unu değiştir — TAMAMEN şu içerikle değiştir:

```tsx
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "İletişim",
  description:
    "Tarık Mirza ile iletişim — soru, öneri ve iş birliği teklifleri için e-posta ve LinkedIn üzerinden ulaşın.",
  path: "/iletisim",
});

export default function IletisimPage() {
  return (
    <div className="max-w-content mx-auto px-6 py-16">
      <h1 className="text-3xl font-extrabold mb-4">İletişim</h1>
      <p className="text-gray-text mb-10">
        Soru, öneri veya iş birliği teklifleri için aşağıdaki kanallardan
        bana ulaşabilirsiniz.
      </p>

      <div className="space-y-6">
        <div className="bg-gray-light/50 rounded-xl p-6">
          <h3 className="font-semibold text-sm uppercase tracking-wide text-gray-text mb-2">
            E-posta
          </h3>
          <a
            href="mailto:tarik@example.com"
            className="text-primary hover:underline"
          >
            tarik@example.com
          </a>
        </div>

        <div className="bg-gray-light/50 rounded-xl p-6">
          <h3 className="font-semibold text-sm uppercase tracking-wide text-gray-text mb-2">
            LinkedIn
          </h3>
          <p className="text-dark">linkedin.com/in/tarikmirza</p>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Doğrulama**

```bash
npx tsc --noEmit
```

Beklenen: temiz.

- [ ] **Step 3: Commit**

```bash
git add src/app/(public)/iletisim/page.tsx
git commit -m "feat(seo): iletisim — buildMetadata"
```

---

### Task 19: Arama — noindex

**Files:**
- Modify: `src/app/(public)/ara/page.tsx`

- [ ] **Step 1: `metadata` export ekle**

Mevcut `src/app/(public)/ara/page.tsx` dosyası `"use client"` — metadata export'u client component'te çalışmaz. Çözüm: parent'e wrapping page'le `noindex` set et.

Dosyayı TAMAMEN şu içerikle değiştir:

`C:\Users\maest\Documents\tarik-site\src\app\(public)\ara\page.tsx` → AYNI client component logic'ini koruyacak ama dosyayı küçük bir server wrapper'a böleceğiz.

**Adım 1a: Mevcut client kodu yeni dosyaya taşı:**

`C:\Users\maest\Documents\tarik-site\src\app\(public)\ara\AraClient.tsx`:

```tsx
"use client";

import { useState } from "react";
import MakaleKart from "@/components/public/MakaleKart";
import { IMakale } from "@/types";

export default function AraClient() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<IMakale[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (query.trim().length < 2) {
      setError("En az 2 karakter girin");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/ara?q=${encodeURIComponent(query)}`);
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

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-extrabold mb-6">Makale Ara</h1>

      <form onSubmit={handleSearch} className="flex gap-3 mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Başlık veya içerik ara..."
          className="flex-1 px-4 py-3 border border-gray-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          autoFocus
        />
        <button
          type="submit"
          disabled={loading}
          className="btn-primary px-6 disabled:opacity-50"
        >
          {loading ? "Aranıyor..." : "Ara"}
        </button>
      </form>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md px-4 py-2">
          {error}
        </div>
      )}

      {searched && !error && (
        <>
          <p className="text-sm text-gray-text mb-6">
            &quot;{query}&quot; için {results.length} sonuç bulundu.
          </p>
          {results.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {results.map((makale) => (
                <MakaleKart key={makale._id} makale={makale} />
              ))}
            </div>
          ) : (
            <p className="text-gray-text text-center py-12">
              Aramanızla eşleşen makale bulunamadı.
            </p>
          )}
        </>
      )}
    </div>
  );
}
```

**Adım 1b: page.tsx'i server wrapper'a çevir:**

`C:\Users\maest\Documents\tarik-site\src\app\(public)\ara\page.tsx`:

```tsx
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";
import AraClient from "./AraClient";

export const metadata: Metadata = buildMetadata({
  title: "Makale Ara",
  description: "Tarık Mirza arşivinde başlık veya içerik ara.",
  path: "/ara",
  noIndex: true,
});

export default function AraPage() {
  return <AraClient />;
}
```

- [ ] **Step 2: Doğrulama**

```bash
npx tsc --noEmit
```

Beklenen: temiz.

- [ ] **Step 3: Smoke**

`http://localhost:3000/ara` source'ta `<meta name="robots" content="noindex, follow">` görünür.

- [ ] **Step 4: Commit**

```bash
git add src/app/(public)/ara/page.tsx src/app/(public)/ara/AraClient.tsx
git commit -m "feat(seo): ara — noindex + buildMetadata via server wrapper"
```

---

### Task 20: Breadcrumb component

**Files:**
- Create: `src/components/public/Breadcrumb.tsx`

- [ ] **Step 1: Breadcrumb yaz**

`C:\Users\maest\Documents\tarik-site\src\components\public\Breadcrumb.tsx`:

```tsx
import Link from "next/link";

interface BreadcrumbItem {
  name: string;
  href?: string; // son item href'siz
}

export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  if (items.length === 0) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className="text-xs text-gray-text mb-4 flex items-center gap-2 flex-wrap"
    >
      {items.map((item, idx) => (
        <span key={idx} className="flex items-center gap-2">
          {item.href ? (
            <Link
              href={item.href}
              className="hover:text-primary hover:underline transition-colors"
            >
              {item.name}
            </Link>
          ) : (
            <span className="text-dark font-medium">{item.name}</span>
          )}
          {idx < items.length - 1 && (
            <span className="text-gray-border">/</span>
          )}
        </span>
      ))}
    </nav>
  );
}
```

- [ ] **Step 2: Doğrulama**

```bash
npx tsc --noEmit
```

Beklenen: temiz.

- [ ] **Step 3: Commit Task 21'de birleşik.**

---

### Task 21: Makale detay — full metadata + JSON-LD + Breadcrumb

**Files:**
- Modify: `src/app/(public)/makale/[slug]/page.tsx`

- [ ] **Step 1: Makale detay sayfasını tamamen yenile**

`C:\Users\maest\Documents\tarik-site\src\app\(public)\makale\[slug]\page.tsx` dosyasını TAMAMEN şu içerikle değiştir:

```tsx
import dbConnect from "@/lib/db";
import Makale from "@/models/Makale";
import "@/models/Kullanici";
import "@/models/Kategori";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { formatDate } from "@/lib/utils";
import IcindekilerTablosu from "@/components/public/IcindekilerTablosu";
import PaylasimButonlari from "@/components/public/PaylasimButonlari";
import YazarKarti from "@/components/public/YazarKarti";
import IlgiliMakaleler from "@/components/public/IlgiliMakaleler";
import Breadcrumb from "@/components/public/Breadcrumb";
import JsonLdScript from "@/components/public/JsonLdScript";
import {
  articleJsonLd,
  breadcrumbJsonLd,
  faqJsonLd,
} from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";
import { SITE_URL } from "@/lib/site-config";
import { IMakale, IKullanici, IKategori } from "@/types";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await dbConnect();
  const { slug } = await params;
  const makale = await Makale.findOne({ slug, status: "yayinda" })
    .populate("author", "name")
    .populate("category", "name");
  if (!makale) return { title: "Bulunamadı" };

  const obj = JSON.parse(JSON.stringify(makale)) as IMakale;
  const yazar =
    obj.author && typeof obj.author === "object" ? (obj.author as IKullanici) : null;
  const kategori =
    obj.category && typeof obj.category === "object"
      ? (obj.category as IKategori)
      : null;

  return buildMetadata({
    title: obj.title,
    description: obj.excerpt,
    path: `/makale/${obj.slug}`,
    image: `${SITE_URL}/api/og?id=${obj._id}&v=${encodeURIComponent(
      obj.updatedAt
    )}`,
    type: "article",
    publishedTime: obj.createdAt,
    modifiedTime: obj.updatedAt,
    authors: yazar ? [yazar.name] : undefined,
    section: kategori?.name,
    tags: obj.tags,
  });
}

export default async function MakaleDetay({ params }: Props) {
  await dbConnect();
  const { slug } = await params;

  const makale = await Makale.findOne({ slug, status: "yayinda" })
    .populate("category", "name slug")
    .populate("author", "name avatar bio slug socials");

  if (!makale) notFound();

  const makaleObj = JSON.parse(JSON.stringify(makale)) as IMakale;

  const yazar =
    makaleObj.author && typeof makaleObj.author === "object"
      ? (makaleObj.author as IKullanici)
      : null;
  const kategori =
    makaleObj.category && typeof makaleObj.category === "object"
      ? (makaleObj.category as IKategori)
      : null;

  // İçerikteki h2/h3'lere id ekle (TOC için)
  let headingIndex = 0;
  const contentWithIds = makaleObj.content.replace(
    /<(h[23])>/g,
    (_match, tag) => {
      const id = `heading-${headingIndex}`;
      headingIndex++;
      return `<${tag} id="${id}">`;
    }
  );

  // İlgili makaleler
  let ilgiliMakaleler: IMakale[] = [];
  if (makale.category) {
    const ilgiliRaw = await Makale.find({
      category: makale.category._id ?? makale.category,
      status: "yayinda",
      _id: { $ne: makale._id },
    })
      .populate("category", "name slug")
      .populate("author", "name avatar")
      .limit(2);

    ilgiliMakaleler = JSON.parse(JSON.stringify(ilgiliRaw)) as IMakale[];
  }

  // Breadcrumb items
  const breadcrumbItems = [
    { name: "Ana Sayfa", href: "/" },
    ...(kategori
      ? [{ name: kategori.name, href: `/kategori/${kategori.slug}` }]
      : []),
    { name: makaleObj.title }, // son item href'siz
  ];

  const breadcrumbAbsolute = [
    { name: "Ana Sayfa", url: SITE_URL },
    ...(kategori
      ? [
          {
            name: kategori.name,
            url: `${SITE_URL}/kategori/${kategori.slug}`,
          },
        ]
      : []),
    { name: makaleObj.title, url: `${SITE_URL}/makale/${makaleObj.slug}` },
  ];

  return (
    <article>
      <JsonLdScript data={articleJsonLd(makaleObj)} />
      <JsonLdScript data={breadcrumbJsonLd(breadcrumbAbsolute)} />
      <JsonLdScript data={faqJsonLd(makaleObj.faqs)} />

      {/* Header */}
      <div className="max-w-content mx-auto px-6 pt-12">
        <Breadcrumb items={breadcrumbItems} />

        {kategori && (
          <p className="kategori-etiketi mb-4">{kategori.name}</p>
        )}
        <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">
          {makaleObj.title}
        </h1>
        <p className="text-lg text-gray-text mt-4 leading-relaxed">
          {makaleObj.excerpt}
        </p>

        {/* Meta */}
        <div className="flex items-center gap-4 mt-6 pb-6 border-b border-gray-border">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold overflow-hidden">
            {yazar?.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={yazar.avatar}
                alt={yazar.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              yazar?.name?.charAt(0) ?? "?"
            )}
          </div>
          <div>
            <p className="text-sm font-semibold">{yazar?.name ?? "Anonim"}</p>
            <p className="text-xs text-gray-text">
              {formatDate(makaleObj.createdAt)} · {makaleObj.readingTime} dk
              okuma
            </p>
          </div>
          <div className="ml-auto">
            <PaylasimButonlari
              title={makaleObj.title}
              slug={makaleObj.slug}
            />
          </div>
        </div>
      </div>

      {/* Cover Image */}
      {makaleObj.coverImage && (
        <div className="max-w-content-wide mx-auto px-6 my-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={makaleObj.coverImage}
            alt={makaleObj.title}
            className="w-full rounded-xl object-cover max-h-96"
          />
        </div>
      )}

      {/* Content + TOC */}
      <div className="max-w-content-wide mx-auto px-6 flex gap-12">
        <div
          className="prose prose-lg max-w-content flex-1
            prose-headings:text-dark prose-headings:font-bold
            prose-h2:text-xl prose-h2:mt-10 prose-h2:mb-4
            prose-h3:text-lg prose-h3:mt-8 prose-h3:mb-3
            prose-p:text-dark/80 prose-p:leading-[1.85]
            prose-blockquote:border-l-primary prose-blockquote:bg-blue-50/50 prose-blockquote:rounded-r-md prose-blockquote:py-3 prose-blockquote:not-italic
            prose-li:text-dark/80
            prose-a:text-primary prose-a:no-underline hover:prose-a:underline
            prose-img:rounded-lg"
          dangerouslySetInnerHTML={{ __html: contentWithIds }}
        />
        <IcindekilerTablosu content={makaleObj.content} />
      </div>

      {/* FAQ Section */}
      {makaleObj.faqs && makaleObj.faqs.length > 0 && (
        <section className="max-w-content mx-auto px-6 mt-12">
          <h2 className="text-2xl font-bold mb-6">Sıkça Sorulan Sorular</h2>
          <div className="space-y-4">
            {makaleObj.faqs.map((faq, idx) => (
              <details
                key={idx}
                className="bg-gray-light/50 rounded-lg p-4 border border-gray-border"
              >
                <summary className="font-semibold cursor-pointer">
                  {faq.question}
                </summary>
                <div
                  className="mt-3 text-dark/80 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: faq.answer }}
                />
              </details>
            ))}
          </div>
        </section>
      )}

      {/* Author Card & Related */}
      <div className="max-w-content mx-auto px-6 pb-16">
        {yazar && <YazarKarti yazar={yazar} />}
        <IlgiliMakaleler makaleler={ilgiliMakaleler} />
      </div>
    </article>
  );
}
```

- [ ] **Step 2: Doğrulama**

```bash
npx tsc --noEmit
```

Beklenen: temiz.

- [ ] **Step 3: Smoke**

Var olan bir makale URL'ini ziyaret et (örn: `http://localhost:3000/makale/<bir-slug>`). Source'ta:

- `<script type="application/ld+json">` 2 ya da 3 blok (Article + Breadcrumb + opt FAQ)
- `<meta property="og:type" content="article">`
- `<meta property="og:image" content="http://localhost:3000/api/og?id=...">`
- Sayfanın üstünde "Ana Sayfa / <Kategori> / <Başlık>" breadcrumb

- [ ] **Step 4: Commit (Breadcrumb component birlikte)**

```bash
git add src/components/public/Breadcrumb.tsx src/app/(public)/makale/[slug]/page.tsx
git commit -m "feat(seo): makale detay — full metadata, Article+Breadcrumb+FAQ JSON-LD, breadcrumb UI"
```

---

### Task 22: Kategori detay — full metadata + Breadcrumb

**Files:**
- Modify: `src/app/(public)/kategori/[slug]/page.tsx`

- [ ] **Step 1: Kategori sayfasını güncelle**

`C:\Users\maest\Documents\tarik-site\src\app\(public)\kategori\[slug]\page.tsx` dosyasını TAMAMEN şu içerikle değiştir:

```tsx
import dbConnect from "@/lib/db";
import Kategori from "@/models/Kategori";
import Makale from "@/models/Makale";
import "@/models/Kullanici";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import MakaleKart from "@/components/public/MakaleKart";
import Breadcrumb from "@/components/public/Breadcrumb";
import JsonLdScript from "@/components/public/JsonLdScript";
import { breadcrumbJsonLd } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";
import { SITE_URL } from "@/lib/site-config";
import { IMakale } from "@/types";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await dbConnect();
  const { slug } = await params;
  const kategori = await Kategori.findOne({ slug });
  if (!kategori) return { title: "Bulunamadı" };

  return buildMetadata({
    title: kategori.name,
    description:
      kategori.description ||
      `${kategori.name} kategorisindeki tüm makaleler — Tarık Mirza Ceza Hukuku Notları.`,
    path: `/kategori/${kategori.slug}`,
  });
}

export default async function KategoriSayfasi({ params }: Props) {
  await dbConnect();
  const { slug } = await params;

  const kategori = await Kategori.findOne({ slug });
  if (!kategori) notFound();

  const makalelerRaw = await Makale.find({
    category: kategori._id,
    status: "yayinda",
  })
    .populate("category", "name slug")
    .populate("author", "name avatar")
    .sort({ createdAt: -1 });

  const makaleler = JSON.parse(JSON.stringify(makalelerRaw)) as IMakale[];

  const breadcrumbItems = [
    { name: "Ana Sayfa", href: "/" },
    { name: kategori.name },
  ];

  const breadcrumbAbsolute = [
    { name: "Ana Sayfa", url: SITE_URL },
    { name: kategori.name, url: `${SITE_URL}/kategori/${kategori.slug}` },
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <JsonLdScript data={breadcrumbJsonLd(breadcrumbAbsolute)} />

      <Breadcrumb items={breadcrumbItems} />

      <div className="mb-10">
        <p className="kategori-etiketi mb-2">KATEGORİ</p>
        <h1 className="text-2xl font-extrabold">{kategori.name}</h1>
        {kategori.description && (
          <p className="text-gray-text mt-2">{kategori.description}</p>
        )}
      </div>

      {makaleler.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {makaleler.map((makale) => (
            <MakaleKart key={makale._id} makale={makale} />
          ))}
        </div>
      ) : (
        <p className="text-gray-text text-center py-12">
          Bu kategoride henüz makale bulunmuyor.
        </p>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Doğrulama**

```bash
npx tsc --noEmit
```

Beklenen: temiz.

- [ ] **Step 3: Smoke**

Var olan bir kategori URL'i (`/kategori/<slug>`) — source'ta BreadcrumbList JSON-LD, canonical URL.

- [ ] **Step 4: Commit**

```bash
git add src/app/(public)/kategori/[slug]/page.tsx
git commit -m "feat(seo): kategori detay — buildMetadata + breadcrumb"
```

---

### Task 23: `/etiket/[tag]` route

**Files:**
- Create: `src/app/(public)/etiket/[tag]/page.tsx`

- [ ] **Step 1: Etiket sayfası yaz**

`C:\Users\maest\Documents\tarik-site\src\app\(public)\etiket\[tag]\page.tsx`:

```tsx
import dbConnect from "@/lib/db";
import Makale from "@/models/Makale";
import "@/models/Kullanici";
import "@/models/Kategori";
import type { Metadata } from "next";
import MakaleKart from "@/components/public/MakaleKart";
import Breadcrumb from "@/components/public/Breadcrumb";
import JsonLdScript from "@/components/public/JsonLdScript";
import { breadcrumbJsonLd } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";
import { SITE_URL } from "@/lib/site-config";
import { IMakale } from "@/types";

interface Props {
  params: Promise<{ tag: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag: tagRaw } = await params;
  const tag = decodeURIComponent(tagRaw);
  return buildMetadata({
    title: `${tag} etiketli makaleler`,
    description: `${tag} etiketiyle yayınlanmış tüm makaleler — Tarık Mirza Ceza Hukuku Notları.`,
    path: `/etiket/${encodeURIComponent(tag)}`,
  });
}

export default async function EtiketSayfasi({ params }: Props) {
  await dbConnect();
  const { tag: tagRaw } = await params;
  const tag = decodeURIComponent(tagRaw);

  const makalelerRaw = await Makale.find({
    tags: tag,
    status: "yayinda",
  })
    .populate("category", "name slug")
    .populate("author", "name avatar")
    .sort({ createdAt: -1 });

  const makaleler = JSON.parse(JSON.stringify(makalelerRaw)) as IMakale[];

  const breadcrumbItems = [
    { name: "Ana Sayfa", href: "/" },
    { name: `#${tag}` },
  ];

  const breadcrumbAbsolute = [
    { name: "Ana Sayfa", url: SITE_URL },
    { name: `#${tag}`, url: `${SITE_URL}/etiket/${encodeURIComponent(tag)}` },
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <JsonLdScript data={breadcrumbJsonLd(breadcrumbAbsolute)} />

      <Breadcrumb items={breadcrumbItems} />

      <div className="mb-10">
        <p className="kategori-etiketi mb-2">ETİKET</p>
        <h1 className="text-2xl font-extrabold">#{tag}</h1>
        <p className="text-gray-text mt-2">
          {makaleler.length} makale
        </p>
      </div>

      {makaleler.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {makaleler.map((makale) => (
            <MakaleKart key={makale._id} makale={makale} />
          ))}
        </div>
      ) : (
        <p className="text-gray-text text-center py-12">
          Bu etikete ait makale yok.
        </p>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Doğrulama**

```bash
npx tsc --noEmit
```

Beklenen: temiz.

- [ ] **Step 3: Smoke**

Mongo'da bir makaleye etiket varsa (örn `tags: ["TCK 220"]`):
`http://localhost:3000/etiket/TCK%20220` → o makaleyi listelemeli.

Olmayan etiket: `http://localhost:3000/etiket/xyz` → "Bu etikete ait makale yok" (200 OK, 404 değil).

- [ ] **Step 4: Commit**

```bash
git add src/app/(public)/etiket/[tag]/page.tsx
git commit -m "feat(seo): /etiket/[tag] route — tag listing + breadcrumb"
```

---

### Task 24: `/yazar/[slug]` route

**Files:**
- Create: `src/app/(public)/yazar/[slug]/page.tsx`

- [ ] **Step 1: Yazar profili sayfası yaz**

`C:\Users\maest\Documents\tarik-site\src\app\(public)\yazar\[slug]\page.tsx`:

```tsx
import dbConnect from "@/lib/db";
import Kullanici from "@/models/Kullanici";
import Makale from "@/models/Makale";
import "@/models/Kategori";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import MakaleKart from "@/components/public/MakaleKart";
import Breadcrumb from "@/components/public/Breadcrumb";
import JsonLdScript from "@/components/public/JsonLdScript";
import { personJsonLd, breadcrumbJsonLd } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";
import { SITE_URL } from "@/lib/site-config";
import { IMakale, IKullanici } from "@/types";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await dbConnect();
  const { slug } = await params;
  const yazar = await Kullanici.findOne({ slug });
  if (!yazar) return { title: "Bulunamadı" };

  return buildMetadata({
    title: yazar.name,
    description:
      yazar.bio?.slice(0, 160) ||
      `${yazar.name} — Tarık Mirza Ceza Hukuku Notları yazarı.`,
    path: `/yazar/${slug}`,
  });
}

export default async function YazarSayfasi({ params }: Props) {
  await dbConnect();
  const { slug } = await params;

  const yazar = await Kullanici.findOne({ slug });
  if (!yazar) notFound();

  const yazarObj = JSON.parse(JSON.stringify(yazar)) as IKullanici;

  const makalelerRaw = await Makale.find({
    author: yazar._id,
    status: "yayinda",
  })
    .populate("category", "name slug")
    .populate("author", "name avatar")
    .sort({ createdAt: -1 });

  const makaleler = JSON.parse(JSON.stringify(makalelerRaw)) as IMakale[];

  const breadcrumbItems = [
    { name: "Ana Sayfa", href: "/" },
    { name: yazarObj.name },
  ];

  const breadcrumbAbsolute = [
    { name: "Ana Sayfa", url: SITE_URL },
    { name: yazarObj.name, url: `${SITE_URL}/yazar/${slug}` },
  ];

  const socials = yazarObj.socials || {};
  const hasSocials =
    socials.linkedin || socials.twitter || socials.orcid || socials.website;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <JsonLdScript data={personJsonLd(yazarObj)} />
      <JsonLdScript data={breadcrumbJsonLd(breadcrumbAbsolute)} />

      <Breadcrumb items={breadcrumbItems} />

      {/* Profile */}
      <div className="flex flex-col md:flex-row gap-8 items-start mb-12 pb-10 border-b border-gray-border">
        <div className="w-32 h-32 bg-primary rounded-full flex items-center justify-center text-white font-bold text-4xl flex-shrink-0 overflow-hidden">
          {yazarObj.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={yazarObj.avatar}
              alt={yazarObj.name}
              className="w-full h-full object-cover"
            />
          ) : (
            yazarObj.name.charAt(0)
          )}
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-extrabold mb-2">{yazarObj.name}</h1>
          {yazarObj.bio && (
            <p className="text-dark/80 leading-relaxed mb-4">{yazarObj.bio}</p>
          )}
          {hasSocials && (
            <div className="flex flex-wrap gap-3 text-sm">
              {socials.linkedin && (
                <a
                  href={socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer me"
                  className="text-primary hover:underline"
                >
                  LinkedIn
                </a>
              )}
              {socials.twitter && (
                <a
                  href={socials.twitter}
                  target="_blank"
                  rel="noopener noreferrer me"
                  className="text-primary hover:underline"
                >
                  Twitter
                </a>
              )}
              {socials.orcid && (
                <a
                  href={socials.orcid}
                  target="_blank"
                  rel="noopener noreferrer me"
                  className="text-primary hover:underline"
                >
                  ORCID
                </a>
              )}
              {socials.website && (
                <a
                  href={socials.website}
                  target="_blank"
                  rel="noopener noreferrer me"
                  className="text-primary hover:underline"
                >
                  Website
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Articles */}
      <h2 className="text-xl font-bold mb-6">
        {yazarObj.name} tarafından yazılmış makaleler ({makaleler.length})
      </h2>

      {makaleler.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {makaleler.map((makale) => (
            <MakaleKart key={makale._id} makale={makale} />
          ))}
        </div>
      ) : (
        <p className="text-gray-text text-center py-12">
          Bu yazarın henüz yayınlanmış makalesi yok.
        </p>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Doğrulama**

```bash
npx tsc --noEmit
```

Beklenen: temiz.

- [ ] **Step 3: Smoke**

Backfill script Task 10'da çalışmış olmalı. Bir yazar varsa: `http://localhost:3000/yazar/<slug>` → bio + makale listesi. Source'ta Person JSON-LD.

- [ ] **Step 4: Commit**

```bash
git add src/app/(public)/yazar/[slug]/page.tsx
git commit -m "feat(seo): /yazar/[slug] route — profile + sameAs + Person JSON-LD"
```

---

### Task 25: KategoriDropdown + Header güncelleme

**Files:**
- Create: `src/components/public/KategoriDropdown.tsx`
- Modify: `src/app/(public)/layout.tsx`
- Modify: `src/components/public/Header.tsx`

- [ ] **Step 1: KategoriDropdown server component**

`C:\Users\maest\Documents\tarik-site\src\components\public\KategoriDropdown.tsx`:

```tsx
import Link from "next/link";
import { IKategori } from "@/types";

export default function KategoriDropdown({
  kategoriler,
}: {
  kategoriler: IKategori[];
}) {
  if (kategoriler.length === 0) return null;

  return (
    <div className="relative group">
      <button
        type="button"
        className="text-sm text-gray-text hover:text-dark transition-colors flex items-center gap-1"
      >
        Kategoriler
        <svg
          className="w-3 h-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
        <div className="py-2">
          {kategoriler.map((k) => (
            <Link
              key={k._id}
              href={`/kategori/${k.slug}`}
              className="block px-4 py-2 text-sm text-gray-text hover:bg-gray-light hover:text-dark"
            >
              {k.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Header'ı kategori dropdown ile genişlet**

`C:\Users\maest\Documents\tarik-site\src\components\public\Header.tsx` dosyasını TAMAMEN şu içerikle değiştir:

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import KategoriDropdown from "@/components/public/KategoriDropdown";
import { IKategori } from "@/types";

const navLinks = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/hakkimda", label: "Hakkımda" },
  { href: "/iletisim", label: "İletişim" },
];

export default function Header({ kategoriler }: { kategoriler: IKategori[] }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="border-b border-gray-border bg-white sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-6 flex items-center justify-between h-16">
        <Link href="/" className="font-bold text-lg text-dark">
          Tarık Mirza
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm transition-colors ${
                pathname === link.href
                  ? "text-dark font-medium"
                  : "text-gray-text hover:text-dark"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <KategoriDropdown kategoriler={kategoriler} />
          <Link
            href="/ara"
            className="text-gray-text hover:text-dark transition-colors"
            aria-label="Ara"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
          </Link>
        </nav>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-dark"
          aria-label="Menü"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            {mobileOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            )}
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-gray-border px-6 py-4 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block text-sm text-gray-text hover:text-dark"
            >
              {link.label}
            </Link>
          ))}
          {kategoriler.length > 0 && (
            <div className="pt-2 border-t border-gray-border">
              <p className="text-xs uppercase tracking-wide text-gray-text mb-2">
                Kategoriler
              </p>
              {kategoriler.map((k) => (
                <Link
                  key={k._id}
                  href={`/kategori/${k.slug}`}
                  onClick={() => setMobileOpen(false)}
                  className="block text-sm text-gray-text hover:text-dark py-1"
                >
                  {k.name}
                </Link>
              ))}
            </div>
          )}
          <Link
            href="/ara"
            onClick={() => setMobileOpen(false)}
            className="block text-sm text-gray-text hover:text-dark"
          >
            Ara
          </Link>
        </div>
      )}
    </header>
  );
}
```

- [ ] **Step 3: Public layout'u server component yap, kategorileri Header'a geç**

`C:\Users\maest\Documents\tarik-site\src\app\(public)\layout.tsx`:

```tsx
import dbConnect from "@/lib/db";
import Kategori from "@/models/Kategori";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import { IKategori } from "@/types";
import { SITE_URL } from "@/lib/site-config";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await dbConnect();
  const kategorilerRaw = await Kategori.find().sort({ order: 1 });
  const kategoriler = JSON.parse(
    JSON.stringify(kategorilerRaw)
  ) as IKategori[];

  return (
    <>
      <link
        rel="alternate"
        type="application/rss+xml"
        title="Tarık Mirza · RSS"
        href={`${SITE_URL}/rss.xml`}
      />
      <Header kategoriler={kategoriler} />
      <main>{children}</main>
      <Footer kategoriler={kategoriler} />
    </>
  );
}
```

- [ ] **Step 4: Doğrulama**

```bash
npx tsc --noEmit
```

Beklenen: `Footer` props uyumsuzluğu — Footer'a `kategoriler` prop'u geçtik ama Footer henüz almıyor. Bu Task 26'da düzelecek. Yine de derlenmesi için Footer'ı geçici accept etmesi gerek.

Geçici fix — Footer'a optional kategoriler prop'u ekle:

`C:\Users\maest\Documents\tarik-site\src\components\public\Footer.tsx` ilk satırını şu olacak şekilde değiştir (sadece signature):

```tsx
import Link from "next/link";
import { IKategori } from "@/types";

export default function Footer({ kategoriler: _kategoriler = [] }: { kategoriler?: IKategori[] } = {}) {
```

(_kategoriler ismi underscore ile başlıyor — kullanılmadığı için lint warning olmasın; Task 26'da gerçekten kullanılacak.)

- [ ] **Step 5: Smoke**

`http://localhost:3000/` → header'da "Kategoriler" dropdown'u görünür, hover'da kategori listesi açılır.

- [ ] **Step 6: Commit**

```bash
git add src/components/public/KategoriDropdown.tsx src/components/public/Header.tsx src/app/(public)/layout.tsx src/components/public/Footer.tsx
git commit -m "feat(seo): header — kategori dropdown + public layout server fetch + rss link tag"
```

---

### Task 26: Footer kategoriler

**Files:**
- Modify: `src/components/public/Footer.tsx`

- [ ] **Step 1: Footer'ı kategoriler ile zenginleştir**

`C:\Users\maest\Documents\tarik-site\src\components\public\Footer.tsx` dosyasını TAMAMEN şu içerikle değiştir:

```tsx
import Link from "next/link";
import { IKategori } from "@/types";
import { SITE_CONFIG } from "@/lib/site-config";

export default function Footer({
  kategoriler = [],
}: {
  kategoriler?: IKategori[];
} = {}) {
  return (
    <footer className="border-t border-gray-border mt-20">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-dark">{SITE_CONFIG.brand}</h3>
            <p className="text-sm text-gray-text mt-2 max-w-xs leading-relaxed">
              {SITE_CONFIG.description}
            </p>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-gray-text uppercase tracking-wide mb-3">
              Sayfalar
            </h4>
            <div className="space-y-2">
              <Link
                href="/"
                className="block text-sm text-gray-text hover:text-dark transition-colors"
              >
                Ana Sayfa
              </Link>
              <Link
                href="/hakkimda"
                className="block text-sm text-gray-text hover:text-dark transition-colors"
              >
                Hakkımda
              </Link>
              <Link
                href="/iletisim"
                className="block text-sm text-gray-text hover:text-dark transition-colors"
              >
                İletişim
              </Link>
              <Link
                href="/rss.xml"
                className="block text-sm text-gray-text hover:text-dark transition-colors"
              >
                RSS
              </Link>
            </div>
          </div>
          {kategoriler.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-gray-text uppercase tracking-wide mb-3">
                Kategoriler
              </h4>
              <div className="space-y-2">
                {kategoriler.map((k) => (
                  <Link
                    key={k._id}
                    href={`/kategori/${k.slug}`}
                    className="block text-sm text-gray-text hover:text-dark transition-colors"
                  >
                    {k.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="border-t border-gray-border mt-8 pt-8">
          <p className="text-xs text-gray-text">
            © {new Date().getFullYear()} {SITE_CONFIG.brand}. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Doğrulama**

```bash
npx tsc --noEmit
```

Beklenen: temiz.

- [ ] **Step 3: Smoke**

`http://localhost:3000/` → footer'da Sayfalar + Kategoriler + RSS link görünür.

- [ ] **Step 4: Commit**

```bash
git add src/components/public/Footer.tsx
git commit -m "feat(seo): footer — kategori listesi + rss link"
```

---

### Task 27: RSS feed `/rss.xml`

**Files:**
- Create: `src/app/rss.xml/route.ts`

- [ ] **Step 1: RSS route yaz**

`C:\Users\maest\Documents\tarik-site\src\app\rss.xml\route.ts`:

```ts
import dbConnect from "@/lib/db";
import Makale from "@/models/Makale";
import "@/models/Kullanici";
import "@/models/Kategori";
import { SITE_CONFIG, SITE_URL } from "@/lib/site-config";
import { IMakale, IKullanici, IKategori } from "@/types";

export const revalidate = 600; // 10 dk

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<": return "&lt;";
      case ">": return "&gt;";
      case "&": return "&amp;";
      case "'": return "&apos;";
      case '"': return "&quot;";
      default: return c;
    }
  });
}

function firstParagraph(html: string, maxChars = 600): string {
  // İlk <p>...</p> bloğu çek; yoksa ham metin
  const match = html.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
  const para = match ? match[1] : html;
  const text = para.replace(/<[^>]*>/g, "").trim();
  return text.length > maxChars ? text.slice(0, maxChars) + "..." : text;
}

export async function GET() {
  await dbConnect();

  const makalelerRaw = await Makale.find({ status: "yayinda" })
    .populate("author", "name email")
    .populate("category", "name")
    .sort({ createdAt: -1 })
    .limit(50);

  const makaleler = JSON.parse(JSON.stringify(makalelerRaw)) as IMakale[];

  const items = makaleler
    .map((m) => {
      const yazar =
        m.author && typeof m.author === "object" ? (m.author as IKullanici) : null;
      const kategori =
        m.category && typeof m.category === "object"
          ? (m.category as IKategori)
          : null;

      const link = `${SITE_URL}/makale/${m.slug}`;
      const pubDate = new Date(m.createdAt).toUTCString();
      const description =
        escapeXml(m.excerpt) +
        " — " +
        escapeXml(firstParagraph(m.content)) +
        ` <a href="${link}">Devamını sitede oku</a>`;

      return `    <item>
      <title>${escapeXml(m.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pubDate}</pubDate>
      ${kategori ? `<category>${escapeXml(kategori.name)}</category>` : ""}
      ${yazar ? `<author>${escapeXml(yazar.email || "noreply@example.com")} (${escapeXml(yazar.name)})</author>` : ""}
      <description><![CDATA[${description}]]></description>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_CONFIG.fullName)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(SITE_CONFIG.description)}</description>
    <language>${SITE_CONFIG.language}</language>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
```

- [ ] **Step 2: Doğrulama**

```bash
npx tsc --noEmit
```

Beklenen: temiz.

- [ ] **Step 3: Smoke**

```bash
curl http://localhost:3000/rss.xml
```

Beklenen: Valid XML, `<?xml version="1.0"?>`, en az `<channel>` ve birkaç `<item>` (yayında makale varsa).

XML doğrulamak için: https://validator.w3.org/feed/ → URL gir.

- [ ] **Step 4: Commit**

```bash
git add src/app/rss.xml/route.ts
git commit -m "feat(seo): /rss.xml — RSS 2.0 hybrid feed (excerpt + first paragraph + link)"
```

---

### Task 28: Admin — YazarSosyalForm + yazarlar page integration

**Files:**
- Create: `src/components/admin/YazarSosyalForm.tsx`
- Modify: `src/app/admin/yazarlar/page.tsx`
- Modify: `src/app/api/yazarlar/route.ts`

- [ ] **Step 1: YazarSosyalForm component**

`C:\Users\maest\Documents\tarik-site\src\components\admin\YazarSosyalForm.tsx`:

```tsx
"use client";

import { ISocials } from "@/types";

interface Props {
  value: ISocials;
  onChange: (v: ISocials) => void;
}

export default function YazarSosyalForm({ value, onChange }: Props) {
  const update = (key: keyof ISocials, v: string) => {
    onChange({ ...value, [key]: v });
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      {(["linkedin", "twitter", "orcid", "website"] as const).map((key) => (
        <div key={key}>
          <label className="block text-xs font-medium text-gray-text mb-1.5 uppercase tracking-wide">
            {key === "orcid"
              ? "ORCID"
              : key.charAt(0).toUpperCase() + key.slice(1)}
          </label>
          <input
            type="url"
            value={value[key] || ""}
            onChange={(e) => update(key, e.target.value)}
            placeholder="https://..."
            className="w-full px-3 py-2 border border-gray-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: yazarlar admin page'i güncelle — socials field eklenmiş halde**

`C:\Users\maest\Documents\tarik-site\src\app\admin\yazarlar\page.tsx` dosyasının state ve form bölümünü genişlet. Mevcut dosyayı şu hale getir (TAM içerik):

```tsx
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
```

- [ ] **Step 3: API — yazarlar POST'a socials accept**

`C:\Users\maest\Documents\tarik-site\src\app\api\yazarlar\route.ts` dosyasını oku, sonra POST handler'ındaki body parsing'i şu mantıkla genişlet:

POST handler içinde mevcut `const { name, email, password, role, bio } = body;` satırını şu hale getir:

```ts
const { name, email, password, role, bio, socials } = body;
```

Ve `Kullanici.create({...})` çağrısına `socials` ekle:

```ts
const yazar = await Kullanici.create({
  name,
  email,
  password: hashed,
  role: role === "admin" ? "admin" : "yazar",
  bio: bio || "",
  socials: socials || {},
});
```

- [ ] **Step 4: Doğrulama**

```bash
npx tsc --noEmit
```

Beklenen: temiz.

- [ ] **Step 5: Smoke**

`http://localhost:3000/admin/yazarlar` → "Yeni Yazar" tıkla, formda artık 4 sosyal alan var. Test bir yazar oluştur. `Mongo.find()` ile yazarın `socials` field'ı dolu mu kontrol et:

```bash
# Mongo shell veya MongoDB Compass:
# db.kullanicis.findOne({ email: "<test@email>" }) — socials objesi görünmeli
```

- [ ] **Step 6: Commit**

```bash
git add src/components/admin/YazarSosyalForm.tsx src/app/admin/yazarlar/page.tsx src/app/api/yazarlar/route.ts
git commit -m "feat(seo): admin — yazar socials field for E-A-T sameAs"
```

---

### Task 29: Admin — FaqEditor + makale formlara entegrasyon + API

**Files:**
- Create: `src/components/admin/FaqEditor.tsx`
- Modify: `src/app/admin/makaleler/yeni/page.tsx`
- Modify: `src/app/admin/makaleler/[id]/page.tsx`
- Modify: `src/app/api/makaleler/route.ts`
- Modify: `src/app/api/makaleler/[id]/route.ts`

- [ ] **Step 1: FaqEditor component**

`C:\Users\maest\Documents\tarik-site\src\components\admin\FaqEditor.tsx`:

```tsx
"use client";

import { IFaq } from "@/types";

interface Props {
  value: IFaq[];
  onChange: (v: IFaq[]) => void;
}

export default function FaqEditor({ value, onChange }: Props) {
  const add = () => onChange([...value, { question: "", answer: "" }]);
  const remove = (idx: number) => onChange(value.filter((_, i) => i !== idx));
  const update = (idx: number, key: keyof IFaq, v: string) => {
    onChange(value.map((f, i) => (i === idx ? { ...f, [key]: v } : f)));
  };

  return (
    <div className="space-y-3">
      {value.map((faq, idx) => (
        <div
          key={idx}
          className="bg-gray-light/50 border border-gray-border rounded-md p-3 space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-text">
              Soru #{idx + 1}
            </span>
            <button
              type="button"
              onClick={() => remove(idx)}
              className="text-xs text-red-600 hover:underline"
            >
              Sil
            </button>
          </div>
          <input
            type="text"
            value={faq.question}
            onChange={(e) => update(idx, "question", e.target.value)}
            placeholder="Soru"
            className="w-full px-3 py-2 border border-gray-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <textarea
            value={faq.answer}
            onChange={(e) => update(idx, "answer", e.target.value)}
            placeholder="Cevap"
            rows={3}
            className="w-full px-3 py-2 border border-gray-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="text-sm text-primary hover:underline"
      >
        + Soru ekle
      </button>
    </div>
  );
}
```

- [ ] **Step 2: makaleler/yeni page'e FaqEditor entegre et**

`C:\Users\maest\Documents\tarik-site\src\app\admin\makaleler\yeni\page.tsx` dosyasına şu değişiklikleri yap:

State ekle (mevcut state'lerin yanına):

```tsx
import { IFaq } from "@/types";
import FaqEditor from "@/components/admin/FaqEditor";

// state'lerin arasına:
const [faqs, setFaqs] = useState<IFaq[]>([]);
```

`handleSave` içinde body'ye ekle:

```tsx
body: JSON.stringify({
  title,
  slug,
  excerpt,
  content,
  category,
  coverImage,
  status,
  tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
  faqs: faqs.filter((f) => f.question.trim() && f.answer.trim()),
}),
```

JSX'te `<MakaleEditoru ... />` altına şu bloğu ekle:

```tsx
<div className="bg-white border border-gray-border rounded-lg p-4">
  <label className="block text-xs font-medium text-gray-text mb-3 uppercase tracking-wide">
    Sıkça Sorulan Sorular (opsiyonel — SEO için FAQ schema oluşturur)
  </label>
  <FaqEditor value={faqs} onChange={setFaqs} />
</div>
```

- [ ] **Step 3: makaleler/[id] page'e FaqEditor entegre et**

`C:\Users\maest\Documents\tarik-site\src\app\admin\makaleler\[id]\page.tsx` dosyasına aynı pattern:

State ekle:

```tsx
import { IFaq } from "@/types";
import FaqEditor from "@/components/admin/FaqEditor";

const [faqs, setFaqs] = useState<IFaq[]>([]);
```

`load()` içinde:

```tsx
setFaqs(Array.isArray(makale.faqs) ? makale.faqs : []);
```

`handleSave` body'sine:

```tsx
faqs: faqs.filter((f) => f.question.trim() && f.answer.trim()),
```

JSX'te aynı blok eklenir (MakaleEditoru'nun altına).

- [ ] **Step 4: API — makaleler POST + PUT faqs accept**

`C:\Users\maest\Documents\tarik-site\src\app\api\makaleler\route.ts` POST handler'ında body destructure'una `faqs` ekle:

```ts
const { title, slug, excerpt, content, coverImage, category, status, tags, faqs } = body;
```

Ve `Makale.create()`'e geç:

```ts
const makale = await Makale.create({
  title, slug: slug || slugify(title), excerpt, content, coverImage: coverImage || "",
  category, author: session.user.id,
  status: status === "yayinda" ? "yayinda" : "taslak",
  readingTime, tags: Array.isArray(tags) ? tags : [],
  faqs: Array.isArray(faqs) ? faqs : [],
});
```

(Diğer field'ları mevcut kodla uyumlu tut — sadece `faqs` eklemen yeter.)

`C:\Users\maest\Documents\tarik-site\src\app\api\makaleler\[id]\route.ts` PUT handler'ında, body'den `author` strip eden mevcut mantığa zaten ek olarak `faqs`'i de body'de bırak — kaynak update zaten `{ ...body }` benzeri pattern ise zaten geçer. Eğer alan-alan değişiyorsa, `faqs` alanını da explicit ekle:

```ts
if (Array.isArray(body.faqs)) {
  // direct assignment
}
```

(Mevcut PUT handler kodunun yapısına göre değişebilir — `runValidators: true` ile findByIdAndUpdate kullanıyorsa zaten `faqs` body'sinden geçer.)

- [ ] **Step 5: Doğrulama**

```bash
npx tsc --noEmit
```

Beklenen: temiz.

- [ ] **Step 6: Smoke**

`http://localhost:3000/admin/makaleler/yeni` → form'un altında "Sıkça Sorulan Sorular" bölümü, "+ Soru ekle" tıkla, soru-cevap yaz, makale kaydet. Detay sayfasında FAQ bloğu render edilmeli + source'ta FAQPage JSON-LD.

- [ ] **Step 7: Commit**

```bash
git add src/components/admin/FaqEditor.tsx src/app/admin/makaleler/yeni/page.tsx src/app/admin/makaleler/[id]/page.tsx src/app/api/makaleler/route.ts src/app/api/makaleler/[id]/route.ts
git commit -m "feat(seo): admin makale forms — FAQ editor + API accepts faqs"
```

---

### Task 30: Phase 1 — final build + smoke

**Files:** (no edits, just verify)

- [ ] **Step 1: Cache temizle ve full build**

```bash
rm -rf .next && npm run build 2>&1 | tail -40
```

Beklenen: "✓ Compiled successfully", tüm sayfalar listede, hata yok. Toplam route sayısı şimdi şöyle olmalı:

- Önceden: 22 route
- Şimdi: 22 + sitemap + robots + rss.xml + api/og + /etiket/[tag] + /yazar/[slug] + /icon + /apple-icon + /manifest.webmanifest ≈ 30 route

- [ ] **Step 2: Typecheck**

```bash
npx tsc --noEmit
```

Beklenen: çıktı yok.

- [ ] **Step 3: Smoke checklist (her birini tarayıcıda veya curl ile aç)**

```bash
curl -s http://localhost:3000/sitemap.xml | head -30
curl -s http://localhost:3000/robots.txt
curl -s http://localhost:3000/rss.xml | head -30
curl -sI http://localhost:3000/api/og
curl -sI http://localhost:3000/icon
curl -sI http://localhost:3000/apple-icon
curl -s http://localhost:3000/manifest.webmanifest
```

Tarayıcıda elle aç:
- `/` — homepage, kategoriler header'da, footer'da, RSS link source'ta
- `/makale/<existing-slug>` — Article JSON-LD source'ta, breadcrumb üstte
- `/kategori/<existing-slug>` — Breadcrumb JSON-LD source'ta
- `/etiket/<existing-tag>` — etiket listesi
- `/yazar/<existing-slug>` — yazar profili
- `/hakkimda` — Person JSON-LD source'ta
- `/iletisim` — meta description set
- `/ara` — `<meta name="robots" content="noindex, follow">`

- [ ] **Step 4: Dış doğrulama (opsiyonel — production sonrası)**

Production deploy edilirse:
- https://search.google.com/test/rich-results — makale URL → Article + Breadcrumb tanınır.
- https://validator.w3.org/feed/ — rss.xml validasyon.
- https://cards-dev.twitter.com/validator — Twitter Card preview.

- [ ] **Step 5: Phase 1 wrap commit**

```bash
git commit --allow-empty -m "chore(seo): phase 1 — core SEO ship checkpoint"
```

---

## Phase 1b — Image Migration (`next/image`)

> **Bu phase Phase 1 merge edildikten sonra başlatılır.** SEO logic'inden bağımsız çalışır. Layout shift testlerini her task sonunda yap.

---

### Task 31: MakaleKart — next/image

**Files:**
- Modify: `src/components/public/MakaleKart.tsx`

- [ ] **Step 1: next/image'a geç**

`C:\Users\maest\Documents\tarik-site\src\components\public\MakaleKart.tsx` dosyasını TAMAMEN şu içerikle değiştir:

```tsx
import Link from "next/link";
import Image from "next/image";
import { IMakale, IKategori } from "@/types";

export default function MakaleKart({ makale }: { makale: IMakale }) {
  const kategori =
    makale.category && typeof makale.category === "object"
      ? (makale.category as IKategori)
      : null;

  return (
    <Link href={`/makale/${makale.slug}`} className="group">
      <article className="border border-gray-border rounded-lg overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
        {makale.coverImage ? (
          <div className="h-44 bg-gray-light overflow-hidden relative">
            <Image
              src={makale.coverImage}
              alt={makale.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        ) : (
          <div className="h-44 bg-gray-light" />
        )}
        <div className="p-5">
          {kategori && (
            <p className="kategori-etiketi mb-2">{kategori.name}</p>
          )}
          <h3 className="font-bold text-dark leading-snug group-hover:text-primary transition-colors">
            {makale.title}
          </h3>
          <p className="text-sm text-gray-text mt-2 leading-relaxed line-clamp-2">
            {makale.excerpt}
          </p>
          <p className="text-xs text-gray-text mt-3">
            {makale.readingTime} dk okuma
          </p>
        </div>
      </article>
    </Link>
  );
}
```

- [ ] **Step 2: Doğrulama**

```bash
npx tsc --noEmit
```

Beklenen: temiz.

- [ ] **Step 3: Smoke**

`/` ana sayfasında kart görselleri yükleniyor. DevTools Network'te `_next/image?url=...` request'leri görünür (Next image optimization).

- [ ] **Step 4: Commit**

```bash
git add src/components/public/MakaleKart.tsx
git commit -m "perf: MakaleKart — next/image migration"
```

---

### Task 32: HeroAlani — next/image

**Files:**
- Modify: `src/components/public/HeroAlani.tsx`

- [ ] **Step 1: next/image'a geç**

`C:\Users\maest\Documents\tarik-site\src\components\public\HeroAlani.tsx` dosyasında sadece `<img>` bloğunu şu şekilde değiştir:

```tsx
import Link from "next/link";
import Image from "next/image";
import { IMakale, IKategori } from "@/types";
import { formatDate } from "@/lib/utils";

export default function HeroAlani({ makale }: { makale: IMakale }) {
  const kategori =
    makale.category && typeof makale.category === "object"
      ? (makale.category as IKategori)
      : null;

  return (
    <section className="border-b border-gray-border">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <p className="kategori-etiketi mb-4">ÖNE ÇIKAN</p>
        <Link href={`/makale/${makale.slug}`} className="group">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-1">
              <h2 className="text-2xl md:text-3xl font-extrabold leading-tight group-hover:text-primary transition-colors">
                {makale.title}
              </h2>
              <p className="text-gray-text mt-4 leading-relaxed">
                {makale.excerpt}
              </p>
              <div className="flex items-center gap-3 mt-4 text-sm text-gray-text">
                <span>{formatDate(makale.createdAt)}</span>
                <span>·</span>
                <span>{makale.readingTime} dk okuma</span>
                {kategori && (
                  <>
                    <span>·</span>
                    <span className="text-primary font-medium">
                      {kategori.name}
                    </span>
                  </>
                )}
              </div>
            </div>
            {makale.coverImage && (
              <div className="w-full md:w-64 h-44 flex-shrink-0 rounded-lg overflow-hidden bg-gray-light relative">
                <Image
                  src={makale.coverImage}
                  alt={makale.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 256px"
                  className="object-cover"
                  priority
                />
              </div>
            )}
          </div>
        </Link>
      </div>
    </section>
  );
}
```

(`priority` öne çıkan içerik above-the-fold olduğu için.)

- [ ] **Step 2: Doğrulama**

```bash
npx tsc --noEmit
```

Beklenen: temiz.

- [ ] **Step 3: Smoke**

`/` ana sayfasında hero görseli optimized olarak yüklenir; LCP iyileşmeli.

- [ ] **Step 4: Commit**

```bash
git add src/components/public/HeroAlani.tsx
git commit -m "perf: HeroAlani — next/image migration with priority"
```

---

### Task 33: Makale detay — next/image (avatar + cover)

**Files:**
- Modify: `src/app/(public)/makale/[slug]/page.tsx`

- [ ] **Step 1: 2 yerde `<img>` → `Image`**

Mevcut Task 21'de yazılan makale detay sayfasında 2 `<img>` tag'i var (avatar + coverImage). Bunları şu şekilde değiştir:

Üst import bloğuna ekle:

```tsx
import Image from "next/image";
```

Avatar bloğu (eskisi yerine):

```tsx
<div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold overflow-hidden relative">
  {yazar?.avatar ? (
    <Image
      src={yazar.avatar}
      alt={yazar.name}
      fill
      sizes="40px"
      className="object-cover"
    />
  ) : (
    yazar?.name?.charAt(0) ?? "?"
  )}
</div>
```

Cover image bloğu:

```tsx
{makaleObj.coverImage && (
  <div className="max-w-content-wide mx-auto px-6 my-8">
    <div className="relative w-full rounded-xl overflow-hidden" style={{ maxHeight: 384 }}>
      <Image
        src={makaleObj.coverImage}
        alt={makaleObj.title}
        width={1200}
        height={384}
        sizes="(max-width: 768px) 100vw, 780px"
        className="w-full rounded-xl object-cover"
        style={{ maxHeight: 384, height: "auto" }}
        priority
      />
    </div>
  </div>
)}
```

- [ ] **Step 2: Doğrulama**

```bash
npx tsc --noEmit
```

Beklenen: temiz.

- [ ] **Step 3: Smoke**

Bir makale detay sayfasını aç — cover image ve avatar artık `_next/image` optimization'ı üstünden geliyor.

- [ ] **Step 4: Commit**

```bash
git add src/app/(public)/makale/[slug]/page.tsx
git commit -m "perf: makale detay — next/image for avatar + cover"
```

---

### Task 34: Admin kapak önizlemeleri — next/image

**Files:**
- Modify: `src/app/admin/makaleler/yeni/page.tsx`
- Modify: `src/app/admin/makaleler/[id]/page.tsx`

- [ ] **Step 1: yeni/page.tsx'te kapak preview**

`src/app/admin/makaleler/yeni/page.tsx`'te `<img src={coverImage}>` bloğunu şuna değiştir:

```tsx
import Image from "next/image";

// ...

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
  // ... olduğu gibi kalır
)}
```

- [ ] **Step 2: [id]/page.tsx'te aynı değişiklik**

Aynı pattern `src/app/admin/makaleler/[id]/page.tsx` dosyasında.

- [ ] **Step 3: Doğrulama**

```bash
npx tsc --noEmit
```

Beklenen: temiz.

- [ ] **Step 4: Smoke**

`/admin/makaleler/yeni` → kapak yükle, preview optimize edilmiş olarak görünür.

- [ ] **Step 5: Commit**

```bash
git add src/app/admin/makaleler/yeni/page.tsx src/app/admin/makaleler/[id]/page.tsx
git commit -m "perf: admin makale forms — next/image for cover preview"
```

---

### Task 35: Phase 1b — final build + verification

**Files:** (no edits)

- [ ] **Step 1: Full build**

```bash
rm -rf .next && npm run build 2>&1 | tail -30
```

Beklenen: temiz build, hata yok.

- [ ] **Step 2: Typecheck**

```bash
npx tsc --noEmit
```

Beklenen: temiz.

- [ ] **Step 3: Layout shift smoke**

`/` ana sayfasını aç, DevTools Performance tab'i kaydet, sayfa yenile. Görüntülerin layout shift'i sıfır olmalı (next/image'ın width/height + fill ile garantilediği davranış).

- [ ] **Step 4: Phase 1b wrap commit**

```bash
git commit --allow-empty -m "chore(seo): phase 1b — image migration ship checkpoint"
```

---

## Plan Coverage Self-Review

Spec'in her bölümünü plan'da hangi task karşılıyor:

| Spec Section | Coverage |
|---|---|
| 3.1 Crawlability | Task 11 (metadataBase), Task 13 (robots), Task 14 (sitemap), Task 19 (/ara noindex), Task 25 (Header dropdown), Task 26 (Footer) |
| 3.2 Meta Tags | Task 2 (site-config), Task 3 (buildMetadata), her sayfa task'ı (16-24) per-page meta |
| 3.3 JSON-LD | Task 4 (jsonld generators), Task 5 (JsonLdScript), Task 11 (Org), Task 17 (Hakkımda Person), Task 21 (Article + Breadcrumb + FAQ), Task 22 (kategori Breadcrumb), Task 24 (yazar Person + Breadcrumb) |
| 3.4 Performance | Task 11 (latin-ext + themeColor), Task 16 (server component conversion), Task 31-34 (next/image) |
| 3.5 OG Card | Task 15 |
| 3.6 Brand Assets | Task 12 |
| 3.7 RSS | Task 27 + RSS link in Task 25 layout |
| 3.8 New Routes | Task 23 (etiket), Task 24 (yazar) |
| 3.9 Data Model | Task 6 (Kullanici), Task 7 (Kategori), Task 8 (Makale), Task 9 (types), Task 10 (migration) |
| 3.10 Admin UI | Task 28 (yazar socials), Task 29 (FAQ editor) |
| 5 Veri Akışı | Veri akışı taskların içine gömülü (Task 15 OG flow, Task 14 sitemap flow, Task 27 RSS flow) |
| 6 Hata Senaryoları | Task 2 (env throw), Task 14 (revalidate fallback), Task 15 (OG default card), Task 21 (orphan author/category guards) |
| 7 Phases | Phase 1 (Tasks 1-30), Phase 1b (Tasks 31-35) |
| 8 Test Strategy | Her task'ın "Smoke" adımı + Task 30 + Task 35 final verification |
| 9 Env Vars | Task 1 |
| 11 Migration | Task 10 |

**Boşluk yok.** Plan spec'in her gereksinimini karşılıyor.
