import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: site.shortName,
    description: site.description,
    start_url: `${base}/`,
    display: "standalone",
    background_color: "#fbf8f3",
    theme_color: "#1c130f",
    lang: "ro",
    icons: [
      { src: `${base}/icon.png`, sizes: "512x512", type: "image/png" },
      { src: `${base}/apple-icon.png`, sizes: "180x180", type: "image/png" },
    ],
  };
}
