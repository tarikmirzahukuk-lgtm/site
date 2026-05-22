/**
 * Admin kullanıcı oluşturur (ya da varsa şifresini günceller).
 *
 * Kullanım:
 *   npm run seed:admin -- <email> <şifre> [ad]
 * Örnek:
 *   npm run seed:admin -- tarik@example.com Sifre1234 "Tarık Mirza"
 */

import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Kullanici from "../src/models/Kullanici";

// Next.js convention: .env.local önce, sonra .env
dotenv.config({ path: ".env.local" });
dotenv.config();

async function main() {
  const email = process.argv[2];
  const password = process.argv[3];
  const name = process.argv[4] || "Tarık Mirza";

  if (!email || !password) {
    console.error(
      'Kullanım: npm run seed:admin -- <email> <şifre> ["Ad Soyad"]'
    );
    process.exit(1);
  }
  if (password.length < 6) {
    console.error("Şifre en az 6 karakter olmalı.");
    process.exit(1);
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI env yok");

  await mongoose.connect(uri);
  console.log("Mongo bağlandı.");

  const hashed = await bcrypt.hash(password, 12);
  const existing = await Kullanici.findOne({ email });

  if (existing) {
    existing.password = hashed;
    existing.role = "admin";
    existing.name = name;
    await existing.save();
    console.log(`Mevcut kullanıcı admin olarak güncellendi: ${email}`);
    console.log(`  slug: ${existing.slug}`);
  } else {
    const yeni = await Kullanici.create({
      name,
      email,
      password: hashed,
      role: "admin",
      bio: "",
    });
    console.log(`Yeni admin oluşturuldu: ${email}`);
    console.log(`  slug: ${yeni.slug}`);
  }

  await mongoose.disconnect();
  console.log("Tamam. Artık /admin/giris üzerinden giriş yapabilirsiniz.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
