import type { NextConfig } from "next";

/**
 * PAGES_BASE_PATH set (even to "") → static export to `out/` with a pass-through image loader.
 *   GitHub Pages preview: "/meredith-choco-house"; Cloudflare Pages (root domain): "".
 * SITE_PREVIEW=1 → noindex + robots disallow (temporary client preview only).
 * Neither set (local dev) → regular Next.js server with image optimization.
 */
const pagesBase = process.env.PAGES_BASE_PATH;
const isPages = pagesBase !== undefined;

const nextConfig: NextConfig = {
  poweredByHeader: false,
  turbopack: { root: process.cwd() },
  env: { NEXT_PUBLIC_BASE_PATH: pagesBase ?? "", NEXT_PUBLIC_PREVIEW: process.env.SITE_PREVIEW ? "1" : "" },
  ...(isPages
    ? {
        output: "export" as const,
        basePath: pagesBase || undefined,
        trailingSlash: true,
        images: { loader: "custom" as const, loaderFile: "./src/lib/image-loader.ts" },
      }
    : {
        images: {
          formats: ["image/avif", "image/webp"],
          qualities: [75, 85],
          deviceSizes: [640, 828, 1080, 1280, 1600, 1920, 2400],
        },
      }),
};

export default nextConfig;
