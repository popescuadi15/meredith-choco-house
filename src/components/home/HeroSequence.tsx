"use client";

import { useEffect, useRef } from "react";
import { preload } from "react-dom";
import frames from "@/lib/hero-frames.json";

/**
 * Scroll-scrubbed atelier footage drawn on a canvas.
 * `progress` (0..1, written by the parent from scroll) picks the frame; neighbouring frames are
 * blended for smoothness. To keep it alive when the visitor stops scrolling, the playhead breathes
 * a little around its position, the image slowly zooms and follows the mouse.
 */

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const src = (set: "d" | "m", i: number) => `${base}/hero/${set}/${String(i + 1).padStart(4, "0")}.webp`;

/** Coarse-to-fine order: every 16th frame first, then 8th, 4th… so scrubbing works early. */
function loadOrder(n: number) {
  const seen = new Set<number>();
  const order: number[] = [];
  for (let step = 16; step >= 1; step /= 2) {
    for (let i = 0; i < n; i += step) {
      if (seen.has(i)) continue;
      seen.add(i);
      order.push(i);
    }
  }
  if (!seen.has(n - 1)) order.push(n - 1);
  return order;
}

export default function HeroSequence({ progress }: { progress: React.RefObject<number> }) {
  const ref = useRef<HTMLCanvasElement>(null);
  // One preload per screen shape, so phones never fetch the desktop frame (and vice versa).
  preload(src("m", 0), { as: "image", fetchPriority: "high", media: "(max-aspect-ratio: 4/5)" });
  preload(src("d", 0), { as: "image", fetchPriority: "high", media: "(min-aspect-ratio: 4/5)" });

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d", { alpha: false })!;
    const portrait = window.matchMedia("(max-aspect-ratio: 4/5)").matches;
    const set = portrait ? "m" : "d";
    const N = frames.count;
    const imgs: (HTMLImageElement | null)[] = new Array(N).fill(null);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let disposed = false;

    // Load progressively, a few at a time.
    const queue = loadOrder(N);
    let inflight = 0;
    const pump = () => {
      while (!disposed && inflight < 6 && queue.length) {
        const i = queue.shift()!;
        const img = new Image();
        img.decoding = "async";
        inflight++;
        img.onload = () => {
          inflight--;
          imgs[i] = img;
          pump();
        };
        img.onerror = () => {
          inflight--;
          pump();
        };
        img.src = src(set, i);
      }
    };
    pump();

    const nearest = (i: number) => {
      if (imgs[i]) return imgs[i];
      for (let d = 1; d < N; d++) {
        if (imgs[i - d]) return imgs[i - d];
        if (imgs[i + d]) return imgs[i + d];
      }
      return null;
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const fw = portrait ? frames.mobile.w : frames.desktop.w;
      const w = Math.round(canvas.clientWidth * dpr);
      const h = Math.round(canvas.clientHeight * dpr);
      // No point drawing at more than ~1.25× the frame resolution.
      const k = Math.min(1, (fw * 1.25) / Math.max(w, 1));
      canvas.width = Math.max(1, Math.round(w * k));
      canvas.height = Math.max(1, Math.round(h * k));
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMove = (e: PointerEvent) => {
      mouse.tx = e.clientX / window.innerWidth - 0.5;
      mouse.ty = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const draw = (img: HTMLImageElement, alpha: number, scale: number) => {
      const cw = canvas.width,
        ch = canvas.height;
      const s = Math.max(cw / img.naturalWidth, ch / img.naturalHeight) * scale;
      const w = img.naturalWidth * s,
        h = img.naturalHeight * s;
      const x = (cw - w) / 2 - mouse.x * cw * 0.025;
      const y = (ch - h) / 2 - mouse.y * ch * 0.025;
      ctx.globalAlpha = alpha;
      ctx.drawImage(img, x, y, w, h);
    };

    let raf = 0;
    let visible = true;
    let f = (progress.current ?? 0) * (N - 1);
    const start = performance.now();

    function frame(now: number) {
      raf = 0;
      if (disposed || !visible || document.hidden) return;
      const t = (now - start) / 1000;
      const target = (progress.current ?? 0) * (N - 1);
      f = reduced ? target : f + (target - f) * 0.12;
      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;

      // Breathing playhead + slow zoom keep the footage alive at rest.
      const breathe = reduced ? 0 : Math.sin(t * 0.9) * 1.6;
      const pos = Math.min(N - 1, Math.max(0, f + breathe));
      const scale = reduced ? 1.04 : 1.06 + Math.sin(t * 0.22) * 0.02;

      const i = Math.floor(pos);
      const a = nearest(i);
      const b = imgs[Math.min(N - 1, i + 1)];
      if (a) {
        draw(a, 1, scale);
        if (b && b !== a) draw(b, pos - i, scale);
        ctx.globalAlpha = 1;
      }
      if (!reduced || !a) raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(frame);
    });
    io.observe(canvas);
    const onVis = () => {
      if (!document.hidden && !raf) raf = requestAnimationFrame(frame);
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [progress]);

  return (
    <>
      {/* First frame as a real image: paints instantly (and without JS) before the canvas takes over. */}
      <picture>
        <source media="(max-aspect-ratio: 4/5)" srcSet={src("m", 0)} />
        <img src={src("d", 0)} alt="" />
      </picture>
      <canvas ref={ref} aria-hidden="true" />
    </>
  );
}
