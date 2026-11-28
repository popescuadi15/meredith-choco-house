import { faq } from "@/lib/faq";
import { site, waLink } from "@/lib/site";
import s from "./Sections.module.css";

const steps = [
  { n: "01", t: "Alegi", d: "Adaugă tabletele, cutiile sau brăduții preferați în „Comanda ta”." },
  { n: "02", t: "Ne scrii", d: "Trimite lista pe WhatsApp sau sună-ne — tablete cu 24–48 h înainte, cutii cu minimum 48 h, restul cu 48–72 h. Stabilim ciocolata, crema și culorile." },
  { n: "03", t: "Ridici", d: `Te așteptăm în laborator, ${site.address.street}, ${site.address.city}. Plata se face la ridicare.` },
];

export default function HowToOrder() {
  return (
    <section className={`section ${s.light}`} aria-labelledby="how-title">
      <div className="container">
        <div className={s.split}>
          <div>
            <p className="eyebrow">08 — Cum comanzi</p>
            <h2 id="how-title" className={s.h2}>
              Simplu, <em>ca un dar.</em>
            </h2>
          </div>
          <div className={s.ctas}>
            <a href={waLink("Bună ziua! Aș dori să plasez o comandă.")} className="btn" target="_blank" rel="noopener">
              Scrie-ne pe WhatsApp
            </a>
            <a href={`tel:${site.phoneE164}`} className="btn btn--ghost">
              {site.phone}
            </a>
          </div>
        </div>
        <ol className={s.steps}>
          {steps.map((st) => (
            <li key={st.n} className="reveal">
              <span>{st.n}</span>
              <h3>{st.t}</h3>
              <p>{st.d}</p>
            </li>
          ))}
        </ol>

        <div className={s.faq} id="intrebari">
          <h2 className={s.h3}>Întrebări frecvente</h2>
          <div>
            {faq.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
