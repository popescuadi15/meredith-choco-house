// Usage (from web/): node scripts/clean-cutouts.mjs
// Transparent product PNGs from the client → web cut-outs without the light fringe on the edge.
import sharp from "sharp";

// ——— Product cut-outs supplied as transparent PNGs (16-bit, with a light fringe) ———
// Usage: node scripts/process-images.mjs --pngs ../assets
// Erodes the alpha by R px (separable min filter) so the white fringe disappears, then feathers 1px.
async function cleanCutout(file, out, R = 9) {
  const eight = await sharp(file).ensureAlpha().webp({ lossless: true }).toBuffer();
  const { data, info } = await sharp(eight).extractChannel(3).raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height;
  const tmp = new Uint8Array(W * H), ero = Buffer.alloc(W * H);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    let m = 255;
    for (let k = Math.max(0, x - R); k <= Math.min(W - 1, x + R) && m; k++) m = Math.min(m, data[y * W + k]);
    tmp[y * W + x] = m;
  }
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    let m = 255;
    for (let k = Math.max(0, y - R); k <= Math.min(H - 1, y + R) && m; k++) m = Math.min(m, tmp[k * W + x]);
    ero[y * W + x] = m;
  }
  const mask = await sharp(ero, { raw: { width: W, height: H, channels: 1 } }).blur(1.2).png().toBuffer();
  const rgb = await sharp(eight).removeAlpha().png().toBuffer();
  const joined = await sharp(rgb).joinChannel(mask).png().toBuffer();
  await sharp(joined).trim({ threshold: 1 }).resize({ width: 1800, height: 1800, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 88, alphaQuality: 95 }).toFile(out);
}

const A = "../assets/";
const cuts = {
  "Dubai 100gr.png": "dubai-100",
  "Dubai 200gr.png": "dubai-200",
  "Ciocolata zmeura.png": "tableta-zmeura-noua",
  "Ciocolata Oreo.png": "tableta-oreo",
  "Ciocolata crunchy cocos.png": "tableta-crunchy-cocos",
  "Bradulet dark.png": "bradut-dark",
  "IMG_4681.png": "cutii-selection-4",
  "IMG_4672.png": "cutie-gold",
};
for (const [f, n] of Object.entries(cuts)) {
  await cleanCutout(A + f, `public/images/cut/${n}.webp`);
  console.log("ok", n);
}
