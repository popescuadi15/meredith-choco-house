"use client";

import { useState } from "react";
import { site } from "@/lib/site";
import s from "./MapEmbed.module.css";

export default function MapEmbed() {
  const [on, setOn] = useState(false);
  const q = encodeURIComponent(site.mapsQuery);
  return (
    <div className={s.map}>
      {on ? (
        <iframe title="Harta atelierului Meredith Choco House" src={`https://www.google.com/maps?q=${q}&output=embed`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
      ) : (
        <div className={s.placeholder}>
          <p className="script gold-text">Caransebeș</p>
          <p>{site.address.street}</p>
          <div className={s.btns}>
            <button className="btn btn--light" onClick={() => setOn(true)}>
              Încarcă harta
            </button>
            <a className="btn btn--light btn--ghost" href={`https://www.google.com/maps/search/?api=1&query=${q}`} target="_blank" rel="noopener">
              Deschide în Google Maps
            </a>
          </div>
          <small>Harta se încarcă de la Google doar dacă apeși butonul.</small>
        </div>
      )}
    </div>
  );
}
