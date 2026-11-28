"use client";

import { usePathname, useRouter } from "next/navigation";
import { NAV_KEY } from "./Motion";
import s from "./BackButton.module.css";

/** Back arrow on every inner page: returns to the previous page of the site, like an app. */
export default function BackButton() {
  const pathname = usePathname();
  const router = useRouter();
  if (pathname === "/") return null;

  const goBack = () => {
    let trail: string[] = [];
    try {
      trail = JSON.parse(sessionStorage.getItem(NAV_KEY) || "[]");
    } catch {}
    // Came here from another page of the site (also after a refresh): real history back.
    if (trail.length > 1 && window.history.length > 1) {
      router.back();
      return;
    }
    // Landed here directly: go to the parent page instead of leaving the site.
    router.push(pathname.startsWith("/produse/") ? "/produse" : "/");
  };

  return (
    <button type="button" className={s.back} onClick={goBack} aria-label="Înapoi la pagina anterioară">
      <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
        <path d="M12.5 4.5 7 10l5.5 5.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span>Înapoi</span>
    </button>
  );
}
