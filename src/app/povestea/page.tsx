import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import s from "../inner.module.css";

export const metadata: Metadata = {
  title: "Povestea Meredith — ciocolată făcută cu mâna, în Caransebeș",
  description: "Cum a început Meredith Choco House: o bunică, un dulap cu surprize și dragostea pentru ciocolata belgiană Callebaut. Singura ciocolaterie artizanală din județul Caraș-Severin.",
  alternates: { canonical: "/povestea" },
};

export default function StoryPage() {
  return (
    <>
      <header className="page-hero">
        <p className="eyebrow">Povestea</p>
        <h1>
          Un dulap cu <span className="script gold-text">surprize</span>
        </h1>
      </header>
      <section className={s.prose}>
        <div className={s.proseInner}>
          <p className={s.lede}>
            Dragostea pentru ciocolata de calitate a pornit din copilărie. Bunica mea cumpăra ciocolată și o ascundea, ca de fiecare dată când voiam ceva dulce să îmi ofere bucuria de a descoperi o surpriză în dulapul ei din bucătărie.
          </p>
          <p>
            Așa am descoperit plăcerea de a dărui — și am împletit-o cu dragostea pentru ciocolata belgiană Callebaut, ciocolata italiană Master Martini și ingredientele de calitate.
          </p>
          <figure className={`${s.figure} reveal`}>
            <Image src="/images/photos/atelier-callebaut.jpg" alt="Tablete de ciocolată Meredith și saci de ciocolată Callebaut în atelier" fill sizes="(max-width: 900px) 100vw, 900px" />
          </figure>
          <h2>Totul, de mână</h2>
          <p>
            În ciocolateria noastră întregul proces se face manual, de la colorare până la ambalare, fără nimic automatizat. Capacitatea de producție este limitată, dar fiecare produs se realizează la dorința clientului: tipul de ciocolată, culoarea, umplutura, ingredientele speciale.
          </p>
          <h2>Un concept nou pentru evenimente</h2>
          <p>
            Pentru aniversări, logodne, cununii, gender reveal, nunți și botezuri realizăm machete, fructe trase în ciocolată și praline în culorile și umpluturile temei — plus mărturii de bun venit într-o gamă foarte mare de forme și cutii. Pe lângă ele, cutii cadou cu praline de diverse mărimi și peste 12 tipuri de tablete, inclusiv celebra tabletă Dubai.
          </p>
          <blockquote className={s.pull}>
            <span className="script gold-text">Artizanală, personalizată, exclusivistă.</span>
          </blockquote>
          <p>
            Suntem singura ciocolaterie artizanală din județ, iar asta ne face să punem și mai multă grijă în fiecare bucată.
          </p>
          <p className={s.sign}>
            <span className="script gold-text">Monica Erimescu</span>
            <small>Fondatoare, Meredith Choco House</small>
          </p>
          <div className={s.pCtas}>
            <Link href="/produse" className="btn">
              Descoperă colecțiile
            </Link>
            <Link href="/contact" className="btn btn--ghost">
              Vino în atelier
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
