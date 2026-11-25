import type { Metadata } from "next";
import { site } from "@/lib/site";
import s from "../inner.module.css";

export const metadata: Metadata = { title: "Termeni și condiții", alternates: { canonical: "/termeni" }, robots: { index: false } };

export default function Terms() {
  return (
    <>
      <header className="page-hero">
        <h1>Termeni și condiții</h1>
      </header>
      <section className={s.prose}>
        <div className={s.proseInner}>
          <p>
            Site-ul {site.url.replace("https://", "")} este administrat de {site.legalName}, CUI {site.cui}, cu atelierul în {site.address.street}, {site.address.city}, jud. {site.address.county}.
          </p>
          <h2>Comenzi</h2>
          <p>
            Site-ul prezintă produsele și prețurile noastre. Comenzile se plasează telefonic ({site.phone}) sau prin WhatsApp și devin ferme doar după confirmarea noastră. Toate produsele sunt realizate manual, la comandă, cu 24–48 de ore înainte.
          </p>
          <h2>Prețuri și plată</h2>
          <p>Prețurile sunt exprimate în lei. Pentru evenimente, prețul final se stabilește după degustare, în funcție de cerințe. Plata se face la ridicarea comenzii.</p>
          <h2>Ridicare</h2>
          <p>Momentan nu livrăm prin curier. Comenzile se ridică din atelier, la data stabilită.</p>
          <h2>Alergeni</h2>
          <p>
            Produsele noastre conțin sau pot conține lapte, soia, gluten, fructe cu coajă lemnoasă (fistic, alune, migdale, macadamia) și arahide. Te rugăm să ne anunți orice alergie înainte de comandă.
          </p>
          <h2>Contact</h2>
          <p>
            Pentru orice întrebare: {site.phone} · {site.email}. Pentru reclamații poți contacta și ANPC (anpc.ro).
          </p>
        </div>
      </section>
    </>
  );
}
