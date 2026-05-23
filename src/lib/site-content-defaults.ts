/**
 * Site içeriği varsayılanları.
 * Hem seed kaynağı (scripts/seed-site-content.ts) hem de DB erişilemediğinde
 * getSiteContent() fallback'i. İçerik mevcut site-data.ts + site-config.ts +
 * component içi gömülü metinlerden port edildi.
 */

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
      {
        value: `${new Date().getFullYear() - since + 1}.`,
        label: "Yıl · sürekli yazım",
      },
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
  faq: {
    kicker: "Sık Sorulan Sorular",
    heading: "Aklınızdaki *ilk sorular.*",
    items: FAQ,
  },
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
