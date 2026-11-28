import Image from "next/image";
import Link from "next/link";
import { inCategory, formatPrice } from "@/lib/products";
import { site } from "@/lib/site";
import AddButton from "@/components/AddButton";
import Countdown from "./Countdown";
import s from "./ChristmasClassic.module.css";

const trees = [
  { src: "/images/cut/bradut-alb-2.webp", alt: "Brăduț de ciocolată albă pictat manual în culori" },
  { src: "/images/cut/bradut-lapte.webp", alt: "Brăduț de ciocolată cu lapte cu decor auriu" },
  { src: "/images/cut/bradut-verde.webp", alt: "Brăduț de ciocolată verde pictat manual" },
  { src: "/images/cut/bradut-lapte-2.webp", alt: "Brăduț de ciocolată cu lapte pictat cu auriu" },
  { src: "/images/cut/bradut-alb.webp", alt: "Brăduț de ciocolată albă cu stropi colorați" },
];

export default function ChristmasClassic() {
  const items = inCategory("craciun");
  return (
    <section id="craciun" className={s.section} data-header="dark" aria-labelledby="xmas-title">
      <div className={s.snow} aria-hidden="true" />
      <div className="container">
        <div className={s.head}>
          <p className="eyebrow">Ediție de sezon</p>
          <h2 id="xmas-title">
            <span className="script gold-text">Crăciun</span> la Meredith
          </h2>
          <p className={s.lead}>Catalogul nostru se lansează pe 1 decembrie, la ora 19:00. Brăduți și globuri din ciocolată belgiană, decorați manual și umpluți cu cremă.</p>
          <Countdown to={site.launch} />
          <Link href="/produse#craciun" className={`btn btn--light btn--ghost ${s.all}`}>
            Toată colecția de Crăciun
          </Link>
        </div>

        <div className={s.trees}>
          {trees.map((t, i) => (
            <div key={t.src} className={`${s.tree} reveal`} style={{ transitionDelay: `${i * 90}ms` }}>
              <Image src={t.src} alt={t.alt} fill sizes="(max-width: 760px) 40vw, 18vw" />
            </div>
          ))}
        </div>

        <ul className={s.cards}>
          {items.map((p) => (
            <li key={p.slug} className="reveal">
              {/* badge row is always present so titles line up across the cards */}
              <span className={s.badge}>{p.badge ?? "\u00a0"}</span>
              <h3>
                <Link href={`/produse/${p.slug}`}>{p.name}</Link>
              </h3>
              <p>{p.short}</p>
              <div className={s.cardFoot}>
                <span>
                  {formatPrice(p)} <small>· {p.weight}</small>
                </span>
                <AddButton slug={p.slug} label="Adaugă" variant="btn--light btn--ghost" />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
