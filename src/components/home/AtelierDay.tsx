"use client";

import { useEffect, useRef, useState } from "react";
import { ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import s from "./AtelierDay.module.css";

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const moments = [
  { h: 7, title: "Laboratorul se trezește.", text: "Topim și temperăm ciocolata belgiană pentru comenzile zilei." },
  { h: 10, title: "Culori, una câte una.", text: "Pictăm formele cu unt de cacao colorat — manual, fără nimic automatizat." },
  { h: 13, title: "Umplutura.", text: "Fistic, caramel, nocciola, cocos, Biscoff. Fiecare cremă, în pralina ei." },
  { h: 16, title: "Ultimele detalii.", text: "Scoatem din forme, verificăm fiecare bucată și o așezăm în cutie." },
  { h: 19, title: "Gata de ridicat.", text: "Comenzile tale te așteaptă în laborator, legate cu fundă." },
  { h: 22, title: "Laboratorul doarme.", text: "Mâine o luăm de la capăt. Tot de la zero, tot de mână." },
];
const START = 7,
  END = 22;
const clamp = (x: number) => Math.min(1, Math.max(0, x));

/*
 * Night lights drawn in the desktop photo's pixel space (2400 × 1297).
 * The string lights hang under the iron arch over the entrance; the lantern sits by the gate.
 */
const ARCH = { x0: 480, y0: 410, cx: 1015, cy: 99, x1: 1550, y1: 392 };
const bulbs = Array.from({ length: 30 }, (_, i) => {
  const t = 0.03 + (i / 29) * 0.94;
  const x = (1 - t) ** 2 * ARCH.x0 + 2 * (1 - t) * t * ARCH.cx + t ** 2 * ARCH.x1;
  const y = (1 - t) ** 2 * ARCH.y0 + 2 * (1 - t) * t * ARCH.cy + t ** 2 * ARCH.y1;
  return { x, y: y + 16 + ((i * 37) % 9) * 12, r: 5 + ((i * 13) % 3), delay: ((i * 0.37) % 2.6).toFixed(2) };
});

function NightLights({ viewBox, className, id }: { viewBox: string; className: string; id: string }) {
  return (
    <svg className={className} viewBox={viewBox} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <radialGradient id={`warm-${id}`}>
          <stop offset="0" stopColor="#ffd9a0" stopOpacity="0.95" />
          <stop offset="0.35" stopColor="#ffb766" stopOpacity="0.45" />
          <stop offset="1" stopColor="#ff9a3c" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`glass-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffcf8a" stopOpacity="0.55" />
          <stop offset="1" stopColor="#ff9f4a" stopOpacity="0.25" />
        </linearGradient>
        <filter id={`bloom-${id}`} x="-200%" y="-200%" width="500%" height="500%">
          <feGaussianBlur stdDeviation="9" />
        </filter>
        <filter id={`soft-${id}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>
      {/* warm light behind the door glass */}
      <g className={s.lit}>
        <rect x="900" y="605" width="195" height="610" rx="6" fill={`url(#glass-${id})`} filter={`url(#soft-${id})`} opacity="0.75" />
        <ellipse cx="1000" cy="900" rx="260" ry="420" fill={`url(#warm-${id})`} opacity="0.5" />
      </g>
      {/* lantern by the gate */}
      <g className={s.lit}>
        <circle cx="1660" cy="318" r="170" fill={`url(#warm-${id})`} />
        <circle cx="1660" cy="312" r="16" fill="#fff2d6" />
      </g>
      {/* string lights under the arch */}
      <g className={s.string}>
        {bulbs.map((b, i) => (
          <g key={i} className={s.bulb} style={{ animationDelay: `${b.delay}s` }}>
            <circle cx={b.x} cy={b.y} r={b.r * 3.2} fill="#ffc979" filter={`url(#bloom-${id})`} opacity="0.8" />
            <circle cx={b.x} cy={b.y} r={b.r} fill="#fff3d8" />
          </g>
        ))}
      </g>
    </svg>
  );
}

export default function AtelierDay() {
  const root = useRef<HTMLElement>(null);
  const clock = useRef<HTMLSpanElement>(null);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const el = root.current!;
    const render = (p: number) => {
      const hour = START + (END - START) * p;
      const hh = Math.floor(hour);
      const mm = Math.floor(((hour - hh) * 60) / 5) * 5;
      if (clock.current) clock.current.textContent = `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
      el.style.setProperty("--dawn", clamp(1 - (hour - 7) / 2.5).toFixed(3));
      el.style.setProperty("--golden", clamp(1 - Math.abs(hour - 17.5) / 2.5).toFixed(3));
      el.style.setProperty("--night", clamp((hour - 18.5) / 3).toFixed(3));
      el.style.setProperty("--lights", clamp((hour - 19) / 1.5).toFixed(3));
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
          <div className={s.frame}>
            <picture>
              <source media="(max-aspect-ratio: 4/5)" srcSet={`${base}/images/photos/laborator-exterior-m.jpg`} />
              <img
                src={`${base}/images/photos/laborator-exterior.jpg`}
                alt="Laboratorul Meredith din Caransebeș: intrarea cu arcadă din fier forjat și plăcuța „Laborator ciocolată belgiană”"
                loading="lazy"
                decoding="async"
              />
            </picture>
            <div className={`${s.layer} ${s.night}`} />
            <NightLights id="d" viewBox="0 0 2400 1297" className={s.lightsDesktop} />
            {/* phones show the 4:5 crop of the same photo (x 406–1444 in desktop pixels) */}
            <NightLights id="m" viewBox="406.5 0 1037.5 1297" className={s.lightsMobile} />
          </div>
        </div>
        <div className={`${s.layer} ${s.dawn}`} />
        <div className={`${s.layer} ${s.golden}`} />
        <div className={`${s.layer} ${s.shade}`} />

        <div className={s.head}>
          <p className="eyebrow">03 — O zi în laborator</p>
          <h2 id="atelier-title">
            Caransebeș, <em>Strada Pajiștei 14</em>
          </h2>
        </div>

        <div className={s.card} aria-hidden="true">
          <span ref={clock} className={s.time}>
            07:00
          </span>
          <span className={s.label}>Laborator Meredith</span>
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
