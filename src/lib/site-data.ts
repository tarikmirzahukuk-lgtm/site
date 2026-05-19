/**
 * Landing page statik içeriği.
 * "Av. Tarık Yılmaz" placeholder'ı yerine "Tarık Mirza" — hukuk öğrencisi/araştırmacı.
 * Metrikler ve deneyim ifadeleri akademik tona uyarlandı.
 */

export interface NavLink {
  href: string;
  label: string;
}

export const NAV: NavLink[] = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/makaleler", label: "Makaleler" },
  { href: "/hakkimda", label: "Hakkımda" },
  { href: "/#uzmanlik", label: "İlgi Alanları" },
  { href: "/#surec", label: "Yaklaşım" },
  { href: "/#sss", label: "SSS" },
  { href: "/iletisim", label: "İletişim" },
];

export interface TrustItem {
  icon: string;
  title: string;
  description: string;
}

export const TRUSTS: TrustItem[] = [
  {
    icon: "shield",
    title: "Akademik Titizlik",
    description:
      "Her makale içtihat, doktrin ve mevzuat referanslarıyla destekli.",
  },
  {
    icon: "lightning",
    title: "Güncel Takip",
    description:
      "Yargıtay kararları ve mevzuat değişiklikleri haftalık takip edilir.",
  },
  {
    icon: "strategy",
    title: "Kavramsal Analiz",
    description:
      "Yüzeyde kalmayan, ceza hukuku dogmatik tartışmalarına inen yaklaşım.",
  },
  {
    icon: "pillar",
    title: "Sürekli Çalışma",
    description:
      "Lisans ve sonrasında düzenli araştırma; alanda derinleşen ilgi.",
  },
];

export interface AreaItem {
  icon: string;
  title: string;
  description: string;
}

export const AREAS: AreaItem[] = [
  {
    icon: "gavel",
    title: "Ağır Ceza Davaları",
    description:
      "Kasten öldürme, yaralama, yağma; ağır ceza usulü ve içtihat.",
  },
  {
    icon: "doc",
    title: "Uyuşturucu Suçları",
    description:
      "Kullanım/ticaret ayrımı, miktar değerlendirmesi, etkin pişmanlık.",
  },
  {
    icon: "scale",
    title: "Dolandırıcılık Suçları",
    description:
      "Bilişim ve nitelikli dolandırıcılık dahil ekonomik suç tartışmaları.",
  },
  {
    icon: "shield",
    title: "Kasten Yaralama",
    description:
      "Kastın derecesi, olası kast – bilinçli taksir sınır tartışmaları.",
  },
  {
    icon: "eye",
    title: "Özel Hayatın Gizliliği",
    description:
      "TCK 132–138 ve bilişim çağında kişisel veri suçları analizi.",
  },
  {
    icon: "handcuff",
    title: "Tutukluluk Hukuku",
    description:
      "Kuvvetli şüphe denetimi; sulh ceza ve ağır ceza itiraz yolu.",
  },
  {
    icon: "user",
    title: "İfade ve Sorgu Süreçleri",
    description:
      "CMK 147 güvenceleri, susma hakkı, müdafi katılımı.",
  },
];

export interface StepItem {
  number: string;
  title: string;
  description: string;
}

export const STEPS: StepItem[] = [
  {
    number: "01",
    title: "Konu Seçimi",
    description:
      "Güncel bir hukuki sorun veya tartışmalı içtihat — yazı için odak belirlenir.",
  },
  {
    number: "02",
    title: "Kaynak Taraması",
    description:
      "Doktrin, içtihat ve karşılaştırmalı kaynaklar taranır; not edilir.",
  },
  {
    number: "03",
    title: "Yazım & Argüman",
    description:
      "Tartışma yapısı kurulur; tezler içtihat ve doktrin referansıyla desteklenir.",
  },
  {
    number: "04",
    title: "Yayım & Geri Dönüş",
    description:
      "Yazı yayımlanır; okuyucu yorumları ve eleştiriler değerlendirilir.",
  },
];

export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQ: FaqItem[] = [
  {
    question: "Bu site bir hukuk bürosu mu?",
    answer:
      "Hayır. Burası akademik bir blog — ceza hukuku alanında araştırma yapan bir hukuk öğrencisinin yazı arşivi. Dava takibi, danışmanlık veya iş kabulü yapılmamaktadır.",
  },
  {
    question: "Burada paylaşılan içerikler hukuki tavsiye midir?",
    answer:
      "Hayır. Tüm içerikler genel bilgilendirme ve akademik tartışma amaçlıdır. Somut bir hukuki sorununuz varsa bir avukata danışmanız zorunludur.",
  },
  {
    question: "Yazılarınızı kaynak gösterebilir miyim?",
    answer:
      "Evet. Akademik atıf kurallarına (yazar, başlık, yayın tarihi, URL) uyduğunuz sürece serbestçe kaynak gösterebilirsiniz. Doğrudan alıntılar için tırnak içine alıp atıf yapmanız yeterli.",
  },
  {
    question: "Bir konuyu önerebilir miyim?",
    answer:
      "Elbette. İletişim sayfasındaki e-posta üzerinden konu önerinizi iletebilirsiniz. Akademik ilgi alanıma uyan konular yazı sırasına eklenir.",
  },
];
