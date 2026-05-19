/**
 * Mevcut Kullanici kayıtlarında slug yoksa slugify(name) ile doldur.
 * Çakışmada -2, -3... suffix ekler.
 *
 * Çalıştır: npm run migrate:yazar-slugs
 */

import dotenv from "dotenv";
import mongoose from "mongoose";
import Kullanici from "../src/models/Kullanici";
import { slugify } from "../src/lib/utils";

// Next.js convention: .env.local has dev secrets; fall back to .env
dotenv.config({ path: ".env.local" });
dotenv.config();

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI env yok");

  await mongoose.connect(uri);
  console.log("Mongo bağlandı");

  const kullanicilar = await Kullanici.find({
    $or: [{ slug: { $exists: false } }, { slug: "" }, { slug: null }],
  });

  console.log(`${kullanicilar.length} yazar için slug üretilecek`);

  for (const k of kullanicilar) {
    const base = slugify(k.name);
    if (!base) {
      console.log(`  ${k.name} → atlandı (slugify boş)`);
      continue;
    }
    let candidate = base;
    let i = 2;
    while (
      await Kullanici.findOne({ slug: candidate, _id: { $ne: k._id } })
    ) {
      candidate = `${base}-${i++}`;
    }
    k.slug = candidate;
    await k.save();
    console.log(`  ${k.name} → ${candidate}`);
  }

  console.log("Tamam.");
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
