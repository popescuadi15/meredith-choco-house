"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

/** In-site navigation history (sessionStorage), used by the back button. */
export const NAV_KEY = "meredith-nav";
const SCROLL_KEY = "meredith-scroll:";

/** Smooth scrolling (Lenis, synced with GSAP) + `.reveal` on-scroll fade-ins. */
export default function Motion() {
  const pathname = usePathname();
  const first = useRef(true);
  const popped = useRef(false);

  useEffect(() => {
    const onPop = () => (popped.current = true);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    // `anchors`: in-page links (#tablete, #cutii-cadou…) glide instead of jumping, landing below the header.
    const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, anchors: { offset: -88, duration: 1.4 }, stopInertiaOnNavigate: true });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    // Remember the route trail for the back button (survives refresh, cleared with the tab).
    try {
      const trail: string[] = JSON.parse(sessionStorage.getItem(NAV_KEY) || "[]");
      if (trail[trail.length - 1] !== pathname) trail.push(pathname);
      sessionStorage.setItem(NAV_KEY, JSON.stringify(trail.slice(-30)));
    } catch {}

    // New page → start at the top; a refresh / first load keeps the browser's own scroll restore
    // (and honours #anchors in the URL).
    const lenis = () => (window as unknown as { __lenis?: Lenis }).__lenis;
    const saved = Number(sessionStorage.getItem(`${SCROLL_KEY}${pathname}`) || 0);
    const restoreTo = (y: number) => {
      const restore = () => {
        ScrollTrigger.refresh();
        const l = lenis();
        if (l) l.scrollTo(y, { immediate: true, force: true });
        else window.scrollTo(0, y);
      };
      setTimeout(restore, 60);
      setTimeout(restore, 450);
    };
    if (first.current) {
      first.current = false;
      if ("scrollRestoration" in history) history.scrollRestoration = "manual";
      if (location.hash) {
        const target = document.querySelector(decodeURIComponent(location.hash));
        if (target) setTimeout(() => lenis()?.scrollTo(target as HTMLElement, { offset: -88, immediate: true }), 50);
      } else if (saved > 0) {
        // Refresh: come back to where the visitor was (after layout and pinned sections settle).
        restoreTo(saved);
      }
    } else if (popped.current) {
      // Back/forward: return to the spot the visitor left on that page.
      popped.current = false;
      if (saved > 0) restoreTo(saved);
      else window.scrollTo(0, 0);
    } else {
      window.scrollTo(0, 0);
    }

    // Keep the current position per page, for refresh.
    let raf = 0;
    const save = () => {
      raf = 0;
      sessionStorage.setItem(`${SCROLL_KEY}${pathname}`, String(Math.round(window.scrollY)));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(save);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    const seen = new WeakSet<Element>();
    const scan = () =>
      document.querySelectorAll<HTMLElement>(".reveal:not(.is-in)").forEach((el) => {
        if (!seen.has(el)) {
          seen.add(el);
          io.observe(el);
        }
      });
    scan();
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });
    const t = setTimeout(() => ScrollTrigger.refresh(), 300);
    return () => {
      io.disconnect();
      mo.disconnect();
      clearTimeout(t);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [pathname]);

  return null;
}
