"use client";

import { useState } from "react";
import { site, waLink } from "@/lib/site";
import s from "./OfferForm.module.css";

const types = ["Nuntă", "Cununie", "Logodnă", "Botez", "Gender reveal", "Aniversare", "Eveniment corporate", "Altul"];
const wants = ["Mărturii", "Deluxe Meredith Choco Bar", "Degustare", "Cutii cadou"];

export default function OfferForm() {
  const [f, setF] = useState({ name: "", phone: "", type: "Nuntă", date: "", guests: "", theme: "", want: ["Mărturii"] as string[] });
  const set = (k: keyof typeof f, v: string) => setF((x) => ({ ...x, [k]: v }));
  const toggle = (w: string) => setF((x) => ({ ...x, want: x.want.includes(w) ? x.want.filter((y) => y !== w) : [...x.want, w] }));

  const msg = () =>
    [
      `Bună ziua! Aș dori o ofertă pentru un eveniment.`,
      `Tip eveniment: ${f.type}`,
      f.date && `Data: ${f.date}`,
      f.guests && `Număr invitați: ${f.guests}`,
      f.want.length && `Interesat(ă) de: ${f.want.join(", ")}`,
      f.theme && `Tematică / culori: ${f.theme}`,
      f.name && `Nume: ${f.name}`,
      f.phone && `Telefon: ${f.phone}`,
    ]
      .filter(Boolean)
      .join("\n");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    window.open(waLink(msg()), "_blank", "noopener");
  };

  return (
    <form className={s.form} onSubmit={submit} id="oferta">
      <div className={s.row}>
        <label>
          <span>Nume</span>
          <input required value={f.name} onChange={(e) => set("name", e.target.value)} autoComplete="name" />
        </label>
        <label>
          <span>Telefon</span>
          <input type="tel" value={f.phone} onChange={(e) => set("phone", e.target.value)} autoComplete="tel" />
        </label>
      </div>
      <div className={s.row}>
        <label>
          <span>Tipul evenimentului</span>
          <select value={f.type} onChange={(e) => set("type", e.target.value)}>
            {types.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
        <label>
          <span>Data evenimentului</span>
          <input type="date" value={f.date} onChange={(e) => set("date", e.target.value)} />
        </label>
        <label>
          <span>Invitați (aprox.)</span>
          <input inputMode="numeric" value={f.guests} onChange={(e) => set("guests", e.target.value)} />
        </label>
      </div>
      <fieldset className={s.want}>
        <legend>Ce te interesează?</legend>
        {wants.map((w) => (
          <label key={w} className={f.want.includes(w) ? s.on : undefined}>
            <input type="checkbox" checked={f.want.includes(w)} onChange={() => toggle(w)} />
            {w}
          </label>
        ))}
      </fieldset>
      <label>
        <span>Tematică, culori, idei</span>
        <textarea rows={4} value={f.theme} onChange={(e) => set("theme", e.target.value)} placeholder="Ex: nuntă în nuanțe de alb și auriu, 120 de mărturii în cutii de câte 2…" />
      </label>
      <div className={s.actions}>
        <button className="btn btn--gold" type="submit">
          Trimite cererea pe WhatsApp
        </button>
        <a className="btn btn--ghost" href={`mailto:${site.email}?subject=${encodeURIComponent("Cerere ofertă eveniment")}&body=${encodeURIComponent(msg())}`}>
          Sau pe e-mail
        </a>
      </div>
      <p className={s.note}>Îți răspundem în aceeași zi. Stabilim telefonic o degustare, iar prețul final se stabilește în funcție de dorințe.</p>
    </form>
  );
}
