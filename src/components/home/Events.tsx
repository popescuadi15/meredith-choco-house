import Image from "next/image";
import Link from "next/link";
import s from "./Sections.module.css";

export default function Events() {
  return (
    <section className={`section ${s.paper}`} aria-labelledby="events-title">
      <div className="container">
        <div className={s.events}>
          <div className={`${s.eventsImg} reveal`}>
            <Image src="/images/photos/candybar-vertical.jpg" alt="Deluxe Meredith Choco Bar la un eveniment: trepte aurii cu praline și batoane de ciocolată" fill sizes="(max-width: 900px) 100vw, 50vw" />
          </div>
          <div className={s.eventsCopy}>
            <p className="eyebrow">06 — Evenimente private</p>
            <h2 id="events-title" className={s.h2}>
              Logodnă, nuntă, <em>botez.</em>
            </h2>
            <p>
              Am adus un concept nou pentru evenimentele tale: machete, fructe trase în ciocolată și praline în culorile și umpluturile temei voastre — plus mărturii de bun venit într-o gamă foarte mare de forme și cutii la alegere.
            </p>
            <dl className={s.facts}>
              <div>
                <dt>Mărturii</dt>
                <dd>de la 5 lei / bucată</dd>
              </div>
              <div>
                <dt>Deluxe Choco Bar</dt>
                <dd>de la 10 lei / persoană</dd>
              </div>
              <div>
                <dt>Împreună</dt>
                <dd>20% reducere la mărturii</dd>
              </div>
            </dl>
            <p className={s.note}>
              Ne găsiți pe <strong>23–24 ianuarie 2027</strong> la Târgul de nunți de la Hotel Rogge, Reșița.
            </p>
            <div className={s.ctas}>
              <Link href="/evenimente" className="btn">
                Cere o ofertă
              </Link>
              <Link href="/degustari" className="btn btn--ghost">
                Programează o degustare
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
