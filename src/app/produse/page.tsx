import type { Metadata } from "next";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import JsonLd from "@/components/JsonLd";
import { categories, fillings, inCategory, type Category } from "@/lib/products";
import { orderRules } from "@/lib/site";
import { breadcrumbs } from "@/lib/schema";
import s from "../inner.module.css";

export const metadata: Metadata = {
  title: "Colecții — tablete, cutii cadou, Crăciun",
  description: "Catalogul Meredith Choco House: tablete de ciocolată Callebaut (25 lei), tableta Dubai pictată manual, cutii cadou cu praline (50–200 lei), brăduți și cadouri de Crăciun. Comenzi în Caransebeș, ridicare din atelier.",
  alternates: { canonical: "/produse" },
};

const order: Category[] = ["tablete", "cutii-cadou", "craciun", "evenimente"];

export default function ProductsPage() {
  return (
    <>
      <header className="page-hero">
        <p className="eyebrow">Catalog 2026</p>
        <h1>
          Colecțiile <span className="script gold-text">Meredith</span>
        </h1>
        <p>Totul se face manual, la comandă, din ciocolată belgiană Callebaut. Alege, adaugă în comandă și ne trimiți lista pe WhatsApp.</p>
        <nav className={s.chips} aria-label="Categorii">
          {order.map((c) => (
            <a key={c} href={`#${c}`}>
              {categories[c].title}
            </a>
          ))}
        </nav>
      </header>

      {order.map((c) => (
        <section key={c} id={c} className={s.cat} aria-labelledby={`${c}-t`}>
          <div className="container">
            <div className={s.catHead}>
              <h2 id={`${c}-t`}>{categories[c].title}</h2>
              <p>{categories[c].lead}</p>
            </div>
            <div className={s.grid}>
              {inCategory(c).map((p, i) => (
                <ProductCard key={p.slug} p={p} priority={c === "tablete" && i < 3} />
              ))}
            </div>
            {c === "evenimente" && (
              <p className={s.more}>
                <Link href="/evenimente">Detalii despre mărturii și Choco Bar →</Link>
              </p>
            )}
          </div>
        </section>
      ))}

      <section className={s.rules}>
        <div className="container">
          <h2>Cele 10 umpluturi</h2>
          <p className={s.fillings}>{fillings.join(" · ")}</p>
          <h2 style={{ marginTop: "3rem" }}>Bine de știut</h2>
          <ul>
            {orderRules.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </div>
      </section>
      <JsonLd data={breadcrumbs([{ name: "Acasă", path: "/" }, { name: "Colecții", path: "/produse" }])} />
    </>
  );
}
