"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { bySlug } from "./products";

export type OrderLine = { slug: string; qty: number };

type OrderCtx = {
  lines: OrderLine[];
  count: number;
  total: number;
  open: boolean;
  setOpen: (v: boolean) => void;
  add: (slug: string, qty?: number) => void;
  setQty: (slug: string, qty: number) => void;
  remove: (slug: string) => void;
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

  const add = useCallback((slug: string, qty = 1) => {
    setLines((ls) => {
      const found = ls.find((l) => l.slug === slug);
      if (found) return ls.map((l) => (l.slug === slug ? { ...l, qty: l.qty + qty } : l));
      return [...ls, { slug, qty }];
    });
    setOpen(true);
  }, []);

  const setQty = useCallback((slug: string, qty: number) => {
    setLines((ls) => (qty <= 0 ? ls.filter((l) => l.slug !== slug) : ls.map((l) => (l.slug === slug ? { ...l, qty } : l))));
  }, []);

  const value = useMemo<OrderCtx>(() => {
    const count = lines.reduce((s, l) => s + l.qty, 0);
    const total = lines.reduce((s, l) => s + (bySlug(l.slug)?.price ?? 0) * l.qty, 0);
    return {
      lines,
      count,
      total,
      open,
      setOpen,
      add,
      setQty,
      remove: (slug) => setQty(slug, 0),
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
