# Tarık Mirza — Hukuk Makale Platformu Tasarım Dokümanı

## Proje Özeti

Ceza hukuku odaklı kişisel makale platformu. Site sahibi Tarık Mirza, hukuk öğrencisi ve gelecekte avukat. Site, profesyonel ve güven veren bir görünümle hukuk makalelerinin yayınlandığı bir içerik platformu olacak.

**Hedef kitle:** Hukuk öğrencileri, hukukla ilgilenen kişiler, ceza hukuku alanına meraklı kullanıcılar.

**Site dili:** Tamamen Türkçe (menüler, butonlar, URL'ler, içerik).

---

## Teknoloji Stack'i

| Katman | Teknoloji |
|--------|-----------|
| Framework | Next.js (App Router, TypeScript) |
| Veritabanı | MongoDB + Mongoose |
| Kimlik Doğrulama | NextAuth.js |
| Zengin Metin Editörü | TipTap |
| Stil | Tailwind CSS |
| Görsel Yükleme | Lokal upload (`public/uploads`), ileride Cloudinary'ye geçilebilir |

**Neden Next.js Full-Stack:** SEO hukuk makaleleri için kritik. SSR/SSG ile makaleler Google'da bulunabilir. Tek proje olması geliştirme ve bakımı kolaylaştırıyor. Bu ölçekte ayrı backend gereksiz karmaşıklık.

---

## Klasör Yapısı

```
tarik-site/
├── src/
│   ├── app/
│   │   ├── (public)/                   # Ziyaretçi sayfaları
│   │   │   ├── page.tsx                # Ana sayfa
│   │   │   ├── makale/[slug]/page.tsx  # Makale detay
│   │   │   ├── kategori/[slug]/page.tsx# Kategori sayfası
│   │   │   ├── hakkimda/page.tsx       # Hakkımda
│   │   │   ├── iletisim/page.tsx       # İletişim
│   │   │   └── ara/page.tsx            # Arama sonuçları
│   │   ├── admin/                      # Admin panel (korumalı)
│   │   │   ├── giris/page.tsx          # Admin giriş
│   │   │   ├── page.tsx                # Dashboard
│   │   │   ├── makaleler/page.tsx      # Makale listesi
│   │   │   ├── makaleler/yeni/page.tsx # Yeni makale
│   │   │   ├── makaleler/[id]/page.tsx # Makale düzenleme
│   │   │   ├── kategoriler/page.tsx    # Kategori yönetimi
│   │   │   └── yazarlar/page.tsx       # Yazar yönetimi
│   │   ├── api/                        # API Route Handlers
│   │   │   ├── auth/[...nextauth]/     # NextAuth
│   │   │   ├── makaleler/              # Makale CRUD
│   │   │   ├── kategoriler/            # Kategori CRUD
│   │   │   ├── upload/                 # Görsel yükleme
│   │   │   └── ara/                    # Arama endpoint
│   │   └── layout.tsx                  # Root layout
│   ├── components/
│   │   ├── public/                     # Ziyaretçi componentleri
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── MakaleKart.tsx
│   │   │   ├── HeroAlani.tsx
│   │   │   ├── KategoriFiltre.tsx
│   │   │   ├── IlgiliMakaleler.tsx
│   │   │   ├── IcindekilerTablosu.tsx
│   │   │   ├── YazarKarti.tsx
│   │   │   ├── PaylasimButonlari.tsx
│   │   │   └── AramaBar.tsx
│   │   └── admin/                      # Admin componentleri
│   │       ├── AdminSidebar.tsx
│   │       ├── MakaleEditoru.tsx
│   │       ├── MakaleListesi.tsx
│   │       └── KategoriForm.tsx
│   ├── lib/
│   │   ├── db.ts                       # MongoDB bağlantısı
│   │   ├── auth.ts                     # NextAuth config
│   │   └── utils.ts                    # Yardımcı fonksiyonlar (slug, okuma süresi vb.)
│   ├── models/
│   │   ├── Makale.ts
│   │   ├── Kategori.ts
│   │   └── Kullanici.ts
│   └── types/
│       └── index.ts
├── public/
│   └── uploads/
├── tailwind.config.ts
├── next.config.ts
└── package.json
```

---

## Veri Modelleri

### Makale

```typescript
{
  title: string              // Makale başlığı
  slug: string               // URL-friendly (unique)
  excerpt: string            // Kısa özet
  content: string            // TipTap'ten gelen HTML
  coverImage: string         // Kapak görseli URL'i
  category: ObjectId         // Kategori referansı
  author: ObjectId           // Yazar referansı
  status: "taslak" | "yayinda"
  readingTime: number        // Dakika (otomatik hesaplanan)
  tags: string[]             // Opsiyonel etiketler
  createdAt: Date
  updatedAt: Date
}
```

### Kategori

```typescript
{
  name: string               // "Ceza Genel Hukuku"
  slug: string               // "ceza-genel-hukuku" (unique)
  description: string        // Kategori açıklaması
  order: number              // Sıralama
  createdAt: Date
}
```

### Kullanıcı

```typescript
{
  name: string               // "Tarık Mirza"
  email: string              // Giriş için (unique)
  password: string           // bcrypt ile hashlenmiş
  role: "admin" | "yazar"    // admin: tam yetki, yazar: sadece kendi makaleleri
  bio: string                // Kısa biyografi
  avatar: string             // Profil fotoğrafı URL'i
  createdAt: Date
}
```

**Kararlar:**
- `readingTime` makale kaydedilirken kelime sayısından otomatik hesaplanır (~200 kelime/dk)
- `slug` başlıktan otomatik oluşturulur, manuel düzenlenebilir
- `content` TipTap editöründen gelen HTML olarak saklanır
- Şifre bcrypt ile hashlenir

---

## Sayfa Yapısı

### Ziyaretçi Sayfaları

| Sayfa | URL | Açıklama |
|-------|-----|----------|
| Ana sayfa | `/` | Öne çıkan makale + grid layout, kategori filtreleme |
| Makale detay | `/makale/[slug]` | Tam makale okuma deneyimi |
| Kategori | `/kategori/[slug]` | Kategoriye ait makaleler |
| Hakkımda | `/hakkimda` | Tarık Mirza hakkında bilgi |
| İletişim | `/iletisim` | İletişim formu veya bilgileri |
| Arama | `/ara?q=...` | Arama sonuçları |

### Admin Sayfaları

| Sayfa | URL | Açıklama |
|-------|-----|----------|
| Giriş | `/admin/giris` | E-posta + şifre ile giriş |
| Dashboard | `/admin` | Genel istatistikler |
| Makale listesi | `/admin/makaleler` | Tablo görünümü, arama, filtreleme |
| Yeni makale | `/admin/makaleler/yeni` | TipTap editörü ile makale oluşturma |
| Makale düzenleme | `/admin/makaleler/[id]` | Mevcut makaleyi düzenleme |
| Kategoriler | `/admin/kategoriler` | Kategori CRUD |
| Yazarlar | `/admin/yazarlar` | Yazar yönetimi (sadece admin) |

---

## Tasarım Kararları

### Genel Görsel Dil: Temiz & Modern

- **Zemin:** Beyaz (#ffffff)
- **Ana metin:** Koyu (#111827)
- **İkincil metin:** Gri (#6b7280)
- **Vurgu rengi:** Mavi (#1a56db)
- **Hafif arka plan:** Açık gri (#f3f4f6)
- **Kenarlık:** Çok hafif (#e5e7eb)

**Tipografi:** Sans-serif (Inter veya system-ui). Başlıklar kalın ve büyük, gövde metni okunaklı satır yüksekliği (1.8+). Kategori etiketleri büyük harfli, küçük punto, letter-spacing ile.

**Genel hissi:** Medium / modern hukuk firması web sitesi. Minimal, keskin, profesyonel. Gereksiz süs yok, kalite odaklı.

### Ana Sayfa Layout'u: Öne Çıkan + Grid

- En üstte öne çıkan (featured) makale — büyük alan, dikkat çekici
- Altında kategori filtreleme (pill butonlar)
- 2 sütunlu makale kartları grid'i
- Her kartta: kapak görseli, kategori etiketi, başlık, okuma süresi
- Hover durumlarında hafif yükselme veya gölge efekti

### Makale Detay Sayfası

Yukarıdan aşağıya akış:
1. Kategori etiketi (mavi, büyük harfli)
2. Başlık (32px, font-weight 800)
3. Özet paragrafı (17px, gri)
4. Yazar bilgisi: avatar + isim + tarih + okuma süresi + paylaşım butonları (X, LinkedIn, link kopyala)
5. Kapak görseli (geniş, yuvarlatılmış köşeler)
6. İçerik alanı: sol tarafta makale metni, sağ tarafta yapışkan İçindekiler tablosu
7. İçerik biçimlendirmesi: başlıklar (h2, h3), paragraflar, alıntı blokları (sol mavi kenarlık), listeler
8. Yazar kartı (makalenin altında, gri arka planlı biyografi kutusu)
9. İlgili Makaleler (aynı kategoriden 2 öneri kartı)

**Max genişlik:** İçerik alanı 680px, kapak görseli 780px — Medium benzeri dar okuma alanı.

### Admin Panel

- **Sol sidebar:** Koyu (#111827) navigasyon — Genel Bakış, Makaleler, Kategoriler, Yazarlar
- **Makale editörü:** İki sütunlu layout
  - Sol: Başlık alanı + özet alanı + TipTap zengin metin editörü (kalın, italik, altı çizili, H2, H3, sıralı/sırasız liste, alıntı, görsel ekleme, link)
  - Sağ panel (280px): Kapak görseli yükleme (sürükle-bırak), kategori seçimi (dropdown), slug düzenleme, durum seçimi (taslak/yayında)
- **Üst bar:** "Taslak Kaydet" ve "Yayınla" butonları
- **Makale listesi:** Tablo görünümü, başlık/durum/kategori/tarih sütunları, arama, filtreleme

---

## Makale Detay Özellikleri

- **Okuma süresi:** Otomatik hesaplanan, makale meta'sında gösterilen
- **İçindekiler tablosu:** İçerikteki h2/h3'lerden otomatik oluşturulan, sağ tarafta yapışkan (sticky)
- **İlgili makaleler:** Aynı kategorideki diğer makalelerden 2 öneri
- **Paylaşım butonları:** X (Twitter), LinkedIn, link kopyala
- **Yazar kartı:** Makalenin altında avatar + isim + biyografi

---

## Kimlik Doğrulama & Yetkilendirme

- NextAuth.js Credentials provider ile e-posta + şifre girişi
- **admin** rolü: Tüm CRUD işlemleri, yazar yönetimi, kategori yönetimi
- **yazar** rolü: Sadece kendi makalelerini oluşturma, düzenleme, silme
- Admin sayfaları middleware ile korunur — giriş yapmamış kullanıcılar `/admin/giris`'e yönlendirilir
- İlk kurulumda seed script ile varsayılan admin kullanıcısı oluşturulur

---

## Arama

- API endpoint: `/api/ara?q=sorgu`
- MongoDB text index kullanarak başlık ve içerik üzerinde arama
- Sonuçlar makale kartları olarak listelenir
- Header'da arama ikonu, tıklandığında arama sayfasına yönlendirme

---

## Responsive Tasarım

- **Masaüstü:** 2 sütunlu grid, İçindekiler tablosu görünür, geniş boşluklar
- **Tablet:** 2 sütunlu grid korunur, boşluklar azalır
- **Mobil:** Tek sütun, İçindekiler tablosu makalenin üstüne taşınır (açılır-kapanır), hamburger menü
