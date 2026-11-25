"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import s from "./AtelierDay.module.css";

const moments = [
  { h: 7, title: "Atelierul se trezește.", text: "Topim și temperăm ciocolata belgiană pentru comenzile zilei." },
  { h: 10, title: "Culori, una câte una.", text: "Pictăm formele cu unt de cacao colorat — manual, fără nimic automatizat." },
  { h: 13, title: "Umplutura.", text: "Fistic, caramel, nocciola, cocos, Biscoff. Fiecare cremă, în pralina ei." },
  { h: 16, title: "Ultimele detalii.", text: "Scoatem din forme, verificăm fiecare bucată și o așezăm în cutie." },
  { h: 19, title: "Gata de ridicat.", text: "Comenzile tale te așteaptă în atelier, legate cu fundă." },
  { h: 22, title: "Atelierul doarme.", text: "Mâine o luăm de la capăt. Tot de la zero, tot de mână." },
];
const START = 7,
  END = 22;
const clamp = (x: number) => Math.min(1, Math.max(0, x));

export default function AtelierDay() {
  const root = useRef<HTMLElement>(null);
  const clock = useRef<HTMLSpanElement>(null);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const el = root.current!;
    const render = (p: number) => {
      const hour = START + (END - START) * p;
      const hh = Math.floor(hour);
      const mm = Math.floor((hour - hh) * 60 / 5) * 5;
      if (clock.current) clock.current.textContent = `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
      el.style.setProperty("--dawn", clamp(1 - (hour - 7) / 2.5).toFixed(3));
      el.style.setProperty("--golden", clamp(1 - Math.abs(hour - 17.5) / 2.5).toFixed(3));
      el.style.setProperty("--night", clamp((hour - 18.5) / 3).toFixed(3));
      el.style.setProperty("--sun", (p * 100).toFixed(2));
      let i = 0;
      moments.forEach((m, k) => {
        if (hour >= m.h - 0.6) i = k;
      });
      setIdx(i);
    };
    render(0);
    if (prefersReducedMotion()) return;
    const st = ScrollTrigger.create({ trigger: el, start: "top top", end: "bottom bottom", onUpdate: (self) => render(self.progress) });
    return () => st.kill();
  }, []);

  return (
    <section ref={root} className={s.section} data-header="dark" aria-labelledby="atelier-title">
      <div className={s.sticky}>
        <div className={s.photo}>
          <Image src="/images/photos/choco-bar-atelier.jpg" alt="Masa de lucru din atelierul Meredith, cu praline colorate și cutii cadou" fill sizes="100vw" />
        </div>
        <div className={`${s.layer} ${s.dawn}`} />
        <div className={`${s.layer} ${s.golden}`} />
        <div className={`${s.layer} ${s.night}`} />
        <div className={`${s.layer} ${s.lamp}`} />
        <div className={`${s.layer} ${s.shade}`} />

        <div className={s.head}>
          <p className="eyebrow">03 — O zi în atelier</p>
          <h2 id="atelier-title">
            Caransebeș, <em>Strada Pajiștei 14</em>
          </h2>
        </div>

        <div className={s.card} aria-hidden="true">
          <span ref={clock} className={s.time}>
            07:00
          </span>
          <span className={s.label}>Atelier Meredith</span>
          <span className={s.track}>
            <i />
          </span>
        </div>

        <ol className={s.moments}>
          {moments.map((m, i) => (
            <li key={m.h} className={i === idx ? s.on : i < idx ? s.past : undefined}>
              <span className={s.hour}>{String(m.h).padStart(2, "0")}:00</span>
              <h3>{m.title}</h3>
              <p>{m.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
