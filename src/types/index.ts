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
