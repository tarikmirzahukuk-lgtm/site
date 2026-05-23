# Site İçeriği CMS — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Tüm public site içeriğini (ana sayfa 7 bölüm, Hakkımda, iletişim/mesleki bilgi, nav, SEO) admin panelinden düzenlenebilir kılmak; kaydedince deploy'suz yayında görünsün.

**Architecture:** Tek `SiteContent` Mongo singleton dökümanı (`key:"main"`). Public sayfalar `getSiteContent()` (unstable_cache, tag `site-content`) ile okur; admin PUT'ı kaydedince `revalidateTag("site-content")` tazeler. DB boşsa `SITE_CONTENT_DEFAULTS` fallback'ine düşer (site asla boş render etmez). `SITE_URL` env'de kalır.

**Tech Stack:** Next 16 (App Router), React 19, Mongoose 9, NextAuth 4, TipTap 3, Tailwind v4. `unstable_cache`/`revalidateTag` from `next/cache` (Cache Components KAPALI — `cacheComponents` flag açılmaz).

**Verification note (TDD sapması):** Projede test runner YOK (package.json'da test script'i yok). Bu plan, doğrulama adımı olarak `npx tsc --noEmit` (hızlı tip kontrolü) + milestone'larda `npm run build` + manuel kontrol kullanır. Saf mantık (`renderAccent`) için manuel/gözle doğrulama yapılır.

---

## Dosya Haritası

**Yeni:**
- `src/models/SiteContent.ts` — Mongoose modeli (singleton).
- `src/lib/site-content-defaults.ts` — `SITE_CONTENT_DEFAULTS` (mevcut içerikten port) — hem seed hem fallback.
- `src/lib/get-site-content.ts` — `getSiteContent()` önbellekli accessor + `SITE_CONTENT_TAG`.
- `src/lib/render-accent.tsx` — `renderAccent(text)` altın-italik vurgu.
- `src/app/api/site-content/route.ts` — GET/PUT.
- `scripts/seed-site-content.ts` — seed/migrasyon.
- `src/app/admin/site-icerik/page.tsx` — admin sekmeli form.
- `src/components/admin/site-icerik/ListEditor.tsx` — generic ekle/sil/sırala liste editörü.
- `src/components/admin/site-icerik/ImageField.tsx` — görsel yükle/kaldır.
- `src/components/admin/site-icerik/IconSelect.tsx` — ikon açılır menü.

**Değişecek:**
- `src/types/index.ts` — yeni arayüzler.
- `package.json` — `seed:site-content` script.
- `src/app/(public)/page.tsx`, `src/app/(public)/hakkimda/page.tsx`, `src/app/(public)/iletisim/page.tsx`.
- `src/components/public/home/{Hero,Trusts,Areas,Process,About,Urgent,Faq}.tsx`.
- `src/components/public/{Header,Footer}.tsx`.
- `src/components/admin/AdminSidebar.tsx`.

---

## Task 1: Tipler + SiteContent modeli

**Files:**
- Modify: `src/types/index.ts`
- Create: `src/models/SiteContent.ts`

- [ ] **Step 1: `src/types/index.ts` sonuna arayüzleri ekle**

```ts
export interface ICta { label: string; href: string; }
export interface IIconItem { icon: string; title: string; description: string; }
export interface IStep { number: string; title: string; description: string; }
export interface IStat { value: string; label: string; }
export interface IBadge { icon: string; label: string; }
export interface INavLink { label: string; href: string; }

export interface ISiteContent {
  key: "main";
  hero: {
    kicker: string; heading: string; subtext: string;
    primaryCta: ICta; secondaryCta: ICta; badges: IBadge[];
  };
  trusts: { kicker: string; heading: string; intro: string; items: IIconItem[]; };
  areas: { kicker: string; heading: string; intro: string; items: IIconItem[]; };
  process: { kicker: string; heading: string; intro: string; items: IStep[]; };
  about: { kicker: string; heading: string; body: string; portraitImage: string; stats: IStat[]; };
  urgent: {
    kicker: string; heading: string; body: string;
    emailKanal: { label: string; value: string };
    secondaryCta: ICta;
  };
  faq: { kicker: string; heading: string; items: IFaq[]; };
  hakkimda: { title: string; body: string; avatarImage: string; metaDescription: string; };
  contact: {
    phone: string; phoneRaw: string; whatsapp: string; email: string;
    address: { line1: string; line2: string; postalCode: string };
  };
  professional: { barosicil: string; since: number; experienceLabel: string; };
  author: { name: string; jobTitle: string; knowsAbout: string[]; bio: string; };
  nav: INavLink[];
  seo: { brand: string; brandShort: string; tagline: string; description: string; };
}
```

- [ ] **Step 2: `src/models/SiteContent.ts` oluştur** (Makale.ts deseni; alt-objeler nested literal, `_id:false` gerekmez çünkü nested objeler array değil; array'ler için alt-şema)

```ts
import mongoose, { Schema, Document, Model } from "mongoose";
import type { ISiteContent } from "@/types";

export interface ISiteContentDoc extends Document, Omit<ISiteContent, "key"> {
  key: string;
}

const Cta = { label: { type: String, default: "" }, href: { type: String, default: "" } };
const IconItem = new Schema(
  { icon: String, title: String, description: String }, { _id: false }
);
const Step = new Schema({ number: String, title: String, description: String }, { _id: false });
const Stat = new Schema({ value: String, label: String }, { _id: false });
const Badge = new Schema({ icon: String, label: String }, { _id: false });
const Nav = new Schema({ label: String, href: String }, { _id: false });
const Faq = new Schema({ question: String, answer: String }, { _id: false });

const SiteContentSchema = new Schema<ISiteContentDoc>(
  {
    key: { type: String, default: "main", unique: true },
    hero: {
      kicker: String, heading: String, subtext: String,
      primaryCta: Cta, secondaryCta: Cta, badges: { type: [Badge], default: [] },
    },
    trusts: { kicker: String, heading: String, intro: String, items: { type: [IconItem], default: [] } },
    areas: { kicker: String, heading: String, intro: String, items: { type: [IconItem], default: [] } },
    process: { kicker: String, heading: String, intro: String, items: { type: [Step], default: [] } },
    about: { kicker: String, heading: String, body: String, portraitImage: String, stats: { type: [Stat], default: [] } },
    urgent: {
      kicker: String, heading: String, body: String,
      emailKanal: { label: String, value: String }, secondaryCta: Cta,
    },
    faq: { kicker: String, heading: String, items: { type: [Faq], default: [] } },
    hakkimda: { title: String, body: String, avatarImage: String, metaDescription: String },
    contact: {
      phone: String, phoneRaw: String, whatsapp: String, email: String,
      address: { line1: String, line2: String, postalCode: String },
    },
    professional: { barosicil: String, since: Number, experienceLabel: String },
    author: { name: String, jobTitle: String, knowsAbout: { type: [String], default: [] }, bio: String },
    nav: { type: [Nav], default: [] },
    seo: { brand: String, brandShort: String, tagline: String, description: String },
  },
  { timestamps: true, minimize: false }
);

const SiteContent: Model<ISiteContentDoc> =
  mongoose.models.SiteContent ||
  mongoose.model<ISiteContentDoc>("SiteContent", SiteContentSchema);

export default SiteContent;
```

- [ ] **Step 3: Doğrula** — `npx tsc --noEmit` → hata yok.
- [ ] **Step 4: Commit** — `git add -A && git commit -m "feat(cms): SiteContent tipleri + Mongoose modeli"`

---

## Task 2: Defaults (fallback + seed kaynağı) + seed script

**Files:**
- Create: `src/lib/site-content-defaults.ts`
- Create: `scripts/seed-site-content.ts`
- Modify: `package.json`

- [ ] **Step 1: `src/lib/site-content-defaults.ts` oluştur.** İçerik AYNEN mevcut kaynaklardan port edilir: `src/lib/site-data.ts` (NAV→nav, TRUSTS→trusts.items, AREAS→areas.items, STEPS→process.items, FAQ→faq.items) ve `src/lib/site-config.ts` (contact, professional, author, seo: brand/brandShort/tagline/description), ARTI component içi gömülü metinler:
  - `hero`: kicker `"İstanbul · {SITE_CONFIG.professional.since}'ten beri"`, heading `"Ceza Hukukunda *titiz ve içtihat odaklı* analiz."`, subtext (Hero.tsx'teki paragraf), primaryCta `{label:"İlgi Alanları",href:"/#uzmanlik"}`, secondaryCta `{label:"Hakkımda",href:"/hakkimda"}`, badges `[{icon:"shield",label:"Akademik referans"},{icon:"strategy",label:"Doktrin tartışmaları"},{icon:"user",label:"Düzenli yayın"}]`.
  - `trusts`: kicker `""` (mevcutta Trusts başlığı — Trusts.tsx'ten teyit et), heading/intro Trusts.tsx'ten, items=TRUSTS.
  - `areas`: kicker `"İlgi Alanları"`, heading `"Çalıştığım *konu başlıkları.*"`, intro (Areas.tsx sağ paragraf), items=AREAS.
  - `process`: kicker `"Yaklaşım"`, heading `"Nasıl *çalışıyorum.*"`, intro (Process.tsx), items=STEPS.
  - `about`: kicker `"Hakkımda"`, heading `"{brand}*.*"` (About.tsx'teki marka+nokta), body=About.tsx iki paragrafın HTML'i (`<p>...</p><p>...</p>`), portraitImage `""`, stats=`[{value:"2.",label:"Yıl · sürekli yazım"},{value:"7+",label:"Çalışma alanı"},{value:"100%",label:"Bağımsız araştırma"}]` (ilk değer artık serbest metin; mevcut hesaplanan değeri yaz).
  - `urgent`: kicker `"Konu Önerisi & Eleştiri"`, heading `"Yazılmasını istediğiniz bir konu — *benimle paylaşın.*"`, body (Urgent.tsx paragraf), emailKanal `{label:"E-POSTA",value: contact.email}`, secondaryCta `{label:"Tüm kanallar",href:"/iletisim"}`.
  - `faq`: kicker `"Sık Sorulan Sorular"`, heading `"Aklınızdaki *ilk sorular.*"`, items=FAQ.
  - `hakkimda`: title `"Hakkımda"`, body=hakkimda/page.tsx üç paragrafın HTML'i, avatarImage `""`, metaDescription=HAKKIMDA_DESC.

```ts
import { SITE_CONFIG } from "@/lib/site-config";
import { NAV, TRUSTS, AREAS, STEPS, FAQ } from "@/lib/site-data";
import type { ISiteContent } from "@/types";

const since = SITE_CONFIG.professional.since;

export const SITE_CONTENT_DEFAULTS: ISiteContent = {
  key: "main",
  hero: {
    kicker: `İstanbul · ${since}'ten beri`,
    heading: "Ceza Hukukunda *titiz ve içtihat odaklı* analiz.",
    subtext:
      "Türk ceza hukukunun genel ve özel hükümlerine ilişkin akademik makaleler, Yargıtay içtihatlarının değerlendirilmesi ve güncel hukuki tartışmalar. Bilgiyi paylaşarak öğrenmek, tartışarak derinleşmek.",
    primaryCta: { label: "İlgi Alanları", href: "/#uzmanlik" },
    secondaryCta: { label: "Hakkımda", href: "/hakkimda" },
    badges: [
      { icon: "shield", label: "Akademik referans" },
      { icon: "strategy", label: "Doktrin tartışmaları" },
      { icon: "user", label: "Düzenli yayın" },
    ],
  },
  trusts: { kicker: "", heading: "", intro: "", items: TRUSTS },
  areas: {
    kicker: "İlgi Alanları",
    heading: "Çalıştığım *konu başlıkları.*",
    intro:
      "Yedi alanda yoğunlaşıyorum. Her konu doktrin, içtihat ve karşılaştırmalı hukuk açılarından titizlikle incelenir.",
    items: AREAS,
  },
  process: {
    kicker: "Yaklaşım",
    heading: "Nasıl *çalışıyorum.*",
    intro:
      "Net bir başlangıç, titiz bir okuma, dosyaya/konuya özel bir analiz. Süreç boyunca şeffaf düşünme.",
    items: STEPS,
  },
  about: {
    kicker: "Hakkımda",
    heading: `${SITE_CONFIG.brand}*.*`,
    body:
      "<p>Hukuk fakültesi öğrencisi ve ceza hukuku alanında araştırmacı. " +
      `${since}'ten bu yana bu platformda düzenli olarak akademik makaleler, Yargıtay kararı değerlendirmeleri ve doktrin tartışmaları yayınlıyorum.</p>` +
      "<p>İlgi alanlarım ağır ceza, bilişim ve ekonomik suçlar; CMK'nın soruşturma ve kovuşturma evrelerine ilişkin güvenceleri; özel olarak da tutukluluk hukukunun uygulamadaki yansımaları.</p>",
    portraitImage: "",
    stats: [
      { value: `${new Date().getFullYear() - since + 1}.`, label: "Yıl · sürekli yazım" },
      { value: "7+", label: "Çalışma alanı" },
      { value: "100%", label: "Bağımsız araştırma" },
    ],
  },
  urgent: {
    kicker: "Konu Önerisi & Eleştiri",
    heading: "Yazılmasını istediğiniz bir konu — *benimle paylaşın.*",
    body:
      "Tartışmalı bir içtihat, kafa karıştıran bir mevzuat değişikliği veya akademik olarak değerlendirilmemiş bir konu — okuyucu önerileri yazı sırasındaki en önemli kaynak. Eleştiri ve düzeltmeler de aynı kanaldan ulaşır.",
    emailKanal: { label: "E-POSTA", value: SITE_CONFIG.contact.email },
    secondaryCta: { label: "Tüm kanallar", href: "/iletisim" },
  },
  faq: { kicker: "Sık Sorulan Sorular", heading: "Aklınızdaki *ilk sorular.*", items: FAQ },
  hakkimda: {
    title: "Hakkımda",
    body:
      "<p>Merhaba, ben <strong>Tarık Mirza</strong>. Ceza hukuku alanında araştırmalar yapan bir hukuk öğrencisiyim.</p>" +
      "<p>Bu platformda ceza hukukunun genel ve özel hükümlerine ilişkin akademik makaleler, güncel Yargıtay kararlarının değerlendirmeleri ve hukuki analizler paylaşıyorum.</p>" +
      "<p>Amacım, ceza hukuku alanındaki bilgi birikimimi paylaşarak hem hukuk öğrencilerine hem de konuya ilgi duyan herkese faydalı bir kaynak oluşturmaktır.</p>",
    avatarImage: "",
    metaDescription:
      "Tarık Mirza — ceza hukuku alanında araştırmalar yapan bir hukuk öğrencisi. Akademik makaleler, Yargıtay kararı değerlendirmeleri ve hukuki analizler.",
  },
  contact: {
    phone: SITE_CONFIG.contact.phone,
    phoneRaw: SITE_CONFIG.contact.phoneRaw,
    whatsapp: SITE_CONFIG.contact.whatsapp,
    email: SITE_CONFIG.contact.email,
    address: { ...SITE_CONFIG.contact.address },
  },
  professional: {
    barosicil: SITE_CONFIG.professional.barosicil,
    since: SITE_CONFIG.professional.since,
    experienceLabel: SITE_CONFIG.professional.experienceLabel,
  },
  author: {
    name: SITE_CONFIG.author.name,
    jobTitle: SITE_CONFIG.author.jobTitle,
    knowsAbout: [...SITE_CONFIG.author.knowsAbout],
    bio: "",
  },
  nav: NAV.map((n) => ({ label: n.label, href: n.href })),
  seo: {
    brand: SITE_CONFIG.brand,
    brandShort: SITE_CONFIG.brandShort,
    tagline: SITE_CONFIG.tagline,
    description: SITE_CONFIG.description,
  },
};
```

- [ ] **Step 2: `scripts/seed-site-content.ts` oluştur** (seed-admin.ts deseni: dotenv + mongoose connect)

```ts
import { config } from "dotenv";
config({ path: ".env.local" });
import mongoose from "mongoose";
import SiteContent from "../src/models/SiteContent";
import { SITE_CONTENT_DEFAULTS } from "../src/lib/site-content-defaults";

async function main() {
  const force = process.argv.includes("--force");
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI tanımlı değil (.env.local).");
  await mongoose.connect(uri);

  const existing = await SiteContent.findOne({ key: "main" });
  if (existing && !force) {
    console.log("SiteContent zaten var. Üzerine yazmak için --force kullanın.");
  } else {
    await SiteContent.findOneAndUpdate(
      { key: "main" },
      { $set: { ...SITE_CONTENT_DEFAULTS, key: "main" } },
      { upsert: true, new: true }
    );
    console.log(force ? "SiteContent --force ile güncellendi." : "SiteContent oluşturuldu.");
  }
  await mongoose.disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
```

- [ ] **Step 3: `package.json` scripts'e ekle** — `"seed:site-content": "tsx scripts/seed-site-content.ts"`
- [ ] **Step 4: Doğrula** — `npx tsc --noEmit`. (Mümkünse `npm run seed:site-content` — MONGODB_URI varsa çalışır; yoksa atla, fallback devrede.)
- [ ] **Step 5: Commit** — `git commit -am "feat(cms): içerik defaults + seed script"`

---

## Task 3: Accessor + renderAccent

**Files:**
- Create: `src/lib/get-site-content.ts`
- Create: `src/lib/render-accent.tsx`

- [ ] **Step 1: `src/lib/get-site-content.ts`**

```ts
import { unstable_cache } from "next/cache";
import dbConnect from "@/lib/db";
import SiteContent from "@/models/SiteContent";
import { SITE_CONTENT_DEFAULTS } from "@/lib/site-content-defaults";
import type { ISiteContent } from "@/types";

export const SITE_CONTENT_TAG = "site-content";

async function readSiteContent(): Promise<ISiteContent> {
  try {
    await dbConnect();
    const doc = await SiteContent.findOne({ key: "main" }).lean();
    if (!doc) return SITE_CONTENT_DEFAULTS;
    return { ...SITE_CONTENT_DEFAULTS, ...JSON.parse(JSON.stringify(doc)) } as ISiteContent;
  } catch {
    return SITE_CONTENT_DEFAULTS;
  }
}

export const getSiteContent = unstable_cache(readSiteContent, ["site-content"], {
  tags: [SITE_CONTENT_TAG],
  revalidate: 3600,
});
```

- [ ] **Step 2: `src/lib/render-accent.tsx`** — `*...*` → `<span class="italic-gold">`

```tsx
import React from "react";

export function renderAccent(text: string): React.ReactNode {
  if (!text) return null;
  return text.split("*").map((part, i) =>
    i % 2 === 1
      ? <span key={i} className="italic-gold">{part}</span>
      : <React.Fragment key={i}>{part}</React.Fragment>
  );
}
```

- [ ] **Step 3: Doğrula** — `npx tsc --noEmit`. Manuel mantık kontrolü: `"a *b* c"` → `["a ", <span>b</span>, " c"]` (3 parça, index 1 vurgulu). ✓
- [ ] **Step 4: Commit** — `git commit -am "feat(cms): getSiteContent accessor + renderAccent"`

---

## Task 4: API route (GET/PUT + revalidate)

**Files:**
- Create: `src/app/api/site-content/route.ts`

- [ ] **Step 1: route.ts** (makaleler/route.ts auth+hata deseni)

```ts
import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import dbConnect from "@/lib/db";
import SiteContent from "@/models/SiteContent";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { SITE_CONTENT_TAG } from "@/lib/get-site-content";
import { SITE_CONTENT_DEFAULTS } from "@/lib/site-content-defaults";

export async function GET() {
  await dbConnect();
  const doc = await SiteContent.findOne({ key: "main" }).lean();
  return NextResponse.json(doc ? JSON.parse(JSON.stringify(doc)) : SITE_CONTENT_DEFAULTS);
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  await dbConnect();
  let body: Record<string, unknown>;
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "Geçersiz istek" }, { status: 400 }); }

  delete body._id; delete body.key; delete body.createdAt; delete body.updatedAt; delete body.__v;

  try {
    const doc = await SiteContent.findOneAndUpdate(
      { key: "main" },
      { $set: { ...body, key: "main" } },
      { upsert: true, new: true, runValidators: true }
    ).lean();
    revalidateTag(SITE_CONTENT_TAG);
    return NextResponse.json(JSON.parse(JSON.stringify(doc)));
  } catch (err: unknown) {
    const e = err as { message?: string };
    return NextResponse.json({ error: e.message || "Kaydedilemedi" }, { status: 500 });
  }
}
```

- [ ] **Step 2: Doğrula** — `npx tsc --noEmit`.
- [ ] **Step 3: Commit** — `git commit -am "feat(cms): /api/site-content GET/PUT + revalidateTag"`

---

## Task 5: Public — ana sayfa + bölümler props'a çevir

**Files:**
- Modify: `src/app/(public)/page.tsx`
- Modify: `src/components/public/home/{Hero,Trusts,Areas,Process,About,Urgent,Faq}.tsx`

Genel desen: her bölüm component'i `data` (ve gerekiyorsa ek) prop alır; sabit `SITE_CONFIG`/`site-data` import'ları kaldırılır; başlık/kicker `renderAccent()` ile render edilir; görsel alanları boşsa monogram fallback.

- [ ] **Step 1: `page.tsx` — async + props dağıt**

```tsx
import { getSiteContent } from "@/lib/get-site-content";
// ... mevcut importlar
export async function generateMetadata(): Promise<Metadata> {
  const c = await getSiteContent();
  return buildMetadata({ title: `${c.seo.brand} | ${c.seo.tagline}`, description: c.seo.description, path: "/" });
}
export default async function AnaSayfa() {
  const c = await getSiteContent();
  return (
    <>
      <Hero data={c.hero} />
      <Reveal><Trusts data={c.trusts} /></Reveal>
      <Reveal delay={50}><Areas data={c.areas} /></Reveal>
      <Reveal><Process data={c.process} /></Reveal>
      <Reveal delay={50}><About data={c.about} /></Reveal>
      <Reveal><Urgent data={c.urgent} contactEmail={c.contact.email} /></Reveal>
      <Reveal><Faq data={c.faq} /></Reveal>
    </>
  );
}
```
(Eski `export const metadata` satırını kaldır.)

- [ ] **Step 2: Hero.tsx** — `export default function Hero({ data }: { data: ISiteContent["hero"] })`. Kicker→`{data.kicker}`, h1→`{renderAccent(data.heading)}`, p→`{data.subtext}`, butonlar→`data.primaryCta`/`secondaryCta` (label+href), reassurance row→`data.badges.map(b => <span><Icon name={b.icon as IconName}/>{b.label}</span>)`. `SITE_CONFIG` import'unu kaldır. `renderAccent` ve `ISiteContent` import et.

- [ ] **Step 3: Trusts.tsx** — props `data: ISiteContent["trusts"]`; başlık varsa `renderAccent(data.heading)`, items `data.items`. (Trusts.tsx'i okuyup mevcut başlık/yapıyı koru; sadece veri kaynağını props yap.)

- [ ] **Step 4: Areas.tsx** — props `data: ISiteContent["areas"]`. kicker `{data.kicker}`, h2 `{renderAccent(data.heading)}`, sağ paragraf `{data.intro}`, `data.items.map(...)`. `AREAS` import kaldır.

- [ ] **Step 5: Process.tsx** — props `data: ISiteContent["process"]`. kicker/h2(renderAccent)/intro/`data.items`. `STEPS` import kaldır.

- [ ] **Step 6: About.tsx** — props `data: ISiteContent["about"]`. kicker `{data.kicker}`, h2 `{renderAccent(data.heading)}`, gövde: `data.body` zengin HTML → `<div className="prose prose-invert ..." dangerouslySetInnerHTML={{ __html: data.body }} />` (mevcut iki `<p>` yerine). Portre: `data.portraitImage` doluysa `<Image src=... fill>` değilse mevcut "TM" monogram. stats `data.stats.map(...)`. `SITE_CONFIG` import kaldır.

- [ ] **Step 7: Urgent.tsx** — props `{ data: ISiteContent["urgent"]; contactEmail: string }`. kicker `{data.kicker}`, h2 `{renderAccent(data.heading)}`, p `{data.body}`, mailto `mailto:${contactEmail}`, e-posta etiketi `data.emailKanal.label`/`value`, ikinci link `data.secondaryCta`. `SITE_CONFIG` import kaldır.

- [ ] **Step 8: Faq.tsx** — `"use client"` kalır; props `data: ISiteContent["faq"]`. kicker/h2(renderAccent)/`data.items`. `FAQ` import kaldır. (renderAccent client'ta da çalışır — saf fonksiyon.)

- [ ] **Step 9: Doğrula** — `npm run build` → ana sayfa derlenir, tip hatası yok.
- [ ] **Step 10: Commit** — `git commit -am "feat(cms): ana sayfa bölümleri DB içeriğinden beslenir"`

---

## Task 6: Public — Hakkımda, İletişim, Header, Footer, SEO

**Files:**
- Modify: `src/app/(public)/hakkimda/page.tsx`, `src/app/(public)/iletisim/page.tsx`
- Modify: `src/components/public/Header.tsx`, `src/components/public/Footer.tsx`

- [ ] **Step 1: hakkimda/page.tsx** — async; `const c = await getSiteContent()`. `generateMetadata` async → `c.hakkimda.metaDescription`/title. Sayfa: h1 `{c.hakkimda.title}`, gövde `<div className="prose prose-lg prose-invert ..." dangerouslySetInnerHTML={{ __html: c.hakkimda.body }} />`, avatar `c.hakkimda.avatarImage` doluysa `<Image>` değilse "T" monogram. `personJsonLd` için `bio`/`name` → `c.author`/`c.hakkimda`.

- [ ] **Step 2: iletisim/page.tsx** — oku (mevcut içeriği gör), `SITE_CONFIG.contact` kullanımlarını `c.contact`/`c.professional` ile değiştir (async getSiteContent). Telefon/e-posta/adres/WhatsApp DB'den. (`generateMetadata` varsa async'e çevir.)

- [ ] **Step 3: Header.tsx** — oku. `NAV`/`SITE_CONFIG` import'larını kaldır; server component'e çevirip `const c = await getSiteContent()`; nav `c.nav`, marka `c.seo.brand`/`brandShort`. Eğer client component ise (mobil menü state'i): server wrapper'dan `nav`/`brand` props geçir. (Mevcut yapıya göre minimal değişiklik.)

- [ ] **Step 4: Footer.tsx** — oku. `SITE_CONFIG`/`NAV` kullanımlarını `getSiteContent()` ile değiştir (server component). İletişim/marka/nav DB'den.

- [ ] **Step 5: SEO yardımcıları kontrolü** — `src/lib/seo/metadata.ts` ve `src/lib/seo/jsonld.ts` `SITE_CONFIG`'i import ediyor. `SITE_URL`/`metadataBase` ENV'de kalır (değişmez). Düzenlenebilir alanları (brand, description, author) kullanan sayfa-seviyesi `generateMetadata`/jsonld çağrıları `getSiteContent()`'ten beslenir; `metadata.ts`/`jsonld.ts` imzaları parametre alıyorsa dokunma, sabit `SITE_CONFIG` default'u fallback olarak kalsın. (Amaç: kırmadan, düzenlenebilir alanları DB'ye bağlamak.)

- [ ] **Step 6: Doğrula** — `npm run build` → tüm public rotalar derlenir.
- [ ] **Step 7: Commit** — `git commit -am "feat(cms): hakkımda/iletişim/header/footer + SEO DB içeriğine bağlandı"`

---

## Task 7: Admin arayüzü

**Files:**
- Create: `src/components/admin/site-icerik/ListEditor.tsx`
- Create: `src/components/admin/site-icerik/ImageField.tsx`
- Create: `src/components/admin/site-icerik/IconSelect.tsx`
- Create: `src/app/admin/site-icerik/page.tsx`
- Modify: `src/components/admin/AdminSidebar.tsx`

- [ ] **Step 1: `IconSelect.tsx`** — mevcut `Icon` setindeki `IconName` birliğinden `<select>`. (Icon.tsx'i okuyup geçerli ikon adlarını bir diziye al; o diziden option üret.) Mevcut `inputClass` stilini kullan.

- [ ] **Step 2: `ImageField.tsx`** — makale kapak yükleme UX'i (yeni/[id] page.tsx'teki cover pattern): `value` (url) + `onChange`. Doluysa `<Image>` + kaldır butonu; boşsa "Görsel yükle" dropzone → `POST /api/upload` (FormData `file`) → dönen `{url}` → onChange. Hata mesajı göster.

- [ ] **Step 3: `ListEditor.tsx`** — generic. Props: `items: T[]`, `onChange`, `fields` tanımı (her alan: key, label, type: "text"|"textarea"|"icon"), `newItem` (boş öğe), `addLabel`. FaqEditor deseninde: her öğe paneli + yukarı/aşağı/sil butonları + alanlar. Sıralama: index swap.

```tsx
"use client";
type FieldDef = { key: string; label: string; type: "text" | "textarea" | "icon" };
export default function ListEditor<T extends Record<string, unknown>>({
  items, onChange, fields, newItem, addLabel,
}: {
  items: T[]; onChange: (v: T[]) => void;
  fields: FieldDef[]; newItem: T; addLabel: string;
}) {
  const update = (i: number, k: string, v: string) =>
    onChange(items.map((it, idx) => (idx === i ? { ...it, [k]: v } : it)));
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir; if (j < 0 || j >= items.length) return;
    const next = [...items]; [next[i], next[j]] = [next[j], next[i]]; onChange(next);
  };
  const add = () => onChange([...items, { ...newItem }]);
  // render: panel başına fields.map (text→input, textarea→textarea, icon→IconSelect) + move/remove
  // ekle butonu addLabel
  // (stiller: inputClass/labelClass dark+gold)
}
```

- [ ] **Step 4: `src/app/admin/site-icerik/page.tsx`** — `"use client"`. Mount'ta `GET /api/site-content` → state. Sekme state'i (`"anasayfa"|"hakkimda"|"iletisim"|"ayarlar"`). Alan değişiklikleri state'i günceller (nested set helper). "Kaydet" → `PUT /api/site-content` (JSON body = state) → başarı/hata mesajı. Bileşenler:
  - Kısa metin → `inputClass`/`labelClass` (makale formundan).
  - Zengin metin (about.body, urgent.body, hakkimda.body) → mevcut `MakaleEditoru` (`content`+`onChange`).
  - Listeler (hero.badges, trusts/areas/process/faq items, about.stats, nav) → `ListEditor` uygun `fields`/`newItem` ile.
  - Görseller (about.portraitImage, hakkimda.avatarImage) → `ImageField`.
  - İkon alanları → `ListEditor` icon tipi (IconSelect).
  - Sekme yerleşimi: Ana Sayfa (hero, trusts, areas, process, about, urgent, faq), Hakkımda (hakkimda.*), İletişim (contact.*, professional.*), Ayarlar (nav, seo, author).
  - Yükleniyor/hata durumları makale formu deseniyle.

- [ ] **Step 5: `AdminSidebar.tsx`** — nav öğelerine ekle: `{ href: "/admin/site-icerik", label: "Site İçeriği", icon: <uygun emoji/ikon> }` (mevcut item dizisinin şekline uy).

- [ ] **Step 6: Doğrula** — `npm run build` → admin rotası derlenir.
- [ ] **Step 7: Commit** — `git commit -am "feat(cms): admin site içeriği sekmeli formu"`

---

## Task 8: Son doğrulama

- [ ] **Step 1:** `npm run build` → temiz (tüm rotalar).
- [ ] **Step 2:** `npm run lint` → temiz.
- [ ] **Step 3 (DB varsa manuel):** `npm run seed:site-content` → panelde 4 sekme yüklenir → bir alan + foto düzenle → Kaydet → public sayfada görünür. DB yoksa: fallback ile public sayfalar mevcut içerikle render eder.
- [ ] **Step 4:** Son commit (varsa kalan) ve özet.

---

## Self-Review (yazım sonrası)

- **Spec kapsamı:** Ana sayfa (T5), Hakkımda+foto (T6+T7 ImageField), İletişim/mesleki (T6+T7), Menü/ayarlar (T6+T7), zengin metin (T7 MakaleEditoru), accent (T3), seed/migrasyon (T2), revalidation (T4), fallback (T3 defaults) — hepsi karşılanıyor. ✓
- **Placeholder taraması:** Çekirdek modüllerde (model, defaults, accessor, renderAccent, API) tam kod var. UI task'larında (T5–T7) mevcut dosya desenleri + anahtar kod + net talimat; component'ler mevcut koddan türetildiği için executor okuyarak uygular.
- **Tip tutarlılığı:** `ISiteContent` alan adları model şeması, defaults, accessor, API ve props tiplerinde birebir aynı. `SITE_CONTENT_TAG` tek yerde tanımlı, API'de import. `getSiteContent`/`renderAccent` adları sabit.
