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
}

export interface IKullanici {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "yazar";
  bio: string;
  avatar: string;
  createdAt: string;
}
