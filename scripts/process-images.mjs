// Usage: node scripts/process-images.mjs <assetsDir> <cutoutsDir>
// Resizes original photos, converts subject cutouts and builds a transparent logo + icons.
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const [assets, cutouts] = process.argv.slice(2);
const pub = path.resolve("public/images");
fs.mkdirSync(path.join(pub, "photos"), { recursive: true });
fs.mkdirSync(path.join(pub, "cut"), { recursive: true });
fs.mkdirSync(path.resolve("src/app"), { recursive: true });

const photos = {
  "Bradulet alb-2.jpg": "bradut-alb-globuri",
  "Bradulet alb.jpg": "bradut-alb",
  "Bradulet maro.jpg": "bradut-lapte",
  "Bradulet maro 2.jpg": "bradut-lapte-globuri",
  "Bradulet verde.jpg": "bradut-verde",
  "Ciocolata Alba.jpg": "tableta-alba",
  "Ciocolata alune.jpg": "tableta-arahide",
  "Ciocolata biscoff.jpg": "tableta-biscoff",
  "Cutii.jpg": "cutii-praline",
  "Marturii.jpg": "marturii-zmeura",
  "Marturii 1.jpg": "marturii-mini-tablete",
  "Marturii 2.jpg": "marturii-fistic-zmeura",
  "Marturii 3.jpg": "marturii-alba-fistic",
  "Marturii 4.jpg": "batoane-nuci",
  "WhatsApp Image 2026-11-20 at 20.55.16.jpeg": "cutie-praline-eveniment",
  "WhatsApp Image 2026-11-20 at 20.55.17.jpeg": "choco-bar-atelier",
  "WhatsApp Image 2026-11-20 at 20.55.18.jpeg": "atelier-callebaut",
};
// Photos carrying the photographer's watermark at the bottom: crop it for web, credit in footer.
const watermarked = new Set(["choco-bar-atelier", "atelier-callebaut"]);
for (const [src, name] of Object.entries(photos)) {
  let img = sharp(path.join(assets, src)).rotate();
  if (watermarked.has(name)) {
    const m = await sharp(path.join(assets, src)).rotate().metadata();
    img = sharp(await img.extract({ left: 0, top: 0, width: m.width, height: Math.round(m.height * 0.86) }).toBuffer());
  }
  await img.resize({ width: 2400, height: 2400, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true }).toFile(path.join(pub, "photos", name + ".jpg"));
}
const cuts = {
  "bradulet-alb-2": "bradut-alb-2", "bradulet-alb": "bradut-alb", "bradulet-maro": "bradut-lapte",
  "bradulet-maro-2": "bradut-lapte-2", "bradulet-verde": "bradut-verde", "ciocolata-alba": "tableta-alba",
  "ciocolata-alune": "tableta-arahide", "ciocolata-biscoff": "tableta-biscoff", "cutii": "cutii-praline",
  "marturii": "tableta-zmeura", "marturii-1": "mini-tablete", "marturii-4": "batoane-nuci",
  "marturii-2": "tableta-fistic-zmeura", "marturii-3": "tableta-alba-fistic",
};
for (const [src, name] of Object.entries(cuts)) {
  await sharp(path.join(cutouts, src + ".png")).trim().resize({ width: 1800, height: 1800, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 88, alphaQuality: 95 }).toFile(path.join(pub, "cut", name + ".webp"));
}

// Logo: gold on black -> gold with alpha (unpremultiply by luminance)
async function logo(out, tint) {
  const { data, info } = await sharp(path.join(assets, "logo-negru.jpeg")).raw().toBuffer({ resolveWithObject: true });
  const px = Buffer.alloc(info.width * info.height * 4);
  for (let i = 0, j = 0; i < data.length; i += info.channels, j += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const m = Math.max(r, g, b);
    let a = Math.min(1, Math.max(0, (m - 14) / 190));
    if (tint) a = Math.pow(a, 0.6);
    const k = a > 0 ? 1 / Math.max(a, 0.001) : 0;
    let R = Math.min(255, r * k), G = Math.min(255, g * k), B = Math.min(255, b * k);
    if (tint) { R = R * tint; G = G * tint; B = B * tint; }
    px[j] = R; px[j + 1] = G; px[j + 2] = B; px[j + 3] = Math.round(a * 255);
  }
  await sharp(px, { raw: { width: info.width, height: info.height, channels: 4 } }).trim({ threshold: 2 })
    .png({ compressionLevel: 9 }).toFile(out);
}
await logo(path.join(pub, "logo-gold.png"));
await logo(path.join(pub, "logo-gold-dark.png"), 0.72);

// Icon: the cacao-pod emblem of the logo on chocolate background
const meta = await sharp(path.join(pub, "logo-gold.png")).metadata();
const m = await sharp(path.join(pub, "logo-gold.png"))
  .extract({ left: Math.round(meta.width * 0.452), top: Math.round(meta.height * 0.59), width: Math.round(meta.width * 0.158), height: Math.round(meta.height * 0.19) })
  .trim({ threshold: 10 }).toBuffer();
for (const [file, size] of [["icon.png", 512], ["apple-icon.png", 180]]) {
  const inner = await sharp(m).resize({ width: Math.round(size * 0.78), height: Math.round(size * 0.78), fit: "inside" }).toBuffer();
  await sharp({ create: { width: size, height: size, channels: 4, background: "#1c130f" } })
    .composite([{ input: inner, gravity: "center" }]).png().toFile(path.resolve("src/app", file));
}
console.log("done");
