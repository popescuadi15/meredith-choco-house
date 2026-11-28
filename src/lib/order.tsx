"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { bySlug, linePrice } from "./products";

export type OrderLine = { slug: string; qty: number; variant?: string };

export const lineKey = (l: Pick<OrderLine, "slug" | "variant">) => (l.variant ? `${l.slug}:${l.variant}` : l.slug);

type OrderCtx = {
  lines: OrderLine[];
  count: number;
  total: number;
  open: boolean;
  setOpen: (v: boolean) => void;
  add: (slug: string, variant?: string, qty?: number) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
};

const Ctx = createContext<OrderCtx | null>(null);
const KEY = "meredith-order-v1";

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<OrderLine[]>([]);
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate from storage once on mount
      if (raw) setLines((JSON.parse(raw) as OrderLine[]).filter((l) => bySlug(l.slug)));
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem(KEY, JSON.stringify(lines));
  }, [lines, loaded]);

  const add = useCallback((slug: string, variant?: string, qty = 1) => {
    const key = lineKey({ slug, variant });
    setLines((ls) => {
      const found = ls.find((l) => lineKey(l) === key);
      if (found) return ls.map((l) => (lineKey(l) === key ? { ...l, qty: l.qty + qty } : l));
      return [...ls, { slug, variant, qty }];
    });
    // The basket no longer pops open: the button confirms and the header basket bumps instead.
  }, []);

  const setQty = useCallback((key: string, qty: number) => {
    setLines((ls) => (qty <= 0 ? ls.filter((l) => lineKey(l) !== key) : ls.map((l) => (lineKey(l) === key ? { ...l, qty } : l))));
  }, []);

  const value = useMemo<OrderCtx>(() => {
    const count = lines.reduce((s, l) => s + l.qty, 0);
    const total = lines.reduce((s, l) => { const p = bySlug(l.slug); return s + (p ? linePrice(p, l.variant) : 0) * l.qty; }, 0);
    return {
      lines,
      count,
      total,
      open,
      setOpen,
      add,
      setQty,
      remove: (key) => setQty(key, 0),
      clear: () => setLines([]),
    };
  }, [lines, open, add, setQty]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useOrder() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useOrder must be used inside OrderProvider");
  return c;
}
