"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { inCategory, formatPrice, prepTime } from "@/lib/products";
import { waLink } from "@/lib/site";
import AddButton from "@/components/AddButton";
import s from "./Christmas.module.css";

/*
  "Noapte de Crăciun" — a pinned scroll scene in three acts:
  1. a round winter window in the night sky, one tree glowing inside it;
  2. the window opens to the whole screen and the trees turn on a carousel, one product per stop;
  3. the carousel steps back and the order block takes the stage.
  Snow is a canvas layer that reacts to scroll speed and to the pointer.
*/

// Five trees on the ring (72° apart); products sit on slots 0, 2, 4, so every stop lands on one of them.
// each product slot shows exactly what the set contains; `wide` = a composed set, not a lone tree
const trees: { src: string; alt: string; wide?: boolean }[] = [
  { src: "/images/cut/bradut-lapte.webp", alt: "Brăduț de ciocolată cu lapte cu decor auriu" },
  { src: "/images/cut/bradut-verde.webp", alt: "Brăduț de ciocolată verde pictat manual" },
  { src: "/images/cut/little-christmas.webp", alt: "Meredith Little Christmas: brăduț de ciocolată albă și globuri din ciocolată", wide: true },
  { src: "/images/cut/bradut-alb-2.webp", alt: "Brăduț de ciocolată albă pictat manual în culori" },
  { src: "/images/cut/meredith-christmas.webp", alt: "Meredith Christmas: brăduț, globuri și mini tablete cu zmeură", wide: true },
];
const order = ["bradut-de-ciocolata", "meredith-little-christmas-150", "meredith-christmas"];

const clamp = (x: number) => Math.min(1, Math.max(0, x));
const smooth = (e0: number, e1: number, x: number) => {
  const t = clamp((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
};
// Scroll map: act 1 (window opens) → act 2 (three stops) → act 3 (order)
const A2 = [0.2, 0.84];

export default function Christmas() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const all = inCategory("craciun");
  const items = order.map((slug) => all.find((p) => p.slug === slug)!).filter(Boolean);
  const N = items.length;

  useEffect(() => {
    const el = root.current!;
    const scene = el.querySelector<HTMLElement>("[data-scene]")!;
    const ring = el.querySelector<HTMLElement>("[data-ring]")!;
    const rim = el.querySelector<HTMLElement>("[data-rim]")!;
    const nodes = Array.from(el.querySelectorAll<HTMLElement>("[data-tree]"));
    const canvas = el.querySelector<HTMLCanvasElement>("canvas")!;
    const reduced = prefersReducedMotion();
    let vel = 0;

    // ——— scene ———
    const render = (p: number) => {
      const w = window.innerWidth,
        h = window.innerHeight,
        mobile = w < 760;
      const open = smooth(0.03, 0.19, p);
      const q = clamp((p - A2[0]) / (A2[1] - A2[0])) * (N - 1);
      const i = Math.floor(q);
      const f = Math.min(N - 1, i + smooth(0.28, 0.72, q - i));
      const out = smooth(0.86, 0.97, p);

      const cy = mobile ? 47 : 54; // keep in sync with --cy in the CSS
      const r0 = Math.min(w, h) * (mobile ? 0.38 : 0.27);
      const r1 = Math.hypot(w, h) * 0.75;
      const r = r0 + (r1 - r0) * open;
      scene.style.clipPath = `circle(${r.toFixed(1)}px at 50% ${cy}%)`;
      rim.style.width = rim.style.height = `${(r * 2).toFixed(1)}px`;
      rim.style.opacity = String(1 - smooth(0.2, 0.7, open));

      el.style.setProperty("--open", open.toFixed(3));
      el.style.setProperty("--out", out.toFixed(3));
      el.style.setProperty("--info", (smooth(0.15, 0.22, p) * (1 - out)).toFixed(3));
      el.dataset.act = p < 0.15 ? "1" : out > 0.5 ? "3" : "2";

      ring.style.transform = `translate3d(0, ${(-out * (mobile ? 18 : 17)).toFixed(2)}vh, 0) scale(${((0.62 + 0.38 * open) * (1 - 0.36 * out)).toFixed(4)})`;

      const rx = mobile ? w * 0.34 : Math.min(w * 0.26, 380);
      const ry = mobile ? h * 0.05 : h * 0.06;
      const step = 360 / trees.length;
      const rot = f * step * 2;
      nodes.forEach((n, k) => {
        const a = ((k * step - rot) * Math.PI) / 180;
        const d = (Math.cos(a) + 1) / 2; // 1 = front, 0 = back
        const sc = 0.34 + 0.66 * Math.pow(d, 1.6);
        n.style.transform = `translate3d(${(Math.sin(a) * rx).toFixed(1)}px, ${(-(1 - d) * ry * 2).toFixed(1)}px, 0) scale(${sc.toFixed(4)})`;
        n.style.opacity = (0.18 + 0.82 * d * d).toFixed(3);
        n.style.zIndex = String(Math.round(d * 100));
      });
      setActive(Math.round(f));
    };

    // ——— snow ———
    const ctx = canvas.getContext("2d")!;
    let flakes: { x: number; y: number; r: number; v: number; ph: number; gold: boolean }[] = [];
    let cw = 0,
      ch = 0,
      wind = 0,
      windTo = 0,
      raf = 0,
      visible = false;
    const size = () => {
      const dpr = Math.min(1.5, window.devicePixelRatio || 1);
      cw = canvas.clientWidth;
      ch = canvas.clientHeight;
      canvas.width = Math.round(cw * dpr);
      canvas.height = Math.round(ch * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = cw < 760 ? 70 : 150;
      flakes = Array.from({ length: count }, () => ({
        x: Math.random() * cw,
        y: Math.random() * ch,
        r: 0.6 + Math.random() * Math.random() * 2.6,
        v: 0.25 + Math.random() * 0.7,
        ph: Math.random() * Math.PI * 2,
        gold: Math.random() < 0.28,
      }));
    };
    const draw = (t: number) => {
      ctx.clearRect(0, 0, cw, ch);
      wind += (windTo - wind) * 0.03;
      vel *= 0.9;
      const lift = Math.max(-14, Math.min(14, vel * 0.006));
      for (const fl of flakes) {
        if (!reduced) {
          fl.y += fl.v * (1 + fl.r * 0.35) - lift * (fl.r / 2.2);
          fl.x += Math.sin(t * 0.0006 + fl.ph) * 0.35 + wind * fl.r * 0.5;
          if (fl.y > ch + 6 || fl.y < -8) {
            fl.y = fl.y > 0 ? -6 : ch + 6;
            fl.x = Math.random() * cw;
          }
          if (fl.x > cw + 6) fl.x = -6;
          if (fl.x < -6) fl.x = cw + 6;
        }
        ctx.beginPath();
        ctx.arc(fl.x, fl.y, fl.r, 0, Math.PI * 2);
        ctx.fillStyle = fl.gold ? `rgba(233,205,150,${0.35 + fl.r * 0.15})` : `rgba(255,252,246,${0.3 + fl.r * 0.18})`;
        ctx.fill();
      }
    };
    const loop = (t: number) => {
      draw(t);
      raf = visible && !reduced ? requestAnimationFrame(loop) : 0;
    };
    const onPointer = (e: PointerEvent) => {
      windTo = (e.clientX / window.innerWidth - 0.5) * 1.6;
    };
    size();
    draw(0);
    const io = new IntersectionObserver(([en]) => {
      visible = en.isIntersecting;
      if (visible && !raf && !reduced) raf = requestAnimationFrame(loop);
    });
    io.observe(el);
    const onResize = () => {
      size();
      draw(0);
    };
    window.addEventListener("resize", onResize);
    el.addEventListener("pointermove", onPointer);

    render(reduced ? A2[0] : 0);
    const st = reduced
      ? null
      : ScrollTrigger.create({
          trigger: el,
          start: "top top",
          end: "bottom bottom",
          onUpdate(self) {
            vel = self.getVelocity();
            render(self.progress);
          },
        });
    // reduced motion: the tabs drive the ring directly
    (el as HTMLElement & { __xmasGo?: (i: number) => void }).__xmasGo = (i: number) =>
      render(A2[0] + ((A2[1] - A2[0]) * i) / (N - 1));

    return () => {
      st?.kill();
      io.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      el.removeEventListener("pointermove", onPointer);
    };
  }, [N]);

  const goTo = (i: number) => {
    const el = root.current!;
    if (prefersReducedMotion()) {
      (el as HTMLElement & { __xmasGo?: (i: number) => void }).__xmasGo?.(i);
      return;
    }
    const top = el.getBoundingClientRect().top + window.scrollY;
    const y = top + (el.offsetHeight - window.innerHeight) * (A2[0] + ((A2[1] - A2[0]) * i) / (N - 1));
    const lenis = (window as unknown as { __lenis?: { scrollTo: (y: number, o?: object) => void } }).__lenis;
    if (lenis) lenis.scrollTo(y, { duration: 1.4 });
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

  const cur = items[active] ?? items[0];

  return (
    <section id="craciun" ref={root} className={s.section} data-header="dark" data-act="1" aria-labelledby="xmas-title">
      <div className={s.sticky}>
        {/* Act 1 — the night and the window */}
        <div className={s.night} aria-hidden="true" />
        <div className={s.intro}>
          <p className="eyebrow">Ediție de sezon</p>
          <h2 id="xmas-title">
            <span className="script gold-text">Crăciun</span> la Meredith
          </h2>
        </div>
        <p className={s.hint} aria-hidden="true">
          Deschide fereastra de iarnă
          <span />
        </p>

        {/* Act 2 — the warm room behind the window */}
        <div className={s.scene} data-scene>
          <div className={s.glow} aria-hidden="true" />
          <div className={s.bokeh} aria-hidden="true" />
          <div className={s.ring} data-ring>
            {trees.map((t, k) => (
              <div key={t.src} className={t.wide ? `${s.tree} ${s.wide}` : s.tree} data-tree>
                <Image src={t.src} alt={k % 2 === 0 ? t.alt : ""} fill sizes={t.wide ? "(max-width: 760px) 90vw, 45vw" : "(max-width: 760px) 60vw, 30vw"} loading={k === 0 ? "eager" : "lazy"} />
              </div>
            ))}
            <div className={s.floor} aria-hidden="true" />
          </div>
        </div>
        <div className={s.rim} data-rim aria-hidden="true" />
        <canvas className={s.snow} aria-hidden="true" />

        <div className={s.info}>
          <div key={cur.slug} className={s.infoIn}>
            <p className={s.badge}>{cur.badge ?? `Pictat manual · ${cur.weight}`}</p>
            <h3>
              <Link href={`/produse/${cur.slug}`}>{cur.name}</Link>
            </h3>
            <p className={s.short}>{cur.short}</p>
            <div className={s.buy}>
              <span className={s.price}>
                {formatPrice(cur)} <small>· {cur.weight}</small>
              </span>
              <AddButton slug={cur.slug} label="Adaugă" variant="btn--light" />
            </div>
          </div>
        </div>

        <div className={s.tabs} role="tablist" aria-label="Colecția de Crăciun">
          {items.map((p, i) => (
            <button key={p.slug} role="tab" aria-selected={i === active} className={i === active ? s.tabOn : undefined} onClick={() => goTo(i)}>
              {p.name.replace("Meredith ", "").replace(" de ciocolată", "")}
            </button>
          ))}
        </div>

        {/* Act 3 — the season's promise + order */}
        <div className={s.launch}>
          <p className="eyebrow">Ediție de sezon · serii mici</p>
          <p className={s.launchTitle}>
            Un Crăciun <em>pictat manual</em>
          </p>
          <dl className={s.facts}>
            <div>
              <dt>Unicat</dt>
              <dd>Fiecare brăduț e pictat de mână</dd>
            </div>
            <div>
              <dt>{prepTime.craciun}</dt>
              <dd>Timp de pregătire</dd>
            </div>
            <div>
              <dt>Callebaut</dt>
              <dd>Ciocolată belgiană, umplută cu cremă</dd>
            </div>
          </dl>
          <div className={s.launchCtas}>
            <Link href="/produse#craciun" className="btn btn--gold">
              Toată colecția de Crăciun
            </Link>
            <a href={waLink("Bună! Aș dori să comand din colecția de Crăciun.")} className="btn btn--light btn--ghost" target="_blank" rel="noopener noreferrer">
              Comandă pe WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
