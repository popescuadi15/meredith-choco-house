"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { inCategory } from "@/lib/products";
import AddButton from "@/components/AddButton";
import s from "./GiftBoxes.module.css";

/*
  "Teancul de cadouri" — the four gift boxes as a deck of cards.
  Scroll deals the top card away to reveal the next box; on the left the price rolls like an
  odometer and a meter fills with the box's weight. At the end the deck fans out, all four at once.
*/

const clamp = (x: number) => Math.min(1, Math.max(0, x));
const smooth = (e0: number, e1: number, x: number) => {
  const t = clamp((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const DEAL = [0.04, 0.76]; // scroll span of the dealing; the fan comes after
const ROMAN = ["I", "II", "III", "IV", "V", "VI"];

function Odometer({ value }: { value: number }) {
  const digits = String(value).padStart(3, "0").split("").map(Number);
  return (
    <span className={s.odo} aria-hidden="true">
      {digits.map((d, i) => (
        <span key={i} className={s.odoCol} data-lead={i === 0 && d === 0}>
          <span className={s.odoStrip} style={{ transform: `translateY(${-d * 10}%)` }}>
            {Array.from({ length: 10 }, (_, n) => (
              <span key={n}>{n}</span>
            ))}
          </span>
        </span>
      ))}
    </span>
  );
}

export default function GiftBoxes() {
  const boxes = inCategory("cutii-cadou");
  const N = boxes.length;
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const maxWeight = Math.max(...boxes.map((b) => parseInt(b.weight ?? "0")));

  useEffect(() => {
    const el = root.current!;
    const deck = el.querySelector<HTMLElement>("[data-deck]")!;
    const cards = Array.from(el.querySelectorAll<HTMLElement>("[data-card]"));
    let shift = 0; // how far the deck must travel to sit in the middle for the fan

    const measure = () => {
      deck.style.translate = "0 0";
      const r = deck.getBoundingClientRect();
      shift = window.innerWidth / 2 - (r.left + r.width / 2);
    };

    const render = (p: number) => {
      const q = clamp((p - DEAL[0]) / (DEAL[1] - DEAL[0])) * (N - 1);
      const i = Math.floor(q);
      const f = Math.min(N - 1, i + smooth(0.3, 0.75, q - i));
      const fan = smooth(0.8, 0.95, p);
      const mobile = window.innerWidth < 900;

      el.style.setProperty("--fan", fan.toFixed(3));
      el.dataset.fan = fan > 0.5 ? "1" : "0";
      deck.style.translate = `${(shift * fan).toFixed(1)}px 0`;

      cards.forEach((c, k) => {
        const d = k - f;
        // deck position
        let x, y, r, sc, o, z;
        if (d >= 0) {
          x = d * 5;
          y = -d * 4;
          r = (k % 2 ? 1 : -1) * Math.min(d, 1) * 3 + d * 2.5;
          sc = 1 - d * 0.07;
          o = d > 2.6 ? clamp(3.4 - d) : 1;
          z = 10 - k;
        } else {
          const t = Math.min(1, -d);
          x = -t * (mobile ? 80 : 95);
          y = t * 12;
          r = -t * 22;
          sc = 1 - t * 0.12;
          o = 1 - smooth(0.25, 0.85, t);
          z = 20 + k;
        }
        // fan position: a hand of four cards across the middle
        // (phones: a 2 × 2 spread — a row of four would not fit)
        const m = k - (N - 1) / 2;
        const fx = mobile ? (k % 2 ? 27 : -27) : m * 62;
        const fy = mobile ? (k < 2 ? -33 : 31) - 16 : Math.abs(m) * 7 - 26;
        const fr = mobile ? (k % 2 ? 3 : -3) : m * 7;
        const fs = mobile ? 0.5 : 0.6;
        c.style.transform = `translate3d(${lerp(x, fx, fan).toFixed(2)}%, ${lerp(y, fy, fan).toFixed(2)}%, 0) rotate(${lerp(r, fr, fan).toFixed(2)}deg) scale(${lerp(sc, fs, fan).toFixed(4)})`;
        c.style.opacity = lerp(o, 1, fan).toFixed(3);
        c.style.zIndex = String(fan > 0.5 ? 30 + k : z);
        c.style.setProperty("--shade", lerp(Math.max(0, d) * 0.1, 0, fan).toFixed(3));
      });
      setActive(Math.round(f));
    };

    measure();
    if (prefersReducedMotion()) {
      render(0);
      return;
    }
    render(0);
    const st = ScrollTrigger.create({ trigger: el, start: "top top", end: "bottom bottom", onUpdate: (self) => render(self.progress) });
    const onResize = () => {
      measure();
      render(st.progress);
    };
    window.addEventListener("resize", onResize);
    return () => {
      st.kill();
      window.removeEventListener("resize", onResize);
    };
  }, [N]);

  const goTo = (i: number) => {
    const el = root.current!;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const y = top + (el.offsetHeight - window.innerHeight) * (DEAL[0] + ((DEAL[1] - DEAL[0]) * i) / (N - 1));
    const lenis = (window as unknown as { __lenis?: { scrollTo: (y: number, o?: object) => void } }).__lenis;
    if (lenis) lenis.scrollTo(y, { duration: 1.2 });
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

  const cur = boxes[active] ?? boxes[0];
  const grams = parseInt(cur.weight ?? "0");

  return (
    <section id="cutii" ref={root} className={s.section} data-fan="0" aria-labelledby="boxes-title">
      <div className={s.sticky}>
        <div className={s.info}>
          <p className="eyebrow">Cutii cadou</p>
          <h2 id="boxes-title" className={s.title}>
            Un dar care <em>se deschide încet.</em>
          </h2>

          <div className={s.detail} key={cur.slug}>
            <p className={s.kicker}>
              {cur.badge ?? `Cutia ${ROMAN[active]} din ${ROMAN[N - 1]}`}
            </p>
            <h3 className={s.name}>
              <Link href={`/produse/${cur.slug}`}>{cur.name}</Link>
            </h3>
            <p className={s.short}>{cur.short}</p>
            {cur.contents && (
              <ul className={s.contents}>
                {cur.contents.slice(0, 4).map((c) => (
                  <li key={c}>{c}</li>
                ))}
                {cur.contents.length > 4 && <li className={s.moreItems}>+ încă {cur.contents.length - 4}</li>}
              </ul>
            )}
          </div>

          <div className={s.meter} aria-hidden="true">
            <span style={{ width: `${(grams / maxWeight) * 100}%` }} />
          </div>
          <p className={s.meterLabel}>
            <span>{cur.weight}</span> din cele mai generoase {maxWeight} g
          </p>

          <div className={s.buy}>
            <p className={s.price}>
              <Odometer value={cur.price ?? 0} />
              <span className={s.lei}>lei</span>
              <span className="visually-hidden">
                {cur.price} lei, {cur.weight}
              </span>
            </p>
            <AddButton slug={cur.slug} label="Adaugă" />
          </div>

          <div className={s.tabs} role="tablist" aria-label="Cutii cadou">
            {boxes.map((b, i) => (
              <button key={b.slug} role="tab" aria-selected={i === active} aria-label={b.name} className={i === active ? s.tabOn : undefined} onClick={() => goTo(i)}>
                {ROMAN[i]}
              </button>
            ))}
          </div>
        </div>

        <div className={s.deckWrap}>
          <div className={s.deck} data-deck>
            {boxes.map((b, k) => {
              const img = b.cutout ?? b.photo;
              return (
                <Link key={b.slug} href={`/produse/${b.slug}`} className={s.card} data-card tabIndex={-1} aria-hidden="true">
                  <span className={s.cardNo}>{ROMAN[k]}</span>
                  <span className={`${s.cardImg} ${b.cutout ? s.cut : s.photo}`}>
                    {img && <Image src={img} alt="" fill sizes="(max-width: 900px) 70vw, 34vw" loading={k < 2 ? "eager" : "lazy"} />}
                  </span>
                  <span className={s.cardFoot}>
                    <strong>{b.name.replace("Meredith ", "")}</strong>
                    <span>
                      {b.price} lei · {b.weight}
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Finale: the whole range at once */}
        <div className={s.finale}>
          <p className={s.finaleTitle}>
            Patru cutii, <em>un singur gând: bucuria.</em>
          </p>
          <Link href="/produse#cutii-cadou" className="btn">
            Vezi toate cutiile cadou
          </Link>
        </div>
      </div>
    </section>
  );
}
