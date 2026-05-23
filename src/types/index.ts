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

// --- Site içeriği (CMS) ---

export interface ICta {
  label: string;
  href: string;
}
export interface IIconItem {
  icon: string;
  title: string;
  description: string;
}
export interface IStep {
  number: string;
  title: string;
  description: string;
}
export interface IStat {
  value: string;
  label: string;
}
export interface IBadge {
  icon: string;
  label: string;
}
export interface INavLink {
  label: string;
  href: string;
}

export interface ISiteContent {
  key: "main";
  hero: {
    kicker: string;
    heading: string;
    subtext: string;
    primaryCta: ICta;
    secondaryCta: ICta;
    badges: IBadge[];
  };
  trusts: { kicker: string; heading: string; intro: string; items: IIconItem[] };
  areas: { kicker: string; heading: string; intro: string; items: IIconItem[] };
  process: { kicker: string; heading: string; intro: string; items: IStep[] };
  about: {
    kicker: string;
    heading: string;
    body: string;
    portraitImage: string;
    stats: IStat[];
  };
  urgent: {
    kicker: string;
    heading: string;
    body: string;
    emailKanal: { label: string; value: string };
    secondaryCta: ICta;
  };
  faq: { kicker: string; heading: string; items: IFaq[] };
  hakkimda: {
    title: string;
    body: string;
    avatarImage: string;
    metaDescription: string;
  };
  contact: {
    phone: string;
    phoneRaw: string;
    whatsapp: string;
    email: string;
    address: { line1: string; line2: string; postalCode: string };
  };
  professional: { barosicil: string; since: number; experienceLabel: string };
  author: { name: string; jobTitle: string; knowsAbout: string[]; bio: string };
  nav: INavLink[];
  seo: { brand: string; brandShort: string; tagline: string; description: string };
}
