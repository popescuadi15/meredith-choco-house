import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { site, waLink } from "@/lib/site";
import s from "../inner.module.css";

export const metadata: Metadata = {
  title: "Degustări de praline pentru evenimente",
  description: "Programează o degustare privată de praline Meredith pentru nunta, botezul sau evenimentul tău. Programare telefonică cu 24 h înainte, în atelierul din Caransebeș.",
  alternates: { canonical: "/degustari" },
};

export default function TastingPage() {
  return (
    <>
      <header className="page-hero">
        <p className="eyebrow">Degustări</p>
        <h1>
          Gustă, <span className="script gold-text">apoi alege</span>
        </h1>
        <p>Înainte de fiecare eveniment ne așezăm la masă împreună: guști pralinele, alegi ciocolata, umpluturile și culorile, iar noi construim oferta potrivită bugetului tău.</p>
      </header>
      <section className={s.feature}>
        <div className="container">
          <div className={s.featureRow}>
            <div className={`${s.featureImg} reveal`}>
              <Image src="/images/photos/cutie-praline-eveniment.jpg" alt="Cutie cu praline asortate, curmale în ciocolată și mini tablete" fill sizes="(max-width: 900px) 100vw, 50vw" />
            </div>
            <div className={s.featureText}>
              <ol className={s.steps}>
                <li>
                  <strong>Ne suni</strong>
                  <span>Programăm degustarea cu cel puțin 24 de ore înainte.</span>
                </li>
                <li>
                  <strong>Guști</strong>
                  <span>Praline cu fistic, caramel, nocciola, cocos, Biscoff, zmeură și altele — pe ciocolată albă, cu lapte sau neagră.</span>
                </li>
                <li>
                  <strong>Alegi</strong>
                  <span>Formele, culorile și ambalajele mărturiilor și ale Choco Bar-ului.</span>
                </li>
                <li>
                  <strong>Primești oferta</strong>
                  <span>Prețul final, adaptat dorințelor și bugetului tău.</span>
                </li>
              </ol>
              <div className={s.pCtas}>
                <a className="btn" href={`tel:${site.phoneE164}`}>
                  Sună: {site.phone}
                </a>
                <a className="btn btn--ghost" href={waLink("Bună ziua! Aș dori să programez o degustare pentru un eveniment.")} target="_blank" rel="noopener">
                  Programează pe WhatsApp
                </a>
              </div>
              <p className={s.small}>
                Vezi și <Link href="/evenimente">mărturiile și Deluxe Meredith Choco Bar</Link>.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
