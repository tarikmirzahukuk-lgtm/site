# Site İçeriği CMS — Tasarım Belgesi

**Tarih:** 2026-05-23
**Proje:** tarik-site (Tarık Mirza · Ceza Hukuku)
**Durum:** Onaylandı, implementasyon planı bekleniyor

---

## 1. Arka Plan ve Motivasyon

Public sitenin metinleri şu an **iki yerde sabit (hardcoded)**:

- **Yapısal veri:** `src/lib/site-data.ts` (NAV, TRUSTS, AREAS, STEPS, FAQ) ve `src/lib/site-config.ts` (marka, iletişim, mesleki/yazar bilgisi).
- **Component içine gömülü düz metin:** Hero başlığı/alt metni, About biyografi paragrafları + istatistikler, Hakkımda sayfası paragrafları, Urgent çağrı metni, ve her bölümün kicker + `<h2>` başlığı (`Areas`, `Process`, `Faq`, `Trusts`).

Ayrıca site **placeholder dolu**: telefon `+90 000 000 00 00`, e-posta `tarik@example.com`, adres "Adres bilgisi", baro sicil "TBD", foto yerine "TM"/"T" monogramı. Her güncelleme bir kod değişikliği + deploy gerektiriyor.

Bu tasarım, sahibinin (admin) **tüm public içeriği panelden düzenleyip anında yayında görebileceği** bir içerik yönetim katmanı (CMS) kurar — deploy gerekmeden, sitenin geri kalanıyla (MongoDB + admin paneli + NextAuth) aynı mimaride.

## 2. Hedefler ve Hedef-Dışılar

### Hedefler

- Admin, ana sayfanın **7 bölümünü**, Hakkımda sayfasını, iletişim/mesleki bilgileri, navigasyon menüsünü ve genel SEO ayarlarını panelden düzenleyebilir.
- Kaydet'e basınca değişiklik **deploy'suz** yayında görünür (statik performans korunur).
- Uzun metinlerde (Hakkımda gövdesi, About, Urgent) zengin metin (kalın, italik, link, başlık, madde) — mevcut TipTap editörü yeniden kullanılır.
- Gerçek **portre/avatar fotoğrafı** yüklenebilir (monogram yerine).
- Mevcut tüm içerik (placeholder'lar dahil) DB'ye taşınır; hiçbir metin kaybolmaz, başlangıç değeri olur.
- Listeler (Areas, Trusts, Steps, FAQ, Nav) **ekle / sil / sırala** edilebilir.
- Başlıklardaki **altın-italik vurgu** korunur ve düzenlenebilir.

### Hedef-dışılar (YAGNI)

- Genel "page builder" / sürükle-bırak bölüm sistemi — bölüm seti sabit ve bilinen.
- Çoklu dil — site sadece Türkçe.
- Versiyonlama / taslak-yayın akışı içerik için — anlık kaydet yeterli.
- Yeni bir görsel depolama altyapısı — mevcut `/api/upload` yeniden kullanılır (bkz. §9 Riskler).
- Makale/Kategori/Yazar yönetimi — zaten mevcut, dokunulmaz.

## 3. Mimari Genel Bakış

**Yaklaşım A (onaylandı):** MongoDB'de tipli içerik + anlık yenileme (on-demand revalidation).

```
Admin form (client)
   │  PUT /api/site-content  (NextAuth admin guard)
   ▼
SiteContent (Mongo, singleton: key="main")
   │  save sonrası revalidateTag("site-content")
   ▼
getSiteContent()  ── önbellekli server accessor (cache tag: "site-content")
   ▼
Public server component'ler (Hero, Areas, … , hakkimda, iletisim, Header, Footer)
   props ile içerik alır → renderAccent() ile altın vurgu uygulanır
```

- **Tek yazı kaynağı:** `SiteContent` singleton dökümanı.
- **Okuma:** `getSiteContent()` — Next 16 önbellekleme API'siyle (`"use cache"` / `cacheTag`, **implementasyondan önce `node_modules/next/dist/docs` okunacak**, AGENTS.md gereği) sarmalanır, tag `"site-content"`.
- **Yazma:** `/api/site-content` PUT; başarıdan sonra `revalidateTag("site-content")` çağrılır → public sayfalar bir sonraki istekte tazelenir, statik kalır.
- `SITE_URL` env'de kalır (yapısal/derleme-kritik). Sadece *görüntülenen* içerik DB'ye taşınır.

## 4. Veri Modeli

Tek `SiteContent` koleksiyonu, tek döküman (`key: "main"`, `unique`). Mongoose deseni `Makale` modeliyle birebir: alt objeler `_id:false` alt-şemalarla, `mongoose.models.SiteContent || mongoose.model(...)` guard'ı, `{ timestamps:true }`. TS arayüzleri `src/types/index.ts`'e eklenir.

### 4.1 Şema (TS arayüzü olarak)

```ts
interface ICta { label: string; href: string; }
interface IIconItem { icon: string; title: string; description: string; } // Trusts, Areas
interface IStep { number: string; title: string; description: string; }   // Process
interface IStat { value: string; label: string; }                          // About
interface IBadge { icon: string; label: string; }                          // Hero reassurance
interface INavLink { label: string; href: string; }

interface ISiteContent {
  key: "main";

  hero: {
    kicker: string;            // "İstanbul · 2024'ten beri" (serbest metin)
    heading: string;           // "Ceza Hukukunda *titiz ve içtihat odaklı* analiz."
    subtext: string;
    primaryCta: ICta;
    secondaryCta: ICta;
    badges: IBadge[];
  };
  trusts:  { kicker: string; heading: string; intro: string; items: IIconItem[]; };
  areas:   { kicker: string; heading: string; intro: string; items: IIconItem[]; };
  process: { kicker: string; heading: string; intro: string; items: IStep[]; };
  about: {
    kicker: string; heading: string;
    body: string;              // zengin HTML (TipTap)
    portraitImage: string;     // "" => monogram fallback
    stats: IStat[];
  };
  urgent: {
    kicker: string; heading: string; body: string;
    emailKanal: { label: string; value: string };   // value = e-posta
    secondaryCta: ICta;
  };
  faq: { kicker: string; heading: string; items: IFaq[]; };  // IFaq mevcut

  hakkimda: {
    title: string;
    body: string;              // zengin HTML (TipTap)
    avatarImage: string;       // "" => monogram fallback
    metaDescription: string;
  };

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

### 4.2 Altın-italik vurgu konvansiyonu

Başlık/kicker metninde bir ifadeyi `*...*` ile sarmak onu render'da `<span class="italic-gold">` yapar.

- Yardımcı: `renderAccent(text: string): ReactNode` — metni `*` üzerinden böler, tek-indeksli (vurgulu) parçaları `italic-gold` span'e sarar, çift-indeksli parçaları düz bırakır.
- Hero gibi ortadaki vurgular da çözülür: `Ceza Hukukunda *titiz ve içtihat odaklı* analiz.`
- `*` içermeyen metin olduğu gibi render edilir (geriye dönük güvenli).

### 4.3 İstatistik trade-off (About)

About'un ilk istatistiği şu an otomatik (`bugünküYıl − since + 1`). Tam düzenleme için 3 istatistik de **serbest metin** (`value` + `label`) olur; otomatik artış kalkar. (Seed sırasında mevcut hesaplanan değer string olarak yazılır.)

## 5. Seed / Migrasyon

`scripts/seed-site-content.ts` (mevcut `scripts/seed-admin.ts` deseninde, `tsx` ile çalışır; `package.json`'a `seed:site-content` script'i eklenir):

- `site-data.ts` + `site-config.ts` + component'lerdeki gömülü metinleri tek `SiteContent` dökümanına yazar (`upsert`, `key:"main"`).
- Idempotent: tekrar çalıştırınca mevcut dökümanı bozmadan eksik alanları tamamlar (varsayılan: yoksa yaz, varsa dokunma — `--force` ile üzerine yaz).
- Bu, "gerçek/realist" başlangıç noktasıdır: admin sonra panelden gerçek değerlerle (telefon, e-posta, foto) günceller.

## 6. API

`src/app/api/site-content/route.ts` (mevcut `/api/makaleler` deseni):

| Metot | Yetki | Davranış |
|---|---|---|
| `GET` | Public | `SiteContent` dökümanını döner (yoksa 404 → seed çalıştırılmamış demektir). Esasen admin formu için; public sayfalar `getSiteContent()` accessor'ını kullanır. |
| `PUT` | Admin (`getServerSession`) | Body'yi doğrular, dökümanı `findOneAndUpdate({key:"main"}, …, {upsert:true})` ile günceller, başarıda `revalidateTag("site-content")` çağırır, güncel dökümanı döner. |

- Auth guard mevcut desen: `session` yoksa `401 {error:"Yetkisiz"}`.
- JSON parse try/catch → `400 {error:"Geçersiz istek"}`.
- Hata → `500 {error: message}`. (Singleton + upsert olduğu için 11000 düplikasyon beklenmez; yine de yakalanır.)

## 7. Admin Arayüzü

- **Sidebar:** `AdminSidebar.tsx`'e yeni öğe — "Site İçeriği" (`/admin/site-icerik`).
- **Sayfa:** `src/app/admin/site-icerik/page.tsx` — client component. Yüklemede `GET /api/site-content`, kaydet `PUT`.
- **Sekmeler:** Ana Sayfa · Hakkımda · İletişim · Ayarlar (basit sekme state'i; mevcut dark+gold form sınıfları: `inputClass`/`labelClass`/`panelClass`).
- **Bileşenler (yeniden kullanım/yeni):**
  - Kısa alanlar → mevcut input/label desenleri.
  - Uzun metin (About body, Urgent body, Hakkımda body) → mevcut `MakaleEditoru` (TipTap) yeniden kullanılır.
  - Liste editörleri (Areas, Trusts, Steps, FAQ, Nav, Badges, Stats) → `FaqEditor` deseninde ekle/sil; sıralama yukarı/aşağı butonu.
  - İkon alanları → mevcut `Icon` setinden (`IconName`) açılır menü.
  - Görsel (portraitImage, avatarImage) → mevcut `/api/upload` + makale kapak görseli yükleme UX'i.
- **Kaydet:** tek "Kaydet" tüm dökümanı PUT'lar; başarı/hata mesajı mevcut error pattern'iyle gösterilir.

## 8. Public Tarafın Yeniden Bağlanması

Bölüm component'leri şu an `site-data`/`site-config`'ten içe aktarıyor. Yeni akış: **server sayfası `getSiteContent()` çağırır, ilgili alt-objeyi props olarak bölüme geçirir.** Düzenlenecekler:

- `src/app/(public)/page.tsx` — `getSiteContent()` → Hero/Trusts/Areas/Process/About/Urgent/Faq'a props.
- Bölüm component'leri (`home/*.tsx`) — sabit import yerine props alır; `renderAccent()` kullanır. `Faq` "use client" kalır ama veriyi props'tan alır.
- `src/app/(public)/hakkimda/page.tsx` — DB body (zengin HTML) + avatar + meta.
- `src/app/(public)/iletisim/page.tsx` — contact bilgisi DB'den.
- `Header.tsx` / `Footer.tsx` — nav + iletişim/marka DB'den (server component).
- **SEO katmanı:** `buildMetadata`/`jsonld` şu an `SITE_CONFIG`'i senkron import ediyor. Düzenlenebilir alanlar (description, brand, author bio, contact) için `generateMetadata` async olarak `getSiteContent()` okur. `SITE_URL` ve `metadataBase` env'de kalır.
- **Geriye dönük güvenlik:** `site-config.ts`/`site-data.ts` DB boşsa fallback olarak kalabilir; ama seed sonrası DB tek kaynaktır. (Plan aşamasında: sabit dosyalar fallback mı yoksa kaldırılsın mı netleşir — varsayılan: fallback olarak bırak, böylece DB erişilemezse site çökmemiş olur.)

## 9. Hata Yönetimi, Uç Durumlar, Riskler

- **DB erişilemez / döküman yok:** `getSiteContent()` `site-config`/`site-data` sabit değerlerine düşer (fallback). Site asla boş render etmez.
- **Eksik alan:** Şema `default` değerleri + accessor'da güvenli erişim. Yeni alan eklenince seed `--force` ya da kısmi default.
- **Vercel ephemeral upload (RİSK):** `/api/upload` dosyayı `public/uploads`'a yazıyor; Vercel serverless'te bu **kalıcı değil** — yüklenen foto deploy sonrası kaybolabilir. Bu mevcut makale kapak görsellerinde de geçerli, yeni bir sorun değil. Bu spec kapsamında çözülmüyor; ileride kalıcı depolama (S3/Cloudinary/Vercel Blob) ayrı iş. Kısa vadede: foto URL alanı manuel de girilebilir.
- **revalidate başarısızlığı:** PUT içeriği kaydettikten sonra revalidate hata verirse içerik yine de kayıtlı; en kötü ihtimalle bir sonraki doğal ISR/yeniden derlemede güncellenir.
- **Yetkisiz erişim:** PUT NextAuth guard'lı. (İsteğe bağlı sıkılaştırma: `role==="admin"` — mevcut rotalar yapmıyor, tutarlılık için opsiyonel.)

## 10. Test / Doğrulama

- `npm run build` temiz geçer (tip + derleme).
- `npm run lint` temiz.
- Manuel: seed çalıştır → panelde 4 sekme yüklenir → bir alan düzenle + foto yükle → kaydet → public sayfada anında görünür (revalidate).
- Accent: `renderAccent("a *b* c")` → "a", italik-altın "b", " c".
- Fallback: DB boşken public sayfa sabit fallback ile render eder.

## 11. Uygulama Sırası (özet — detay plan ayrı belgede)

1. Tipler (`types/index.ts`) + `SiteContent` modeli.
2. Seed script + ilk çalıştırma.
3. `getSiteContent()` accessor + `renderAccent()` yardımcısı (Next 16 cache dokümanı okunduktan sonra).
4. `/api/site-content` GET/PUT + revalidate.
5. Public component'leri props'a çevir + sayfaları bağla + SEO async.
6. Admin `/admin/site-icerik` sekmeli form + sidebar.
7. `npm run build` + manuel doğrulama.
