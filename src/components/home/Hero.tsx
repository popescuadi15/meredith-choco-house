"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import ChocolateCanvas from "./ChocolateCanvas";
import { ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import s from "./Hero.module.css";

const stages = [
  { a: "Ciocolată", b: "belgiană.", text: "Callebaut și Master Martini. Alegem doar ciocolata pe care am dărui-o celor dragi." },
  { a: "Topită", b: "încet.", text: "Fără grabă și fără mașinării. Totul începe cu răbdare, în atelierul nostru din Caransebeș." },
  { a: "Temperată", b: "manual.", text: "Până capătă luciul și ruptura curată a unei ciocolate adevărate." },
  { a: "Pictată", b: "pentru tine.", text: "Fiecare tabletă și fiecare pralină — colorată de mână, una câte una, în culorile alese de tine." },
  { a: "Gata de", b: "dăruit.", text: "Fiecare creație are propria poveste, fiecare detaliu poartă semnătura noastră." },
];

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const [active, setActive] = useState(0);
  const [static_, setStatic] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time capability check
      setStatic(true);
      setActive(stages.length - 1);
      progress.current = 0.5;
      return;
    }
    const el = root.current!;
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top top",
      end: "bottom bottom",
      onUpdate(self) {
        const p = self.progress;
        progress.current = p;
        el.style.setProperty("--p", p.toFixed(4));
        el.style.setProperty("--reveal", Math.min(1, Math.max(0, (p - 0.8) / 0.14)).toFixed(4));
        setActive(Math.min(stages.length - 1, Math.floor(p * stages.length * 0.999)));
      },
    });
    return () => st.kill();
  }, []);

  return (
    <section ref={root} className={`${s.hero} ${static_ ? s.static : ""}`} data-header="dark" aria-labelledby="hero-title">
      <div className={s.sticky}>
        <div className={s.canvas}>
          <ChocolateCanvas progress={progress} />
        </div>
        <div className={s.photo} aria-hidden={active < stages.length - 1}>
          <Image src="/images/photos/atelier-callebaut.jpg" alt="Tablete Meredith pictate manual, lângă sacii de ciocolată belgiană Callebaut din atelier" fill sizes="100vw" quality={75} />
        </div>
        <div className={s.shade} />

        <div className={s.top}>
          <h1 id="hero-title" className={s.h1}>
            Ciocolaterie artizanală <span>· Caransebeș</span>
          </h1>
        </div>

        <div className={s.stages}>
          {stages.map((st, i) => (
            <div key={i} className={`${s.stage} ${i === active ? s.on : ""} ${i < active ? s.past : ""}`} aria-hidden={i !== active}>
              <p className={s.title}>
                <span className={s.line}>
                  <span>{st.a}</span>
                </span>{" "}
                <span className={s.line}>
                  <em>{st.b}</em>
                </span>
              </p>
              <p className={s.text}>{st.text}</p>
              {i === stages.length - 1 && (
                <div className={s.ctas}>
                  <Link href="/produse" className="btn btn--gold" tabIndex={i === active ? 0 : -1}>
                    Descoperă colecțiile
                  </Link>
                  <Link href="/evenimente" className="btn btn--light btn--ghost" tabIndex={i === active ? 0 : -1}>
                    Pentru evenimente
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className={s.meter} aria-hidden="true">
          <span>{String(active + 1).padStart(2, "0")}</span>
          <i>
            <b />
          </i>
          <span>{String(stages.length).padStart(2, "0")}</span>
        </div>
        <div className={s.cue} aria-hidden="true">
          Derulează
        </div>
      </div>
    </section>
  );
}
