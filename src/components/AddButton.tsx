"use client";

import { useOrder } from "@/lib/order";

export default function AddButton({ slug, className = "", label = "Adaugă la comandă", variant = "" }: { slug: string; className?: string; label?: string; variant?: string }) {
  const { add } = useOrder();
  return (
    <button type="button" className={`btn ${variant} ${className}`} onClick={() => add(slug)}>
      {label}
    </button>
  );
}
