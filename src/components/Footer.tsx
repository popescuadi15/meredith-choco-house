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
            <h2 className="eyebrow">Atelier</h2>
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
            <a href={site.social.instagram} target="_blank" rel="noopener">
              Instagram
            </a>
            <a href={site.social.tiktok} target="_blank" rel="noopener">
              TikTok
            </a>
          </div>
        </div>
      </div>
      <div className={`container ${s.bottom}`}>
        <p>
          © 2026 {site.legalName} · CUI {site.cui} · Foto: PH Studio — Petru Humița
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
