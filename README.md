# Meredith Choco House — site

Next.js 16 (App Router), static generation, GSAP + Lenis, WebGL hero.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Where to edit
- **Products & prices:** `src/lib/products.ts` (catalogue from the client's Excel)
- **Contact details, hours, social links, launch date:** `src/lib/site.ts`
- **FAQ:** `src/lib/faq.ts`

## Images
`scripts/process-images.mjs` resizes the originals in `../assets` into `public/images`.
New product cut-outs (transparent background, macOS 14+):
```bash
swiftc -O scripts/cutout.swift -o /tmp/cutout
/tmp/cutout "../assets/New photo.jpg" /tmp/new-cutout.png
```
Then add it to the `cuts` map in `process-images.mjs` and rerun the script.

## Deploy
Vercel (recommended): import the `web` folder and point the meredithchoco.ro domain at it.

## Client preview (GitHub Pages)
Every push to `main` runs `.github/workflows/deploy-pages.yml`: lint + typecheck, then a static export
(`PAGES_BASE_PATH` = repo path) uploaded to GitHub Pages. The preview is `noindex` and its robots.txt
disallows crawling, so it never competes with meredithchoco.ro in Google.
One-time setup: repo **Settings → Pages → Source: GitHub Actions**.
