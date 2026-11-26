"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { lineKey, useOrder } from "@/lib/order";
import { bySlug, formatPrice, linePrice } from "@/lib/products";
import { site, waLink } from "@/lib/site";
import s from "./OrderDrawer.module.css";

export default function OrderDrawer() {
  const { lines, open, setOpen, setQty, remove, total, clear } = useOrder();
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    panel.current?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  const message = () => {
    const items = lines
      .map((l) => {
        const p = bySlug(l.slug)!;
        const v = p.variants?.find((x) => x.id === l.variant);
        const price = linePrice(p, l.variant);
        return `• ${l.qty} × ${p.name}${v ? ` ${v.label}` : ""}${price ? ` (${price} lei)` : ""}`;
      })
      .join("\n");
    return [
      "Bună ziua! Aș dori să comand de la Meredith Choco House:",
      items,
      total ? `Total estimativ: ${total} lei` : "",
      name && `Nume: ${name}`,
      date && `Data dorită pentru ridicare: ${date}`,
      notes && `Mențiuni: ${notes}`,
    ]
      .filter(Boolean)
      .join("\n");
  };

  return (
    <div className={`${s.root} ${open ? s.open : ""}`} aria-hidden={!open} inert={!open}>
      <button className={s.scrim} onClick={() => setOpen(false)} aria-label="Închide" tabIndex={-1} />
      <div className={s.panel} role="dialog" aria-modal="true" aria-labelledby="order-title" ref={panel} tabIndex={-1}>
        <div className={s.head}>
          <h2 id="order-title">
            Comanda <span className="script gold-text">ta</span>
          </h2>
          <button className={s.close} onClick={() => setOpen(false)} aria-label="Închide comanda">
            ×
          </button>
        </div>

        {lines.length === 0 ? (
          <div className={s.empty}>
            <p>Comanda ta este goală.</p>
            <Link href="/produse" className="btn btn--ghost" onClick={() => setOpen(false)}>
              Descoperă colecțiile
            </Link>
          </div>
        ) : (
          <>
            <ul className={s.lines}>
              {lines.map((l) => {
                const p = bySlug(l.slug)!;
                const img = p.cutout ?? p.photo;
                const key = lineKey(l);
                const v = p.variants?.find((x) => x.id === l.variant);
                return (
                  <li key={key}>
                    <div className={s.thumb}>{img ? <Image src={img} alt="" fill sizes="72px" /> : <span className="script">M</span>}</div>
                    <div className={s.info}>
                      <p className={s.name}>{p.name}</p>
                      <p className={s.price}>{v ? `${v.label} · ${v.price} lei` : formatPrice(p)}</p>
                      <div className={s.qty}>
                        <button onClick={() => setQty(key, l.qty - 1)} aria-label={`Scade cantitatea pentru ${p.name}`}>
                          −
                        </button>
                        <span aria-live="polite">{l.qty}</span>
                        <button onClick={() => setQty(key, l.qty + 1)} aria-label={`Crește cantitatea pentru ${p.name}`}>
                          +
                        </button>
                      </div>
                    </div>
                    <button className={s.remove} onClick={() => remove(key)} aria-label={`Elimină ${p.name}`}>
                      Elimină
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className={s.form}>
              <label>
                <span>Numele tău</span>
                <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
              </label>
              <label>
                <span>Când dorești să ridici comanda?</span>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </label>
              <label>
                <span>Mențiuni (tip ciocolată, cremă, mesaj)</span>
                <textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
              </label>
            </div>

            <div className={s.foot}>
              {total > 0 && (
                <p className={s.total}>
                  <span>Total estimativ</span>
                  <strong>{total} lei</strong>
                </p>
              )}
              <p className={s.note}>
                Timp de pregătire: tablete 24–48 h, cutii cadou minimum 48 h, restul 48–72 h. Comenzile se ridică din atelier, {site.address.street}, {site.address.city}. Plata la ridicare.
              </p>
              <a className="btn btn--gold" href={waLink(message())} target="_blank" rel="noopener">
                Trimite comanda pe WhatsApp
              </a>
              <a className="btn btn--ghost" href={`tel:${site.phoneE164}`}>
                Sau sună: {site.phone}
              </a>
              <button className={s.clear} onClick={clear}>
                Golește comanda
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
