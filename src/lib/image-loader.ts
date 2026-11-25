// Used only for the static GitHub Pages preview: serves the pre-sized files from /public under the base path.
export default function pagesLoader({ src, width }: { src: string; width: number; quality?: number }) {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return `${src.startsWith("/") ? base : ""}${src}?w=${width}`;
}
