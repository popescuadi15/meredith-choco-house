import { inCategory } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import s from "./Sections.module.css";

export default function GiftBoxes() {
  const boxes = inCategory("cutii-cadou");
  return (
    <section className={`section ${s.light}`} aria-labelledby="boxes-title">
      <div className="container">
        <div className={s.split}>
          <div>
            <p className="eyebrow">Cutii cadou</p>
            <h2 id="boxes-title" className={s.h2}>
              Un dar care <em>se deschide încet.</em>
            </h2>
          </div>
          <p className={s.intro}>De la cele 12 praline ale cutiei Selection până la Family Moments — fiecare cutie e pictată manual și se pregătește la comandă, în 24–48 de ore.</p>
        </div>
        <div className={s.grid4}>
          {boxes.map((p) => (
            <ProductCard key={p.slug} p={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
