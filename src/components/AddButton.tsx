"use client";

import Link from "next/link";
import { useState } from "react";
import { useOrder } from "@/lib/order";
import { bySlug } from "@/lib/products";
import s from "./AddButton.module.css";

type Props = { slug: string; className?: string; label?: string; variant?: string; /** Show the weight picker inline (product page). */ picker?: boolean };

export default function AddButton({ slug, className = "", label = "Adaugă la comandă", variant = "", picker = false }: Props) {
  const { add } = useOrder();
  const p = bySlug(slug);
  const [choice, setChoice] = useState(p?.variants?.[1]?.id ?? p?.variants?.[0]?.id);

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
      <button type="button" className={`btn ${variant} ${className}`} onClick={() => add(slug, p?.variants ? choice : undefined)}>
        {label}
      </button>
    </span>
  );
}
