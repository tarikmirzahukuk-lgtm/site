/* Tek seferlik: indirilen MİRZA logosu jpg'inden (damalı zemin + 2 kopya)
   tek logoyu çıkar, zemini renk-anahtarla → şeffaf PNG amblem + tam logo üret. */
const sharp = require("sharp");

const SRC = "C:/Users/turko/Downloads/eaedf89c-9f65-4ba6-9349-2b63064f8535.jpg";
const OUT_AMBLEM = "C:/Users/maest/Documents/tarik-site/public/mirza-amblem.png";
const OUT_FULL = "C:/Users/maest/Documents/tarik-site/public/mirza-logo.png";

(async () => {
  const meta = await sharp(SRC).metadata();
  const W = meta.width, H = meta.height;
  // Sol logo: genişliğin ilk ~yarısı (ikinci kopyayı dışla)
  const cropW = Math.floor(W * 0.5);
  const { data, info } = await sharp(SRC)
    .extract({ left: 0, top: 0, width: cropW, height: H })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const w = info.width, h = info.height, ch = info.channels;

  // Zemini anahtarla: nötr (gri) VE açık piksel → saydam (damalı zemin + gölge)
  for (let i = 0; i < w * h; i++) {
    const r = data[i * ch], g = data[i * ch + 1], b = data[i * ch + 2];
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    const isGray = max - min < 26;
    const light = max / 255;
    if (isGray && light > 0.5) data[i * ch + 3] = 0;
  }

  // Satır/sütun doluluk + bbox
  const rowOpaque = new Array(h).fill(0);
  let minX = w, maxX = 0, minY = h, maxY = 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (data[(y * w + x) * ch + 3] > 40) {
        rowOpaque[y]++;
        if (x < minX) minX = x; if (x > maxX) maxX = x;
        if (y < minY) minY = y; if (y > maxY) maxY = y;
      }
    }
  }

  // Amblem ↔ "MİRZA" ayrımı: alt-orta bantta en AZ dolu satırı (vadi) bul
  const range = maxY - minY;
  const bandTop = Math.floor(minY + range * 0.60);
  const bandBot = Math.floor(minY + range * 0.82);
  let valleyY = bandTop, valleyVal = Infinity;
  for (let y = bandTop; y <= bandBot; y++) {
    if (rowOpaque[y] < valleyVal) { valleyVal = rowOpaque[y]; valleyY = y; }
  }
  const emblemBottom = valleyY;
  console.log("band", bandTop, "→", bandBot, "valleyY", valleyY, "valleyOpaque", valleyVal);

  // Amblem bbox (üst..gapStart) sütun sınırları
  let aMinX = w, aMaxX = 0;
  for (let y = minY; y <= emblemBottom; y++) {
    for (let x = 0; x < w; x++) {
      if (data[(y * w + x) * ch + 3] > 40) { if (x < aMinX) aMinX = x; if (x > aMaxX) aMaxX = x; }
    }
  }

  console.log("dims", W, "x", H, "crop", w, "x", h);
  console.log("opaque bbox", { minX, minY, maxX, maxY });
  console.log("amblem bbox x", aMinX, "→", aMaxX, "y", minY, "→", emblemBottom);

  const keyed = sharp(Buffer.from(data), { raw: { width: w, height: h, channels: ch } });

  const PAD = 6;
  // Amblem (yazısız)
  await keyed
    .clone()
    .extract({
      left: Math.max(0, aMinX - PAD),
      top: Math.max(0, minY - PAD),
      width: Math.min(w, aMaxX - aMinX + 1 + 2 * PAD),
      height: Math.min(h, emblemBottom - minY + 1 + 2 * PAD),
    })
    .png()
    .toFile(OUT_AMBLEM);

  // Tam logo (amblem + MİRZA)
  await keyed
    .clone()
    .extract({
      left: Math.max(0, minX - PAD),
      top: Math.max(0, minY - PAD),
      width: Math.min(w, maxX - minX + 1 + 2 * PAD),
      height: Math.min(h, maxY - minY + 1 + 2 * PAD),
    })
    .png()
    .toFile(OUT_FULL);

  const a = await sharp(OUT_AMBLEM).metadata();
  const f = await sharp(OUT_FULL).metadata();
  console.log("WROTE amblem", a.width, "x", a.height, "| full", f.width, "x", f.height);
})().catch((e) => { console.error("ERR", e); process.exit(1); });
