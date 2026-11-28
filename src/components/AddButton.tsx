"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useOrder } from "@/lib/order";
import { bySlug } from "@/lib/products";
import s from "./AddButton.module.css";

type Props = { slug: string; className?: string; label?: string; variant?: string; /** Show the weight picker inline (product page). */ picker?: boolean };

export default function AddButton({ slug, className = "", label = "Adaugă la comandă", variant = "", picker = false }: Props) {
  const { add } = useOrder();
  const p = bySlug(slug);
  const [choice, setChoice] = useState(p?.variants?.[1]?.id ?? p?.variants?.[0]?.id);
  const [added, setAdded] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const onAdd = () => {
    add(slug, p?.variants ? choice : undefined);
    setAdded(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setAdded(false), 1600);
  };

  if (p?.variants && !picker) {
    return (
      <Link href={`/produse/${slug}`} className={`btn ${variant} ${className}`}>
        Alege gramajul
      </Link>
    );
  }

  return (
    <span className={s.wrap}>
      {p?.variants && (
        <span className={s.picker} role="radiogroup" aria-label="Gramaj">
          {p.variants.map((v) => (
            <button key={v.id} type="button" role="radio" aria-checked={choice === v.id} className={choice === v.id ? s.on : undefined} onClick={() => setChoice(v.id)}>
              <strong>{v.label}</strong>
              <small>{v.price} lei</small>
            </button>
          ))}
        </span>
      )}
      <button type="button" className={`btn ${variant} ${className} ${added ? s.added : ""}`} onClick={onAdd} aria-live="polite">
        {added ? (
          <>
            <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true">
              <path d="M3 8.5l3.2 3L13 4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Adăugat
          </>
        ) : (
          label
        )}
      </button>
    </span>
  );
}
