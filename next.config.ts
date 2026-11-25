import type { NextConfig } from "next";

/**
 * PAGES_BASE_PATH is set only by the GitHub Pages workflow (e.g. "/meredith-choco-house").
 * It switches the build to a static export with a pass-through image loader.
 * Without it (local dev, Vercel) the site uses the regular Next.js server and image optimization.
 */
const pagesBase = process.env.PAGES_BASE_PATH;
const isPages = pagesBase !== undefined;

const nextConfig: NextConfig = {
  poweredByHeader: false,
  turbopack: { root: process.cwd() },
  env: { NEXT_PUBLIC_BASE_PATH: pagesBase ?? "", NEXT_PUBLIC_PREVIEW: isPages ? "1" : "" },
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
