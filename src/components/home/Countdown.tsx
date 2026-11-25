"use client";

import { useEffect, useState } from "react";
import s from "./Christmas.module.css";

export default function Countdown({ to }: { to: string }) {
  const [left, setLeft] = useState<number | null>(null);
  useEffect(() => {
    const target = new Date(to).getTime();
    const tick = () => setLeft(Math.max(0, target - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [to]);

  if (left === null) return <div className={s.count} aria-hidden="true" />;
  if (left === 0)
    return (
      <p className={s.live}>
        Colecția este <em>disponibilă</em> — comandă acum.
      </p>
    );
  const d = Math.floor(left / 864e5),
    h = Math.floor((left / 36e5) % 24),
    m = Math.floor((left / 6e4) % 60),
    sec = Math.floor((left / 1e3) % 60);
  return (
    <div className={s.count} role="timer" aria-label={`Lansare în ${d} zile și ${h} ore`}>
      {[
        [d, "zile"],
        [h, "ore"],
        [m, "minute"],
        [sec, "secunde"],
      ].map(([v, l]) => (
        <div key={l as string}>
          <strong>{String(v).padStart(2, "0")}</strong>
          <span>{l}</span>
        </div>
      ))}
    </div>
  );
}
