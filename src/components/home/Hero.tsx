"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import FrameSequence from "./FrameSequence";
import frames from "@/lib/hero-frames.json";
import { ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import s from "./Hero.module.css";

const stages = [
  { a: "Ciocolată", b: "belgiană.", text: "Callebaut — ciocolată belgiană premium. Fiecare dorință inspiră o creație, fiecare creație devine unică." },
  { a: "Încălzită", b: "încet.", text: "Încet, căldura îmbrățișează ciocolata, trezindu-i aroma și pregătind-o pentru o nouă formă." },
  { a: "Temperare.", b: "", text: "O îmbinare între temperatură și răbdare, care transformă ciocolata într-o creație fină, cu luciu delicat și textură perfectă." },
  { a: "Pictată", b: "pentru tine.", text: "Colorată și pictată artizanal, fiecare creație e unică. Îți dăruim timp și atenție, ca să o facem exact așa cum ai visat-o." },
  { a: "Un dar cu", b: "gust de magie.", text: "Pregătită să surprindă, ciocolata noastră transformă fiecare dăruire într-un moment de neuitat." },
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
      progress.current = 1;
      return;
    }
    const el = root.current!;
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top top",
      end: "bottom bottom",
      onUpdate(self) {
        const p = self.progress;
        // The footage ends a little before the section does, so the last stage can hold.
        const seq = Math.min(1, p / 0.9);
        progress.current = seq;
        el.style.setProperty("--p", p.toFixed(4));
        let i = 0;
        frames.stages.forEach((start, k) => {
          if (seq >= start - 0.01) i = k;
        });
        setActive(i);
      },
    });
    return () => st.kill();
  }, []);

  return (
    <section ref={root} className={`${s.hero} ${static_ ? s.static : ""}`} data-header="dark" aria-labelledby="hero-title">
      <div className={s.sticky}>
        <div className={s.canvas}>
          <FrameSequence progress={progress} name="hero" frames={frames} priority />
        </div>
        <div className={s.grain} aria-hidden="true" />
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
                </span>
                {st.b && (
                  <>
                    {" "}
                    <span className={s.line}>
                      <em>{st.b}</em>
                    </span>
                  </>
                )}
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
