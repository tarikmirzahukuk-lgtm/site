/**
 * Site içeriğini (SiteContent singleton) ilk değerlerle oluşturur.
 *
 * Kullanım:
 *   npm run seed:site-content           # yoksa oluşturur, varsa dokunmaz
 *   npm run seed:site-content -- --force # mevcut dökümanı varsayılanlarla EZER
 */

import dotenv from "dotenv";
import mongoose from "mongoose";
import SiteContent from "../src/models/SiteContent";
import { SITE_CONTENT_DEFAULTS } from "../src/lib/site-content-defaults";

// Next.js convention: .env.local önce, sonra .env
dotenv.config({ path: ".env.local" });
dotenv.config();

async function main() {
  const force = process.argv.includes("--force");

  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI env yok (.env.local).");

  await mongoose.connect(uri);
  console.log("Mongo bağlandı.");

  const existing = await SiteContent.findOne({ key: "main" });
  if (existing && !force) {
    console.log(
      "SiteContent zaten var. Üzerine yazmak için: npm run seed:site-content -- --force"
    );
  } else {
    await SiteContent.findOneAndUpdate(
      { key: "main" },
      { $set: { ...SITE_CONTENT_DEFAULTS, key: "main" } },
      { upsert: true, new: true }
    );
    console.log(
      force
        ? "SiteContent --force ile varsayılanlara güncellendi."
        : "SiteContent oluşturuldu."
    );
  }

  await mongoose.disconnect();
  console.log("Tamam. /admin/site-icerik üzerinden düzenleyebilirsiniz.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
