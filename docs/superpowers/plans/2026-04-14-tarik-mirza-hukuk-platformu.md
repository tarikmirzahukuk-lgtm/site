# Tarık Mirza Hukuk Makale Platformu — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a professional criminal law article platform with a rich admin panel and a premium reading experience.

**Architecture:** Next.js 14 App Router full-stack. MongoDB with Mongoose for data. NextAuth for auth. TipTap for rich text editing. Tailwind CSS for styling. Public pages use SSR for SEO. Admin pages are client-side behind auth middleware.

**Tech Stack:** Next.js 14, TypeScript, MongoDB, Mongoose, NextAuth.js, TipTap, Tailwind CSS, bcryptjs

**Spec:** `docs/superpowers/specs/2026-04-14-tarik-mirza-hukuk-platformu-design.md`

---

## File Map

### Core Infrastructure
- `src/types/index.ts` — shared TypeScript interfaces
- `src/lib/db.ts` — MongoDB connection singleton
- `src/lib/auth.ts` — NextAuth configuration
- `src/lib/utils.ts` — slug generation, reading time calculation
- `src/models/Kullanici.ts` — User model
- `src/models/Kategori.ts` — Category model
- `src/models/Makale.ts` — Article model
- `src/middleware.ts` — admin route protection
- `scripts/seed.ts` — initial admin user + sample data

### API Routes
- `src/app/api/auth/[...nextauth]/route.ts` — NextAuth handler
- `src/app/api/kategoriler/route.ts` — GET all, POST create
- `src/app/api/kategoriler/[id]/route.ts` — GET one, PUT update, DELETE
- `src/app/api/makaleler/route.ts` — GET all, POST create
- `src/app/api/makaleler/[id]/route.ts` — GET one, PUT update, DELETE
- `src/app/api/upload/route.ts` — image upload
- `src/app/api/ara/route.ts` — search

### Admin Pages
- `src/app/admin/layout.tsx` — admin shell with sidebar
- `src/app/admin/giris/page.tsx` — login page
- `src/app/admin/page.tsx` — dashboard
- `src/app/admin/makaleler/page.tsx` — article list
- `src/app/admin/makaleler/yeni/page.tsx` — new article
- `src/app/admin/makaleler/[id]/page.tsx` — edit article
- `src/app/admin/kategoriler/page.tsx` — category management
- `src/app/admin/yazarlar/page.tsx` — author management
- `src/components/admin/AdminSidebar.tsx` — navigation sidebar
- `src/components/admin/MakaleEditoru.tsx` — TipTap editor wrapper
- `src/components/admin/MakaleListesi.tsx` — article table
- `src/components/admin/KategoriForm.tsx` — category CRUD form

### Public Pages
- `src/app/(public)/layout.tsx` — public shell with header/footer
- `src/app/(public)/page.tsx` — homepage
- `src/app/(public)/makale/[slug]/page.tsx` — article detail
- `src/app/(public)/kategori/[slug]/page.tsx` — category page
- `src/app/(public)/hakkimda/page.tsx` — about
- `src/app/(public)/iletisim/page.tsx` — contact
- `src/app/(public)/ara/page.tsx` — search results
- `src/app/layout.tsx` — root layout (Inter font, metadata)
- `src/components/public/Header.tsx` — top navigation
- `src/components/public/Footer.tsx` — site footer
- `src/components/public/MakaleKart.tsx` — article card
- `src/components/public/HeroAlani.tsx` — featured article hero
- `src/components/public/KategoriFiltre.tsx` — category pill filter
- `src/components/public/IcindekilerTablosu.tsx` — sticky TOC
- `src/components/public/YazarKarti.tsx` — author bio card
- `src/components/public/PaylasimButonlari.tsx` — share buttons
- `src/components/public/IlgiliMakaleler.tsx` — related articles
- `src/components/public/AramaBar.tsx` — search input

---

## Task 1: Project Scaffolding & Configuration

**Files:**
- Create: `package.json`, `tsconfig.json`, `tailwind.config.ts`, `next.config.ts`, `src/app/layout.tsx`, `src/app/globals.css`, `.env.local`, `.gitignore`

- [ ] **Step 1: Initialize Next.js project**

```bash
cd C:/Users/maest/Documents/tarik-site
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
```

Select defaults when prompted. This creates the base Next.js project with TypeScript, Tailwind, ESLint, App Router, and src directory.

- [ ] **Step 2: Install dependencies**

```bash
npm install mongoose next-auth@4 bcryptjs @tiptap/react @tiptap/starter-kit @tiptap/extension-image @tiptap/extension-link @tiptap/extension-underline @tiptap/extension-placeholder @tiptap/pm sharp
npm install -D @types/bcryptjs
```

- [ ] **Step 3: Create `.env.local`**

Create `src/../.env.local` (project root):

```env
MONGODB_URI=mongodb://localhost:27017/tarik-site
NEXTAUTH_SECRET=buraya-guclu-bir-secret-yazin-32-karakter
NEXTAUTH_URL=http://localhost:3000
```

- [ ] **Step 4: Configure `next.config.ts`**

Replace the contents of `next.config.ts`:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
  },
};

export default nextConfig;
```

- [ ] **Step 5: Set up Tailwind with custom design tokens**

Replace `tailwind.config.ts`:

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1a56db",
        "primary-dark": "#1544b0",
        dark: "#111827",
        "gray-text": "#6b7280",
        "gray-light": "#f3f4f6",
        "gray-border": "#e5e7eb",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      maxWidth: {
        content: "680px",
        "content-wide": "780px",
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "680px",
            lineHeight: "1.85",
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;
```

- [ ] **Step 6: Set up global CSS**

Replace `src/app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply text-dark antialiased;
  }

  h1, h2, h3, h4, h5, h6 {
    @apply font-bold text-dark;
  }
}

@layer components {
  .btn-primary {
    @apply bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-dark transition-colors;
  }

  .btn-secondary {
    @apply bg-white text-dark border border-gray-border px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-light transition-colors;
  }

  .kategori-etiketi {
    @apply text-xs font-semibold tracking-wider uppercase text-primary;
  }
}
```

- [ ] **Step 7: Set up root layout with Inter font**

Replace `src/app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Tarık Mirza | Ceza Hukuku Yazıları",
    template: "%s | Tarık Mirza",
  },
  description:
    "Ceza hukuku alanında akademik makaleler, içtihat değerlendirmeleri ve güncel hukuki analizler.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
```

- [ ] **Step 8: Update `.gitignore`**

Append to `.gitignore`:

```
.env.local
public/uploads/*
!public/uploads/.gitkeep
.superpowers/
```

- [ ] **Step 9: Create uploads directory**

```bash
mkdir -p public/uploads
touch public/uploads/.gitkeep
```

- [ ] **Step 10: Verify project runs**

```bash
npm run dev
```

Expected: Dev server starts at `http://localhost:3000` without errors.

- [ ] **Step 11: Commit**

```bash
git add -A
git commit -m "feat: project scaffolding — Next.js, Tailwind, dependencies"
```

---

## Task 2: TypeScript Types & Utility Functions

**Files:**
- Create: `src/types/index.ts`, `src/lib/utils.ts`

- [ ] **Step 1: Define shared TypeScript interfaces**

Create `src/types/index.ts`:

```typescript
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
```

- [ ] **Step 2: Implement utility functions**

Create `src/lib/utils.ts`:

```typescript
export function slugify(text: string): string {
  const turkishMap: Record<string, string> = {
    ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u",
    Ç: "c", Ğ: "g", İ: "i", Ö: "o", Ş: "s", Ü: "u",
  };

  return text
    .split("")
    .map((char) => turkishMap[char] || char)
    .join("")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function calculateReadingTime(htmlContent: string): number {
  const text = htmlContent.replace(/<[^>]*>/g, "");
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
```

- [ ] **Step 3: Commit**

```bash
git add src/types/index.ts src/lib/utils.ts
git commit -m "feat: TypeScript types and utility functions"
```

---

## Task 3: Database Connection & Mongoose Models

**Files:**
- Create: `src/lib/db.ts`, `src/models/Kullanici.ts`, `src/models/Kategori.ts`, `src/models/Makale.ts`

- [ ] **Step 1: Create MongoDB connection singleton**

Create `src/lib/db.ts`:

```typescript
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI ortam değişkeni tanımlı değil");
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

export default async function dbConnect(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
```

- [ ] **Step 2: Create Kullanici (User) model**

Create `src/models/Kullanici.ts`:

```typescript
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IKullaniciDoc extends Document {
  name: string;
  email: string;
  password: string;
  role: "admin" | "yazar";
  bio: string;
  avatar: string;
  createdAt: Date;
}

const KullaniciSchema = new Schema<IKullaniciDoc>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "yazar"], default: "yazar" },
  bio: { type: String, default: "" },
  avatar: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

const Kullanici: Model<IKullaniciDoc> =
  mongoose.models.Kullanici ||
  mongoose.model<IKullaniciDoc>("Kullanici", KullaniciSchema);

export default Kullanici;
```

- [ ] **Step 3: Create Kategori (Category) model**

Create `src/models/Kategori.ts`:

```typescript
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IKategoriDoc extends Document {
  name: string;
  slug: string;
  description: string;
  order: number;
  createdAt: Date;
}

const KategoriSchema = new Schema<IKategoriDoc>({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, default: "" },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

const Kategori: Model<IKategoriDoc> =
  mongoose.models.Kategori ||
  mongoose.model<IKategoriDoc>("Kategori", KategoriSchema);

export default Kategori;
```

- [ ] **Step 4: Create Makale (Article) model**

Create `src/models/Makale.ts`:

```typescript
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMakaleDoc extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: mongoose.Types.ObjectId;
  author: mongoose.Types.ObjectId;
  status: "taslak" | "yayinda";
  readingTime: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const MakaleSchema = new Schema<IMakaleDoc>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String, required: true },
    content: { type: String, default: "" },
    coverImage: { type: String, default: "" },
    category: { type: Schema.Types.ObjectId, ref: "Kategori", required: true },
    author: { type: Schema.Types.ObjectId, ref: "Kullanici", required: true },
    status: { type: String, enum: ["taslak", "yayinda"], default: "taslak" },
    readingTime: { type: Number, default: 1 },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

MakaleSchema.index({ title: "text", content: "text" });

const Makale: Model<IMakaleDoc> =
  mongoose.models.Makale ||
  mongoose.model<IMakaleDoc>("Makale", MakaleSchema);

export default Makale;
```

- [ ] **Step 5: Commit**

```bash
git add src/lib/db.ts src/models/
git commit -m "feat: MongoDB connection and Mongoose models"
```

---

## Task 4: Authentication (NextAuth)

**Files:**
- Create: `src/lib/auth.ts`, `src/app/api/auth/[...nextauth]/route.ts`, `src/middleware.ts`

- [ ] **Step 1: Create NextAuth configuration**

Create `src/lib/auth.ts`:

```typescript
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "./db";
import Kullanici from "@/models/Kullanici";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "E-posta", type: "email" },
        password: { label: "Şifre", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        await dbConnect();
        const user = await Kullanici.findOne({ email: credentials.email });

        if (!user) {
          return null;
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid) {
          return null;
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role: string }).role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { role?: string }).role = token.role as string;
        (session.user as { id?: string }).id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/admin/giris",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
```

- [ ] **Step 2: Create NextAuth route handler**

Create `src/app/api/auth/[...nextauth]/route.ts`:

```typescript
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
```

- [ ] **Step 3: Create admin middleware**

Create `src/middleware.ts`:

```typescript
import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token, req }) => {
      const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
      const isLoginPage = req.nextUrl.pathname === "/admin/giris";

      if (isLoginPage) return true;
      if (isAdminRoute) return !!token;
      return true;
    },
  },
});

export const config = {
  matcher: ["/admin/:path*"],
};
```

- [ ] **Step 4: Commit**

```bash
git add src/lib/auth.ts src/app/api/auth/ src/middleware.ts
git commit -m "feat: NextAuth authentication with credentials provider"
```

---

## Task 5: Seed Script

**Files:**
- Create: `scripts/seed.ts`

- [ ] **Step 1: Create seed script with admin user and sample data**

Create `scripts/seed.ts`:

```typescript
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const MONGODB_URI = "mongodb://localhost:27017/tarik-site";

const KullaniciSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: "yazar" },
  bio: { type: String, default: "" },
  avatar: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

const KategoriSchema = new mongoose.Schema({
  name: String,
  slug: { type: String, unique: true },
  description: { type: String, default: "" },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

const MakaleSchema = new mongoose.Schema(
  {
    title: String,
    slug: { type: String, unique: true },
    excerpt: String,
    content: { type: String, default: "" },
    coverImage: { type: String, default: "" },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Kategori" },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "Kullanici" },
    status: { type: String, default: "yayinda" },
    readingTime: { type: Number, default: 1 },
    tags: [String],
  },
  { timestamps: true }
);

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log("MongoDB bağlantısı kuruldu.");

  const Kullanici = mongoose.model("Kullanici", KullaniciSchema);
  const Kategori = mongoose.model("Kategori", KategoriSchema);
  const Makale = mongoose.model("Makale", MakaleSchema);

  // Temizlik
  await Kullanici.deleteMany({});
  await Kategori.deleteMany({});
  await Makale.deleteMany({});

  // Admin kullanıcı
  const hashedPassword = await bcrypt.hash("admin123", 12);
  const admin = await Kullanici.create({
    name: "Tarık Mirza",
    email: "tarik@example.com",
    password: hashedPassword,
    role: "admin",
    bio: "Ceza hukuku alanında araştırmalar yapan hukuk öğrencisi. Akademik makaleler, içtihat değerlendirmeleri ve güncel hukuki analizler üzerine yazıyor.",
  });

  // Kategoriler
  const kategoriler = await Kategori.create([
    {
      name: "Ceza Genel Hukuku",
      slug: "ceza-genel-hukuku",
      description: "Ceza hukukunun genel hükümlerine ilişkin makaleler",
      order: 1,
    },
    {
      name: "Ceza Özel Hukuku",
      slug: "ceza-ozel-hukuku",
      description: "Ceza hukukunun özel hükümlerine ilişkin makaleler",
      order: 2,
    },
    {
      name: "Ceza Muhakemesi Hukuku",
      slug: "ceza-muhakemesi-hukuku",
      description: "Ceza muhakemesi hukukuna ilişkin makaleler",
      order: 3,
    },
    {
      name: "İnfaz Hukuku",
      slug: "infaz-hukuku",
      description: "Ceza infaz hukukuna ilişkin makaleler",
      order: 4,
    },
  ]);

  // Örnek makaleler
  await Makale.create([
    {
      title: "Ceza Hukukunda Meşru Müdafaanın Sınırları ve Güncel Yargıtay Kararları",
      slug: "ceza-hukukunda-mesru-mudafaanin-sinirlari",
      excerpt:
        "Meşru müdafaa hakkının kullanılabilmesi için saldırının hukuka aykırı olması gerekir. Bu makalede TCK m.25/1 kapsamında meşru müdafaanın koşulları güncel içtihatlar ışığında değerlendirilmektedir.",
      content: `<h2>I. Genel Olarak</h2><p>Meşru müdafaa, Türk Ceza Kanunu'nun 25. maddesinin birinci fıkrasında düzenlenmiş olup, kişinin kendisine veya başkasına yönelmiş haksız bir saldırıyı defetmek amacıyla, zorunlu ve orantılı güç kullanmasını ifade etmektedir.</p><p>Bu hukuka uygunluk nedeni, ceza hukukunun en temel kavramlarından biri olarak, bireyin meşru haklarını korumasına olanak tanır.</p><blockquote><p>"Gerek kendisine ve gerek başkasına ait bir hakka yönelmiş, gerçekleşen, gerçekleşmesi veya tekrarı muhakkak olan haksız bir saldırıyı o anda hal ve koşullara göre saldırı ile orantılı biçimde defetmek zorunluluğu ile işlenen fiillerden dolayı faile ceza verilmez."</p><p>— TCK m.25/1</p></blockquote><h2>II. Meşru Müdafaanın Koşulları</h2><p>Meşru müdafaanın kabul edilebilmesi için saldırıya ve savunmaya ilişkin belirli koşulların bir arada bulunması gerekmektedir:</p><h3>A. Saldırıya İlişkin Koşullar</h3><ul><li>Bir hakka yönelmiş saldırı bulunmalıdır</li><li>Saldırı hukuka aykırı olmalıdır</li><li>Saldırı halen mevcut olmalıdır</li></ul><h3>B. Savunmaya İlişkin Koşullar</h3><ul><li>Savunmada zorunluluk bulunmalıdır</li><li>Savunma saldırı ile orantılı olmalıdır</li></ul><h2>III. Güncel Yargıtay Kararları</h2><p>Yargıtay, meşru müdafaa değerlendirmesinde somut olayın özelliklerini dikkate almakta ve özellikle orantılılık ilkesine büyük önem vermektedir. Yargıtay 1. Ceza Dairesi'nin yerleşik içtihadına göre, meşru müdafaada saldırının ağırlığı ile savunmanın ağırlığı arasında makul bir oran bulunmalıdır.</p>`,
      category: kategoriler[0]._id,
      author: admin._id,
      status: "yayinda",
      readingTime: 8,
      tags: ["meşru müdafaa", "hukuka uygunluk", "TCK"],
    },
    {
      title: "Hırsızlık Suçunda Nitelikli Haller",
      slug: "hirsizlik-sucunda-nitelikli-haller",
      excerpt:
        "TCK m.142'de düzenlenen nitelikli hırsızlık suçunun unsurları ve yaptırımları. Gece vakti, bina içinde, suç örgütü kapsamında işlenen hırsızlık hallerinin incelenmesi.",
      content: `<h2>I. Giriş</h2><p>Hırsızlık suçu, Türk Ceza Kanunu'nun 141. maddesinde temel haliyle düzenlenmiş olup, 142. maddede ise nitelikli halleri sayılmıştır. Nitelikli haller, suçun daha ağır cezayı gerektiren şekilleridir.</p><h2>II. Nitelikli Haller</h2><h3>A. Kamu Kurumu veya İbadethanede İşlenmesi</h3><p>Hırsızlık fiilinin kamu kurumlarında veya ibadete ayrılmış yerlerde işlenmesi halinde ceza artırılır.</p><h3>B. Halkın Yararlanmasına Sunulmuş Eşya Hakkında İşlenmesi</h3><p>Herkesin yararlanmasına sunulmuş ulaşım aracı, elektrik, su gibi kaynaklar hakkında işlenen hırsızlık nitelikli hal teşkil eder.</p>`,
      category: kategoriler[1]._id,
      author: admin._id,
      status: "yayinda",
      readingTime: 7,
      tags: ["hırsızlık", "nitelikli hal", "TCK m.142"],
    },
    {
      title: "Tutuklama Kararına İtiraz Yolları",
      slug: "tutuklama-kararina-itiraz-yollari",
      excerpt:
        "CMK m.101 uyarınca tutuklama kararına karşı başvurulabilecek kanun yolları ve itiraz sürecinin detaylı incelenmesi.",
      content: `<h2>I. Tutuklamanın Hukuki Niteliği</h2><p>Tutuklama, ceza muhakemesi hukukunda en ağır koruma tedbiridir. Kişi özgürlüğünü doğrudan kısıtlayan bu tedbir, ancak kanunda belirtilen koşulların varlığı halinde uygulanabilir.</p><h2>II. İtiraz Hakkı</h2><p>CMK m.101/5 uyarınca, tutuklama kararına karşı itiraz yoluna başvurulabilir. İtiraz, kararı veren makamın bir üst makamına yapılır.</p>`,
      category: kategoriler[2]._id,
      author: admin._id,
      status: "yayinda",
      readingTime: 6,
      tags: ["tutuklama", "itiraz", "CMK"],
    },
    {
      title: "Taksirle Öldürme Suçunda Cezai Sorumluluk",
      slug: "taksirle-oldurme-sucunda-cezai-sorumluluk",
      excerpt:
        "TCK m.85 kapsamında taksirle öldürme suçunun unsurları, bilinçli taksir ayrımı ve cezai sorumluluk şartlarının değerlendirilmesi.",
      content: `<h2>I. Taksir Kavramı</h2><p>Taksir, dikkat ve özen yükümlülüğüne aykırılık dolayısıyla bir davranışın suçun kanuni tanımında belirtilen neticesi öngörülmeyerek gerçekleştirilmesidir (TCK m.22/2).</p><h2>II. Bilinçli Taksir</h2><p>Kişinin öngördüğü neticeyi istememesine karşın neticenin meydana gelmesi halinde bilinçli taksir söz konusu olur.</p>`,
      category: kategoriler[0]._id,
      author: admin._id,
      status: "yayinda",
      readingTime: 5,
      tags: ["taksir", "taksirle öldürme", "bilinçli taksir"],
    },
    {
      title: "İştirak Halleri ve Yardım Etme Kavramı",
      slug: "istirak-halleri-ve-yardim-etme",
      excerpt:
        "TCK m.37-41 arasında düzenlenen iştirak hallerinin karşılaştırmalı incelemesi. Müşterek faillik, azmettirme ve yardım etme kavramlarının analizi.",
      content: `<h2>I. İştirak Kavramı</h2><p>İştirak, birden fazla kişinin bir suçun işlenmesine katılmasıdır. TCK'da iştirak halleri; faillik, azmettirme ve yardım etme olarak düzenlenmiştir.</p>`,
      category: kategoriler[0]._id,
      author: admin._id,
      status: "taslak",
      readingTime: 10,
      tags: ["iştirak", "müşterek faillik", "yardım etme"],
    },
  ]);

  console.log("Seed verileri başarıyla oluşturuldu:");
  console.log("- 1 admin kullanıcı (tarik@example.com / admin123)");
  console.log("- 4 kategori");
  console.log("- 5 makale (4 yayında, 1 taslak)");

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed hatası:", err);
  process.exit(1);
});
```

- [ ] **Step 2: Run seed script**

```bash
npx tsx scripts/seed.ts
```

Expected output:
```
MongoDB bağlantısı kuruldu.
Seed verileri başarıyla oluşturuldu:
- 1 admin kullanıcı (tarik@example.com / admin123)
- 4 kategori
- 5 makale (4 yayında, 1 taslak)
```

- [ ] **Step 3: Commit**

```bash
git add scripts/seed.ts
git commit -m "feat: seed script with admin user and sample data"
```

---

## Task 6: API Routes — Categories

**Files:**
- Create: `src/app/api/kategoriler/route.ts`, `src/app/api/kategoriler/[id]/route.ts`

- [ ] **Step 1: Create category list + create routes**

Create `src/app/api/kategoriler/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Kategori from "@/models/Kategori";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  await dbConnect();
  const kategoriler = await Kategori.find().sort({ order: 1 });
  return NextResponse.json(kategoriler);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  await dbConnect();
  const body = await req.json();
  const kategori = await Kategori.create(body);
  return NextResponse.json(kategori, { status: 201 });
}
```

- [ ] **Step 2: Create single category routes (GET, PUT, DELETE)**

Create `src/app/api/kategoriler/[id]/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Kategori from "@/models/Kategori";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  const { id } = await params;
  const kategori = await Kategori.findById(id);
  if (!kategori) {
    return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });
  }
  return NextResponse.json(kategori);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  await dbConnect();
  const { id } = await params;
  const body = await req.json();
  const kategori = await Kategori.findByIdAndUpdate(id, body, { new: true });
  if (!kategori) {
    return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });
  }
  return NextResponse.json(kategori);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  await dbConnect();
  const { id } = await params;
  await Kategori.findByIdAndDelete(id);
  return NextResponse.json({ message: "Silindi" });
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/api/kategoriler/
git commit -m "feat: category API routes (CRUD)"
```

---

## Task 7: API Routes — Articles

**Files:**
- Create: `src/app/api/makaleler/route.ts`, `src/app/api/makaleler/[id]/route.ts`

- [ ] **Step 1: Create article list + create routes**

Create `src/app/api/makaleler/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Makale from "@/models/Makale";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { slugify, calculateReadingTime } from "@/lib/utils";

export async function GET(req: NextRequest) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const category = searchParams.get("category");
  const limit = parseInt(searchParams.get("limit") || "50");
  const page = parseInt(searchParams.get("page") || "1");

  const filter: Record<string, unknown> = {};
  if (status) filter.status = status;
  if (category) filter.category = category;

  const skip = (page - 1) * limit;
  const [makaleler, total] = await Promise.all([
    Makale.find(filter)
      .populate("category", "name slug")
      .populate("author", "name avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Makale.countDocuments(filter),
  ]);

  return NextResponse.json({ makaleler, total, page, limit });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  await dbConnect();
  const body = await req.json();

  if (!body.slug) {
    body.slug = slugify(body.title);
  }

  body.readingTime = calculateReadingTime(body.content || "");
  body.author = (session.user as { id: string }).id;

  const makale = await Makale.create(body);
  return NextResponse.json(makale, { status: 201 });
}
```

- [ ] **Step 2: Create single article routes (GET, PUT, DELETE)**

Create `src/app/api/makaleler/[id]/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Makale from "@/models/Makale";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { calculateReadingTime } from "@/lib/utils";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  const { id } = await params;
  const makale = await Makale.findById(id)
    .populate("category", "name slug")
    .populate("author", "name avatar bio");
  if (!makale) {
    return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });
  }
  return NextResponse.json(makale);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  await dbConnect();
  const { id } = await params;
  const body = await req.json();

  if (body.content) {
    body.readingTime = calculateReadingTime(body.content);
  }

  const makale = await Makale.findByIdAndUpdate(id, body, { new: true })
    .populate("category", "name slug")
    .populate("author", "name avatar");
  if (!makale) {
    return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });
  }
  return NextResponse.json(makale);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  await dbConnect();
  const { id } = await params;
  await Makale.findByIdAndDelete(id);
  return NextResponse.json({ message: "Silindi" });
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/api/makaleler/
git commit -m "feat: article API routes (CRUD with pagination)"
```

---

## Task 8: API Routes — Search & Upload

**Files:**
- Create: `src/app/api/ara/route.ts`, `src/app/api/upload/route.ts`

- [ ] **Step 1: Create search endpoint**

Create `src/app/api/ara/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Makale from "@/models/Makale";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");

  if (!q || q.trim().length < 2) {
    return NextResponse.json({ makaleler: [] });
  }

  await dbConnect();

  const makaleler = await Makale.find(
    {
      status: "yayinda",
      $or: [
        { title: { $regex: q, $options: "i" } },
        { excerpt: { $regex: q, $options: "i" } },
        { content: { $regex: q, $options: "i" } },
      ],
    }
  )
    .populate("category", "name slug")
    .populate("author", "name avatar")
    .sort({ createdAt: -1 })
    .limit(20);

  return NextResponse.json({ makaleler });
}
```

- [ ] **Step 2: Create image upload endpoint**

Create `src/app/api/upload/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "Dosya bulunamadı" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const ext = path.extname(file.name);
  const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;
  const filepath = path.join(process.cwd(), "public", "uploads", filename);

  await writeFile(filepath, buffer);

  return NextResponse.json({ url: `/uploads/${filename}` });
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/api/ara/ src/app/api/upload/
git commit -m "feat: search and image upload API routes"
```

---

## Task 9: Admin Login Page

**Files:**
- Create: `src/app/admin/giris/page.tsx`

- [ ] **Step 1: Create login page**

Create `src/app/admin/giris/page.tsx`:

```tsx
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function GirisPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("E-posta veya şifre hatalı.");
      setLoading(false);
    } else {
      router.push("/admin");
    }
  };

  return (
    <div className="min-h-screen bg-gray-light flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-dark">Tarık Mirza</h1>
          <p className="text-gray-text text-sm mt-1">Yönetim Paneli</p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg border border-gray-border p-6 space-y-4"
        >
          <div>
            <label className="block text-xs font-medium text-gray-text mb-1.5 uppercase tracking-wide">
              E-posta
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-text mb-1.5 uppercase tracking-wide">
              Şifre
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>
          {error && (
            <p className="text-red-600 text-sm">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-2.5 disabled:opacity-50"
          >
            {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
          </button>
        </form>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/admin/giris/
git commit -m "feat: admin login page"
```

---

## Task 10: Admin Layout & Sidebar

**Files:**
- Create: `src/components/admin/AdminSidebar.tsx`, `src/app/admin/layout.tsx`

- [ ] **Step 1: Create admin sidebar component**

Create `src/components/admin/AdminSidebar.tsx`:

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const menuItems = [
  { href: "/admin", label: "Genel Bakış", icon: "📊" },
  { href: "/admin/makaleler", label: "Makaleler", icon: "📝" },
  { href: "/admin/kategoriler", label: "Kategoriler", icon: "📁" },
  { href: "/admin/yazarlar", label: "Yazarlar", icon: "👥" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-56 bg-dark min-h-screen flex flex-col flex-shrink-0">
      <div className="px-5 py-5 border-b border-gray-800">
        <Link href="/" className="block">
          <h1 className="text-white font-bold text-sm">Tarık Mirza</h1>
          <p className="text-gray-400 text-xs mt-0.5">Admin Panel</p>
        </Link>
      </div>

      <nav className="flex-1 py-4">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-5 py-2.5 text-sm transition-colors ${
              isActive(item.href)
                ? "text-white bg-gray-800 border-l-2 border-primary"
                : "text-gray-400 hover:text-white hover:bg-gray-800/50"
            }`}
          >
            <span>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="px-5 py-4 border-t border-gray-800">
        <button
          onClick={() => signOut({ callbackUrl: "/admin/giris" })}
          className="text-gray-400 text-sm hover:text-white transition-colors"
        >
          Çıkış Yap
        </button>
      </div>
    </aside>
  );
}
```

- [ ] **Step 2: Create admin layout**

Create `src/app/admin/layout.tsx`:

```tsx
"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";

function AdminContent({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === "/admin/giris";

  useEffect(() => {
    if (status === "unauthenticated" && !isLoginPage) {
      router.push("/admin/giris");
    }
  }, [status, isLoginPage, router]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-light flex items-center justify-center">
        <p className="text-gray-text text-sm">Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 bg-gray-light p-6 overflow-auto">
        {children}
      </main>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <AdminContent>{children}</AdminContent>
    </SessionProvider>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/admin/AdminSidebar.tsx src/app/admin/layout.tsx
git commit -m "feat: admin layout with sidebar navigation"
```

---

## Task 11: Admin Dashboard

**Files:**
- Create: `src/app/admin/page.tsx`

- [ ] **Step 1: Create admin dashboard page**

Create `src/app/admin/page.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { IMakale } from "@/types";

interface Stats {
  totalMakaleler: number;
  yayindaMakaleler: number;
  taslakMakaleler: number;
  totalKategoriler: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [sonMakaleler, setSonMakaleler] = useState<IMakale[]>([]);

  useEffect(() => {
    async function fetchData() {
      const [allRes, publishedRes, draftRes, katRes] = await Promise.all([
        fetch("/api/makaleler?limit=5"),
        fetch("/api/makaleler?status=yayinda&limit=1"),
        fetch("/api/makaleler?status=taslak&limit=1"),
        fetch("/api/kategoriler"),
      ]);

      const allData = await allRes.json();
      const publishedData = await publishedRes.json();
      const draftData = await draftRes.json();
      const katData = await katRes.json();

      setStats({
        totalMakaleler: allData.total,
        yayindaMakaleler: publishedData.total,
        taslakMakaleler: draftData.total,
        totalKategoriler: katData.length,
      });
      setSonMakaleler(allData.makaleler);
    }
    fetchData();
  }, []);

  if (!stats) {
    return <p className="text-gray-text text-sm">Yükleniyor...</p>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold">Genel Bakış</h1>
          <p className="text-gray-text text-sm mt-1">
            Hoş geldiniz, Tarık Mirza
          </p>
        </div>
        <Link href="/admin/makaleler/yeni" className="btn-primary">
          Yeni Makale
        </Link>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: "Toplam Makale", value: stats.totalMakaleler },
          { label: "Yayında", value: stats.yayindaMakaleler },
          { label: "Taslak", value: stats.taslakMakaleler },
          { label: "Kategori", value: stats.totalKategoriler },
        ].map((item) => (
          <div
            key={item.label}
            className="bg-white rounded-lg border border-gray-border p-5"
          >
            <p className="text-xs text-gray-text font-medium uppercase tracking-wide">
              {item.label}
            </p>
            <p className="text-2xl font-bold mt-1">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg border border-gray-border">
        <div className="px-5 py-4 border-b border-gray-border">
          <h2 className="font-semibold text-sm">Son Makaleler</h2>
        </div>
        <div className="divide-y divide-gray-border">
          {sonMakaleler.map((makale) => (
            <Link
              key={makale._id}
              href={`/admin/makaleler/${makale._id}`}
              className="flex items-center justify-between px-5 py-3 hover:bg-gray-light transition-colors"
            >
              <div>
                <p className="text-sm font-medium">{makale.title}</p>
                <p className="text-xs text-gray-text mt-0.5">
                  {formatDate(makale.createdAt)}
                </p>
              </div>
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  makale.status === "yayinda"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-text"
                }`}
              >
                {makale.status === "yayinda" ? "Yayında" : "Taslak"}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/admin/page.tsx
git commit -m "feat: admin dashboard with stats and recent articles"
```

---

## Task 12: Admin Category Management

**Files:**
- Create: `src/components/admin/KategoriForm.tsx`, `src/app/admin/kategoriler/page.tsx`

- [ ] **Step 1: Create category form component**

Create `src/components/admin/KategoriForm.tsx`:

```tsx
"use client";

import { useState } from "react";
import { slugify } from "@/lib/utils";
import { IKategori } from "@/types";

interface Props {
  kategori?: IKategori;
  onSave: () => void;
  onCancel: () => void;
}

export default function KategoriForm({ kategori, onSave, onCancel }: Props) {
  const [name, setName] = useState(kategori?.name || "");
  const [slug, setSlug] = useState(kategori?.slug || "");
  const [description, setDescription] = useState(kategori?.description || "");
  const [order, setOrder] = useState(kategori?.order || 0);
  const [loading, setLoading] = useState(false);

  const handleNameChange = (value: string) => {
    setName(value);
    if (!kategori) {
      setSlug(slugify(value));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const url = kategori
      ? `/api/kategoriler/${kategori._id}`
      : "/api/kategoriler";
    const method = kategori ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, slug, description, order }),
    });

    setLoading(false);
    onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-border p-5 space-y-4">
      <div>
        <label className="block text-xs font-medium text-gray-text mb-1.5 uppercase tracking-wide">
          Kategori Adı
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => handleNameChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          required
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-text mb-1.5 uppercase tracking-wide">
          Slug
        </label>
        <input
          type="text"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="w-full px-3 py-2 border border-gray-border rounded-md text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          required
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-text mb-1.5 uppercase tracking-wide">
          Açıklama
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className="w-full px-3 py-2 border border-gray-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-text mb-1.5 uppercase tracking-wide">
          Sıra
        </label>
        <input
          type="number"
          value={order}
          onChange={(e) => setOrder(parseInt(e.target.value))}
          className="w-24 px-3 py-2 border border-gray-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>
      <div className="flex gap-2 pt-2">
        <button type="submit" disabled={loading} className="btn-primary disabled:opacity-50">
          {loading ? "Kaydediliyor..." : kategori ? "Güncelle" : "Oluştur"}
        </button>
        <button type="button" onClick={onCancel} className="btn-secondary">
          İptal
        </button>
      </div>
    </form>
  );
}
```

- [ ] **Step 2: Create categories management page**

Create `src/app/admin/kategoriler/page.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";
import KategoriForm from "@/components/admin/KategoriForm";
import { IKategori } from "@/types";

export default function KategorilerPage() {
  const [kategoriler, setKategoriler] = useState<IKategori[]>([]);
  const [editing, setEditing] = useState<IKategori | null>(null);
  const [showForm, setShowForm] = useState(false);

  const fetchKategoriler = async () => {
    const res = await fetch("/api/kategoriler");
    const data = await res.json();
    setKategoriler(data);
  };

  useEffect(() => {
    fetchKategoriler();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Bu kategoriyi silmek istediğinize emin misiniz?")) return;
    await fetch(`/api/kategoriler/${id}`, { method: "DELETE" });
    fetchKategoriler();
  };

  const handleSave = () => {
    setShowForm(false);
    setEditing(null);
    fetchKategoriler();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">Kategoriler</h1>
        <button
          onClick={() => { setEditing(null); setShowForm(true); }}
          className="btn-primary"
        >
          Yeni Kategori
        </button>
      </div>

      {(showForm || editing) && (
        <div className="mb-6">
          <KategoriForm
            kategori={editing || undefined}
            onSave={handleSave}
            onCancel={() => { setShowForm(false); setEditing(null); }}
          />
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-border">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-border text-left">
              <th className="px-5 py-3 text-xs font-medium text-gray-text uppercase tracking-wide">Sıra</th>
              <th className="px-5 py-3 text-xs font-medium text-gray-text uppercase tracking-wide">Ad</th>
              <th className="px-5 py-3 text-xs font-medium text-gray-text uppercase tracking-wide">Slug</th>
              <th className="px-5 py-3 text-xs font-medium text-gray-text uppercase tracking-wide">Açıklama</th>
              <th className="px-5 py-3 text-xs font-medium text-gray-text uppercase tracking-wide">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-border">
            {kategoriler.map((kat) => (
              <tr key={kat._id} className="hover:bg-gray-light transition-colors">
                <td className="px-5 py-3 text-sm">{kat.order}</td>
                <td className="px-5 py-3 text-sm font-medium">{kat.name}</td>
                <td className="px-5 py-3 text-sm text-gray-text font-mono">{kat.slug}</td>
                <td className="px-5 py-3 text-sm text-gray-text">{kat.description}</td>
                <td className="px-5 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setEditing(kat); setShowForm(false); }}
                      className="text-xs text-primary hover:underline"
                    >
                      Düzenle
                    </button>
                    <button
                      onClick={() => handleDelete(kat._id)}
                      className="text-xs text-red-600 hover:underline"
                    >
                      Sil
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/admin/KategoriForm.tsx src/app/admin/kategoriler/
git commit -m "feat: admin category management"
```

---

## Task 13: Admin Article Editor (TipTap)

**Files:**
- Create: `src/components/admin/MakaleEditoru.tsx`, `src/app/admin/makaleler/yeni/page.tsx`, `src/app/admin/makaleler/[id]/page.tsx`

- [ ] **Step 1: Create TipTap editor component**

Create `src/components/admin/MakaleEditoru.tsx`:

```tsx
"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import LinkExtension from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";

interface Props {
  content: string;
  onChange: (html: string) => void;
}

function ToolbarButton({
  onClick,
  active,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
        active
          ? "bg-primary text-white"
          : "bg-gray-light text-dark hover:bg-gray-200"
      }`}
    >
      {children}
    </button>
  );
}

export default function MakaleEditoru({ content, onChange }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Image,
      LinkExtension.configure({ openOnClick: false }),
      Underline,
      Placeholder.configure({
        placeholder: "Makale içeriğinizi buraya yazın...",
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none min-h-[400px] px-5 py-4 focus:outline-none",
      },
    },
  });

  if (!editor) return null;

  const addImage = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (data.url) {
        editor.chain().focus().setImage({ src: data.url }).run();
      }
    };
    input.click();
  };

  const addLink = () => {
    const url = prompt("Link URL'si:");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  return (
    <div className="bg-white border border-gray-border rounded-lg overflow-hidden">
      <div className="flex flex-wrap gap-1 p-2 border-b border-gray-border">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
        >
          B
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
        >
          I
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive("underline")}
        >
          U
        </ToolbarButton>

        <div className="w-px bg-gray-border mx-1" />

        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          active={editor.isActive("heading", { level: 2 })}
        >
          H2
        </ToolbarButton>
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          active={editor.isActive("heading", { level: 3 })}
        >
          H3
        </ToolbarButton>

        <div className="w-px bg-gray-border mx-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
        >
          • Liste
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
        >
          1. Liste
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive("blockquote")}
        >
          ❝ Alıntı
        </ToolbarButton>

        <div className="w-px bg-gray-border mx-1" />

        <ToolbarButton onClick={addImage}>🖼 Görsel</ToolbarButton>
        <ToolbarButton onClick={addLink} active={editor.isActive("link")}>
          🔗 Link
        </ToolbarButton>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}
```

- [ ] **Step 2: Create new article page**

Create `src/app/admin/makaleler/yeni/page.tsx`:

```tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MakaleEditoru from "@/components/admin/MakaleEditoru";
import { slugify } from "@/lib/utils";
import { IKategori } from "@/types";

export default function YeniMakalePage() {
  const router = useRouter();
  const [kategoriler, setKategoriler] = useState<IKategori[]>([]);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/kategoriler")
      .then((res) => res.json())
      .then(setKategoriler);
  }, []);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    setSlug(slugify(value));
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();
    if (data.url) setCoverImage(data.url);
  };

  const handleSave = async (status: "taslak" | "yayinda") => {
    setLoading(true);
    const res = await fetch("/api/makaleler", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        slug,
        excerpt,
        content,
        category,
        coverImage,
        status,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      }),
    });

    if (res.ok) {
      router.push("/admin/makaleler");
    }
    setLoading(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold">Yeni Makale</h1>
          <p className="text-gray-text text-sm mt-1">
            Makale oluştur ve yayınla
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleSave("taslak")}
            disabled={loading}
            className="btn-secondary disabled:opacity-50"
          >
            Taslak Kaydet
          </button>
          <button
            onClick={() => handleSave("yayinda")}
            disabled={loading}
            className="btn-primary disabled:opacity-50"
          >
            Yayınla
          </button>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_280px] gap-5">
        <div className="space-y-3">
          <div className="bg-white border border-gray-border rounded-lg p-4">
            <label className="block text-xs font-medium text-gray-text mb-2 uppercase tracking-wide">
              Başlık
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full text-xl font-bold border-b border-gray-border pb-2 focus:outline-none focus:border-primary"
              placeholder="Makale başlığı"
            />
          </div>

          <div className="bg-white border border-gray-border rounded-lg p-4">
            <label className="block text-xs font-medium text-gray-text mb-2 uppercase tracking-wide">
              Özet
            </label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={2}
              className="w-full text-sm border-none focus:outline-none resize-none"
              placeholder="Makale özeti (kart ve SEO için)"
            />
          </div>

          <MakaleEditoru content={content} onChange={setContent} />
        </div>

        <div className="space-y-3">
          <div className="bg-white border border-gray-border rounded-lg p-4">
            <label className="block text-xs font-medium text-gray-text mb-2 uppercase tracking-wide">
              Kapak Görseli
            </label>
            {coverImage ? (
              <div className="relative">
                <img
                  src={coverImage}
                  alt="Kapak"
                  className="w-full h-32 object-cover rounded-md"
                />
                <button
                  onClick={() => setCoverImage("")}
                  className="absolute top-1 right-1 bg-white rounded-full w-6 h-6 text-xs flex items-center justify-center shadow"
                >
                  ✕
                </button>
              </div>
            ) : (
              <label className="block h-32 bg-gray-light rounded-md border-2 border-dashed border-gray-border cursor-pointer flex items-center justify-center hover:border-primary transition-colors">
                <div className="text-center">
                  <p className="text-2xl mb-1">📷</p>
                  <p className="text-xs text-gray-text">
                    Görsel yükle
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>

          <div className="bg-white border border-gray-border rounded-lg p-4">
            <label className="block text-xs font-medium text-gray-text mb-2 uppercase tracking-wide">
              Kategori
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Kategori seçin</option>
              {kategoriler.map((kat) => (
                <option key={kat._id} value={kat._id}>
                  {kat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-white border border-gray-border rounded-lg p-4">
            <label className="block text-xs font-medium text-gray-text mb-2 uppercase tracking-wide">
              URL (Slug)
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full px-3 py-2 border border-gray-border rounded-md text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="bg-white border border-gray-border rounded-lg p-4">
            <label className="block text-xs font-medium text-gray-text mb-2 uppercase tracking-wide">
              Etiketler
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full px-3 py-2 border border-gray-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="virgülle ayırın"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create edit article page**

Create `src/app/admin/makaleler/[id]/page.tsx`:

```tsx
"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import MakaleEditoru from "@/components/admin/MakaleEditoru";
import { slugify } from "@/lib/utils";
import { IKategori, IMakale } from "@/types";

export default function MakaleDuzenlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [kategoriler, setKategoriler] = useState<IKategori[]>([]);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [status, setStatus] = useState<"taslak" | "yayinda">("taslak");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch(`/api/makaleler/${id}`).then((r) => r.json()),
      fetch("/api/kategoriler").then((r) => r.json()),
    ]).then(([makale, kats]: [IMakale, IKategori[]]) => {
      setTitle(makale.title);
      setSlug(makale.slug);
      setExcerpt(makale.excerpt);
      setContent(makale.content);
      setCategory(
        typeof makale.category === "string"
          ? makale.category
          : makale.category._id
      );
      setCoverImage(makale.coverImage);
      setStatus(makale.status);
      setTags(makale.tags.join(", "));
      setKategoriler(kats);
      setLoading(false);
    });
  }, [id]);

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();
    if (data.url) setCoverImage(data.url);
  };

  const handleSave = async (newStatus?: "taslak" | "yayinda") => {
    setSaving(true);
    await fetch(`/api/makaleler/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        slug,
        excerpt,
        content,
        category,
        coverImage,
        status: newStatus || status,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      }),
    });
    setSaving(false);
    router.push("/admin/makaleler");
  };

  if (loading) {
    return <p className="text-gray-text text-sm">Yükleniyor...</p>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold">Makale Düzenle</h1>
          <p className="text-gray-text text-sm mt-1">{title}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleSave("taslak")}
            disabled={saving}
            className="btn-secondary disabled:opacity-50"
          >
            Taslak Kaydet
          </button>
          <button
            onClick={() => handleSave("yayinda")}
            disabled={saving}
            className="btn-primary disabled:opacity-50"
          >
            Yayınla
          </button>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_280px] gap-5">
        <div className="space-y-3">
          <div className="bg-white border border-gray-border rounded-lg p-4">
            <label className="block text-xs font-medium text-gray-text mb-2 uppercase tracking-wide">
              Başlık
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-xl font-bold border-b border-gray-border pb-2 focus:outline-none focus:border-primary"
            />
          </div>

          <div className="bg-white border border-gray-border rounded-lg p-4">
            <label className="block text-xs font-medium text-gray-text mb-2 uppercase tracking-wide">
              Özet
            </label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={2}
              className="w-full text-sm border-none focus:outline-none resize-none"
            />
          </div>

          <MakaleEditoru content={content} onChange={setContent} />
        </div>

        <div className="space-y-3">
          <div className="bg-white border border-gray-border rounded-lg p-4">
            <label className="block text-xs font-medium text-gray-text mb-2 uppercase tracking-wide">
              Kapak Görseli
            </label>
            {coverImage ? (
              <div className="relative">
                <img src={coverImage} alt="Kapak" className="w-full h-32 object-cover rounded-md" />
                <button onClick={() => setCoverImage("")} className="absolute top-1 right-1 bg-white rounded-full w-6 h-6 text-xs flex items-center justify-center shadow">✕</button>
              </div>
            ) : (
              <label className="block h-32 bg-gray-light rounded-md border-2 border-dashed border-gray-border cursor-pointer flex items-center justify-center hover:border-primary transition-colors">
                <div className="text-center">
                  <p className="text-2xl mb-1">📷</p>
                  <p className="text-xs text-gray-text">Görsel yükle</p>
                </div>
                <input type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
              </label>
            )}
          </div>

          <div className="bg-white border border-gray-border rounded-lg p-4">
            <label className="block text-xs font-medium text-gray-text mb-2 uppercase tracking-wide">Kategori</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-3 py-2 border border-gray-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="">Kategori seçin</option>
              {kategoriler.map((kat) => (<option key={kat._id} value={kat._id}>{kat.name}</option>))}
            </select>
          </div>

          <div className="bg-white border border-gray-border rounded-lg p-4">
            <label className="block text-xs font-medium text-gray-text mb-2 uppercase tracking-wide">URL (Slug)</label>
            <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} className="w-full px-3 py-2 border border-gray-border rounded-md text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>

          <div className="bg-white border border-gray-border rounded-lg p-4">
            <label className="block text-xs font-medium text-gray-text mb-2 uppercase tracking-wide">Durum</label>
            <div className="flex gap-2">
              <button onClick={() => setStatus("taslak")} className={`px-3 py-1.5 rounded-md text-xs font-medium ${status === "taslak" ? "bg-gray-200 text-dark" : "bg-gray-light text-gray-text"}`}>Taslak</button>
              <button onClick={() => setStatus("yayinda")} className={`px-3 py-1.5 rounded-md text-xs font-medium ${status === "yayinda" ? "bg-green-100 text-green-700" : "bg-gray-light text-gray-text"}`}>Yayında</button>
            </div>
          </div>

          <div className="bg-white border border-gray-border rounded-lg p-4">
            <label className="block text-xs font-medium text-gray-text mb-2 uppercase tracking-wide">Etiketler</label>
            <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} className="w-full px-3 py-2 border border-gray-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary" placeholder="virgülle ayırın" />
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/admin/MakaleEditoru.tsx src/app/admin/makaleler/
git commit -m "feat: TipTap article editor, new and edit article pages"
```

---

## Task 14: Admin Article List & Author Management

**Files:**
- Create: `src/app/admin/makaleler/page.tsx`, `src/app/admin/yazarlar/page.tsx`

- [ ] **Step 1: Create article list management page**

Create `src/app/admin/makaleler/page.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { IMakale } from "@/types";

export default function MakalelerPage() {
  const [makaleler, setMakaleler] = useState<IMakale[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const fetchMakaleler = async () => {
    const params = new URLSearchParams();
    if (statusFilter) params.set("status", statusFilter);
    const res = await fetch(`/api/makaleler?${params}`);
    const data = await res.json();
    setMakaleler(data.makaleler);
  };

  useEffect(() => {
    fetchMakaleler();
  }, [statusFilter]);

  const handleDelete = async (id: string) => {
    if (!confirm("Bu makaleyi silmek istediğinize emin misiniz?")) return;
    await fetch(`/api/makaleler/${id}`, { method: "DELETE" });
    fetchMakaleler();
  };

  const filtered = makaleler.filter((m) =>
    m.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">Makaleler</h1>
        <Link href="/admin/makaleler/yeni" className="btn-primary">
          Yeni Makale
        </Link>
      </div>

      <div className="flex gap-3 mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Makale ara..."
          className="flex-1 max-w-xs px-3 py-2 border border-gray-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">Tüm Durumlar</option>
          <option value="yayinda">Yayında</option>
          <option value="taslak">Taslak</option>
        </select>
      </div>

      <div className="bg-white rounded-lg border border-gray-border">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-border text-left">
              <th className="px-5 py-3 text-xs font-medium text-gray-text uppercase tracking-wide">Başlık</th>
              <th className="px-5 py-3 text-xs font-medium text-gray-text uppercase tracking-wide">Kategori</th>
              <th className="px-5 py-3 text-xs font-medium text-gray-text uppercase tracking-wide">Durum</th>
              <th className="px-5 py-3 text-xs font-medium text-gray-text uppercase tracking-wide">Tarih</th>
              <th className="px-5 py-3 text-xs font-medium text-gray-text uppercase tracking-wide">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-border">
            {filtered.map((makale) => (
              <tr key={makale._id} className="hover:bg-gray-light transition-colors">
                <td className="px-5 py-3">
                  <Link href={`/admin/makaleler/${makale._id}`} className="text-sm font-medium hover:text-primary">
                    {makale.title}
                  </Link>
                </td>
                <td className="px-5 py-3 text-sm text-gray-text">
                  {typeof makale.category === "object" ? makale.category.name : "—"}
                </td>
                <td className="px-5 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${makale.status === "yayinda" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-text"}`}>
                    {makale.status === "yayinda" ? "Yayında" : "Taslak"}
                  </span>
                </td>
                <td className="px-5 py-3 text-sm text-gray-text">
                  {formatDate(makale.createdAt)}
                </td>
                <td className="px-5 py-3">
                  <div className="flex gap-2">
                    <Link href={`/admin/makaleler/${makale._id}`} className="text-xs text-primary hover:underline">Düzenle</Link>
                    <button onClick={() => handleDelete(makale._id)} className="text-xs text-red-600 hover:underline">Sil</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create author management page**

Create `src/app/admin/yazarlar/page.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";
import { IKullanici } from "@/types";

export default function YazarlarPage() {
  const [yazarlar, setYazarlar] = useState<IKullanici[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "yazar">("yazar");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchYazarlar = async () => {
    const res = await fetch("/api/yazarlar");
    if (res.ok) {
      const data = await res.json();
      setYazarlar(data);
    }
  };

  useEffect(() => {
    fetchYazarlar();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/yazarlar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role, bio }),
    });
    setLoading(false);
    setShowForm(false);
    setName("");
    setEmail("");
    setPassword("");
    setRole("yazar");
    setBio("");
    fetchYazarlar();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">Yazarlar</h1>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          Yeni Yazar
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-border p-5 space-y-4 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-text mb-1.5 uppercase tracking-wide">Ad</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border border-gray-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-text mb-1.5 uppercase tracking-wide">E-posta</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 border border-gray-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-text mb-1.5 uppercase tracking-wide">Şifre</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 border border-gray-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-text mb-1.5 uppercase tracking-wide">Rol</label>
              <select value={role} onChange={(e) => setRole(e.target.value as "admin" | "yazar")} className="w-full px-3 py-2 border border-gray-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="yazar">Yazar</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-text mb-1.5 uppercase tracking-wide">Biyografi</label>
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={2} className="w-full px-3 py-2 border border-gray-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div className="flex gap-2">
            <button type="submit" disabled={loading} className="btn-primary disabled:opacity-50">{loading ? "Kaydediliyor..." : "Oluştur"}</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">İptal</button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-lg border border-gray-border">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-border text-left">
              <th className="px-5 py-3 text-xs font-medium text-gray-text uppercase tracking-wide">Ad</th>
              <th className="px-5 py-3 text-xs font-medium text-gray-text uppercase tracking-wide">E-posta</th>
              <th className="px-5 py-3 text-xs font-medium text-gray-text uppercase tracking-wide">Rol</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-border">
            {yazarlar.map((yazar) => (
              <tr key={yazar._id} className="hover:bg-gray-light transition-colors">
                <td className="px-5 py-3 text-sm font-medium">{yazar.name}</td>
                <td className="px-5 py-3 text-sm text-gray-text">{yazar.email}</td>
                <td className="px-5 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${yazar.role === "admin" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-text"}`}>
                    {yazar.role === "admin" ? "Admin" : "Yazar"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create authors API route**

Create `src/app/api/yazarlar/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Kullanici from "@/models/Kullanici";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  await dbConnect();
  const yazarlar = await Kullanici.find().select("-password").sort({ createdAt: -1 });
  return NextResponse.json(yazarlar);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role?: string }).role !== "admin") {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  await dbConnect();
  const body = await req.json();
  body.password = await bcrypt.hash(body.password, 12);
  const yazar = await Kullanici.create(body);

  const result = yazar.toObject();
  delete (result as Record<string, unknown>).password;

  return NextResponse.json(result, { status: 201 });
}
```

- [ ] **Step 4: Commit**

```bash
git add src/app/admin/makaleler/page.tsx src/app/admin/yazarlar/ src/app/api/yazarlar/
git commit -m "feat: admin article list and author management"
```

---

## Task 15: Public Layout — Header & Footer

**Files:**
- Create: `src/components/public/Header.tsx`, `src/components/public/Footer.tsx`, `src/app/(public)/layout.tsx`

- [ ] **Step 1: Create header component**

Create `src/components/public/Header.tsx`:

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/hakkimda", label: "Hakkımda" },
  { href: "/iletisim", label: "İletişim" },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="border-b border-gray-border bg-white sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-6 flex items-center justify-between h-16">
        <Link href="/" className="font-bold text-lg text-dark">
          Tarık Mirza
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm transition-colors ${
                pathname === link.href
                  ? "text-dark font-medium"
                  : "text-gray-text hover:text-dark"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/ara"
            className="text-gray-text hover:text-dark transition-colors"
            aria-label="Ara"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </Link>
        </nav>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-dark"
          aria-label="Menü"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            )}
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-gray-border px-6 py-4 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block text-sm text-gray-text hover:text-dark"
            >
              {link.label}
            </Link>
          ))}
          <Link href="/ara" onClick={() => setMobileOpen(false)} className="block text-sm text-gray-text hover:text-dark">
            Ara
          </Link>
        </div>
      )}
    </header>
  );
}
```

- [ ] **Step 2: Create footer component**

Create `src/components/public/Footer.tsx`:

```tsx
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-border mt-20">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          <div>
            <h3 className="font-bold text-dark">Tarık Mirza</h3>
            <p className="text-sm text-gray-text mt-2 max-w-xs leading-relaxed">
              Ceza hukuku alanında akademik makaleler, içtihat değerlendirmeleri
              ve güncel hukuki analizler.
            </p>
          </div>
          <div className="flex gap-8">
            <div>
              <h4 className="text-xs font-semibold text-gray-text uppercase tracking-wide mb-3">
                Sayfalar
              </h4>
              <div className="space-y-2">
                <Link href="/" className="block text-sm text-gray-text hover:text-dark transition-colors">Ana Sayfa</Link>
                <Link href="/hakkimda" className="block text-sm text-gray-text hover:text-dark transition-colors">Hakkımda</Link>
                <Link href="/iletisim" className="block text-sm text-gray-text hover:text-dark transition-colors">İletişim</Link>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-border mt-8 pt-8">
          <p className="text-xs text-gray-text">
            © {new Date().getFullYear()} Tarık Mirza. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 3: Create public layout**

Create `src/app/(public)/layout.tsx`:

```tsx
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/public/Header.tsx src/components/public/Footer.tsx src/app/\(public\)/layout.tsx
git commit -m "feat: public layout with header and footer"
```

---

## Task 16: Homepage

**Files:**
- Create: `src/components/public/HeroAlani.tsx`, `src/components/public/MakaleKart.tsx`, `src/components/public/KategoriFiltre.tsx`, `src/app/(public)/page.tsx`

- [ ] **Step 1: Create hero component**

Create `src/components/public/HeroAlani.tsx`:

```tsx
import Link from "next/link";
import { IMakale, IKategori } from "@/types";
import { formatDate } from "@/lib/utils";

export default function HeroAlani({ makale }: { makale: IMakale }) {
  const kategori = makale.category as IKategori;

  return (
    <section className="border-b border-gray-border">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <p className="kategori-etiketi mb-4">ÖNE ÇIKAN</p>
        <Link href={`/makale/${makale.slug}`} className="group">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-1">
              <h2 className="text-2xl md:text-3xl font-extrabold leading-tight group-hover:text-primary transition-colors">
                {makale.title}
              </h2>
              <p className="text-gray-text mt-4 leading-relaxed">
                {makale.excerpt}
              </p>
              <div className="flex items-center gap-3 mt-4 text-sm text-gray-text">
                <span>{formatDate(makale.createdAt)}</span>
                <span>·</span>
                <span>{makale.readingTime} dk okuma</span>
                {kategori && (
                  <>
                    <span>·</span>
                    <span className="text-primary font-medium">
                      {kategori.name}
                    </span>
                  </>
                )}
              </div>
            </div>
            {makale.coverImage && (
              <div className="w-full md:w-64 h-44 flex-shrink-0 rounded-lg overflow-hidden bg-gray-light">
                <img
                  src={makale.coverImage}
                  alt={makale.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </Link>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Create article card component**

Create `src/components/public/MakaleKart.tsx`:

```tsx
import Link from "next/link";
import { IMakale, IKategori } from "@/types";

export default function MakaleKart({ makale }: { makale: IMakale }) {
  const kategori = makale.category as IKategori;

  return (
    <Link href={`/makale/${makale.slug}`} className="group">
      <article className="border border-gray-border rounded-lg overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
        {makale.coverImage ? (
          <div className="h-44 bg-gray-light overflow-hidden">
            <img
              src={makale.coverImage}
              alt={makale.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        ) : (
          <div className="h-44 bg-gray-light" />
        )}
        <div className="p-5">
          {kategori && (
            <p className="kategori-etiketi mb-2">{kategori.name}</p>
          )}
          <h3 className="font-bold text-dark leading-snug group-hover:text-primary transition-colors">
            {makale.title}
          </h3>
          <p className="text-sm text-gray-text mt-2 leading-relaxed line-clamp-2">
            {makale.excerpt}
          </p>
          <p className="text-xs text-gray-text mt-3">
            {makale.readingTime} dk okuma
          </p>
        </div>
      </article>
    </Link>
  );
}
```

- [ ] **Step 3: Create category filter component**

Create `src/components/public/KategoriFiltre.tsx`:

```tsx
"use client";

import { IKategori } from "@/types";

interface Props {
  kategoriler: IKategori[];
  aktif: string;
  onChange: (slug: string) => void;
}

export default function KategoriFiltre({ kategoriler, aktif, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange("")}
        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
          aktif === ""
            ? "bg-dark text-white"
            : "bg-gray-light text-dark hover:bg-gray-200"
        }`}
      >
        Tümü
      </button>
      {kategoriler.map((kat) => (
        <button
          key={kat._id}
          onClick={() => onChange(kat._id)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            aktif === kat._id
              ? "bg-dark text-white"
              : "bg-gray-light text-dark hover:bg-gray-200"
          }`}
        >
          {kat.name}
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Create homepage**

Create `src/app/(public)/page.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";
import HeroAlani from "@/components/public/HeroAlani";
import MakaleKart from "@/components/public/MakaleKart";
import KategoriFiltre from "@/components/public/KategoriFiltre";
import { IMakale, IKategori } from "@/types";

export default function AnaSayfa() {
  const [makaleler, setMakaleler] = useState<IMakale[]>([]);
  const [kategoriler, setKategoriler] = useState<IKategori[]>([]);
  const [aktifKategori, setAktifKategori] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/makaleler?status=yayinda").then((r) => r.json()),
      fetch("/api/kategoriler").then((r) => r.json()),
    ]).then(([makaleData, katData]) => {
      setMakaleler(makaleData.makaleler);
      setKategoriler(katData);
    });
  }, []);

  const oneCikan = makaleler[0];
  const digerMakaleler = makaleler.slice(1);

  const filtrelenmis = aktifKategori
    ? digerMakaleler.filter((m) => {
        const catId =
          typeof m.category === "string" ? m.category : m.category._id;
        return catId === aktifKategori;
      })
    : digerMakaleler;

  return (
    <>
      {oneCikan && <HeroAlani makale={oneCikan} />}

      <section className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-lg font-bold">Makaleler</h2>
        </div>

        <div className="mb-8">
          <KategoriFiltre
            kategoriler={kategoriler}
            aktif={aktifKategori}
            onChange={setAktifKategori}
          />
        </div>

        {filtrelenmis.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtrelenmis.map((makale) => (
              <MakaleKart key={makale._id} makale={makale} />
            ))}
          </div>
        ) : (
          <p className="text-gray-text text-sm text-center py-12">
            Bu kategoride henüz makale bulunmuyor.
          </p>
        )}
      </section>
    </>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add src/components/public/HeroAlani.tsx src/components/public/MakaleKart.tsx src/components/public/KategoriFiltre.tsx src/app/\(public\)/page.tsx
git commit -m "feat: homepage with hero, article grid, and category filter"
```

---

## Task 17: Article Detail Page

**Files:**
- Create: `src/components/public/IcindekilerTablosu.tsx`, `src/components/public/PaylasimButonlari.tsx`, `src/components/public/YazarKarti.tsx`, `src/components/public/IlgiliMakaleler.tsx`, `src/app/(public)/makale/[slug]/page.tsx`

- [ ] **Step 1: Create table of contents component**

Create `src/components/public/IcindekilerTablosu.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export default function IcindekilerTablosu({ content }: { content: string }) {
  const [items, setItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");
    const headings = doc.querySelectorAll("h2, h3");
    const tocItems: TocItem[] = [];

    headings.forEach((heading, index) => {
      const id = `heading-${index}`;
      tocItems.push({
        id,
        text: heading.textContent || "",
        level: heading.tagName === "H2" ? 2 : 3,
      });
    });

    setItems(tocItems);
  }, [content]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-80px 0px -80% 0px" }
    );

    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav className="hidden lg:block w-48 flex-shrink-0">
      <div className="sticky top-24">
        <p className="text-xs font-semibold text-gray-text uppercase tracking-widest mb-3">
          İçindekiler
        </p>
        <div className="border-l-2 border-gray-border pl-3 space-y-2">
          {items.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`block text-xs transition-colors ${
                item.level === 3 ? "pl-3" : ""
              } ${
                activeId === item.id
                  ? "text-primary font-medium border-l-2 border-primary -ml-[calc(0.75rem+2px)] pl-[calc(0.75rem)]"
                  : "text-gray-text hover:text-dark"
              }`}
            >
              {item.text}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
```

- [ ] **Step 2: Create share buttons component**

Create `src/components/public/PaylasimButonlari.tsx`:

```tsx
"use client";

export default function PaylasimButonlari({
  title,
  slug,
}: {
  title: string;
  slug: string;
}) {
  const url = typeof window !== "undefined" ? `${window.location.origin}/makale/${slug}` : "";

  const shareTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      "_blank"
    );
  };

  const shareLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      "_blank"
    );
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(url);
    alert("Link kopyalandı!");
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={shareTwitter}
        className="w-8 h-8 bg-gray-light rounded-md flex items-center justify-center text-gray-text hover:bg-gray-200 hover:text-dark transition-colors text-sm"
        title="X'te paylaş"
      >
        𝕏
      </button>
      <button
        onClick={shareLinkedIn}
        className="w-8 h-8 bg-gray-light rounded-md flex items-center justify-center text-gray-text hover:bg-gray-200 hover:text-dark transition-colors text-xs font-bold"
        title="LinkedIn'de paylaş"
      >
        in
      </button>
      <button
        onClick={copyLink}
        className="w-8 h-8 bg-gray-light rounded-md flex items-center justify-center text-gray-text hover:bg-gray-200 hover:text-dark transition-colors"
        title="Linki kopyala"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
        </svg>
      </button>
    </div>
  );
}
```

- [ ] **Step 3: Create author card component**

Create `src/components/public/YazarKarti.tsx`:

```tsx
import { IKullanici } from "@/types";

export default function YazarKarti({ yazar }: { yazar: IKullanici }) {
  return (
    <div className="border-t border-gray-border pt-8 mt-12">
      <div className="flex gap-4 items-start bg-gray-light/50 rounded-xl p-6">
        <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
          {yazar.avatar ? (
            <img
              src={yazar.avatar}
              alt={yazar.name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            yazar.name.charAt(0)
          )}
        </div>
        <div>
          <p className="font-bold text-dark">{yazar.name}</p>
          {yazar.bio && (
            <p className="text-sm text-gray-text mt-1 leading-relaxed">
              {yazar.bio}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Create related articles component**

Create `src/components/public/IlgiliMakaleler.tsx`:

```tsx
import MakaleKart from "./MakaleKart";
import { IMakale } from "@/types";

export default function IlgiliMakaleler({
  makaleler,
}: {
  makaleler: IMakale[];
}) {
  if (makaleler.length === 0) return null;

  return (
    <section className="mt-16">
      <h2 className="text-lg font-bold mb-6">İlgili Makaleler</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {makaleler.map((makale) => (
          <MakaleKart key={makale._id} makale={makale} />
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Create article detail page**

Create `src/app/(public)/makale/[slug]/page.tsx`:

```tsx
import dbConnect from "@/lib/db";
import Makale from "@/models/Makale";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/utils";
import IcindekilerTablosu from "@/components/public/IcindekilerTablosu";
import PaylasimButonlari from "@/components/public/PaylasimButonlari";
import YazarKarti from "@/components/public/YazarKarti";
import IlgiliMakaleler from "@/components/public/IlgiliMakaleler";
import { IMakale, IKullanici, IKategori } from "@/types";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  await dbConnect();
  const { slug } = await params;
  const makale = await Makale.findOne({ slug, status: "yayinda" });
  if (!makale) return { title: "Bulunamadı" };
  return {
    title: makale.title,
    description: makale.excerpt,
  };
}

function addHeadingIds(html: string): string {
  let index = 0;
  return html.replace(/<(h[23])>/g, () => {
    const id = `heading-${index}`;
    index++;
    return `<$1 id="${id}">`.replace("$1", index % 2 === 0 ? "h2" : "h3");
  }).replace(/<(h[23])>/g, (match) => {
    const id = `heading-${index}`;
    index++;
    return match.replace(">", ` id="${id}">`);
  });
}

export default async function MakaleDetay({ params }: Props) {
  await dbConnect();
  const { slug } = await params;

  const makale = await Makale.findOne({ slug, status: "yayinda" })
    .populate("category", "name slug")
    .populate("author", "name avatar bio");

  if (!makale) notFound();

  const makaleObj = JSON.parse(JSON.stringify(makale)) as IMakale;
  const yazar = makaleObj.author as IKullanici;
  const kategori = makaleObj.category as IKategori;

  // İçerikteki h2/h3'lere id ekle
  let headingIndex = 0;
  const contentWithIds = makaleObj.content.replace(
    /<(h[23])>/g,
    (match, tag) => {
      const id = `heading-${headingIndex}`;
      headingIndex++;
      return `<${tag} id="${id}">`;
    }
  );

  // İlgili makaleler
  const ilgiliRaw = await Makale.find({
    category: makale.category._id,
    status: "yayinda",
    _id: { $ne: makale._id },
  })
    .populate("category", "name slug")
    .populate("author", "name avatar")
    .limit(2);

  const ilgiliMakaleler = JSON.parse(JSON.stringify(ilgiliRaw)) as IMakale[];

  return (
    <article>
      {/* Header */}
      <div className="max-w-content mx-auto px-6 pt-12">
        {kategori && (
          <p className="kategori-etiketi mb-4">{kategori.name}</p>
        )}
        <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">
          {makaleObj.title}
        </h1>
        <p className="text-lg text-gray-text mt-4 leading-relaxed">
          {makaleObj.excerpt}
        </p>

        {/* Meta */}
        <div className="flex items-center gap-4 mt-6 pb-6 border-b border-gray-border">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
            {yazar.avatar ? (
              <img src={yazar.avatar} alt={yazar.name} className="w-full h-full rounded-full object-cover" />
            ) : (
              yazar.name.charAt(0)
            )}
          </div>
          <div>
            <p className="text-sm font-semibold">{yazar.name}</p>
            <p className="text-xs text-gray-text">
              {formatDate(makaleObj.createdAt)} · {makaleObj.readingTime} dk
              okuma
            </p>
          </div>
          <div className="ml-auto">
            <PaylasimButonlari title={makaleObj.title} slug={makaleObj.slug} />
          </div>
        </div>
      </div>

      {/* Cover Image */}
      {makaleObj.coverImage && (
        <div className="max-w-content-wide mx-auto px-6 my-8">
          <img
            src={makaleObj.coverImage}
            alt={makaleObj.title}
            className="w-full rounded-xl object-cover max-h-96"
          />
        </div>
      )}

      {/* Content + TOC */}
      <div className="max-w-content-wide mx-auto px-6 flex gap-12">
        <div
          className="prose prose-lg max-w-content flex-1
            prose-headings:text-dark prose-headings:font-bold
            prose-h2:text-xl prose-h2:mt-10 prose-h2:mb-4
            prose-h3:text-lg prose-h3:mt-8 prose-h3:mb-3
            prose-p:text-dark/80 prose-p:leading-[1.85]
            prose-blockquote:border-l-primary prose-blockquote:bg-blue-50/50 prose-blockquote:rounded-r-md prose-blockquote:py-3 prose-blockquote:not-italic
            prose-li:text-dark/80
            prose-a:text-primary prose-a:no-underline hover:prose-a:underline
            prose-img:rounded-lg"
          dangerouslySetInnerHTML={{ __html: contentWithIds }}
        />
        <IcindekilerTablosu content={makaleObj.content} />
      </div>

      {/* Author Card & Related */}
      <div className="max-w-content mx-auto px-6 pb-16">
        <YazarKarti yazar={yazar} />
        <IlgiliMakaleler makaleler={ilgiliMakaleler} />
      </div>
    </article>
  );
}
```

- [ ] **Step 6: Commit**

```bash
git add src/components/public/IcindekilerTablosu.tsx src/components/public/PaylasimButonlari.tsx src/components/public/YazarKarti.tsx src/components/public/IlgiliMakaleler.tsx src/app/\(public\)/makale/
git commit -m "feat: article detail page with TOC, author card, related articles"
```

---

## Task 18: Category Page, Search, Static Pages

**Files:**
- Create: `src/app/(public)/kategori/[slug]/page.tsx`, `src/app/(public)/ara/page.tsx`, `src/app/(public)/hakkimda/page.tsx`, `src/app/(public)/iletisim/page.tsx`

- [ ] **Step 1: Create category page**

Create `src/app/(public)/kategori/[slug]/page.tsx`:

```tsx
import dbConnect from "@/lib/db";
import Kategori from "@/models/Kategori";
import Makale from "@/models/Makale";
import { notFound } from "next/navigation";
import MakaleKart from "@/components/public/MakaleKart";
import { IMakale } from "@/types";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  await dbConnect();
  const { slug } = await params;
  const kategori = await Kategori.findOne({ slug });
  if (!kategori) return { title: "Bulunamadı" };
  return {
    title: kategori.name,
    description: kategori.description,
  };
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

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="mb-10">
        <p className="kategori-etiketi mb-2">KATEGORİ</p>
        <h1 className="text-2xl font-extrabold">{kategori.name}</h1>
        {kategori.description && (
          <p className="text-gray-text mt-2">{kategori.description}</p>
        )}
      </div>

      {makaleler.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {makaleler.map((makale) => (
            <MakaleKart key={makale._id} makale={makale} />
          ))}
        </div>
      ) : (
        <p className="text-gray-text text-center py-12">
          Bu kategoride henüz makale bulunmuyor.
        </p>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Create search page**

Create `src/app/(public)/ara/page.tsx`:

```tsx
"use client";

import { useState } from "react";
import MakaleKart from "@/components/public/MakaleKart";
import { IMakale } from "@/types";

export default function AramaSayfasi() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<IMakale[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim().length < 2) return;

    setLoading(true);
    const res = await fetch(`/api/ara?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    setResults(data.makaleler);
    setSearched(true);
    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-extrabold mb-6">Makale Ara</h1>

      <form onSubmit={handleSearch} className="flex gap-3 mb-10">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Başlık veya içerik ara..."
          className="flex-1 px-4 py-3 border border-gray-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          autoFocus
        />
        <button type="submit" disabled={loading} className="btn-primary px-6 disabled:opacity-50">
          {loading ? "Aranıyor..." : "Ara"}
        </button>
      </form>

      {searched && (
        <>
          <p className="text-sm text-gray-text mb-6">
            &quot;{query}&quot; için {results.length} sonuç bulundu.
          </p>
          {results.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {results.map((makale) => (
                <MakaleKart key={makale._id} makale={makale} />
              ))}
            </div>
          ) : (
            <p className="text-gray-text text-center py-12">
              Aramanızla eşleşen makale bulunamadı.
            </p>
          )}
        </>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Create about page**

Create `src/app/(public)/hakkimda/page.tsx`:

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hakkımda",
};

export default function HakkimdaPage() {
  return (
    <div className="max-w-content mx-auto px-6 py-16">
      <h1 className="text-3xl font-extrabold mb-8">Hakkımda</h1>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="w-32 h-32 bg-primary rounded-full flex items-center justify-center text-white font-bold text-4xl flex-shrink-0">
          T
        </div>
        <div className="prose prose-lg max-w-none">
          <p className="text-lg text-dark/80 leading-relaxed">
            Merhaba, ben <strong>Tarık Mirza</strong>. Ceza hukuku alanında
            araştırmalar yapan bir hukuk öğrencisiyim.
          </p>
          <p className="text-dark/80 leading-relaxed">
            Bu platformda ceza hukukunun genel ve özel hükümlerine ilişkin
            akademik makaleler, güncel Yargıtay kararlarının değerlendirmeleri
            ve hukuki analizler paylaşıyorum.
          </p>
          <p className="text-dark/80 leading-relaxed">
            Amacım, ceza hukuku alanındaki bilgi birikimimi paylaşarak hem
            hukuk öğrencilerine hem de konuya ilgi duyan herkese faydalı bir
            kaynak oluşturmaktır.
          </p>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Create contact page**

Create `src/app/(public)/iletisim/page.tsx`:

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "İletişim",
};

export default function IletisimPage() {
  return (
    <div className="max-w-content mx-auto px-6 py-16">
      <h1 className="text-3xl font-extrabold mb-4">İletişim</h1>
      <p className="text-gray-text mb-10">
        Soru, öneri veya iş birliği teklifleri için aşağıdaki kanallardan
        bana ulaşabilirsiniz.
      </p>

      <div className="space-y-6">
        <div className="bg-gray-light/50 rounded-xl p-6">
          <h3 className="font-semibold text-sm uppercase tracking-wide text-gray-text mb-2">
            E-posta
          </h3>
          <a
            href="mailto:tarik@example.com"
            className="text-primary hover:underline"
          >
            tarik@example.com
          </a>
        </div>

        <div className="bg-gray-light/50 rounded-xl p-6">
          <h3 className="font-semibold text-sm uppercase tracking-wide text-gray-text mb-2">
            LinkedIn
          </h3>
          <p className="text-dark">linkedin.com/in/tarikmirza</p>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add src/app/\(public\)/kategori/ src/app/\(public\)/ara/ src/app/\(public\)/hakkimda/ src/app/\(public\)/iletisim/
git commit -m "feat: category page, search, about and contact pages"
```

---

## Task 19: Final Polish & Verification

- [ ] **Step 1: Delete the default Next.js page content**

Remove the default `src/app/page.tsx` if it exists (the homepage is now at `src/app/(public)/page.tsx`).

```bash
rm -f src/app/page.tsx
```

- [ ] **Step 2: Add `@tailwindcss/typography` plugin for prose styling**

```bash
npm install @tailwindcss/typography
```

Then update `tailwind.config.ts` plugins array:

```typescript
plugins: [require("@tailwindcss/typography")],
```

- [ ] **Step 3: Run dev server and verify all routes**

```bash
npm run dev
```

Verify these routes work:
- `http://localhost:3000` — Homepage with articles
- `http://localhost:3000/makale/ceza-hukukunda-mesru-mudafaanin-sinirlari` — Article detail
- `http://localhost:3000/kategori/ceza-genel-hukuku` — Category page
- `http://localhost:3000/hakkimda` — About page
- `http://localhost:3000/iletisim` — Contact page
- `http://localhost:3000/ara` — Search page
- `http://localhost:3000/admin/giris` — Admin login
- `http://localhost:3000/admin` — Admin dashboard (after login)
- `http://localhost:3000/admin/makaleler` — Article list
- `http://localhost:3000/admin/makaleler/yeni` — New article
- `http://localhost:3000/admin/kategoriler` — Categories
- `http://localhost:3000/admin/yazarlar` — Authors

- [ ] **Step 4: Run build to check for errors**

```bash
npm run build
```

Fix any TypeScript or build errors.

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "feat: final polish — typography plugin, cleanup"
```
