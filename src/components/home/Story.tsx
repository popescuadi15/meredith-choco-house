import Image from "next/image";
import Link from "next/link";
import s from "./Sections.module.css";

export default function Story() {
  return (
    <section className={`section ${s.light} ${s.story}`} aria-labelledby="story-title">
      <div className="container">
        <p className="eyebrow" style={{ textAlign: "center" }}>
          Povestea noastră
        </p>
        <h2 id="story-title" className="visually-hidden">
          Povestea Meredith
        </h2>
        <blockquote className={`${s.quote} reveal`}>
          <p>
            Bunica mea, Edith, cumpăra ciocolată și o ascundea în dulapul din bucătărie, ca de fiecare dată când voiam ceva dulce să am <em>bucuria de a descoperi o surpriză.</em>
          </p>
          <footer>
            <span className="script gold-text">Monica</span>
            <span>Fondatoare, Meredith Choco House</span>
          </footer>
        </blockquote>
        <div className={s.storyRow}>
          <div className={`${s.storyImg} reveal`}>
            <Image src="/images/photos/atelier-callebaut.jpg" alt="Tablete Meredith lângă sacii de ciocolată belgiană Callebaut" fill sizes="(max-width: 900px) 100vw, 40vw" />
          </div>
          <div className={`${s.storyText} reveal`}>
            <p>
              Așa am descoperit plăcerea de a dărui — și am împletit-o cu dragostea pentru ciocolata belgiană Callebaut și pentru ingredientele de calitate.
            </p>
            <p>
              În atelierul nostru totul se face manual, de la colorare până la ambalare. Capacitatea e limitată, dar fiecare produs se realizează la dorința ta: tipul de ciocolată, culoarea, umplutura, ingredientele speciale.
            </p>
            <ul className={s.pillars}>
              <li>
                <strong>Artizanală</strong>
                <span>Nimic automatizat</span>
              </li>
              <li>
                <strong>Personalizată</strong>
                <span>Exact cum ți-o dorești</span>
              </li>
              <li>
                <strong>Exclusivistă</strong>
                <span>Singura ciocolaterie artizanală din județ</span>
              </li>
            </ul>
            <Link href="/povestea" className="btn btn--ghost">
              Citește povestea
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
