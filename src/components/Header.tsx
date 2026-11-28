"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { nav, shop } from "@/lib/site";
import { useOrder } from "@/lib/order";
import s from "./Header.module.css";

export default function Header() {
  const pathname = usePathname();
  const { count, setOpen } = useOrder();
  const [theme, setTheme] = useState<"dark" | "light" | "clear">("light");
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      setScrolled(window.scrollY > 24);
      const zone = document
        .elementsFromPoint(window.innerWidth / 2, 40)
        .map((e) => e.closest<HTMLElement>("[data-header], main, footer"))
        .find((z) => z && !z.closest("header"));
      const t = zone?.dataset?.header;
      setTheme(t === "dark" ? "dark" : t === "clear" ? "clear" : "light");
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [pathname]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- close menu on navigation
    setMenu(false);
  }, [pathname]);

  useEffect(() => {
    // Freeze the page behind the open menu (Lenis drives the scroll, so stop it too).
    const lenis = (window as unknown as { __lenis?: { stop(): void; start(): void } }).__lenis;
    document.documentElement.style.overflow = menu ? "hidden" : "";
    if (menu) lenis?.stop();
    else lenis?.start();
  }, [menu]);

  // Little "bump" on the basket whenever a product is added.
  const [bump, setBump] = useState(0);
  const prev = useRef(count);
  useEffect(() => {
     
    if (count > prev.current) setBump((b) => b + 1);
    prev.current = count;
  }, [count]);

  const dark = theme === "dark" && !menu;

  return (
    <header className={`${s.header} ${dark ? s.dark : theme === "clear" && !menu ? s.clear : s.light} ${scrolled ? s.scrolled : ""} ${menu ? s.menuOpen : ""}`}>
      <div className={s.inner}>
        <Link href="/" className={s.logo} aria-label="Meredith Choco House — acasă">
          {/* Both logos are loaded up front so switching (dark sections, open menu) is instant. */}
          <Image className={dark ? s.logoOn : s.logoOff} src="/images/logo-gold.png" alt="Meredith Choco House" width={772} height={388} priority sizes="120px" />
          <Image className={dark ? s.logoOff : s.logoOn} src="/images/logo-gold-dark.png" alt="" aria-hidden="true" width={772} height={388} priority sizes="120px" />
        </Link>

        <nav className={s.nav} aria-label="Navigare principală">
          {nav.map((n) =>
            n.href === "/produse" ? (
              <div key={n.href} className={s.drop}>
                <Link href={n.href} className={pathname.startsWith(n.href) ? s.active : undefined} aria-haspopup="true">
                  {n.label}
                </Link>
                <div className={s.dropMenu}>
                  {shop.map((c) => (
                    <Link key={c.href} href={c.href}>
                      <span>{c.label}</span>
                      <small>{c.note}</small>
                    </Link>
                  ))}
                  <Link href="/produse" className={s.dropAll}>
                    Toate produsele →
                  </Link>
                </div>
              </div>
            ) : (
              <Link key={n.href} href={n.href} className={pathname.startsWith(n.href) ? s.active : undefined}>
                {n.label}
              </Link>
            ),
          )}
        </nav>

        <div className={s.actions}>
          <button className={`${s.bag} ${count > 0 ? s.bagFull : ""}`} onClick={() => setOpen(true)} aria-label={`Comanda ta, ${count} produse`}>
            <span>Comanda</span>
            <span key={bump} className={`${s.count} ${bump ? s.bump : ""}`} data-has={count > 0}>
              {count}
            </span>
          </button>
          <button className={s.burger} onClick={() => setMenu((m) => !m)} aria-expanded={menu} aria-controls="mobile-menu" aria-label="Meniu">
            <i />
            <i />
          </button>
        </div>
      </div>

      <div id="mobile-menu" className={`${s.mobile} ${menu ? s.mobileOn : ""}`} aria-hidden={!menu} inert={!menu}>
        <nav aria-label="Navigare mobil">
          {nav.map((n, i) => (
            <Link key={n.href} href={n.href} style={{ transitionDelay: menu ? `${i * 30}ms` : "0ms" }} onClick={() => setMenu(false)}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className={s.shopChips}>
          <p className="eyebrow">Comandă rapid</p>
          <div>
            {shop.map((c) => (
              <Link key={c.href} href={c.href} onClick={() => setMenu(false)}>
                {c.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
