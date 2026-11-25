"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import s from "./Gallery.module.css";

export type Shot = { src: string; alt: string; w: number; h: number };

export default function Gallery({ shots }: { shots: Shot[] }) {
  const [i, setI] = useState<number | null>(null);
  useEffect(() => {
    if (i === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setI(null);
      if (e.key === "ArrowRight") setI((x) => (x! + 1) % shots.length);
      if (e.key === "ArrowLeft") setI((x) => (x! - 1 + shots.length) % shots.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [i, shots.length]);

  return (
    <>
      <div className={s.masonry}>
        {shots.map((sh, k) => (
          <button key={sh.src} className={`${s.item} reveal`} onClick={() => setI(k)} aria-label={`Mărește: ${sh.alt}`}>
            <Image src={sh.src} alt={sh.alt} width={sh.w} height={sh.h} sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw" />
          </button>
        ))}
      </div>
      {i !== null && (
        <div className={s.lightbox} role="dialog" aria-modal="true" aria-label={shots[i].alt} onClick={() => setI(null)}>
          <Image src={shots[i].src} alt={shots[i].alt} fill sizes="100vw" />
          <p>{shots[i].alt}</p>
          <button className={s.close} aria-label="Închide" onClick={() => setI(null)}>
            ×
          </button>
        </div>
      )}
    </>
  );
}
