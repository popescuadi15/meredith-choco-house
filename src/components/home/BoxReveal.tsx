"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { bySlug } from "@/lib/products";
import AddButton from "@/components/AddButton";
import s from "./BoxReveal.module.css";

const box = bySlug("cutie-meredith-selection")!;
// One column of the box per cream — the praline shown is the one Meredith makes for it.
const fillings = [
  { id: "fistic", name: "Fistic", note: "Cremă de fistic, intensă și catifelată" },
  { id: "caramel", name: "Caramel", note: "Cremă fină de caramel" },
  { id: "nocciola", name: "Nocciola", note: "Cremă de alune de pădure" },
  { id: "cocos", name: "Cocos", note: "Cremă delicată de cocos" },
];
const ROWS = 3;
const clamp = (x: number) => Math.min(1, Math.max(0, x));

export default function BoxReveal() {
  const root = useRef<HTMLElement>(null);
  const [step, setStep] = useState(-1);

  useEffect(() => {
    const el = root.current!;
    const render = (p: number) => {
      const open = clamp(p / 0.38);
      el.style.setProperty("--open", open.toFixed(4));
      setStep(p < 0.42 ? -1 : Math.min(fillings.length - 1, Math.floor(((p - 0.42) / 0.5) * fillings.length)));
    };
    if (prefersReducedMotion()) {
      render(1);
      return;
    }
    render(0);
    const st = ScrollTrigger.create({ trigger: el, start: "top top", end: "bottom bottom", onUpdate: (self) => render(self.progress) });
    return () => st.kill();
  }, []);

  return (
    <section id="cutii-cadou" ref={root} className={s.section} aria-labelledby="box-title">
      <div className={s.sticky}>
        <div className={s.copy}>
          <p className="eyebrow">Meredith Selection</p>
          <h2 id="box-title">
            Douăsprezece praline, <em>pictate una câte una.</em>
          </h2>
          <p className={s.lead}>{box.description}</p>
          <div className={s.buy}>
            <span className={s.price}>
              {box.price} lei <small>· {box.weight}</small>
            </span>
            <AddButton slug={box.slug} label="Adaugă cutia" />
          </div>
          <Link href="/produse#cutii-cadou" className={s.more}>
            Vezi toate cutiile cadou →
          </Link>
        </div>

        <div className={s.stage}>
          <div className={s.box}>
            <div className={s.base} data-step={step} style={{ "--lx": `${12.5 + Math.max(0, step) * 25}%` } as React.CSSProperties}>
              <div className={s.tray} role="img" aria-label={`${box.name}: douăsprezece praline pictate manual, câte trei pentru fiecare cremă — fistic, caramel, nocciola și cocos`}>
                {Array.from({ length: ROWS }, (_, r) =>
                  fillings.map((f, c) => (
                    <div key={`${f.id}-${r}`} className={`${s.cell} ${step === c ? s.cellOn : ""}`} data-dim={step >= 0 && step !== c}>
                      <Image src={`/images/pralines/${f.id}-${r + 1}.webp`} alt="" width={320} height={320} sizes="120px" />
                    </div>
                  )),
                )}
                <span className={s.light} aria-hidden="true" />
              </div>
            </div>
            <div className={s.lid} aria-hidden="true">
              <div className={s.lidFace}>
                <span className={s.ribbonH} />
                <span className={s.ribbonV} />
                <svg className={s.bow} viewBox="0 0 120 70">
                  <defs>
                    <linearGradient id="bowg" x1="0" x2="1">
                      <stop offset="0" stopColor="#8a6a37" />
                      <stop offset=".45" stopColor="#ecd59f" />
                      <stop offset="1" stopColor="#9c7a43" />
                    </linearGradient>
                  </defs>
                  <path d="M60 35 C 40 5, 8 8, 12 30 C 15 50, 42 46, 60 35 Z" fill="url(#bowg)" />
                  <path d="M60 35 C 80 5, 112 8, 108 30 C 105 50, 78 46, 60 35 Z" fill="url(#bowg)" />
                  <path d="M56 38 L 44 68 L 52 64 L 58 70 Z M64 38 L 76 68 L 68 64 L 62 70 Z" fill="url(#bowg)" />
                  <rect x="53" y="28" width="14" height="14" rx="4" fill="#b8955a" />
                </svg>
                <Image className={s.lidLogo} src="/images/logo-gold-dark.png" alt="" width={772} height={388} sizes="160px" />
              </div>
            </div>
          </div>
        </div>

        {/* phones: the list is hidden, so the box says which cream is lit */}
        <p className={s.caption} aria-live="polite">
          {step >= 0 ? (
            <>
              <strong key={fillings[step].id}>{fillings[step].name}</strong> {fillings[step].note}
            </>
          ) : (
            "Patru creme, câte trei praline din fiecare"
          )}
        </p>

        <ol className={s.list} aria-label="Umpluturi">
          {fillings.map((f, i) => (
            <li key={f.name} className={i === step ? s.on : undefined}>
              <span>{String(i + 1).padStart(2, "0")}</span>
              <div>
                <strong>{f.name}</strong>
                <em>{f.note}</em>
              </div>
            </li>
          ))}
          <li className={s.choc}>
            <span>—</span>
            <div>
              <strong>Ciocolata</strong>
              <em>Albă, cu lapte, neagră sau fără zahăr — o alegi tu la precomandă.</em>
            </div>
          </li>
        </ol>
      </div>
    </section>
  );
}
