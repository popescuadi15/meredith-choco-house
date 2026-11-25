import Image from "next/image";
import Link from "next/link";
import { type Product, formatPrice } from "@/lib/products";
import AddButton from "./AddButton";
import s from "./ProductCard.module.css";

export default function ProductCard({ p, priority = false }: { p: Product; priority?: boolean }) {
  const img = p.cutout ?? p.photo;
  return (
    <article className={`${s.card} reveal`}>
      <Link href={`/produse/${p.slug}`} className={s.media} aria-label={p.name}>
        {img ? (
          <Image src={img} alt={p.alt} fill sizes="(max-width: 700px) 90vw, (max-width: 1100px) 45vw, 30vw" className={p.cutout ? s.cut : s.photo} priority={priority} />
        ) : (
          <span className={s.mono} aria-hidden="true">
            <span className="script">Meredith</span>
            <small>{p.name.replace("Ciocolată cu ", "")}</small>
          </span>
        )}
        {p.badge && <span className={s.badge}>{p.badge}</span>}
      </Link>
      <div className={s.body}>
        <h3>
          <Link href={`/produse/${p.slug}`}>{p.name}</Link>
        </h3>
        <p>{p.short}</p>
        <div className={s.foot}>
          <span className={s.price}>
            {formatPrice(p)}
            {p.weight && <small> · {p.weight}</small>}
          </span>
          <AddButton slug={p.slug} label="Adaugă" variant="btn--ghost" className={s.add} />
        </div>
      </div>
    </article>
  );
}
