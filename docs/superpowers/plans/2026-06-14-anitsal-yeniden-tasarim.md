# Anıtsal Public Site Yeniden Tasarımı — Uygulama Planı

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Tarık Mirza ceza hukuku sitesinin tüm public yüzeylerini, mevcut altın-koyu kimliği koruyarak "Anıtsal" tasarım diline taşımak.

**Architecture:** CSS-öncelikli. `globals.css`'teki paylaşılan yardımcı sınıf katmanı + `utils.ts`'teki `toRoman` yardımcısı (Task 1) tüm yüzeyler tarafından miras alınır; böylece tutarlılık tek kaynaktan gelir. Veri modeli ve bağımlılıklar değişmez.

**Tech Stack:** Next.js (App Router), Tailwind CSS v4 (`@theme inline`), Playfair Display + Inter (`next/font`), TipTap (içerik render), MongoDB/Mongoose (değişmez).

**Doğrulama yaklaşımı:** Proje test altyapısı içermez ve bu çalışmada eklenmez. Bu yüzden TDD/unit test yerine **dev-server önizlemesi** ile görsel doğrulama uygulanır: her task `npx tsc --noEmit` + `npm run lint` temiz geçmeli ve ilgili yüzey `preview_screenshot` ile görsel olarak doğrulanmalıdır.

**Commit notu:** Tüm commit mesajlarının sonuna şu trailer eklenir:
`Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`

---

### Task 1: Tasarım sistemi temeli — `globals.css` yardımcıları + `toRoman`

Bu task tüm sonraki yüzeylerin kullandığı paylaşılan sınıf sözlüğünü ve `toRoman` yardımcısını kurar. **Önce bu task tamamlanmalı.**

**Files:**
- Modify: `src/lib/utils.ts`
- Modify: `src/app/globals.css`

- [ ] **Step 1: `toRoman` yardımcısını `utils.ts`'e ekle**

`src/lib/utils.ts` dosyasının sonuna aşağıdaki export'u ekle (mevcut `slugify`/`calculateReadingTime`/`formatDate` export'larına dokunma):

```ts
const ROMAN_MAP: [number, string][] = [
  [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"],
  [100, "C"], [90, "XC"], [50, "L"], [40, "XL"],
  [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
];

/** Pozitif tam sayıyı Roma rakamına çevirir (anıtsal indeksler için). */
export function toRoman(n: number): string {
  if (!Number.isFinite(n) || n < 1) return String(n);
  let num = Math.floor(n);
  let out = "";
  for (const [value, symbol] of ROMAN_MAP) {
    while (num >= value) {
      out += symbol;
      num -= value;
    }
  }
  return out;
}
```

- [ ] **Step 2: Kontrast düzeltmesi — `--color-muted-dim`**

`src/app/globals.css` içindeki `@theme inline` bloğunda `--color-muted-dim` değerini güncelle (denetimde koyu zeminde ~3.9:1 ile AA altı çıkmıştı; #9a9a9a ~6:1 ile AA'yı geçer):

```css
  --color-muted-dim: #9a9a9a;
```

- [ ] **Step 3: Anıtsal yardımcı sınıfları ekle**

`src/app/globals.css` içindeki mevcut `@layer components { ... }` bloğunun SONUNA (kapanış `}`'inden hemen önce) aşağıdaki sınıfları ekle. Mevcut sınıflar (`.btn-*`, `.kicker`, `.eyebrow`, `.display`, `.pcard`, `.pill`, `.reveal-*`, `.hero-enter-*`) korunur:

```css
  /* ===== Anıtsal yeniden tasarım — paylaşılan yardımcılar ===== */

  /* Büyük, ortalanabilir anıtsal serif başlık (boyut yüzeyde clamp ile inline) */
  .display-monument {
    font-family: var(--font-display);
    color: var(--color-ink);
    font-weight: 500;
    letter-spacing: -0.02em;
    line-height: 1.04;
  }
  .display-monument .italic-gold {
    font-style: italic;
    color: var(--color-gold);
    font-weight: 400;
  }

  /* İnce altın hat aksanları (ortalamak için mx-auto kullan) */
  .gold-rule-sm { width: 34px; height: 1px; background: var(--color-gold); }
  .gold-rule    { width: 60px; height: 1px; background: var(--rule); }

  /* Roma rakamı indeksi */
  .roman-index {
    font-family: var(--font-display);
    color: var(--color-gold);
    font-weight: 500;
    font-style: normal;
    letter-spacing: 0.02em;
  }

  /* Kart köşesinde soluk Roma rakamı filigranı — kapsayıcı 'relative' olmalı, aria-hidden */
  .roman-watermark {
    position: absolute;
    top: 8px;
    right: 14px;
    font-family: var(--font-display);
    font-size: 34px;
    line-height: 1;
    color: rgba(212, 175, 55, 0.14);
    font-weight: 500;
    pointer-events: none;
  }

  /* Makale gövdesi drop-cap — kapsayıcıya .dropcap ekle, ilk paragrafın ilk harfi */
  .dropcap > p:first-of-type::first-letter {
    float: left;
    font-family: var(--font-display);
    font-size: 3.4em;
    line-height: 0.74;
    font-weight: 500;
    color: var(--color-gold);
    padding: 0.06em 0.14em 0 0;
  }

  /* Anıtsal kart — .pcard'ın 2px altın üst-hatlı varyantı */
  .tablet-card {
    position: relative;
    background: var(--color-panel);
    border: 1px solid var(--rule-dim);
    border-top: 2px solid var(--color-gold);
    transition: transform 0.2s, box-shadow 0.2s, border-top-color 0.2s;
  }
  .tablet-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 18px 40px rgba(0, 0, 0, 0.4);
    border-top-color: #e8c452;
  }

  /* Anıt/dergi tarzı üst bilgi şeridi — soluk altın alt-çizgi aksanı */
  .masthead {
    border-bottom: 1px solid var(--rule);
  }

  /* Hero arkası mimari kemer + sütun motifi (dekoratif, aria-hidden, kapsayıcı 'relative') */
  .arch-motif {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: min(520px, 80%);
    height: 100%;
    pointer-events: none;
    z-index: 0;
  }
  .arch-motif::before {
    content: "";
    position: absolute;
    top: 8%;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    aspect-ratio: 1 / 1;
    max-height: 84%;
    border: 1px solid rgba(212, 175, 55, 0.10);
    border-bottom: 0;
    border-radius: 50% 50% 0 0 / 100% 100% 0 0;
  }
  .arch-motif::after {
    content: "";
    position: absolute;
    top: 14%;
    left: 50%;
    transform: translateX(-50%);
    width: 62%;
    height: 78%;
    border-left: 1px solid rgba(212, 175, 55, 0.08);
    border-right: 1px solid rgba(212, 175, 55, 0.08);
  }
```

- [ ] **Step 4: Doğrula ve commit**

Run: `npx tsc --noEmit` ve `npm run lint` (beklenen: temiz). Dev sunucuyu başlat (`npm run dev` / `preview_start`) ve ana sayfayı `preview_screenshot` ile çek; doğrula: site çökmedi, mevcut görünüm bozulmadı (yeni sınıflar henüz kullanılmıyor, yalnız tanımlandı), `--color-muted-dim` ile yazılan küçük metinler (ör. MakaleKart "dk okuma") biraz daha okunaklı. Sonra:

```bash
git add src/lib/utils.ts src/app/globals.css
git commit -m "feat(redesign): anıtsal tasarım sistemi temeli (globals.css + toRoman)"
```

### Task 2: Header — aktif-sayfa vurgusu + anıtsal sadeleştirme
**Files:**
- Modify: `src/components/public/Header.tsx`

- [ ] **Step 1: `usePathname` importunu ekle** — `react`'tan `useState` importunun hemen ardına `next/navigation`'dan `usePathname` ekle. `"use client"` direktifi en üstte korunur (bu hook client component gerektirir).

```tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Icon from "@/components/public/icons/Icon";
import type { INavLink } from "@/types";
```

- [ ] **Step 2: Bileşen gövdesinde aktif rota tespitini kur** — `useState` satırının altına `pathname` ve yardımcı `isActive` fonksiyonunu ekle. Ana sayfa (`/`) yalnız tam eşleşmede, diğer rotalar alt-yollar dahil aktif sayılır.

```tsx
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");
```

- [ ] **Step 3: Header kabuğunu anıtsal `.masthead` tonuna hizala** — `<header>` kapsayıcısını koru ama iç sarmalayıcıya `masthead` sınıfını ekleyerek altın alt-çizgi aksanını uygula. Sticky/blur/border davranışı korunur.

```tsx
    <header className="sticky top-0 z-30 backdrop-blur-md border-b" style={{ background: "rgba(11,15,20,0.94)", borderColor: "var(--rule-dim)" }}>
      <div className="masthead max-w-7xl mx-auto px-5 md:px-10 flex items-center justify-between py-4 md:py-5">
```

- [ ] **Step 4: Masaüstü navigasyonda gerçek aktif rotayı altın renklendir** — `i === 0` varsayımını kaldır, `isActive(link.href)` ile değiştir. `aria-current="page"` erişilebilirlik aksanı ekle. Aktif linkte ince altın alt-hat (boxShadow) ve Playfair vurgusu ile anıtsal his ver.

```tsx
        {/* Desktop nav */}
        <nav className="hidden md:flex gap-8">
          {nav.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className="text-[13.5px] tracking-[0.02em] plink relative pb-1"
                style={{
                  fontWeight: active ? 600 : 400,
                  color: active ? "var(--color-gold)" : "var(--color-ink)",
                  boxShadow: active ? "inset 0 -2px 0 0 var(--color-gold)" : "none",
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
```

- [ ] **Step 5: Mobil menüde de aktif rota vurgusunu uygula** — Mobil menüdeki link döngüsünü, aktif rotayı altın renklendirecek şekilde güncelle; `aria-current` ekle. `onClick` ile menü kapatma ve `menu-slide` animasyonu korunur.

```tsx
      {/* Mobile menu */}
      {mobileOpen && (
        <div className="menu-slide md:hidden border-t px-5 py-4 space-y-3" style={{ borderColor: "var(--rule-dim)", background: "var(--color-bg)" }}>
          {nav.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                aria-current={active ? "page" : undefined}
                className="block text-sm plink"
                style={{
                  fontWeight: active ? 600 : 400,
                  color: active ? "var(--color-gold)" : "var(--color-ink)",
                }}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/iletisim"
            onClick={() => setMobileOpen(false)}
            className="inline-flex items-center gap-2 mt-3 px-4 py-2.5 text-[12px] font-bold uppercase tracking-[0.16em]"
            style={{ background: "var(--color-gold)", color: "#0a0d11" }}
          >
            <Icon name="phone" size={14} color="#0a0d11" />
            İletişim
          </Link>
        </div>
      )}
```

- [ ] **Step (son): Doğrula ve commit** — Run: `npx tsc --noEmit` ve `npm run lint` (beklenen: temiz). Dev sunucuda farklı rotalarda gez (ör. `/` ve `/yazilar`) ve her birinde `preview_screenshot` ile header'ı çek; doğrula: (1) yalnızca o anki aktif sayfanın nav linki altın + 600 ağırlıkta + altında ince altın alt-hat görünür, diğer linkler ink rengi; (2) masthead altında soluk altın alt-çizgi aksanı var; (3) mobil menü açıldığında aktif link altın, menü açma/kapama animasyonu çalışıyor. Sonra `git commit -m "style(header): aktif-sayfa altın vurgusu ve anıtsal masthead"`.

### Task 3: Footer — anıtsal altın hatlar
**Files:**
- Modify: `src/components/public/Footer.tsx`

- [ ] **Step 1: Marka bloğunun üstüne anıtsal altın hat aksanı ekle** — Marka `<div>`'inin en başına, marka kimliğini anıtsal bir hat ile çerçevelemek üzere `.gold-rule-sm` (sol hizalı, dekoratif) ekle. Mevcut marka satırı (T amblemi + brand + alt başlık) korunur.

```tsx
          {/* Brand */}
          <div>
            <div className="gold-rule-sm mb-5" aria-hidden="true" />
            <div className="flex items-center gap-3">
              <span
                className="w-[38px] h-[38px] flex items-center justify-center text-[22px] font-medium italic"
                style={{
                  border: "1px solid var(--color-gold)",
                  color: "var(--color-gold)",
                  fontFamily: "var(--font-display)",
                }}
              >
                T
              </span>
              <div>
                <div className="text-[17px] font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}>
                  {brand}
                </div>
                <div className="text-[10.5px] mt-0.5 uppercase tracking-[0.22em]" style={{ color: "var(--color-muted)" }}>
                  Ceza Hukuku Araştırmaları
                </div>
              </div>
            </div>
```

- [ ] **Step 2: Sütun başlıklarının altına ince altın alt-hat ekle** — Üç `.kicker` başlığının (Menü / İletişim / Hukuki) her birinin hemen altına, başlığı anıtsal biçimde sonlandıran dekoratif `.gold-rule-sm` ekle. Mevcut `kicker` sınıfı ve `mb` boşlukları, sonra gelen liste yapısı korunur.

Menü sütunu:
```tsx
          {/* Menu */}
          <div>
            <div className="kicker mb-3">Menü</div>
            <div className="gold-rule-sm mb-[18px]" aria-hidden="true" />
            <ul className="space-y-1.5 text-[13.5px]" style={{ color: "var(--color-ink)" }}>
```

İletişim sütunu:
```tsx
          {/* Contact */}
          <div>
            <div className="kicker mb-3">İletişim</div>
            <div className="gold-rule-sm mb-[18px]" aria-hidden="true" />
            <ul className="space-y-2.5 text-[13.5px] leading-[1.8]" style={{ color: "var(--color-body)" }}>
```

Hukuki sütunu:
```tsx
          {/* Legal */}
          <div>
            <div className="kicker mb-3">Hukuki</div>
            <div className="gold-rule-sm mb-[18px]" aria-hidden="true" />
            <ul className="space-y-1.5 text-[13.5px]" style={{ color: "var(--color-muted)" }}>
```

- [ ] **Step 3: Alt telif şeridini soluk altın `.gold-rule` ile ortalanmış anıtsal ayraca dönüştür** — Mevcut `border-t` ayracını kaldırıp yerine ortalanmış soluk altın `.gold-rule` (mx-auto) koy; ardından telif satırını anıtsal tona hizala. Otomatik yıl (`new Date().getFullYear()`) ve metin içerikleri korunur.

```tsx
        <div className="gold-rule mx-auto mt-12" aria-hidden="true" />
        <div
          className="mt-6 flex flex-col md:flex-row justify-between gap-3 text-[11.5px] tracking-[0.04em]"
          style={{ color: "var(--color-muted-dim)" }}
        >
          <span>© {new Date().getFullYear()} {brand} · Tüm hakları saklıdır.</span>
          <span style={{ fontFamily: "var(--font-display)" }} className="italic">Akademik blog · Hukuki tavsiye değildir</span>
        </div>
```

- [ ] **Step (son): Doğrula ve commit** — Run: `npx tsc --noEmit` ve `npm run lint` (beklenen: temiz). Dev sunucuda herhangi bir public sayfayı aç, en alta in ve `preview_screenshot` ile footer'ı çek; doğrula: (1) marka bloğunun üstünde kısa solid altın hat var; (2) Menü/İletişim/Hukuki başlıklarının her birinin altında ince altın alt-hat görünür; (3) alt telif şeridinin üstünde ortalanmış soluk altın `.gold-rule` var ve telif satırı doğru yıl (2026) ile Playfair italik aksanıyla render oluyor; (4) sosyal/hukuki link metinleri değişmemiş. Sonra `git commit -m "style(footer): anıtsal altın hat ayraçları ve tipografi hizası"`.

### Task 4: Hero — ortalanmış anıtsal kompozisyon + kemer motifi

**Files:**
- Modify: `src/components/public/home/Hero.tsx`

- [ ] **Step 1: ColumnBg yerine anıtsal `arch-motif` kompozisyonu için dosyanın tamamını yeniden yaz** — `ColumnBg` fonksiyonunu kaldırıp yerine `.arch-motif` paylaşılan sınıfını kullanan dekoratif kemer/sütun motifini (SVG, `aria-hidden`) koy; başlığı ortalanmış `.display-monument` (clamp ~ `clamp(44px, 7vw, 84px)`) yap, üstüne `.gold-rule-sm mx-auto` aksanı ekle; alt metin, CTA satırı ve badge satırını ortalı düzene al; mevcut `renderAccent`, `Icon`, tipler ve tüm `hero-enter-*` animasyon sınıflarını KORU. Tek birincil CTA (`.btn-primary`) + ikincil ghost (`.btn-ghost`) ölçülü kalsın. Dosyanın tam yeni hali:

```tsx
import Link from "next/link";
import Icon from "@/components/public/icons/Icon";
import type { IconName } from "@/components/public/icons/Icon";
import type { ISiteContent } from "@/types";
import { renderAccent } from "@/lib/render-accent";

function ArchMotif() {
  return (
    <svg
      className="arch-motif"
      aria-hidden="true"
      viewBox="0 0 1440 760"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="hero-arch-stroke" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#D4AF37" stopOpacity="0.32" />
          <stop offset="1" stopColor="#D4AF37" stopOpacity="0.04" />
        </linearGradient>
        <linearGradient id="hero-arch-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#D4AF37" stopOpacity="0" />
          <stop offset="0.5" stopColor="#D4AF37" stopOpacity="0.05" />
          <stop offset="1" stopColor="#D4AF37" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Merkezî anıtsal kemer */}
      <path
        d="M 420 760 L 420 320 A 300 300 0 0 1 1020 320 L 1020 760"
        fill="none"
        stroke="url(#hero-arch-stroke)"
        strokeWidth="1.5"
      />
      <path
        d="M 470 760 L 470 320 A 250 250 0 0 1 970 320 L 970 760"
        fill="url(#hero-arch-fill)"
        stroke="#D4AF37"
        strokeOpacity="0.08"
        strokeWidth="1"
      />

      {/* Yan sütunlar */}
      {[300, 360, 1080, 1140].map((x, i) => (
        <rect key={i} x={x} y="200" width="2" height="560" fill="#D4AF37" opacity="0.06" />
      ))}

      {/* Kemer kilit taşı vurgusu */}
      <rect x="716" y="56" width="8" height="34" fill="#D4AF37" opacity="0.22" />

      {/* İnce yatay hatlar */}
      <rect x="420" y="200" width="600" height="1" fill="#D4AF37" opacity="0.07" />
      <rect x="470" y="720" width="500" height="1" fill="#D4AF37" opacity="0.07" />
    </svg>
  );
}

export default function Hero({ data }: { data: ISiteContent["hero"] }) {
  return (
    <section className="relative overflow-hidden px-5 md:px-16 pt-16 pb-18 md:pt-[120px] md:pb-[110px]">
      <ArchMotif />
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <div className="kicker mb-5 md:mb-[22px] hero-enter hero-enter-1">
          {data.kicker}
        </div>
        <div className="gold-rule-sm mx-auto mb-6 md:mb-8 hero-enter hero-enter-1" aria-hidden="true" />
        <h1
          className="display-monument m-0 hero-enter hero-enter-2"
          style={{ fontSize: "clamp(44px, 7vw, 84px)" }}
        >
          {renderAccent(data.heading)}
        </h1>
        <p
          className="mt-6 md:mt-8 max-w-[640px] mx-auto leading-[1.65] font-normal hero-enter hero-enter-3"
          style={{ fontSize: "clamp(16px, 1.5vw, 19px)", color: "var(--color-body)" }}
        >
          {data.subtext}
        </p>
        <div className="mt-8 md:mt-11 flex flex-wrap justify-center gap-3.5 hero-enter hero-enter-4">
          <Link href={data.primaryCta.href} className="btn-primary">
            {data.primaryCta.label}
            <Icon name="chevron" size={14} color="#0a0d11" />
          </Link>
          <Link href={data.secondaryCta.href} className="btn-ghost">
            {data.secondaryCta.label}
          </Link>
        </div>

        {/* Reassurance row */}
        <div className="mt-9 md:mt-14 flex flex-wrap justify-center gap-5 md:gap-9 text-[12.5px] tracking-[0.04em] hero-enter hero-enter-4" style={{ color: "var(--color-muted)" }}>
          {data.badges.map((b, i) => (
            <span key={i} className="flex items-center gap-2">
              <Icon name={b.icon as IconName} size={16} color="var(--color-gold)" />
              {b.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Düzen ve korunan davranışların doğrulaması (gözden geçirme)** — Şunları teyit et: kapsayıcıda `relative` var (`.arch-motif` mutlak konumlanmış arka plan için gerekli), içerik `z-10` ile üstte; başlık ortalanmış `.display-monument` ve `renderAccent(data.heading)` içindeki altın vurguyu `.italic-gold` üzerinden gösteriyor; `data.kicker`, `data.subtext`, `data.primaryCta`, `data.secondaryCta`, `data.badges` prop'ları ve `IconName` tip kullanımı değişmedi; tüm `hero-enter-1..4` animasyon sınıfları yerinde; eklenen `.gold-rule-sm` ve `ArchMotif` dekoratif olduğu için `aria-hidden`.

- [ ] **Step 3 (son): Doğrula ve commit** — Run: `npx tsc --noEmit` ve `npm run lint` (beklenen: temiz, hata yok); dev sunucuda ana sayfayı `preview_screenshot` ile çek ve şunları doğrula: hero başlığı ekranda ortalanmış büyük anıtsal serif (`.display-monument`) olarak görünüyor, başlığın üstünde kısa altın hat (`.gold-rule-sm`) var, arkada soluk altın kemer/sütun motifi (`.arch-motif`) içeriğin gerisinde duruyor, birincil + ikincil CTA ve badge satırı ortalı; sonra `git commit -m "style(hero): ortalanmış anıtsal kompozisyon + kemer motifi"`.

### Task 5: Trusts bölümü — anıtsal güven şeridi
**Files:**
- Modify: `src/components/public/home/Trusts.tsx`

- [ ] **Step 1: Bölüm başlığını anıtsal merkeze al** — `Trusts` fonksiyonundaki üst başlık bloğunu (kicker + sol hizalı `.display` başlık) ortalanmış anıtsal `.masthead` + `.display-monument` + `.gold-rule` düzenine çevir. Mevcut `renderAccent` ve `data.kicker` koşulu korunur; başlık `.display-monument` ile ortalanır, altına soluk altın hat aksanı eklenir.

- [ ] **Step 2: Güven kartlarını tablet-card'a yükselt** — Kart `grid` döngüsündeki her `.pcard`'ı `.tablet-card`'a çevir (2px altın üst-hat + hover lift), kartı `relative` tut ve köşeye `.roman-watermark` ile soluk Roma rakamı filigranı ekle (`toRoman(i + 1)`, `aria-hidden`). Mevcut `Icon`, başlık ve açıklama render mantığı + tipler (`IconName`, `ISiteContent["trusts"]`) korunur.

- [ ] **Step 3: TAM yeniden-tasarlanmış dosya** — `Trusts.tsx`'i aşağıdaki tam kod ile değiştir:

```tsx
import Icon from "@/components/public/icons/Icon";
import type { IconName } from "@/components/public/icons/Icon";
import type { ISiteContent } from "@/types";
import { renderAccent } from "@/lib/render-accent";
import { toRoman } from "@/lib/utils";

export default function Trusts({ data }: { data: ISiteContent["trusts"] }) {
  return (
    <section
      className="px-5 md:px-16 py-14 md:py-[88px] border-y"
      style={{ background: "var(--color-panel)", borderColor: "var(--rule)" }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          {data.kicker && <div className="kicker mb-3.5">{data.kicker}</div>}
          <h2
            className="display-monument m-0 mx-auto max-w-[760px]"
            style={{ fontSize: "clamp(30px, 4vw, 44px)" }}
          >
            {renderAccent(data.heading)}
          </h2>
          <div className="gold-rule mx-auto mt-6" aria-hidden="true" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5 md:gap-5 mt-9 md:mt-14">
          {data.items.map((t, i) => (
            <div key={i} className="tablet-card p-6 md:p-7 relative">
              <span className="roman-watermark" aria-hidden="true">
                {toRoman(i + 1)}
              </span>
              <div
                className="w-12 h-12 flex items-center justify-center mb-5"
                style={{ border: "1px solid var(--rule)" }}
              >
                <Icon name={t.icon as IconName} size={22} color="var(--color-gold)" />
              </div>
              <div
                className="text-xl font-semibold mb-2.5"
                style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}
              >
                {t.title}
              </div>
              <p className="text-[13.5px] leading-[1.6] m-0" style={{ color: "var(--color-muted)" }}>
                {t.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4 (son): Doğrula ve commit** — Run: `npx tsc --noEmit` ve `npm run lint` (beklenen: temiz çıktı, hata yok). Dev sunucuda ana sayfayı açıp Trusts bölümünü `preview_screenshot` ile çek ve doğrula: başlık ortalanmış anıtsal serif olarak görünüyor, altında soluk altın hat var; her kartın üstünde 2px altın hat ve köşesinde soluk Roma rakamı filigranı (I, II, III, IV) okunuyor, hover'da kart hafifçe yükseliyor. Sonra `git commit -m "style(trusts): anıtsal güven şeridi — ortalı başlık, tablet kartlar, Roma filigranı"`.

### Task 6: Areas bölümü — Roma rakamı + tablet kartlar
**Files:**
- Modify: `src/components/public/home/Areas.tsx`

- [ ] **Step 1: toRoman import et** — Dosyanın üstüne `import { toRoman } from "@/lib/utils";` satırını ekle (mevcut `Icon`, `IconName`, `ISiteContent`, `renderAccent` importları korunur).

- [ ] **Step 2: Numara rozetini Roma rakamına çevir** — Kart başlığındaki `<span>` içindeki `String(i + 1).padStart(2, "0")` değerini `toRoman(i + 1)` ile değiştir ve span'e `.roman-index` sınıfını uygula (inline `text-[11px] uppercase tracking-[0.2em]` küçük etiket stilini Playfair altın Roma indeksiyle değiştir). Span dekoratif sıralama göstergesi değil, görsel indeks olduğundan etiket olarak korunur — `aria-hidden` ekleme.

- [ ] **Step 3: Kartları tablet-card'a yükselt** — `article` `className`'indeki `pcard`'ı `tablet-card` ile değiştir; mevcut `p-6 md:p-[30px] flex flex-col min-h-[180px] md:min-h-[220px]` ve 7. öğe (`i === 6 ? "md:col-start-2" : ""`) ortalama mantığı aynen korunur. Mevcut `Icon` ve render mantığı değişmez.

- [ ] **Step 4: TAM yeniden-tasarlanmış dosya** — `Areas.tsx`'i aşağıdaki tam kod ile değiştir:

```tsx
import Icon from "@/components/public/icons/Icon";
import type { IconName } from "@/components/public/icons/Icon";
import type { ISiteContent } from "@/types";
import { renderAccent } from "@/lib/render-accent";
import { toRoman } from "@/lib/utils";

export default function Areas({ data }: { data: ISiteContent["areas"] }) {
  return (
    <section id="uzmanlik" className="px-5 md:px-16 py-16 md:py-[110px]">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-baseline justify-between flex-wrap gap-4 mb-9 md:mb-12">
          <div>
            {data.kicker && <div className="kicker mb-3.5">{data.kicker}</div>}
            <h2 className="display m-0" style={{ fontSize: "clamp(30px, 4.5vw, 46px)" }}>
              {renderAccent(data.heading)}
            </h2>
          </div>
          {data.intro && (
            <p className="hidden md:block text-sm max-w-[360px] m-0 leading-[1.65]" style={{ color: "var(--color-muted)" }}>
              {data.intro}
            </p>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 md:gap-[18px]">
          {data.items.map((a, i) => (
            <article
              key={i}
              className={`tablet-card p-6 md:p-[30px] flex flex-col min-h-[180px] md:min-h-[220px] ${
                i === 6 ? "md:col-start-2" : ""
              }`}
            >
              <div className="flex items-center justify-between mb-5">
                <div
                  className="w-11 h-11 flex items-center justify-center"
                  style={{ border: "1px solid var(--rule)" }}
                >
                  <Icon name={a.icon as IconName} size={20} color="var(--color-gold)" />
                </div>
                <span className="roman-index">{toRoman(i + 1)}</span>
              </div>
              <div
                className="text-[22px] font-semibold mb-2"
                style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}
              >
                {a.title}
              </div>
              <p className="text-[13.5px] leading-[1.6] m-0 flex-1" style={{ color: "var(--color-muted)" }}>
                {a.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 5 (son): Doğrula ve commit** — Run: `npx tsc --noEmit` ve `npm run lint` (beklenen: temiz çıktı, hata yok). Dev sunucuda ana sayfada `#uzmanlik` bölümüne kaydırıp `preview_screenshot` ile çek ve doğrula: her uzmanlık kartının sağ üstünde "01/02" yerine Playfair altın Roma rakamı (I, II, III...) görünüyor; kartlar 2px altın üst-hatlı tablet kartlara dönüşmüş ve hover'da yükseliyor; 7 öğe varsa son kart ikinci sütunda ortalanmış kalıyor. Sonra `git commit -m "style(areas): Roma rakamı indeksi + tablet kartlar"`.

### Task 7: Process bölümü — Roma rakamlı adımlar
**Files:**
- Modify: `src/components/public/home/Process.tsx`

- [ ] **Step 1: toRoman import et** — Dosyanın üstüne `import { toRoman } from "@/lib/utils";` satırını ekle (mevcut `ISiteContent`, `renderAccent` importları korunur).

- [ ] **Step 2: Başlığı anıtsal merkeze yükselt** — Merkez başlık bloğundaki `.display` `h2`'yi `.display-monument` ile değiştir (ortalı kalır, `mx-auto`), başlık ile intro arasına ince merkezi altın hat aksanı (`.gold-rule-sm mx-auto`, `aria-hidden`) ekle. Mevcut `data.kicker` ve `data.intro` koşulları + `renderAccent` korunur.

- [ ] **Step 3: Adım numaralarını Roma rakamı indeksine çevir** — Her adımın `64px` dairesel/kare rozetindeki `{s.number}` değerini `{toRoman(i + 1)}` ile değiştir; altın hatlı kutu Playfair italik altın stilini korur. Adım numarası görsel sıra indeksi olduğundan `.roman-index` görsel dilini takip eder (büyük boyut inline ile verilir). Mevcut dikey/yatay konektör çizgisi, `relative z-10`, `prefers-reduced-motion`'a dokunmayan statik yapı ve mobil `border-t` ritmi korunur.

- [ ] **Step 4: TAM yeniden-tasarlanmış dosya** — `Process.tsx`'i aşağıdaki tam kod ile değiştir:

```tsx
import type { ISiteContent } from "@/types";
import { renderAccent } from "@/lib/render-accent";
import { toRoman } from "@/lib/utils";

export default function Process({ data }: { data: ISiteContent["process"] }) {
  return (
    <section
      id="surec"
      className="px-5 md:px-16 py-16 md:py-[110px] border-y"
      style={{ background: "var(--color-panel)", borderColor: "var(--rule)" }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 md:mb-16">
          {data.kicker && <div className="kicker mb-3.5">{data.kicker}</div>}
          <h2
            className="display-monument m-0 mx-auto"
            style={{ fontSize: "clamp(30px, 4.5vw, 46px)" }}
          >
            {renderAccent(data.heading)}
          </h2>
          <div className="gold-rule-sm mx-auto mt-6" aria-hidden="true" />
          {data.intro && (
            <p
              className="max-w-[540px] mx-auto mt-6 text-[15px] leading-[1.65]"
              style={{ color: "var(--color-muted)" }}
            >
              {data.intro}
            </p>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 relative">
          {/* Horizontal connector line (desktop only) */}
          <div
            className="hidden md:block absolute top-8 left-[12%] right-[12%] h-px pointer-events-none"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, var(--rule) 12%, var(--rule) 88%, transparent 100%)",
            }}
          />
          {data.items.map((s, i) => (
            <div
              key={i}
              className={`relative flex md:flex-col gap-5 md:gap-0 items-start md:items-center text-left md:text-center md:px-5 py-6 md:py-0 ${
                i > 0 ? "md:border-0 border-t md:border-t-0" : ""
              }`}
              style={i > 0 ? { borderColor: "var(--rule-dim)" } : {}}
            >
              <div
                className="roman-index w-16 h-16 flex items-center justify-center relative z-10 italic flex-shrink-0 md:mb-5"
                style={{
                  background: "var(--color-bg)",
                  border: "1px solid var(--color-gold)",
                  fontSize: 24,
                  fontWeight: 500,
                }}
              >
                {toRoman(i + 1)}
              </div>
              <div>
                <div
                  className="text-xl font-semibold mb-1.5"
                  style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}
                >
                  {s.title}
                </div>
                <p
                  className="text-[13.5px] leading-[1.6] m-0 max-w-[240px]"
                  style={{ color: "var(--color-muted)" }}
                >
                  {s.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 5 (son): Doğrula ve commit** — Run: `npx tsc --noEmit` ve `npm run lint` (beklenen: temiz çıktı, hata yok). Dev sunucuda ana sayfada `#surec` bölümüne kaydırıp `preview_screenshot` ile çek ve doğrula: başlık ortalanmış anıtsal serif, altında kısa solid altın hat (34px) var; her adım rozetinde `s.number` yerine Playfair italik altın Roma rakamı (I, II, III, IV) görünüyor; yatay konektör çizgisi (desktop) ve mobil üst-çizgi ritmi korunmuş; rozetler altın hatlı kutu olarak gece arka plan üzerinde okunuyor. Sonra `git commit -m "style(process): Roma rakamlı adımlar + anıtsal başlık"`.

### Task 8: About bölümü — editöryel anıtsal düzen
**Files:**
- Modify: `src/components/public/home/About.tsx`

- [ ] **Step 1: Mevcut kodu doğrula** — `src/components/public/home/About.tsx` dosyasını Read ile aç. Korunması gerekenler: `Image`, `renderAccent`, `sanitize` importları; props imzası `{ data, yearsSince }`; portre `dangerouslySetInnerHTML={{ __html: sanitize(data.body) }}` render mantığı; `s.value.replace("{yil}", String(yearsSince))` istatistik mantığı; köşe ornament `<span>`'leri.

- [ ] **Step 2: `toRoman` import et** — Dosyanın en üstündeki import bloğuna ekle (mevcut importların hemen altına):
  ```tsx
  import { toRoman } from "@/lib/utils";
  ```

- [ ] **Step 3: Tüm `return(...)` JSX'ini anıtsal editöryel düzenle değiştir** — Portre plağı `relative` kapsayıcıda kalır (köşe ornament + texture overlay korunur); üzerine `roman-watermark` filigranı eklenir. Metin sütununda başlık `display-monument` + `italic-gold` ile anıtsallaşır, üstüne `gold-rule-sm` aksanı gelir; gövde kapsayıcısına `dropcap` eklenir; istatistikler Roma rakamı indeksli (`roman-index`) editöryel satırlara döner. Tüm `style` renkleri ve `replace`/`sanitize` mantığı aynen korunur. `return` içeriğini şununla değiştir:
  ```tsx
    return (
      <section className="px-5 md:px-16 py-16 md:py-[110px]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[1fr_1.4fr] gap-9 md:gap-[72px] items-center">
          {/* Portrait plaque */}
          <div className="relative">
            <div
              className="aspect-[4/5] relative overflow-hidden flex items-center justify-center"
              style={{ background: "var(--color-panel-hi)", border: "1px solid var(--rule)" }}
            >
              {/* Texture overlay */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(0deg, transparent 0 2px, rgba(212,175,55,0.02) 2px 3px)",
                }}
              />
              {/* Corner ornaments */}
              <span className="absolute top-3.5 left-3.5 w-7 h-7" style={{ borderTop: "1px solid var(--color-gold)", borderLeft: "1px solid var(--color-gold)" }} />
              <span className="absolute top-3.5 right-3.5 w-7 h-7" style={{ borderTop: "1px solid var(--color-gold)", borderRight: "1px solid var(--color-gold)" }} />
              <span className="absolute bottom-3.5 left-3.5 w-7 h-7" style={{ borderBottom: "1px solid var(--color-gold)", borderLeft: "1px solid var(--color-gold)" }} />
              <span className="absolute bottom-3.5 right-3.5 w-7 h-7" style={{ borderBottom: "1px solid var(--color-gold)", borderRight: "1px solid var(--color-gold)" }} />

              {data.portraitImage ? (
                <Image
                  src={data.portraitImage}
                  alt="Portre"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 40vw"
                />
              ) : (
                <div className="text-center relative">
                  <div className="kicker mb-3.5" style={{ color: "var(--color-muted)" }}>
                    Portre
                  </div>
                  <div
                    className="italic leading-[0.9]"
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 140,
                      color: "var(--color-gold)",
                      fontWeight: 500,
                      letterSpacing: "-0.04em",
                    }}
                  >
                    TM
                  </div>
                  <div className="kicker mt-3.5" style={{ color: "var(--color-muted-dim)", fontWeight: 500 }}>
                    MMXXIV
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Text */}
          <div>
            {data.kicker && <div className="kicker mb-3.5">{data.kicker}</div>}
            <div className="gold-rule-sm mb-5" aria-hidden="true" />
            <h2
              className="display-monument m-0 leading-[1.1] text-left"
              style={{ fontSize: "clamp(30px, 4.5vw, 46px)" }}
            >
              {renderAccent(data.heading)}
            </h2>
            <div
              className="dropcap prose prose-invert max-w-none mt-6 text-[15.5px] leading-[1.75]"
              style={{ color: "var(--color-body)" }}
              dangerouslySetInnerHTML={{ __html: sanitize(data.body) }}
            />
            {data.stats.length > 0 && (
              <div
                className="mt-9 grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-7 pt-7 border-t"
                style={{ borderColor: "var(--rule)" }}
              >
                {data.stats.map((s, i) => (
                  <div key={i} className="flex items-baseline gap-3">
                    <span className="roman-index shrink-0" aria-hidden="true">
                      {toRoman(i + 1)}
                    </span>
                    <div>
                      <div
                        className="italic leading-none"
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: 32,
                          color: "var(--color-gold)",
                          fontWeight: 500,
                        }}
                      >
                        {s.value.replace("{yil}", String(yearsSince))}
                      </div>
                      <div className="text-[12.5px] mt-1.5" style={{ color: "var(--color-muted)" }}>
                        {s.label}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    );
  ```

- [ ] **Step 4: Portre plağına soluk Roma filigranı ekle** — Köşe ornament `<span>`'lerinin hemen ALTINA (texture overlay'den sonra, `data.portraitImage ?` koşulundan önce) dekoratif filigranı yerleştir:
  ```tsx
              {/* Roman watermark — decorative */}
              <span className="roman-watermark" aria-hidden="true">
                I
              </span>
  ```
  (Kapsayıcı zaten `relative`; filigran `aria-hidden` olduğundan ekran okuyucudan gizlenir.)

- [ ] **Step 5 (son): Doğrula ve commit** — Run: `npx tsc --noEmit` ve `npm run lint` (beklenen: temiz, yeni uyarı yok). Dev sunucuda ana sayfayı aç ve About bölümünü `preview_screenshot` ile çek; doğrula: başlık altın italik vurgulu anıtsal serif (`display-monument`), başlığın üstünde kısa altın hat aksanı görünüyor, gövde metninin ilk harfi altın drop-cap, istatistikler solda altın Roma rakamı indeksiyle (I, II, III) hizalı, portre plağının köşesinde soluk Roma filigranı var; köşe ornamentleri ve portre/TM yedek render hâlâ doğru. Sonra `git commit -m "style(about): editöryel anıtsal düzen — dropcap, roman indeks, başlık hat aksanı"`.

### Task 9: Urgent bölümü — ölçülü anıtsal çağrı
**Files:**
- Modify: `src/components/public/home/Urgent.tsx`

- [ ] **Step 1: Mevcut kodu doğrula** — `src/components/public/home/Urgent.tsx` dosyasını Read ile aç. Korunması gerekenler: `Link`, `Icon`, `renderAccent`, `sanitize` importları; props imzası `{ data, contactEmail }`; gövde `dangerouslySetInnerHTML={{ __html: sanitize(data.body) }}`; iki CTA `Link`'inin `href` mantığı (`mailto:${contactEmail}` ve `data.secondaryCta.href`), iç metinleri (`data.emailKanal.label`, `contactEmail`, `data.secondaryCta.label`) ve tüm `Icon` kullanımları; section'ın `border-y` + gradient arka planı.

- [ ] **Step 2: Tüm `return(...)` JSX'ini ölçülü anıtsal çağrı düzenine getir** — Gold corner glow korunur; arkaya `arch-motif` dekoratif kemer eklenir (kapsayıcı `relative`, içerik `z-10`). Metin tarafında başlık `display-monument` + `italic-gold`, üstüne `gold-rule-sm` aksanı; ortada CTA bloğu `tablet-card` çerçevesiyle çevrelenir. İki CTA `Link`'inin tüm `style`/`href`/metin/`Icon` mantığı aynen korunur. `return` içeriğini şununla değiştir:
  ```tsx
    return (
      <section
        className="relative overflow-hidden px-5 md:px-16 py-14 md:py-[88px] border-y"
        style={{
          background: "linear-gradient(180deg, var(--color-bg) 0%, #08090d 100%)",
          borderColor: "var(--rule)",
        }}
      >
        {/* Decorative arch motif */}
        <div className="arch-motif" aria-hidden="true" />
        {/* Gold corner glow */}
        <div
          className="absolute -top-24 -right-24 w-[360px] h-[360px] pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, var(--gold-glow) 0%, transparent 70%)",
          }}
        />
        <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-7 md:gap-14 items-center">
          <div>
            <div className="kicker mb-3.5 flex items-center gap-2">
              <Icon name="lightning" size={14} color="var(--color-gold)" />
              {data.kicker}
            </div>
            <div className="gold-rule-sm mb-5" aria-hidden="true" />
            <h2
              className="display-monument m-0 leading-[1.05] text-left"
              style={{ fontSize: "clamp(32px, 5vw, 48px)" }}
            >
              {renderAccent(data.heading)}
            </h2>
            <div
              className="prose prose-invert max-w-[540px] mt-5 text-base leading-[1.65]"
              style={{ color: "var(--color-body)" }}
              dangerouslySetInnerHTML={{ __html: sanitize(data.body) }}
            />
          </div>
          <div className="tablet-card flex flex-col gap-3.5 p-3.5">
            <Link
              href={`mailto:${contactEmail}`}
              className="flex justify-between items-center px-6 py-5 text-sm gap-3.5 font-bold uppercase tracking-[0.16em] no-underline transition-all"
              style={{ background: "var(--color-gold)", color: "#0a0d11" }}
            >
              <span className="flex items-center gap-3.5">
                <Icon name="phone" size={20} color="#0a0d11" />
                <span>
                  <span className="block text-[10px] tracking-[0.2em]">
                    {data.emailKanal.label}
                  </span>
                  <span className="block text-base mt-0.5 font-extrabold tracking-[0.04em]">
                    {contactEmail}
                  </span>
                </span>
              </span>
              <Icon name="chevron" size={14} color="#0a0d11" />
            </Link>
            <Link
              href={data.secondaryCta.href}
              className="flex justify-between items-center px-6 py-5 text-sm gap-3.5 font-semibold uppercase tracking-[0.16em] no-underline transition-all"
              style={{
                border: "1px solid var(--color-gold)",
                color: "var(--color-gold)",
              }}
            >
              <span className="flex items-center gap-3.5">
                <Icon name="user" size={20} color="var(--color-gold)" />
                <span>
                  <span className="block text-[10px] tracking-[0.2em]">İLETİŞİM</span>
                  <span className="block text-base mt-0.5 font-bold tracking-[0.04em]">
                    {data.secondaryCta.label}
                  </span>
                </span>
              </span>
              <Icon name="chevron" size={14} color="var(--color-gold)" />
            </Link>
          </div>
        </div>
      </section>
    );
  ```

- [ ] **Step 3 (son): Doğrula ve commit** — Run: `npx tsc --noEmit` ve `npm run lint` (beklenen: temiz). Dev sunucuda ana sayfayı aç ve Urgent bölümünü `preview_screenshot` ile çek; doğrula: başlık altın italik vurgulu anıtsal serif, üstünde kısa altın hat aksanı; arka planda soluk dekoratif kemer (arch-motif) içeriğin gerisinde duruyor ve metni okunabilir bırakıyor; sağdaki iki CTA, 2px altın üst-hatlı tablet kart içinde gruplanmış ve hover'da hafifçe yükseliyor; mailto + ikincil CTA linkleri tıklanabilir ve metinleri doğru. Sonra `git commit -m "style(urgent): ölçülü anıtsal çağrı — arch motif, tablet kart CTA, başlık aksanı"`.

### Task 10: Faq bölümü — hairline akordeon
**Files:**
- Modify: `src/components/public/home/Faq.tsx`

- [ ] **Step 1: Mevcut kodu doğrula** — `src/components/public/home/Faq.tsx` dosyasını Read ile aç. Korunması ZORUNLU: `"use client"` direktifi; `useState`, `Link`, `Icon`, `renderAccent` importları; `const [open, setOpen] = useState<number | null>(0)` durumu; `onClick={() => setOpen(isOpen ? null : i)}` aç-kapa mantığı; `aria-expanded={isOpen}`, `aria-controls={`faq-panel-${i}`}`, panel `id={`faq-panel-${i}`}` + `role="region"`; `Icon name={isOpen ? "minus" : "plus"}`; `min-h-[44px]` dokunma hedefi; alt CTA `Link` (`btn-ghost`).

- [ ] **Step 2: `toRoman` import et** — Mevcut import bloğunun altına ekle:
  ```tsx
  import { toRoman } from "@/lib/utils";
  ```

- [ ] **Step 3: Başlık bloğunu anıtsallaştır** — `text-center mb-9 md:mb-12` kapsayıcısının içeriğini, `display-monument` + ortalı altın hat aksanı ile güncelle. Mevcut başlık bloğunu şununla değiştir:
  ```tsx
          <div className="text-center mb-9 md:mb-12">
            {data.kicker && <div className="kicker mb-3.5">{data.kicker}</div>}
            <h2 className="display-monument m-0" style={{ fontSize: "clamp(30px, 4.5vw, 46px)" }}>
              {renderAccent(data.heading)}
            </h2>
            <div className="gold-rule mx-auto mt-6" aria-hidden="true" />
          </div>
  ```

- [ ] **Step 4: Kutulu `pcard` listesini ince ayraçlı (hairline) akordeona dönüştür** — Liste kapsayıcısı `flex flex-col gap-3` yerine üst-hatlı tek bir sütuna döner; her öğe `pcard` kutusu yerine alt-hairline ayraçlı bir satır olur. `aria-expanded`/`aria-controls`/panel `id`/`role`/aç-kapa state ve `Icon` mantığı AYNEN korunur; soruya `toRoman` indeksi eklenir; açık panel için `grid` yükseklik geçişi ile yumuşak açılım sağlanır. Mevcut liste bloğunu (`<div className="flex flex-col gap-3">...</div>`) şununla değiştir:
  ```tsx
          <div
            className="flex flex-col border-t"
            style={{ borderColor: "var(--rule)" }}
          >
            {data.items.map((f, i) => {
              const isOpen = open === i;
              return (
                <div
                  key={i}
                  className="border-b"
                  style={{ borderColor: "var(--rule)" }}
                >
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${i}`}
                    className="w-full min-h-[44px] text-left bg-transparent border-0 cursor-pointer flex justify-between items-center gap-4 py-5 md:py-6 leading-[1.3] transition-colors"
                    style={{
                      color: isOpen ? "var(--color-gold)" : "var(--color-ink)",
                      fontFamily: "var(--font-display)",
                      fontSize: "clamp(16px, 1.7vw, 19px)",
                      fontWeight: 500,
                    }}
                  >
                    <span className="flex items-baseline gap-3.5">
                      <span className="roman-index shrink-0" aria-hidden="true">
                        {toRoman(i + 1)}
                      </span>
                      <span>{f.question}</span>
                    </span>
                    <span className={`shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}>
                      <Icon
                        name={isOpen ? "minus" : "plus"}
                        size={18}
                        color="var(--color-gold)"
                      />
                    </span>
                  </button>
                  {isOpen && (
                    <div
                      id={`faq-panel-${i}`}
                      role="region"
                      className="text-[14.5px] leading-[1.75] max-w-[720px] pb-6 md:pb-7 pl-[calc(1.6em+0.875rem)]"
                      style={{ color: "var(--color-body)" }}
                    >
                      {f.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
  ```

- [ ] **Step 5 (son): Doğrula ve commit** — Run: `npx tsc --noEmit` ve `npm run lint` (beklenen: temiz). Dev sunucuda ana sayfayı (`#sss` bölümü) aç; doğrula: başlık `display-monument` anıtsal serif, altında ortalı soluk altın hat; SSS kutu yerine ince hairline ayraçlı satırlardan oluşuyor, her sorunun başında altın Roma rakamı indeksi (I, II, III…), açık satırın sorusu altın renge dönüyor ve cevap metni soru hizasına girintili açılıyor. Ardından `preview_click` ile bir soruya tıkla ve aç-kapa davranışını + `+`/`−` ikon dönüşünü doğrula; `preview_eval` ile açık sorunun `aria-expanded="true"` ve panelin `aria-controls`/`id` eşleşmesini kontrol et. Sonra `git commit -m "style(faq): hairline akordeon — roman indeks, ince ayraçlı satırlar"`.

### Task 11: MakaleKart — tablet-card varyantı
**Files:**
- Modify: `src/components/public/MakaleKart.tsx`

- [ ] **Step 1: `.pcard` → `.tablet-card` ve kapsayıcıyı Roma filigranı için `relative` yap; serif başlığı koru, opsiyonel `.roman-watermark` ekle** — Dosyanın tamamını aşağıdaki TAM kodla değiştir. Mevcut `next/image` cover mantığı, `group-hover:scale-105` zoom, props (`{ makale }: { makale: IMakale }`), `kategori` türetme, satır kelepçeleri (`line-clamp-2`) ve okuma süresi aynen korunur; sadece kart kabuğu `.tablet-card` anıtsal varyantına geçer, kapsayıcı `relative` olur ve sağ-üst köşeye `aria-hidden` soluk Roma rakamı filigranı eklenir. Filigran, makale numarası bulunmadığı için sabit `I` rakamı yerine kapsayıcı dekoratif aksanı olarak yalnızca `kategori` mevcutsa `category` adının baş harfi yerine soluk dekoratif aksandır — burada veri modeli değişmediği için filigran statik dekoratiftir ve `toRoman` gerektirmez; izole kalması için `aria-hidden`'dır.

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
    <Link href={`/makale/${makale.slug}`} className="group block no-underline">
      <article className="tablet-card relative overflow-hidden h-full flex flex-col">
        <span className="roman-watermark" aria-hidden="true">
          §
        </span>
        {makale.coverImage ? (
          <div className="h-44 overflow-hidden relative" style={{ background: "var(--color-panel-hi)" }}>
            <Image
              src={makale.coverImage}
              alt={makale.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        ) : (
          <div className="h-44" style={{ background: "var(--color-panel-hi)" }} />
        )}
        <div className="p-6 flex-1 flex flex-col relative z-10">
          {kategori && <p className="kicker mb-2">{kategori.name}</p>}
          <h3
            className="text-lg font-semibold leading-snug mb-2 transition-colors group-hover:text-[var(--color-gold)]"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}
          >
            {makale.title}
          </h3>
          <p className="text-sm leading-relaxed line-clamp-2 mb-3" style={{ color: "var(--color-muted)" }}>
            {makale.excerpt}
          </p>
          <p className="text-xs mt-auto" style={{ color: "var(--color-muted-dim)" }}>
            {makale.readingTime} dk okuma
          </p>
        </div>
      </article>
    </Link>
  );
}
```

- [ ] **Step 2 (son): Doğrula ve commit** — Run: `npx tsc --noEmit` ve `npm run lint` (beklenen: temiz). Dev sunucuda `/makaleler` sayfasını `preview_screenshot` ile çek ve doğrula: kartların üstünde 2px altın hat (`.tablet-card`) görünür, hover'da kart hafifçe yükselir (lift), kapak görseli hover'da büyür, sağ-üst köşede soluk dekoratif filigran (§) ekran okuyucudan gizli olarak durur, başlık Playfair serif kalır ve hover'da altına döner. Sonra `git commit -m "style(makale-kart): tablet-card anıtsal varyant + roman filigran"`.

### Task 12: Arşiv sayfaları — anıtsal başlıklar + tablet ızgara
**Files:**
- Modify: `src/app/(public)/makaleler/page.tsx`
- Modify: `src/app/(public)/kategori/[slug]/page.tsx`
- Modify: `src/app/(public)/yazar/[slug]/page.tsx`
- Modify: `src/app/(public)/etiket/[tag]/page.tsx`

- [ ] **Step 1: `makaleler/page.tsx` — sayfa başlığını `.display-monument` + `.gold-rule` yap** — Veri çekme (`fetchData`, `revalidate`, `metadata`, `KategoriFiltreClient`) tamamen korunur; yalnızca başlık bloğu anıtsal hale getirilir. Dosyanın tamamını aşağıdaki TAM kodla değiştir. `.display` → `.display-monument` (boyut yüzeyde `clamp` ile inline), `italic-gold` vurgu korunur, başlık altına `.gold-rule` ince hat eklenir; `kicker` korunur, açıklama paragrafı korunur.

```tsx
import type { Metadata } from "next";
import dbConnect from "@/lib/db";
import Makale from "@/models/Makale";
import Kategori from "@/models/Kategori";
import "@/models/Kullanici";
import KategoriFiltreClient from "@/components/public/KategoriFiltreClient";
import { IMakale, IKategori } from "@/types";
import { buildMetadata } from "@/lib/seo/metadata";
import { SITE_CONFIG } from "@/lib/site-config";

export const metadata: Metadata = buildMetadata({
  title: "Makaleler",
  description: `${SITE_CONFIG.brand} tarafından yayımlanmış tüm ceza hukuku makaleleri — kategoriye göre filtreleyebilirsiniz.`,
  path: "/makaleler",
});

export const revalidate = 300; // 5 dk ISR

async function fetchData(): Promise<{
  makaleler: IMakale[];
  kategoriler: IKategori[];
}> {
  try {
    await dbConnect();
    const [makalelerRaw, kategorilerRaw] = await Promise.all([
      Makale.find({ status: "yayinda" })
        .populate("category", "name slug")
        .populate("author", "name avatar")
        .sort({ createdAt: -1 })
        .limit(100),
      Kategori.find().sort({ order: 1 }),
    ]);
    return {
      makaleler: JSON.parse(JSON.stringify(makalelerRaw)) as IMakale[],
      kategoriler: JSON.parse(JSON.stringify(kategorilerRaw)) as IKategori[],
    };
  } catch (err) {
    console.error("Makaleler index: fetch failed —", err);
    return { makaleler: [], kategoriler: [] };
  }
}

export default async function MakalelerSayfasi() {
  const { makaleler, kategoriler } = await fetchData();

  return (
    <section className="max-w-7xl mx-auto px-5 md:px-16 py-16 md:py-24">
      <div className="kicker mb-3.5 text-center">Arşiv</div>
      <h1
        className="display-monument m-0 mb-5"
        style={{ fontSize: "clamp(36px, 6vw, 64px)" }}
      >
        Tüm <span className="italic-gold">makaleler.</span>
      </h1>
      <div className="gold-rule mx-auto mb-8" />
      <p
        className="max-w-[640px] mx-auto text-center text-base leading-[1.65] mb-10 md:mb-14"
        style={{ color: "var(--color-muted)" }}
      >
        {makaleler.length} yayımlanmış makale. Kategoriye göre filtreleyin veya
        aramak için sayfanın altındaki arşiv linklerini kullanın.
      </p>

      {makaleler.length === 0 ? (
        <p className="text-center py-16" style={{ color: "var(--color-muted)" }}>
          Henüz makale yayınlanmamış.
        </p>
      ) : (
        <KategoriFiltreClient kategoriler={kategoriler} makaleler={makaleler} />
      )}
    </section>
  );
}
```

- [ ] **Step 2: `kategori/[slug]/page.tsx` — başlığı `.display-monument` + `.gold-rule` yap, ızgara MakaleKart kullanmaya devam eder** — `dbConnect`, `findOne`, `populate`, `notFound`, `generateMetadata`, breadcrumb (görünür + JSON-LD) ve grid yapısı (`grid-cols-1 md:grid-cols-2 gap-6` + `MakaleKart`) tamamen korunur; yalnızca başlık bloğu anıtsallaştırılır. Dosyanın tamamını aşağıdaki TAM kodla değiştir. `.display` → `.display-monument` (inline `clamp`), `kicker` korunur, açıklama korunur, başlık altına `.gold-rule` eklenir.

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

      <div className="mb-10 text-center">
        <p className="kicker mb-3">KATEGORİ</p>
        <h1
          className="display-monument"
          style={{ fontSize: "clamp(30px, 5vw, 52px)" }}
        >
          {kategori.name}
        </h1>
        <div className="gold-rule mx-auto mt-5" />
        {kategori.description && (
          <p
            className="mt-5 max-w-[560px] mx-auto"
            style={{ color: "var(--color-muted)" }}
          >
            {kategori.description}
          </p>
        )}
      </div>

      {makaleler.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {makaleler.map((makale) => (
            <MakaleKart key={makale._id} makale={makale} />
          ))}
        </div>
      ) : (
        <p className="text-center py-12" style={{ color: "var(--color-muted)" }}>
          Bu kategoride henüz makale bulunmuyor.
        </p>
      )}
    </div>
  );
}
```

- [ ] **Step 3: `yazar/[slug]/page.tsx` — makale bölümü başlığını anıtsallaştır + ızgara korunur** — `fetchYazarSayfasi`, `generateMetadata`, hata/`notFound` durumları, profil bloğu (avatar `next/image` fill, sosyal linkler, `border-b`), JSON-LD, breadcrumb ve grid (`grid-cols-1 md:grid-cols-2 gap-6` + `MakaleKart`) tamamen korunur. Yazar adı profil `h1`'i o bağlamda kalır (profil kimliği); aşağıdaki "Articles" bölümü başlığı `.gold-rule-sm` aksanı ile anıtsallaştırılır ve serif kalır. Dosyanın tamamını aşağıdaki TAM kodla değiştir.

```tsx
import dbConnect from "@/lib/db";
import Kullanici from "@/models/Kullanici";
import Makale from "@/models/Makale";
import "@/models/Kategori";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
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

async function fetchYazarSayfasi(slug: string): Promise<
  | { yazar: IKullanici; makaleler: IMakale[] }
  | null
  | "error"
> {
  try {
    await dbConnect();
    const yazar = await Kullanici.findOne({ slug });
    if (!yazar) return null;
    const yazarObj = JSON.parse(JSON.stringify(yazar)) as IKullanici;

    const makalelerRaw = await Makale.find({
      author: yazar._id,
      status: "yayinda",
    })
      .populate("category", "name slug")
      .populate("author", "name avatar")
      .sort({ createdAt: -1 });

    const makaleler = JSON.parse(JSON.stringify(makalelerRaw)) as IMakale[];
    return { yazar: yazarObj, makaleler };
  } catch (err) {
    console.error("YazarSayfasi: fetch failed —", err);
    return "error";
  }
}

export default async function YazarSayfasi({ params }: Props) {
  const { slug } = await params;
  const data = await fetchYazarSayfasi(slug);

  if (data === null) notFound();
  if (data === "error") {
    return (
      <div className="max-w-5xl mx-auto px-6 py-12">
        <p className="text-red-700 text-center">Yazar bilgileri yüklenemedi.</p>
      </div>
    );
  }

  const { yazar: yazarObj, makaleler } = data;

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
      <div className="flex flex-col md:flex-row gap-8 items-start mb-12 pb-10 border-b" style={{ borderColor: "var(--rule-dim)" }}>
        <div
          className="relative w-32 h-32 flex items-center justify-center flex-shrink-0 overflow-hidden"
          style={{ border: "1px solid var(--color-gold)", background: "var(--color-panel-hi)" }}
        >
          {yazarObj.avatar ? (
            <Image
              src={yazarObj.avatar}
              alt={yazarObj.name}
              fill
              sizes="128px"
              className="object-cover"
            />
          ) : (
            <span
              className="italic"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 48,
                color: "var(--color-gold)",
                fontWeight: 500,
              }}
            >
              {yazarObj.name.charAt(0)}
            </span>
          )}
        </div>
        <div className="flex-1">
          <h1
            className="display-monument text-left"
            style={{ fontSize: "clamp(30px, 5vw, 48px)", marginBottom: "0.5rem" }}
          >
            {yazarObj.name}
          </h1>
          {yazarObj.bio && (
            <p className="leading-relaxed mb-4" style={{ color: "var(--color-body)" }}>{yazarObj.bio}</p>
          )}
          {hasSocials && (
            <div className="flex flex-wrap gap-3 text-sm">
              {socials.linkedin && (
                <a
                  href={socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer me"
                  className="transition-colors hover:underline"
                  style={{ color: "var(--color-gold)" }}
                >
                  LinkedIn
                </a>
              )}
              {socials.twitter && (
                <a
                  href={socials.twitter}
                  target="_blank"
                  rel="noopener noreferrer me"
                  className="transition-colors hover:underline"
                  style={{ color: "var(--color-gold)" }}
                >
                  Twitter
                </a>
              )}
              {socials.orcid && (
                <a
                  href={socials.orcid}
                  target="_blank"
                  rel="noopener noreferrer me"
                  className="transition-colors hover:underline"
                  style={{ color: "var(--color-gold)" }}
                >
                  ORCID
                </a>
              )}
              {socials.website && (
                <a
                  href={socials.website}
                  target="_blank"
                  rel="noopener noreferrer me"
                  className="transition-colors hover:underline"
                  style={{ color: "var(--color-gold)" }}
                >
                  Website
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Articles */}
      <div className="mb-6">
        <div className="gold-rule-sm mb-3" />
        <h2
          className="text-xl font-semibold"
          style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}
        >
          {yazarObj.name} tarafından yazılmış makaleler ({makaleler.length})
        </h2>
      </div>

      {makaleler.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {makaleler.map((makale) => (
            <MakaleKart key={makale._id} makale={makale} />
          ))}
        </div>
      ) : (
        <p className="text-center py-12" style={{ color: "var(--color-muted)" }}>
          Bu yazarın henüz yayınlanmış makalesi yok.
        </p>
      )}
    </div>
  );
}
```

- [ ] **Step 4: `etiket/[tag]/page.tsx` — başlığı `.display-monument` + `.gold-rule` yap, ızgara korunur** — `generateMetadata`, `decodeURIComponent`, `fetchTaglıMakaleler`, breadcrumb (görünür + JSON-LD) ve grid (`grid-cols-1 md:grid-cols-2 gap-6` + `MakaleKart`) tamamen korunur; yalnızca başlık bloğu anıtsallaştırılır. Dosyanın tamamını aşağıdaki TAM kodla değiştir. `.display` → `.display-monument` (inline `clamp`), `#${tag}` formatı ve makale sayacı korunur, başlık altına `.gold-rule` eklenir.

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

async function fetchTaglıMakaleler(tag: string): Promise<IMakale[]> {
  try {
    await dbConnect();
    const raw = await Makale.find({
      tags: tag,
      status: "yayinda",
    })
      .populate("category", "name slug")
      .populate("author", "name avatar")
      .sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(raw)) as IMakale[];
  } catch (err) {
    console.error("EtiketSayfasi: fetch failed —", err);
    return [];
  }
}

export default async function EtiketSayfasi({ params }: Props) {
  const { tag: tagRaw } = await params;
  const tag = decodeURIComponent(tagRaw);
  const makaleler = await fetchTaglıMakaleler(tag);

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

      <div className="mb-10 text-center">
        <p className="kicker mb-3">ETİKET</p>
        <h1
          className="display-monument"
          style={{ fontSize: "clamp(30px, 5vw, 52px)" }}
        >
          <span className="italic-gold">#</span>{tag}
        </h1>
        <div className="gold-rule mx-auto mt-5" />
        <p className="mt-5" style={{ color: "var(--color-muted)" }}>
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
        <p className="text-center py-12" style={{ color: "var(--color-muted)" }}>
          Bu etikete ait makale yok.
        </p>
      )}
    </div>
  );
}
```

- [ ] **Step 5 (son): Doğrula ve commit** — Run: `npx tsc --noEmit` ve `npm run lint` (beklenen: temiz). Dev sunucuda dört sayfayı `preview_screenshot` ile çek: `/makaleler` (ortalanmış `.display-monument` başlık + altın italik "makaleler." + altında soluk `.gold-rule` hattı, altta tablet-card ızgara), bir `/kategori/<slug>`, bir `/yazar/<slug>` (profil `h1` anıtsal serif, "Articles" başlığının üstünde 34px solid `.gold-rule-sm`), bir `/etiket/<tag>` (ortalanmış anıtsal `#tag` başlık + `.gold-rule`). Doğrula: tüm başlıklar Playfair anıtsal serif, altın hat aksanları ortalı, kart ızgaraları tablet-card ile render oluyor, filtre pill'leri `/makaleler`'de `KategoriFiltreClient` içinde korunuyor. Sonra `git commit -m "style(arsiv): anitsal baslik + gold-rule + tablet izgara"`.

### Task 13: Makale okuma sayfası — anıtsal başlık + drop-cap

**Files:**
- Modify: `src/app/(public)/makale/[slug]/page.tsx`

- [ ] **Step 1: `toRoman` importunu ekle (kullanılmıyorsa kaldırma — meta okuma süresi rozetinde gerek yok; sadece mevcut importları koru).** Dosyanın en üstündeki mevcut importlara dokunma. Bu task'ta yeni import gerekmiyor; `formatDate` zaten import edilmiş durumda. Bir sonraki adımlara geç.

- [ ] **Step 2: Header bloğunu (mevcut satır 136–187 arası) anıtsal başlık + ortalanmış düzene çevir.** Mevcut `{/* Header */}` `<div>` bloğunu aşağıdaki TAM blokla değiştir. `Breadcrumb`, `kategori`, `PaylasimButonlari`, `yazar` avatar/isim render mantığı ve `formatDate`/`readingTime` korunur; sadece görsel anıtsal dile hizalanır (ortalanmış `.display-monument` başlık, `.kicker` kategori, meta satırı, `.gold-rule`):

```tsx
      {/* Header */}
      <div className="max-w-content mx-auto px-6 pt-12">
        <Breadcrumb items={breadcrumbItems} />

        <div className="text-center mt-8">
          {kategori && <p className="kicker mb-5">{kategori.name}</p>}
          <h1
            className="display-monument"
            style={{ fontSize: "clamp(2rem, 5vw, 3.4rem)" }}
          >
            {makaleObj.title}
          </h1>
          <p
            className="text-lg mt-6 leading-relaxed max-w-2xl mx-auto"
            style={{ color: "var(--color-muted)" }}
          >
            {makaleObj.excerpt}
          </p>

          {/* Meta satırı: yazar · tarih · okuma süresi */}
          <div
            className="flex items-center justify-center gap-3 mt-7 text-sm flex-wrap"
            style={{ color: "var(--color-muted)" }}
          >
            <div
              className="w-9 h-9 flex items-center justify-center overflow-hidden relative flex-shrink-0"
              style={{ border: "1px solid var(--color-gold)", background: "var(--color-panel-hi)" }}
            >
              {yazar?.avatar ? (
                <Image
                  src={yazar.avatar}
                  alt={yazar.name}
                  fill
                  sizes="36px"
                  className="object-cover"
                />
              ) : (
                <span style={{ fontFamily: "var(--font-display)", color: "var(--color-gold)", fontWeight: 500 }}>
                  {yazar?.name?.charAt(0) ?? "?"}
                </span>
              )}
            </div>
            <span className="font-semibold" style={{ color: "var(--color-ink)" }}>
              {yazar?.name ?? "Anonim"}
            </span>
            <span style={{ color: "var(--color-muted-dim)" }}>·</span>
            <span>{formatDate(makaleObj.createdAt)}</span>
            <span style={{ color: "var(--color-muted-dim)" }}>·</span>
            <span>{makaleObj.readingTime} dk okuma</span>
          </div>

          <div className="gold-rule mx-auto mt-8" />

          {/* Paylaşım */}
          <div className="flex justify-center mt-6">
            <PaylasimButonlari title={makaleObj.title} slug={makaleObj.slug} />
          </div>
        </div>
      </div>
```

- [ ] **Step 3: Gövde kapsayıcısına `.dropcap` ekle ve serif H2 ayarını koru.** Mevcut `prose` `<div>`'inin (satır 207–220) `className`'ine `dropcap` sınıfını ekle. Mevcut tüm `prose-*` modifikasyonları, `style`, ve `dangerouslySetInnerHTML` korunur — yalnızca `className` dizisinin başına `dropcap` eklenir:

```tsx
        <div
          className="dropcap prose prose-lg prose-invert max-w-content flex-1
            prose-headings:font-display prose-headings:font-semibold
            prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4
            prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
            prose-p:leading-[1.85]
            prose-blockquote:border-l-[var(--color-gold)] prose-blockquote:bg-[var(--color-panel)] prose-blockquote:py-3 prose-blockquote:not-italic
            prose-a:text-[var(--color-gold)] prose-a:no-underline hover:prose-a:underline
            prose-strong:text-[var(--color-ink)]
            prose-code:text-[var(--color-gold)]
            prose-img:rounded-none"
          style={{ color: "var(--color-body)" }}
          dangerouslySetInnerHTML={{ __html: sanitize(contentWithIds) }}
        />
```

- [ ] **Step 4: FAQ başlığını anıtsal serif düzene hizala (opsiyonel görsel tutarlılık).** Mevcut FAQ `<section>` başlığını ortalanmış `.display`/`.kicker` ile sadeleştir. Mevcut `faqs` render döngüsü, `sanitize`, `details/summary` mantığı KORUNUR — yalnızca başlık üst bloğu değişir:

```tsx
      {/* FAQ Section */}
      {makaleObj.faqs && makaleObj.faqs.length > 0 && (
        <section className="max-w-content mx-auto px-6 mt-16">
          <p className="kicker mb-3">Sıkça Sorulan Sorular</p>
          <h2 className="display text-2xl mb-2">Merak Edilenler</h2>
          <div className="gold-rule-sm mb-7" />
          <div className="space-y-4">
            {makaleObj.faqs.map((faq, idx) => (
              <details
                key={idx}
                className="p-4"
                style={{
                  background: "var(--color-panel)",
                  border: "1px solid var(--rule-dim)",
                }}
              >
                <summary
                  className="font-semibold cursor-pointer"
                  style={{ color: "var(--color-ink)" }}
                >
                  {faq.question}
                </summary>
                <div
                  className="mt-3 leading-relaxed"
                  style={{ color: "var(--color-body)" }}
                  dangerouslySetInnerHTML={{ __html: sanitize(faq.answer) }}
                />
              </details>
            ))}
          </div>
        </section>
      )}
```

- [ ] **Step 5 (son): Doğrula ve commit** — Run: `npx tsc --noEmit` ve `npm run lint` (beklenen: temiz). Dev sunucuda bir yayınlanmış makale sayfasını (`/makale/<slug>`) `preview_screenshot` ile çek ve doğrula: başlık ortalanmış anıtsal serifte (içinde altın italik vurgu görünüyorsa `.italic-gold`), altında kategori `.kicker`'ı, tek satırlık meta (yazar · tarih · okuma süresi), altın `.gold-rule` çizgisi; gövdenin ilk paragrafının ilk harfi altın drop-cap olarak büyük; JSON-LD script'leri DOM'da mevcut. Sonra `git commit -m "style(makale): anıtsal başlık bloğu + drop-cap okuma düzeni"`.

### Task 14: İçindekiler — Roma rakamlı kenar-rayı

**Files:**
- Modify: `src/components/public/IcindekilerTablosu.tsx`

- [ ] **Step 1: `toRoman` yardımcısını import et.** Dosyanın en üstündeki import bloğuna ekle (mevcut `"use client"` ve React importu korunur):

```tsx
"use client";

import { useEffect, useState } from "react";
import { toRoman } from "@/lib/utils";
```

- [ ] **Step 2: Render bloğunu Roma rakamlı ince kenar-rayına çevir.** Mevcut `return (...)` JSX'ini (satır 55–80) aşağıdaki TAM blokla değiştir. `items`, `activeId`, `IntersectionObserver` aktif-başlık mantığı ve `item.level` girintisi KORUNUR; her madde başına `.roman-index` Roma rakamı eklenir, kapsayıcı `.pcard` yerine sol altın hatlı kenar-rayı olur:

```tsx
  return (
    <aside className="hidden lg:block w-64 flex-shrink-0 sticky top-24 self-start">
      <p className="kicker mb-4">İçindekiler</p>
      <ul
        className="space-y-3 pl-5"
        style={{ borderLeft: "1px solid var(--rule-dim)" }}
      >
        {items.map((item, idx) => {
          const isActive = activeId === item.id;
          return (
            <li
              key={item.id}
              className={`flex gap-3 items-baseline ${item.level === 3 ? "pl-3" : ""}`}
            >
              <span
                className="roman-index text-[0.7rem] flex-shrink-0 leading-snug"
                aria-hidden="true"
                style={{ opacity: isActive ? 1 : 0.5 }}
              >
                {toRoman(idx + 1)}
              </span>
              <a
                href={`#${item.id}`}
                className="text-xs leading-snug transition-colors block focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-gold)]"
                aria-current={isActive ? "true" : undefined}
                style={{
                  color: isActive ? "var(--color-gold)" : "var(--color-muted)",
                  fontWeight: isActive ? 600 : 400,
                }}
              >
                {item.text}
              </a>
            </li>
          );
        })}
      </ul>
    </aside>
  );
```

- [ ] **Step 3 (son): Doğrula ve commit** — Run: `npx tsc --noEmit` ve `npm run lint` (beklenen: temiz). Dev sunucuda en az iki H2/H3 başlığı olan bir makale sayfasını `preview_screenshot` ile çek; sayfayı kaydırarak doğrula: sağ kenarda ince soluk dikey altın hat boyunca dizilmiş maddeler, her birinin solunda `.roman-index` Roma rakamı (I, II, III…); kaydırırken aktif başlığa karşılık gelen maddenin metni ve Roma rakamı altına (`var(--color-gold)`) dönüyor (IntersectionObserver çalışıyor). Sonra `git commit -m "style(toc): Roma rakamlı anıtsal kenar-rayı"`.

### Task 15: Makale yan bileşenleri — anıtsal hizalama

**Files:**
- Modify: `src/components/public/YazarKarti.tsx`
- Modify: `src/components/public/IlgiliMakaleler.tsx`
- Modify: `src/components/public/PaylasimButonlari.tsx`
- Modify: `src/components/public/Breadcrumb.tsx`

- [ ] **Step 1: `YazarKarti.tsx` — `.pcard`'ı `.tablet-card` anıtsal varyantına yükselt ve avatarı serif italik'e hizala.** Dosyanın tamamını aşağıdaki TAM kodla değiştir. `yazar` props, avatar/`bio`/`slug` koşullu render mantığı ve `Link` hedefi KORUNUR; yalnızca kapsayıcı `.tablet-card` (2px altın üst hat + hover lift) olur ve "Yazar" üstüne `.kicker` korunarak küçük bir altın hat eklenir:

```tsx
import Link from "next/link";
import Image from "next/image";
import { IKullanici } from "@/types";

export default function YazarKarti({ yazar }: { yazar: IKullanici }) {
  return (
    <div className="tablet-card p-6 md:p-7 mt-10 flex gap-5 items-start">
      <div
        className="w-16 h-16 flex-shrink-0 flex items-center justify-center overflow-hidden relative"
        style={{
          border: "1px solid var(--color-gold)",
          background: "var(--color-panel-hi)",
        }}
      >
        {yazar.avatar ? (
          <Image
            src={yazar.avatar}
            alt={yazar.name}
            fill
            sizes="64px"
            className="object-cover"
          />
        ) : (
          <span
            className="italic"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 28,
              color: "var(--color-gold)",
              fontWeight: 500,
            }}
          >
            {yazar.name.charAt(0)}
          </span>
        )}
      </div>
      <div className="flex-1">
        <p className="kicker mb-2">Yazar</p>
        <div className="gold-rule-sm mb-3" />
        <h3
          className="text-lg font-semibold mb-2"
          style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}
        >
          {yazar.name}
        </h3>
        {yazar.bio && (
          <p className="text-sm leading-relaxed" style={{ color: "var(--color-body)" }}>
            {yazar.bio}
          </p>
        )}
        {yazar.slug && (
          <Link
            href={`/yazar/${yazar.slug}`}
            className="inline-block mt-3 text-xs uppercase tracking-[0.14em] font-semibold transition-colors hover:text-[var(--color-gold)]"
            style={{ color: "var(--color-gold)" }}
          >
            Yazarın diğer makaleleri →
          </Link>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: `IlgiliMakaleler.tsx` — başlığı ortalanmış anıtsal serif + altın hat düzenine al.** Dosyanın tamamını aşağıdaki TAM kodla değiştir. `makaleler` props, boş-dizi guard'ı ve `MakaleKart` grid render'ı KORUNUR; yalnızca başlık bloğu `.kicker` + serif başlık + `.gold-rule-sm` ile anıtsal dile hizalanır:

```tsx
import { IMakale } from "@/types";
import MakaleKart from "@/components/public/MakaleKart";

export default function IlgiliMakaleler({
  makaleler,
}: {
  makaleler: IMakale[];
}) {
  if (makaleler.length === 0) return null;

  return (
    <div className="mt-12 pt-10 border-t" style={{ borderColor: "var(--rule-dim)" }}>
      <p className="kicker mb-3">İlgili Makaleler</p>
      <h2
        className="text-xl md:text-2xl font-semibold mb-3"
        style={{ fontFamily: "var(--font-display)", color: "var(--color-ink)" }}
      >
        Bunları da okumak ister misiniz?
      </h2>
      <div className="gold-rule-sm mb-7" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {makaleler.map((m) => (
          <MakaleKart key={m._id} makale={m} />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: `PaylasimButonlari.tsx` — altın hatlı, anıtsal "Paylaş" etiketli buton grubu.** Dosyanın tamamını aşağıdaki TAM kodla değiştir. `title`/`slug` props, `useState`, `twitterUrl`/`linkedinUrl` üretimi, `handleCopy` clipboard mantığı, tüm `aria-label`'lar ve `target="_blank" rel="noopener noreferrer"` KORUNUR; yalnızca grubun başına soluk altın bir "Paylaş" eyebrow etiketi ve ince ayraç eklenir, `.icon-btn` korunur:

```tsx
"use client";

import { useState } from "react";
import { SITE_URL } from "@/lib/site-config";

export default function PaylasimButonlari({
  title,
  slug,
}: {
  title: string;
  slug: string;
}) {
  const [copied, setCopied] = useState(false);
  const url = `${SITE_URL}/makale/${slug}`;

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    title
  )}&url=${encodeURIComponent(url)}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
    url
  )}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="flex items-center gap-3">
      <span
        className="eyebrow hidden sm:inline"
        style={{ color: "var(--color-muted)" }}
        aria-hidden="true"
      >
        Paylaş
      </span>
      <span
        className="hidden sm:block w-6 h-px"
        style={{ background: "var(--color-gold)" }}
        aria-hidden="true"
      />
      <div className="flex gap-2">
        <a
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Twitter'da paylaş"
          className="icon-btn"
        >
          X
        </a>
        <a
          href={linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn'de paylaş"
          className="icon-btn"
        >
          in
        </a>
        <button
          onClick={handleCopy}
          aria-label="Linki kopyala"
          className="icon-btn"
        >
          {copied ? "✓" : "⎘"}
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: `Breadcrumb.tsx` — altın ayraçlı, harf-aralıklı anıtsal şerit.** Dosyanın tamamını aşağıdaki TAM kodla değiştir. `BreadcrumbItem` tipi, boş-dizi guard'ı, `item.href` koşullu `Link`/`span` mantığı ve son madde vurgusu KORUNUR; yalnızca ayraç altın renge alınır, `/` yerine ince `›` kullanılır ve şeride hafif harf aralığı verilir:

```tsx
import Link from "next/link";

interface BreadcrumbItem {
  name: string;
  href?: string;
}

export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  if (items.length === 0) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className="text-xs mb-6 flex items-center gap-2 flex-wrap tracking-[0.04em]"
      style={{ color: "var(--color-muted)" }}
    >
      {items.map((item, idx) => (
        <span key={idx} className="flex items-center gap-2">
          {item.href ? (
            <Link
              href={item.href}
              className="transition-colors hover:text-[var(--color-gold)]"
            >
              {item.name}
            </Link>
          ) : (
            <span className="font-medium" style={{ color: "var(--color-ink)" }}>
              {item.name}
            </span>
          )}
          {idx < items.length - 1 && (
            <span aria-hidden="true" style={{ color: "var(--color-gold)", opacity: 0.6 }}>
              ›
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
```

- [ ] **Step 5 (son): Doğrula ve commit** — Run: `npx tsc --noEmit` ve `npm run lint` (beklenen: temiz). Dev sunucuda bir makale sayfasını `preview_screenshot` ile çek ve doğrula: (1) Breadcrumb'da maddeler arası ayraç ince altın `›`; (2) başlık altındaki paylaşım grubunda soluk "Paylaş" etiketi + altın ince ayraç + üç `.icon-btn`; (3) sayfa sonunda yazar kartı 2px altın üst hatlı `.tablet-card` olarak görünüyor ve hover'da hafif yükseliyor, "Yazar" `.kicker`'ı altında küçük altın hat var; (4) "İlgili Makaleler" başlığının altında `.gold-rule-sm` ince altın hat. Sonra `git commit -m "style(makale-yan): anıtsal hizalama — yazar kartı, ilgili, paylaşım, breadcrumb"`.

### Task 16: İletişim sayfası — anıtsal başlık + ölçülü kartlar
**Files:**
- Modify: `src/app/(public)/iletisim/page.tsx`

- [ ] **Step 1: Başlık bloğunu anıtsal hâle getir.** Mevcut `<h1 className="display ...">` + açıklama paragrafını, ortalanmış `.display-monument` başlık + `.gold-rule` + açıklama bloğuyla değiştir. Mevcut `getSiteContent` çağrısı, `SOCIAL_LABELS` sabiti ve `generateMetadata` aynen korunur. `IletisimPage` fonksiyonunun `return` içindeki sarmalayıcı `<div>` ile başlık/açıklama kısmını şu şekilde güncelle (kart bloğu Step 2'de gelecek):

```tsx
export default async function IletisimPage() {
  const c = await getSiteContent();
  return (
    <div className="max-w-content mx-auto px-6 py-16 md:py-20">
      <header className="text-center mb-12 md:mb-16">
        <p className="kicker mb-4">İletişim</p>
        <h1
          className="display-monument"
          style={{ fontSize: "clamp(2.4rem, 6vw, 4rem)" }}
        >
          Bana <span className="italic-gold">ulaşın</span>
        </h1>
        <div className="gold-rule-sm mx-auto mt-6" />
        <p
          className="mx-auto mt-6 max-w-xl text-base leading-relaxed"
          style={{ color: "var(--color-muted)" }}
        >
          Soru, öneri veya iş birliği teklifleri için aşağıdaki kanallardan
          bana ulaşabilirsiniz.
        </p>
      </header>
```

- [ ] **Step 2: Kart listesini anıtsal `.tablet-card` diline taşı.** Mevcut `<div className="space-y-6">` sarmalayıcısını ortalanmış, dar bir kolona (`max-w-2xl mx-auto`) çevir; her `.pcard p-6`'yı `.tablet-card p-6 md:p-7`'ye dönüştür. Mevcut render mantığı (e-posta zorunlu, telefon/adres koşullu, `SOCIAL_LABELS.filter(...).map(...)`), tüm `href`/`target`/`rel`/`break-all` davranışları ve inline renkler BİREBİR korunur — yalnız kart sınıfı ve sarmalayıcı değişir. Step 1'deki `</header>`'dan sonra gelecek tam blok:

```tsx
      <div className="max-w-2xl mx-auto space-y-5">
        <div className="tablet-card p-6 md:p-7">
          <h3 className="kicker mb-2">E-posta</h3>
          <a
            href={`mailto:${c.contact.email}`}
            className="transition-colors hover:underline"
            style={{ color: "var(--color-gold)" }}
          >
            {c.contact.email}
          </a>
        </div>

        {c.contact.phone && (
          <div className="tablet-card p-6 md:p-7">
            <h3 className="kicker mb-2">Telefon</h3>
            <a
              href={`tel:${c.contact.phoneRaw || c.contact.phone}`}
              className="transition-colors hover:underline"
              style={{ color: "var(--color-gold)" }}
            >
              {c.contact.phone}
            </a>
          </div>
        )}

        {(c.contact.address.line1 || c.contact.address.line2) && (
          <div className="tablet-card p-6 md:p-7">
            <h3 className="kicker mb-2">Adres</h3>
            <p style={{ color: "var(--color-body)" }}>
              {c.contact.address.line1}
              {c.contact.address.line2 && (
                <>
                  <br />
                  {c.contact.address.line2}
                </>
              )}
            </p>
          </div>
        )}

        {SOCIAL_LABELS.filter((s) => c.socials?.[s.key]).map((s) => (
          <div key={s.key} className="tablet-card p-6 md:p-7">
            <h3 className="kicker mb-2">{s.label}</h3>
            <a
              href={c.socials[s.key]}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:underline break-all"
              style={{ color: "var(--color-gold)" }}
            >
              {c.socials[s.key]}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step (son): Doğrula ve commit** — Run: `npx tsc --noEmit` ve `npm run lint` (beklenen: temiz, yeni import/bağımlılık eklenmedi). Dev sunucuda `/iletisim` sayfasını `preview_screenshot` ile çek ve doğrula: başlık ortada büyük Playfair `.display-monument` olarak "ulaşın" kelimesi altın italik; başlığın altında kısa solid altın hat (`.gold-rule-sm`); kartlar dar tek kolonda ortalanmış, her birinin üstünde 2px altın hat var (`.tablet-card`) ve hover'da hafifçe yükseliyor; e-posta/sosyal bağlantı renkleri altın korunmuş. Sonra `git commit -m "style(iletisim): anıtsal başlık + ölçülü tablet kartlar"`.

### Task 17: Arama — anıtsal başlık + sonuç listesi
**Files:**
- Modify: `src/app/(public)/ara/AraClient.tsx`

- [ ] **Step 1: Başlık bloğunu anıtsal hâle getir.** Mevcut `<h1 className="display ...">Makale Ara</h1>`'i ortalanmış `.display-monument` başlık + `.gold-rule-sm` ile değiştir. `"use client"`, tüm `useState`'ler ve `handleSearch` fetch mantığı (min 2 karakter kontrolü, `/api/ara?q=...`, hata/`searched` durumları) BİREBİR korunur. `return`'ün başını ve form öncesi başlık bloğunu şu şekilde güncelle:

```tsx
  return (
    <div className="max-w-5xl mx-auto px-6 py-16 md:py-20">
      <header className="text-center mb-10">
        <p className="kicker mb-4">Arşiv</p>
        <h1
          className="display-monument"
          style={{ fontSize: "clamp(2rem, 5vw, 3.25rem)" }}
        >
          Makale <span className="italic-gold">ara</span>
        </h1>
        <div className="gold-rule-sm mx-auto mt-6" />
      </header>
```

- [ ] **Step 2: Form ve durum bloklarını ortalanmış sütuna hizala.** Form'u dar ortalanmış bir kolona (`max-w-2xl mx-auto`) al; mevcut `input`/`button` markup'ı, inline stiller, `onFocus`/`onBlur` border davranışı, `autoFocus`, `disabled`/loading metni BİREBİR korunur. Hata bloğu ve `searched` sonuç sayacı paragrafı da aynı dar kolon hizasında kalır. Step 1'deki `</header>`'dan sonra gelecek tam blok:

```tsx
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSearch} className="flex gap-3 mb-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Başlık veya içerik ara..."
            className="flex-1 px-4 py-3 text-sm focus:outline-none"
            style={{
              background: "var(--color-panel)",
              border: "1px solid var(--rule-dim)",
              color: "var(--color-ink)",
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = "var(--color-gold)"; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = "var(--rule-dim)"; }}
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
          <div
            className="mb-6 text-sm px-4 py-2"
            style={{
              background: "var(--color-panel)",
              border: "1px solid var(--rule-dim)",
              color: "#f87171",
            }}
          >
            {error}
          </div>
        )}

        {searched && !error && (
          <p className="text-sm" style={{ color: "var(--color-muted)" }}>
            &quot;{query}&quot; için {results.length} sonuç bulundu.
          </p>
        )}
      </div>
```

- [ ] **Step 3: Sonuç ızgarasını tablet/satır diline hizala ve dar başlık hattından sonra tam genişliğe aç.** Sonuç bloğunu Step 2'deki dar kolon `</div>`'inden sonra, üstte ince bir altın ayraç (`.gold-rule`) ile ayrılmış tam genişlikte bir bölüme taşı. Mevcut `results.map` ile `MakaleKart` render'ı (`key={makale._id}`, `makale={makale}`) ve "bulunamadı" durumu BİREBİR korunur; yalnız sarmalayıcı/boşluklar anıtsal ritme uyarlanır. Step 2'deki sonuç sayacı artık dar kolonda kaldığı için, sonuç listesi şu blokla onun altına gelir:

```tsx
      {searched && !error && (
        <div className="mt-8">
          {results.length > 0 ? (
            <>
              <div className="gold-rule mx-auto mb-8" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {results.map((makale) => (
                  <MakaleKart key={makale._id} makale={makale} />
                ))}
              </div>
            </>
          ) : (
            <p className="text-center py-12" style={{ color: "var(--color-muted)" }}>
              Aramanızla eşleşen makale bulunamadı.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step (son): Doğrula ve commit** — Run: `npx tsc --noEmit` ve `npm run lint` (beklenen: temiz, davranış/fetch değişmedi, yeni import yok). Dev sunucuda `/ara` sayfasını `preview_screenshot` ile çek; başlığın ortada büyük Playfair `.display-monument` ("ara" kelimesi altın italik) ve altında kısa altın hat (`.gold-rule-sm`) olduğunu doğrula. Bir terim ara (ör. min 2 karakter) ve sonuçların geldiğini gör: sonuç sayacı dar kolonda, sonuç ızgarası tam genişlikte ve üstünde soluk altın ayraç (`.gold-rule`); `autoFocus` ve input focus altın border davranışının çalıştığını teyit et. Sonra `git commit -m "style(ara): anıtsal başlık + tablet hizalı sonuç listesi"`.

### Task 18: Tüm site görsel doğrulama geçişi

Tüm yüzeyler tamamlandıktan sonra bütünsel kontrol. Bu task kod üretmez; doğrulama ve son onaydır.

**Files:** (yok — doğrulama task'ı)

- [ ] **Step 1: Statik kontroller**

Run: `npx tsc --noEmit` ve `npm run lint` ve `npm run build` — üçü de temiz/başarılı olmalı. Hata varsa ilgili task'a dön.

- [ ] **Step 2: Masaüstü görsel geçiş**

Dev sunucuda şu yüzeyleri sırayla gez ve her birini `preview_screenshot` ile çek: `/` (hero + 7 bölüm), `/makaleler`, `/makale/<bir-slug>`, `/kategori/<slug>`, `/yazar/<slug>`, `/etiket/<tag>`, `/iletisim`, `/ara`. Doğrula: anıtsal dil tutarlı (ortalanmış `.display-monument` başlıklar, `.gold-rule` ayraçlar, Roma rakamları, `.tablet-card` kartlar, hero `.arch-motif`), altın ölçülü kullanılmış, hiçbir yüzey kırık değil.

- [ ] **Step 3: Mobil + responsive**

`preview_resize` ile ~390px genişlikte aynı yüzeyleri kontrol et: başlıklar taşmıyor, kartlar tek kolona düşüyor, mobil header menüsü ve aktif-sayfa vurgusu çalışıyor, kemer motifi mobilde taşma yapmıyor.

- [ ] **Step 4: Hareket + erişilebilirlik**

`prefers-reduced-motion: reduce` ile (devtools emülasyonu / `preview_eval`) reveal ve hero animasyonlarının kapandığını doğrula. Klavye ile gez: `focus-visible` altın halka her interaktif öğede görünür, aktif nav linkinde `aria-current="page"` var, dekoratif motifler ve Roma filigranları `aria-hidden`.

- [ ] **Step 5: Önce/sonra onayı ve kapanış commit'i**

Ana yüzeylerin ekran görüntülerini kullanıcıya sun, onay al. Onaylanınca, varsa kalan küçük rötuşları uygula ve toparlayıcı commit at:

```bash
git add -A
git commit -m "style(redesign): anıtsal yeniden tasarım — final görsel doğrulama rötuşları"
```
