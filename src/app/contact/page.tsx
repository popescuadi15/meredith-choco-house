import type { Metadata } from "next";
import MapEmbed from "@/components/MapEmbed";
import JsonLd from "@/components/JsonLd";
import { faq } from "@/lib/faq";
import { faqSchema, breadcrumbs } from "@/lib/schema";
import { orderRules, site, waLink } from "@/lib/site";
import s from "../inner.module.css";

export const metadata: Metadata = {
  title: "Contact & comenzi — atelier în Caransebeș",
  description: "Comandă ciocolată artizanală Meredith: 0728 997 053 (telefon & WhatsApp). Atelier: Strada Pajiștei nr. 14, Caransebeș. Comenzi cu 24–72 h înainte, ridicare din atelier.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <header className="page-hero">
        <p className="eyebrow">Contact</p>
        <h1>
          Hai în <span className="script gold-text">atelier</span>
        </h1>
        <p>Comenzile se fac telefonic sau pe WhatsApp, cu 24–72 de ore înainte (în funcție de produs), și se ridică din atelierul nostru din Caransebeș.</p>
      </header>
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className={s.contact}>
            <div className={s.contactInfo}>
              <div>
                <h2 className="eyebrow">Telefon & WhatsApp</h2>
                <a className={s.big} href={`tel:${site.phoneE164}`}>
                  {site.phone}
                </a>
                <a className="btn" href={waLink("Bună ziua! Aș dori să comand de la Meredith Choco House.")} target="_blank" rel="noopener">
                  Scrie-ne pe WhatsApp
                </a>
              </div>
              <div>
                <h2 className="eyebrow">E-mail</h2>
                <a href={`mailto:${site.email}`}>{site.email}</a>
              </div>
              <div>
                <h2 className="eyebrow">Atelier</h2>
                <address>
                  {site.address.street}
                  <br />
                  {site.address.city}, jud. {site.address.county}
                </address>
              </div>
              <div>
                <h2 className="eyebrow">Program</h2>
                {site.hours.map((h) => (
                  <p key={h.days}>
                    {h.days}: {h.time}
                  </p>
                ))}
                <p className={s.small}>Comenzi telefonice oricând: tablete 24–48 h, cutii minimum 48 h, restul 48–72 h.</p>
              </div>
              <div>
                <h2 className="eyebrow">Social</h2>
                <p>
                  <a href={site.social.instagram} target="_blank" rel="noopener">
                    Instagram
                  </a>{" "}
                  ·{" "}
                  <a href={site.social.tiktok} target="_blank" rel="noopener">
                    TikTok
                  </a>
                </p>
              </div>
              <ul className={s.pRules}>
                {orderRules.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </div>
            <MapEmbed />
          </div>

          <div className={s.faqBlock}>
            <h2>Întrebări frecvente</h2>
            {faq.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
      <JsonLd data={faqSchema(faq)} />
      <JsonLd data={breadcrumbs([{ name: "Acasă", path: "/" }, { name: "Contact", path: "/contact" }])} />
    </>
  );
}
