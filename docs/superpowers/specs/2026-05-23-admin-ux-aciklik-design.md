# Admin Panel Anlaşılabilirlik İyileştirmesi — Tasarım Belgesi

**Tarih:** 2026-05-23
**Proje:** tarik-site
**Durum:** Onaylandı

## Sorun

Admin panel kullanımı zor:
1. **Editör araç çubuğu** sadece ikon; ne işe yaradığı denemeden anlaşılmıyor (bazı ikonlar zaten okunaksız).
2. **`/admin/site-icerik` formları** jargon dolu ("Kicker", "Hero", "Urgent"); `*...*` vurgu kuralı izah edilmemiş; alanın sitede nerede göründüğü belirsiz; örnek/yardım yok.

## Hedef

Bakar bakmaz anlaşılan, kendini açıklayan bir admin arayüzü. **Davranış, veri modeli ve public site değişmez** — yalnızca etiket/yardım/görünüm.

## Kapsam

### 1. Editör araç çubuğu (`MakaleEditoru.tsx`)
- `IconBtn`'e opsiyonel `label` prop'u: doluysa ikon **+ Türkçe yazı** yan yana gösterilir (örn. `B Kalın`).
- Tüm ana toolbar düğmeleri etiketli (Kalın, İtalik, Altı çizili, Üstü çizili, Kod, Sol/Orta/Sağ/Yasla, Madde/Sıralı/Alıntı/Kod bloğu/Çizgi, Alt simge/Üst simge, Görsel, Link, Geri/İleri, Temizle).
- Açılır menü tetikleyicileri yazılı: `Paragraf ▾`, `Renk ▾`, `Vurgu ▾`, `Boyut ▾`.
- İnce ayraçlarla gruplar; yapışkan üst çubuk ve kelime sayacı korunur.
- Bubble menü korunur ama etiketli-kompakt (Kalın · İtalik · Link · Vurgu).

### 2. CMS formları (`admin/site-icerik/page.tsx` + alan bileşenleri)
- `Text`/`Area` bileşenlerine `help?: string` (alan altında küçük açıklama).
- `Card` bileşenine `description?: string` (bölüm başında "sitede nerede/nasıl görünür").
- `ListEditor`'a `note?: string` (liste üstünde kısa açıklama).
- Jargon temizliği: Kicker→**Üst etiket**, Hero→**Üst Alan**, Urgent→**Çağrı Bölümü**, Trusts→**Güven Kartları**, Areas→**İlgi Alanları**, Process→**Süreç Adımları**, FAQ→**Sık Sorulan Sorular**.
- Başlık alanlarının yardımında `*vurgu*` kuralı örnekle: "Yıldız içine aldığın kelime sitede **altın renkte** çıkar — örn. `Ceza Hukukunda *titiz* analiz`".
- 4 sekmenin tamamı (Ana Sayfa / Hakkımda / İletişim / Ayarlar) aynı açıklayıcı dile kavuşur.

## Hedef-dışı (YAGNI)
- Canlı önizleme paneli.
- Yeni alan/özellik; kaydetme/revalidation mantığı değişmez.
- Public site veya makale içerik yapısı.

## Doğrulama
- `npx tsc --noEmit` temiz, `npm run build` yeşil, yeni kodda lint hatası yok.
- Manuel: panelde her düğmenin ne yaptığı yazıyla belli; her form alanının altında açıklama + nerede göründüğü görünür.
