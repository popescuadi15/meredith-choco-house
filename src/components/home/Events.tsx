"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import s from "./Events.module.css";

/*
  "Invitația" — events told as an invitation.
  1. a sealed envelope on a midnight table; 2. the seal breaks, the flap opens, the card slides out;
  3. the envelope falls away and the card grows into the offer; 4. polaroids of the Choco Bar and
  the favours land around it, like photos spread on the table after the party.
*/

const clamp = (x: number) => Math.min(1, Math.max(0, x));
const smooth = (e0: number, e1: number, x: number) => {
  const t = clamp((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// Final spots as fractions of the viewport (desktop / phone). `back` = tucked behind the card.
const photos = [
  { src: "/images/photos/candybar-vertical.jpg", alt: "Deluxe Meredith Choco Bar: trepte aurii cu praline și batoane", caption: "Deluxe Choco Bar", w: 1023, h: 1537, d: [-0.33, -0.1, -7, 0.14], m: [-0.3, -0.29, -8, 0.3] },
  { src: "/images/photos/candybar-randuri.jpg", alt: "Rânduri de praline și batoane pe masa de ciocolată", caption: "rânduri de praline", w: 1600, h: 1064, d: [-0.35, 0.25, 5, 0.19], m: [0.3, -0.33, 7, 0.36] },
  { src: "/images/photos/candybar-detaliu.jpg", alt: "Detaliu de praline pictate la Choco Bar", caption: "pictate manual", w: 1023, h: 1537, d: [0.33, -0.12, 6, 0.135], m: [-0.31, 0.36, 6, 0.28] },
  { src: "/images/photos/marturii-zmeura.jpg", alt: "Mărturii: mini tablete din ciocolată cu zmeură", caption: "mărturii", w: 2400, h: 1600, d: [0.36, 0.24, -4, 0.19], m: [0.31, 0.38, -6, 0.36] },
  { src: "/images/photos/eveniment-cutii-praline.jpg", alt: "Cutii cu praline pregătite pentru invitați", caption: "", w: 1200, h: 1600, d: [0.19, -0.33, 11, 0.1], m: null, back: true },
  { src: "/images/photos/marturii-fistic-zmeura.jpg", alt: "Mărturii cu fistic și zmeură", caption: "", w: 2400, h: 2015, d: [-0.2, 0.36, -9, 0.11], m: null, back: true },
] as const;

export default function Events() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current!;
    const q = <T extends HTMLElement>(sel: string) => el.querySelector<T>(sel)!;
    const env = q("[data-env]");
    const flap = q("[data-flap]");
    const seal = q("[data-seal]");
    const card = q("[data-card]");
    const content = q("[data-content]");
    const pics = Array.from(el.querySelectorAll<HTMLElement>("[data-pic]"));

    const render = (p: number) => {
      const W = window.innerWidth,
        H = window.innerHeight,
        mobile = W < 760;
      const headerH = 76;

      const sealOff = smooth(0.03, 0.1, p);
      const flapOpen = smooth(0.07, 0.19, p);
      const slide = smooth(0.17, 0.3, p);
      const drop = smooth(0.29, 0.42, p);
      const grow = smooth(0.31, 0.46, p);
      const reveal = smooth(0.42, 0.5, p);

      // envelope
      const envW = Math.min(460, W * 0.8);
      const envH = envW * 0.64;
      const envY = H * (mobile ? 0.08 : 0.1);
      env.style.width = `${envW}px`;
      env.style.height = `${envH}px`;
      env.style.transform = `translate(-50%, -50%) translate3d(0, ${(envY + drop * H * 0.75).toFixed(1)}px, 0) rotate(${(drop * 6).toFixed(2)}deg)`;
      env.style.opacity = String(1 - smooth(0.32, 0.44, p));
      seal.style.transform = `translate(-50%, -50%) scale(${(1 + sealOff * 0.5).toFixed(3)}) rotate(${(sealOff * 25).toFixed(1)}deg)`;
      seal.style.opacity = String(1 - sealOff);
      flap.style.transform = `rotateX(${(flapOpen * 178).toFixed(1)}deg)`;
      flap.style.zIndex = flapOpen > 0.5 ? "0" : "4";

      // card: starts as a small card tucked in the envelope, ends as the offer in the middle
      const cardW = Math.min(540, W * (mobile ? 0.86 : 0.42));
      card.style.width = `${cardW}px`;
      const fullH = content.scrollHeight;
      const sIn = (envW * 0.9) / cardW;
      const hIn = (envH * 0.9) / sIn;
      const sOut = Math.min(1, (H - headerH - 36) / fullH);
      const h = lerp(hIn, fullH, grow);
      const sc = lerp(sIn, sOut, grow);
      const yIn = envY - slide * envH * 0.78;
      const yOut = headerH / 2;
      card.style.height = `${h.toFixed(1)}px`;
      card.style.transform = `translate(-50%, -50%) translate3d(0, ${lerp(yIn, yOut, grow).toFixed(1)}px, 0) scale(${sc.toFixed(4)})`;
      card.style.zIndex = slide > 0.55 || grow > 0 ? "6" : "2";
      el.style.setProperty("--reveal", reveal.toFixed(3));
      el.style.setProperty("--intro", (1 - smooth(0.15, 0.27, p)).toFixed(3));
      el.dataset.open = reveal > 0.5 ? "1" : "0";

      // polaroids land one after another
      pics.forEach((n, i) => {
        const ph = photos[i];
        const spot = mobile ? ph.m : ph.d;
        if (!spot) {
          n.style.opacity = "0";
          return;
        }
        const [fx, fy, fr, fw] = spot;
        const t = smooth(0.5 + i * 0.06, 0.66 + i * 0.06, p);
        const sx = fx * W * 2.4,
          sy = fy * H * 2.2 + H * 0.3;
        n.style.width = `${(fw * W).toFixed(1)}px`;
        n.style.transform = `translate(-50%, -50%) translate3d(${lerp(sx, fx * W, t).toFixed(1)}px, ${lerp(sy, fy * H + yOut, t).toFixed(1)}px, 0) rotate(${lerp(fr * 4, fr, t).toFixed(2)}deg)`;
        n.style.opacity = String(smooth(0, 0.4, t));
        n.style.zIndex = "back" in ph || mobile ? "3" : "7";
      });
    };

    if (prefersReducedMotion()) {
      render(1);
      return;
    }
    render(0);
    const st = ScrollTrigger.create({ trigger: el, start: "top top", end: "bottom bottom", onUpdate: (self) => render(self.progress) });
    const onResize = () => render(st.progress);
    window.addEventListener("resize", onResize);
    return () => {
      st.kill();
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <section id="evenimente" ref={root} className={s.section} data-header="dark" data-open="0" aria-labelledby="events-title">
      <div className={s.sticky}>
        <div className={s.intro} aria-hidden="true">
          <p className="eyebrow">Evenimente private</p>
          <p className={s.introTitle}>
            O invitație <em>pentru zilele mari.</em>
          </p>
        </div>

        {photos.map((ph) => (
          <figure key={ph.src} className={s.pic} data-pic>
            <span className={s.picImg} style={{ aspectRatio: `${ph.w} / ${ph.h}` }}>
              <Image src={ph.src} alt={ph.alt} fill sizes="(max-width: 760px) 40vw, 20vw" loading="lazy" />
            </span>
            {ph.caption && <figcaption className="script">{ph.caption}</figcaption>}
          </figure>
        ))}

        {/* the envelope */}
        <div className={s.env} data-env aria-hidden="true">
          <span className={s.envBack} />
          <span className={s.envFront} />
          <span className={s.flap} data-flap>
            <span className={s.flapFace} />
          </span>
          <span className={s.seal} data-seal>
            <span className="script">M</span>
          </span>
        </div>

        {/* the invitation */}
        <div className={s.card} data-card>
          <div className={s.front} aria-hidden="true">
            <span className={`script ${s.mono}`}>M</span>
            <span className={`script ${s.invited}`}>Sunteți invitați</span>
            <span className={s.invitedSub}>la o poveste dulce</span>
          </div>
          <div className={s.content} data-content>
            <p className="eyebrow">Evenimente private</p>
            <h2 id="events-title" className={s.title}>
              Logodnă, nuntă, <em>botez.</em>
            </h2>
            <p className={s.lead}>Machete, fructe trase în ciocolată și praline în culorile și umpluturile temei voastre — plus mărturii de bun venit într-o gamă foarte mare de forme și cutii la alegere.</p>
            <dl className={s.facts}>
              <div>
                <dt>Mărturii</dt>
                <dd>de la 5 lei / bucată</dd>
              </div>
              <div>
                <dt>Deluxe Choco Bar</dt>
                <dd>de la 10 lei / persoană</dd>
              </div>
              <div>
                <dt>Împreună</dt>
                <dd>20% reducere la mărturii</dd>
              </div>
            </dl>
            <p className={s.note}>
              Ne găsiți pe <strong>23–24 ianuarie 2027</strong> la Târgul de nunți de la Hotel Rogge, Reșița.
            </p>
            <div className={s.ctas}>
              <Link href="/evenimente" className="btn">
                Cere o ofertă
              </Link>
              <Link href="/degustari" className="btn btn--ghost">
                Programează o degustare
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
