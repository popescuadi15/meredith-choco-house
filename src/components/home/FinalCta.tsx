import Image from "next/image";
import Link from "next/link";
import s from "./Sections.module.css";

const pieces = [
  { src: "/images/cut/tableta-zmeura.webp", cls: "p1" },
  { src: "/images/cut/batoane-nuci.webp", cls: "p2" },
  { src: "/images/cut/tableta-alba-fistic.webp", cls: "p3" },
  { src: "/images/cut/tableta-arahide.webp", cls: "p4" },
];

export default function FinalCta() {
  return (
    <section className={s.final} data-header="dark" aria-labelledby="final-title">
      {pieces.map((p) => (
        <div key={p.cls} className={`${s.piece} ${s[p.cls]}`} aria-hidden="true">
          <Image src={p.src} alt="" fill sizes="22vw" />
        </div>
      ))}
      <div className={s.finalInner}>
        <p className="eyebrow">Meredith Choco House · Caransebeș</p>
        <h2 id="final-title">
          Fiecare creație <em>are propria poveste.</em>
        </h2>
        <p>Spune-ne pentru cine este, iar noi o pictăm de mână — în culorile și aromele alese de tine.</p>
        <div className={s.ctas}>
          <Link href="/produse" className="btn btn--gold">
            Comandă acum
          </Link>
          <Link href="/contact" className="btn btn--light btn--ghost">
            Contact
          </Link>
        </div>
      </div>
    </section>
  );
}
