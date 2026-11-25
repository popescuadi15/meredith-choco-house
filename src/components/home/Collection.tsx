"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { sliderTablets as items, formatPrice } from "@/lib/products";
import AddButton from "@/components/AddButton";
import s from "./Collection.module.css";

const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mix = (a: string, b: string, t: number) => {
  const A = hex(a),
    B = hex(b);
  return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * t)).join(",")})`;
};
const smooth = (e0: number, e1: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};

export default function Collection() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const N = items.length;

  useEffect(() => {
    const el = root.current!;
    const words = el.querySelectorAll<HTMLElement>("[data-word]");
    const bars = el.querySelectorAll<HTMLElement>("[data-bar]");

    const render = (f: number) => {
      const i = Math.min(N - 1, Math.floor(f));
      const t = f - i;
      const a = items[i].tone!,
        b = items[Math.min(N - 1, i + 1)].tone!;
      el.style.setProperty("--bg", mix(a.bg, b.bg, t));
      el.style.setProperty("--ink", t < 0.5 ? a.ink : b.ink);
      words.forEach((w, k) => {
        const o = k - f;
        w.style.transform = `translate3d(${o * 70}vw,0,0)`;
        w.style.opacity = String(Math.max(0, 1 - Math.abs(o) * 1.2));
      });
      bars.forEach((w, k) => {
        const o = k - f;
        w.style.transform = `translate3d(${o * 18}vw, ${o * 95}vh, 0) rotate(${o * -28 - 8}deg) scale(${1 - Math.min(1, Math.abs(o)) * 0.15})`;
        w.style.opacity = String(Math.max(0, 1 - Math.abs(o) * 1.4));
      });
      setActive(Math.round(f));
    };

    if (prefersReducedMotion()) {
      render(0);
      return;
    }
    render(0);
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top top",
      end: "bottom bottom",
      onUpdate(self) {
        const raw = self.progress * (N - 1);
        const i = Math.floor(raw);
        const f = Math.min(N - 1, i + smooth(0.3, 0.8, raw - i));
        render(f);
      },
    });
    return () => st.kill();
  }, [N]);

  const goTo = (i: number) => {
    const el = root.current!;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const y = top + ((el.offsetHeight - window.innerHeight) * (i + 0.05)) / (N - 1);
    const lenis = (window as unknown as { __lenis?: { scrollTo: (y: number, o?: object) => void } }).__lenis;
    if (lenis) lenis.scrollTo(y, { duration: 1.2 });
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

  const cur = items[active];

  return (
    <section ref={root} className={s.section} data-header="clear" style={{ height: `${N * 90 + 30}vh` }} aria-labelledby="collection-title">
      <div className={s.sticky}>
        <div className={s.head}>
          <p className={s.kicker}>02 — Colecția de tablete</p>
          <h2 id="collection-title" className={s.lead}>
            Fiecare tabletă e pictată manual, în 100 g de ciocolată belgiană — și umplută exact cum îți dorești.
          </h2>
        </div>
        <div className={s.weight} aria-hidden="true">
          <strong>100g</strong>
          <span>Pictată manual</span>
        </div>

        <div className={s.stage}>
          {items.map((p) => (
            <span key={p.slug} className={s.word} data-word aria-hidden="true" style={{ color: p.tone!.word }}>
              {p.word}
            </span>
          ))}
          {items.map((p, k) => (
            <div key={p.slug} className={s.bar} data-bar>
              <Image src={p.cutout!} alt={p.alt} fill sizes="(max-width: 760px) 80vw, 42vw" loading={k === 0 ? "eager" : "lazy"} />
            </div>
          ))}
        </div>

        <div className={s.foot}>
          <div className={s.info} key={cur.slug}>
            <p className={s.name}>
              <Link href={`/produse/${cur.slug}`}>{cur.name}</Link>
            </p>
            <p>{cur.short}</p>
          </div>
          <div className={s.dots} role="tablist" aria-label="Tablete">
            {items.map((p, i) => (
              <button key={p.slug} role="tab" aria-selected={i === active} aria-label={p.name} className={i === active ? s.dotOn : undefined} onClick={() => goTo(i)} />
            ))}
          </div>
          <div className={s.buy}>
            <span className={s.price}>{formatPrice(cur)}</span>
            <AddButton slug={cur.slug} className={s.add} />
          </div>
        </div>
      </div>
    </section>
  );
}
