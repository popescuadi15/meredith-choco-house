import type { Metadata } from "next";
import Image from "next/image";
import OfferForm from "@/components/OfferForm";
import JsonLd from "@/components/JsonLd";
import { breadcrumbs } from "@/lib/schema";
import s from "../inner.module.css";

export const metadata: Metadata = {
  title: "Mărturii nuntă & botez și Choco Bar pentru evenimente",
  description: "Mărturii din ciocolată de la 5 lei/buc. și Deluxe Meredith Choco Bar de la 10 lei/persoană pentru nunți, botezuri, logodne, gender reveal și evenimente corporate. Degustare la cerere, Caransebeș.",
  alternates: { canonical: "/evenimente" },
};

export default function EventsPage() {
  return (
    <>
      <header className="page-hero">
        <p className="eyebrow">Evenimente private</p>
        <h1>
          Dulce, <span className="script gold-text">ca ziua voastră</span>
        </h1>
        <p>Aniversare, logodnă, cununie, nuntă, gender reveal, botez sau eveniment corporate — creăm totul după tematica și dorințele voastre.</p>
      </header>

      <section className={s.feature}>
        <div className="container">
          <div className={s.featureRow}>
            <div className={`${s.featureImg} reveal`}>
              <Image src="/images/photos/marturii-mini-tablete.jpg" alt="Mărturii de nuntă — mini tablete de ciocolată în culori pastel" fill sizes="(max-width: 900px) 100vw, 50vw" />
            </div>
            <div className={s.featureText}>
              <p className="eyebrow">01 — Mărturii</p>
              <h2>Mărturii de bun venit</h2>
              <p className={s.big}>de la 5 lei / bucată · 8 g</p>
              <p>
                Într-o gamă foarte mare de forme, culori și umpluturi. Le putem ambala individual sau în cutii de 2, 4, 6, 8 sau 12 bucăți. Stabilim telefonic o ședință de degustare, iar în funcție de dorințe stabilim prețul final.
              </p>
              <p className={s.tag}>−20% la mărturii dacă alegi și Deluxe Meredith Choco Bar</p>
            </div>
          </div>
          <div className={`${s.featureRow} ${s.reverse}`}>
            <div className={`${s.featureImg} reveal`}>
              <Image src="/images/photos/choco-bar-atelier.jpg" alt="Praline colorate pregătite pentru Deluxe Meredith Choco Bar" fill sizes="(max-width: 900px) 100vw, 50vw" />
            </div>
            <div className={s.featureText}>
              <p className="eyebrow">02 — Deluxe Meredith Choco Bar</p>
              <h2>Un bar de ciocolată pentru invitații tăi</h2>
              <p className={s.big}>de la 10 lei / persoană</p>
              <p>
                Machete, fructe trase în ciocolată și praline în culorile și umpluturile alese pentru tema voastră. Facem împreună o degustare de praline și construim meniul — potrivit fiecărui buget.
              </p>
            </div>
          </div>
          <div className={s.notice}>
            <span className="script gold-text">Ne vedem acolo</span>
            <p>
              <strong>23–24 ianuarie 2027</strong> — Târgul de nunți de la Hotel Rogge, Reșița.
            </p>
          </div>
        </div>
      </section>

      <section className={s.formSection} aria-labelledby="oferta-t">
        <div className="container">
          <div className={s.formGrid}>
            <div>
              <p className="eyebrow">Cerere de ofertă</p>
              <h2 id="oferta-t">Spune-ne despre evenimentul tău</h2>
              <p>Completează câteva detalii, iar mesajul se deschide gata scris în WhatsApp. Te sunăm pentru a programa degustarea (cu cel puțin 24 h înainte).</p>
            </div>
            <OfferForm />
          </div>
        </div>
      </section>
      <JsonLd data={breadcrumbs([{ name: "Acasă", path: "/" }, { name: "Evenimente", path: "/evenimente" }])} />
    </>
  );
}
