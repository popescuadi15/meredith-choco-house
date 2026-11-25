import type { Metadata } from "next";
import { site } from "@/lib/site";
import s from "../inner.module.css";

export const metadata: Metadata = { title: "Politica de confidențialitate", alternates: { canonical: "/politica-de-confidentialitate" }, robots: { index: false } };

export default function Privacy() {
  return (
    <>
      <header className="page-hero">
        <h1>Politica de confidențialitate</h1>
      </header>
      <section className={s.prose}>
        <div className={s.proseInner}>
          <p>
            {site.legalName} (CUI {site.cui}) respectă confidențialitatea datelor tale, conform Regulamentului (UE) 2016/679 (GDPR).
          </p>
          <h2>Ce date colectăm</h2>
          <p>
            Site-ul nu folosește cookie-uri de urmărire și nu stochează date pe servere. Lista „Comanda ta” este păstrată doar în browserul tău (localStorage). Când trimiți o comandă sau o cerere de ofertă, mesajul se deschide în WhatsApp sau în aplicația ta de e-mail, iar noi primim doar datele pe care alegi să ni le trimiți (nume, telefon, detalii comandă).
          </p>
          <h2>De ce le folosim</h2>
          <p>Exclusiv pentru a-ți confirma și pregăti comanda sau oferta. Nu le vindem și nu le transmitem terților.</p>
          <h2>Harta</h2>
          <p>Harta Google se încarcă numai dacă apeși „Încarcă harta”; în acel moment se aplică politica de confidențialitate Google.</p>
          <h2>Drepturile tale</h2>
          <p>
            Poți cere oricând accesul, rectificarea sau ștergerea datelor scriindu-ne la {site.email}. Ai dreptul să depui o plângere la ANSPDCP (dataprotection.ro).
          </p>
        </div>
      </section>
    </>
  );
}
