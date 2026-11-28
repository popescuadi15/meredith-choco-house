import Link from "next/link";
import Image from "next/image";
import { site, waLink } from "@/lib/site";
import s from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={s.footer} data-header="dark">
      <div className={`container ${s.top}`}>
        <div className={s.brand}>
          <Image src="/images/logo-gold.png" alt="Meredith Choco House" width={772} height={388} sizes="220px" />
          <p>{site.tagline}</p>
        </div>

        <div className={s.cols}>
          <div>
            <h2 className="eyebrow">Laborator</h2>
            <address>
              {site.address.street}
              <br />
              {site.address.city}, jud. {site.address.county}
            </address>
            {site.hours.map((h) => (
              <p key={h.days}>
                {h.days}: {h.time}
              </p>
            ))}
            <p className={s.muted}>Comenzi telefonic cu 24–72 h înainte</p>
          </div>
          <div>
            <h2 className="eyebrow">Comenzi</h2>
            <a href={`tel:${site.phoneE164}`}>{site.phone}</a>
            <a href={waLink("Bună ziua! Aș dori să comand de la Meredith Choco House.")} target="_blank" rel="noopener">
              WhatsApp
            </a>
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </div>
          <div>
            <h2 className="eyebrow">Colecții</h2>
            <Link href="/produse#tablete">Tablete</Link>
            <Link href="/produse#cutii-cadou">Cutii cadou</Link>
            <Link href="/produse#craciun">Crăciun</Link>
            <Link href="/evenimente">Mărturii & Choco Bar</Link>
          </div>
          <div>
            <h2 className="eyebrow">Urmărește-ne</h2>
            <div className={s.social}>
              <a href={site.social.instagram} target="_blank" rel="noopener" aria-label="Meredith Choco House pe Instagram">
                <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                  <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="1.6" />
                  <circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" strokeWidth="1.6" />
                  <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" />
                </svg>
              </a>
              <a href={site.social.tiktok} target="_blank" rel="noopener" aria-label="Meredith Choco House pe TikTok">
                <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M16.6 3c.3 2.1 1.6 3.7 3.7 3.9v3a7.1 7.1 0 0 1-3.6-1.1v6.4A6.2 6.2 0 1 1 10.5 9v3.1a3.1 3.1 0 1 0 3.1 3.1V3h3Z"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className={`container ${s.bottom}`}>
        <p>
          © 2026 {site.legalName}
        </p>
        <nav aria-label="Legal">
          <Link href="/termeni">Termeni</Link>
          <Link href="/politica-de-confidentialitate">Confidențialitate</Link>
          <a href="https://anpc.ro/" target="_blank" rel="noopener">
            ANPC
          </a>
        </nav>
      </div>
    </footer>
  );
}
