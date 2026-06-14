# Anıtsal Yeniden Tasarım — Tasarım Dokümanı

- **Tarih:** 2026-06-14
- **Durum:** Onaylandı (uygulamaya hazır)
- **Kapsam:** Tüm public site (admin paneli hariç)
- **Yön:** "Anıtsal" (C) — mimari otorite + gravitas

## 1. Bağlam ve Mevcut Durum

Site (`Tarık Mirza · Ceza Hukuku`) hâlihazırda bilinçli ve rafine bir görsel
kimliğe sahip: altın (#D4AF37) / gece-mavisi (#0B0F14) palet, Playfair Display
(serif başlık) + Inter (gövde) ikilisi, `.kicker`/`.eyebrow` tipografisi,
italik-altın vurgu kelimeleri, premium kartlar (`.pcard`), hero'da mimari sütun
motifi, kâğıt-hissi için ince SVG noise dokusu ve scroll-reveal animasyonları.

Bu çalışma kimliği **yıkmaz**; mevcut DNA'yı koruyarak daha anıtsal, otoriter ve
"ağır" bir yöne evrimleştirir. Üç yön (Rafine Süreklilik / Hukuk Dergisi /
Anıtsal) mockup'larla karşılaştırıldı; **Anıtsal (C)** seçildi ve hero +
makale okuma + arşiv yüzeylerine uygulanmış mockup'larla doğrulandı.

## 2. Kilitlenen Kararlar

- **Kapsam:** tüm public site (header/footer, hero + 7 ana sayfa bölümü, makale
  okuma, arşiv/liste, kategori/yazar/etiket, iletişim, arama).
- **Yaklaşım:** CSS-öncelikli, paylaşılan yardımcı sınıf katmanı; yüzeylere tek
  tek elle stil yazmak yerine `globals.css`'te yeniden kullanılabilir sınıflar.
- **Veri modeli DEĞİŞMEZ.** Redesign %100 sunumsaldır.
- **Yeni bağımlılık yok** — mevcut `next/font` fontları (Playfair + Inter) yeterli.
- **Güvenlik paketi** (ayrı tasarım) bu çalışmanın dışında; sonraya ertelendi.

## 3. Anıtsal Tasarım Dili

**Korunan DNA:** palet, Playfair + Inter, noise dokusu, scroll-reveal & hero
giriş animasyonları, gold `focus-visible`, `prefers-reduced-motion` desteği,
`.kicker`/`.eyebrow`/`.display` tipografisi, içerik genişlikleri (680/780px).

**Anıtsal katman (yeni):**
- Ortalanmış, simetrik kompozisyonlar (hero ve bölüm başlıkları).
- Daha büyük, anıtsal serif başlık ölçeği.
- Altının daha **ölçülü** kullanımı: tek ince altın hat aksanları.
- **Roma rakamı** indeksleri (bölümler, adımlar, kartlar — `01` yerine `I`).
- Mimari **kemer/sütun motifi** (hero arka planı, saf CSS).
- Makale gövdesinde **drop-cap** (ilk harf, altın serif).
- Dergi/anıt tarzı **masthead** üst bilgi şeridi.

## 4. Tasarım Sistemi Katmanı — `src/app/globals.css`

Yeni paylaşılan yardımcı sınıflar (`@layer components`) ve token rafine:

| Sınıf / Token | Amaç |
|---|---|
| `.display-monument` | Ortalanabilir, daha büyük anıtsal serif başlık ölçeği (clamp) |
| `.gold-rule`, `.gold-rule-sm` | İnce ortalanan altın hat — bölüm ayraçları |
| `.roman-index` | Playfair Roma rakamı indeksi (altın) |
| `.roman-watermark` | Kart köşesinde soluk Roma rakamı filigranı |
| `.dropcap` | Makale ilk harfi: altın, serif, float |
| `.tablet-card` | `.pcard`'ın anıtsal varyantı (2px altın üst-hat, panel zemin, hover lift) |
| `.arch-motif` | Hero arkası soluk kemer/sütun — saf CSS `border`, `aria-hidden` |
| `.masthead` | Anıt/dergi tarzı üst bilgi şeridi |

- Mevcut `.pcard`, `.btn-*`, `.kicker`, `.eyebrow`, `.display`, `.pill`,
  `.reveal-*`, `.hero-enter-*` **korunur**; `.tablet-card` bunların yanına eklenir.
- **Erişilebilirlik düzeltmesi:** `--color-muted-dim` (#7e7e7e → ~#9a9a9a).
  Denetimde koyu zemin üzerinde ~3.9:1 ile AA (4.5:1) altında çıkmıştı; küçük
  metinlerde kullanıldığı için tonu açılır.

## 5. Yüzey Yüzey Değişiklikler

### 5.1 Header / Footer
- `src/components/public/Header.tsx`: **aktif-sayfa vurgusu** — şu an aktif sekme
  her zaman `nav[0]` (Ana Sayfa) varsayılıyor; `usePathname` ile gerçek aktif
  rota altın renklendirilir. Marka kilidi ve anıtsal sadelik korunur.
- `src/components/public/Footer.tsx`: anıtsal altın hatlar; tipografi hizalaması.
  (Footer'daki ölü sosyal/hukuki linkler bu redesign'ın kapsamı dışında —
  ayrı işler.)

### 5.2 Hero — `src/components/public/home/Hero.tsx`
- Ortalanmış anıtsal başlık (`.display-monument`), mevcut `renderAccent` ve
  italik-altın vurgu korunur.
- Mevcut `ColumnBg` SVG'si **`.arch-motif`** ile zenginleştirilir/değiştirilir
  (soluk kemer + sütunlar).
- Üstte tek `.gold-rule-sm`, ölçülü tek birincil CTA + ikincil ghost.
- `hero-enter-*` animasyonları korunur.

### 5.3 Ana Sayfa Bölümleri
`src/components/public/home/` altındaki bileşenler anıtsal ızgaraya uyarlanır:
- **Areas.tsx**: numara rozetleri (`01`) → `.roman-index` (`I`); kartlar
  `.tablet-card`. (Mevcut 7-öğe / `i===6` ortalama mantığı korunur.)
- **Process.tsx**: adımlar Roma rakamlı, altın hatlı dikey ritim.
- **Trusts.tsx**: anıtsal güven şeridi, ölçülü altın.
- **About.tsx**: editöryel/anıtsal düzen; zengin metin render'ı korunur.
- **Urgent.tsx**: ölçülü anıtsal çağrı bloğu; mevcut HTML render'ı korunur.
- **Faq.tsx**: hairline akordeon (kutu yerine ince ayraçlar); mevcut
  `aria-expanded`/`aria-controls` erişilebilirliği korunur.

### 5.4 Makale Okuma — `src/app/(public)/makale/[slug]/page.tsx`
- Anıtsal başlık bloğu: ortalanmış `.display-monument`, `.kicker` (kategori),
  meta satırı (yazar · tarih · okuma süresi), `.gold-rule`.
- Gövde ilk paragrafına `.dropcap`.
- Serif H2 başlıklar; `@tailwindcss/typography` `prose` ayarı anıtsal tona göre
  rafine edilir.
- **İçindekiler** (`src/components/public/IcindekilerTablosu.tsx`) Roma rakamlı
  kenar-rayı olarak restyle; mevcut IntersectionObserver aktif-başlık mantığı
  korunur.
- `YazarKarti`, `IlgiliMakaleler`, `PaylasimButonlari`, `Breadcrumb` anıtsal
  dile uyarlanır.

### 5.5 Arşiv / Kategori / Yazar / Etiket
- `src/app/(public)/makaleler/page.tsx`, `kategori/[slug]`, `yazar/[slug]`,
  `etiket/[tag]`: anıtsal sayfa başlıkları + **tablet kart** ızgarası.
- `src/components/public/MakaleKart.tsx`: `.tablet-card` varyantına geçer
  (2px altın üst-hat, köşede `.roman-watermark` opsiyonel, serif başlık).
- Filtre bileşenleri (`KategoriFiltre`, `KategoriDropdown`, `KategoriFiltreClient`)
  ve `.pill` stilleri korunur; yalnız anıtsal tona hizalanır.

### 5.6 İletişim / Arama
- `src/app/(public)/iletisim/page.tsx`: anıtsal başlık + ölçülü kartlar.
  (İletişim formu/WhatsApp davranışı bu kapsamda değil; yalnız görsel.)
- `src/app/(public)/ara/AraClient.tsx`: anıtsal başlık + sonuç listesi
  tablet/satır diline hizalanır.

## 6. Erişilebilirlik

- `--color-muted-dim` kontrast düzeltmesi (bkz. §4).
- Tüm dekoratif motifler (`.arch-motif`, Roma filigranları) `aria-hidden`.
- Mevcut `focus-visible`, skip-link, `prefers-reduced-motion`, FAQ
  `aria-expanded` davranışları korunur — yeni eklenen interaktif öğeler aynı
  standarda uyar.
- Drop-cap görsel; ekran okuyucuda kelime bütünlüğü bozulmaz (tek `<p>` içinde
  ilk harf stillenir, ayrı düğüm olarak okutulmaz).

## 7. Kapsam Dışı / Gelecek İşler

- **"Mevzuat & kaynaklar" bloğu** (makale okuma mockup'ında gösterildi): küçük
  bir `references` veri alanı gerektirir → bu sunumsal turun dışında, opsiyonel
  gelecek işi. Yalnız veri varsa render edilecek şekilde sonradan eklenebilir.
- **Güvenlik sertleştirme paketi** (ayrı spec) — ertelendi.
- Footer ölü link/sosyal düzeltmeleri, iletişim formu, ISR/performans — ayrı
  yol haritası kalemleri.

## 8. Kısıtlar ve İlkeler

- CSS-öncelikli; veri/şema değişikliği yok; yeni bağımlılık yok.
- Performans nötr — motifler saf CSS, ekstra ağ yükü yok.
- AGENTS.md: bu Next sürümü farklı olabilir; uygulamada `next/font` ve
  `next/image` konvansiyonları `node_modules/next/dist/docs/` üzerinden teyit
  edilecek.

## 9. Doğrulama

- `npm run lint`, `tsc --noEmit`, `next build` temiz geçmeli.
- **Canlı dev-server önizlemesiyle her yüzeyde görsel doğrulama** — bu redesign'da
  kritik. Her ana yüzey için "önce/sonra" ekran görüntüsü alınıp onaylanır.
- Mobil + masaüstü responsive kontrol; `prefers-reduced-motion` ile animasyon
  kapanışı kontrol; klavye/odak akışı kontrol.

## 10. Riskler

- **Tutarlılık riski:** çok sayıda yüzey; paylaşılan yardımcı sınıf katmanı
  (DRY) bunu azaltır — her yüzey aynı `.display-monument`/`.gold-rule`/
  `.tablet-card` dilini miras alır.
- **"Büro" havasına kayma riski:** Anıtsal yön akademik blog kimliğinden fazla
  uzaklaşabilir; ölçülü altın ve serif öncelik korunarak akademik ton
  muhafaza edilir.
- **Regresyon riski:** mevcut sınıflar korunur, yeni sınıflar eklenir; eski
  görünüm kırılmadan kademeli geçiş mümkün.
