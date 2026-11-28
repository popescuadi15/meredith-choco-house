import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import AddButton from "@/components/AddButton";
import ProductCard from "@/components/ProductCard";
import JsonLd from "@/components/JsonLd";
import { bySlug, categories, chocolates, formatPrice, inCategory, prepTime, products, traces } from "@/lib/products";
import { orderRules, site, waLink } from "@/lib/site";
import { breadcrumbs, productSchema } from "@/lib/schema";
import s from "../../inner.module.css";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/produse/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = bySlug(slug);
  if (!p) return {};
  const img = p.photo ?? p.cutout;
  return {
    title: `${p.name} — ${formatPrice(p)}`,
    description: `${p.short} ${p.description}`.slice(0, 158),
    alternates: { canonical: `/produse/${p.slug}` },
    openGraph: { title: `${p.name} · ${site.name}`, description: p.short, images: img ? [{ url: img, alt: p.alt }] : undefined },
  };
}

export default function ProductPage({ params }: PageProps<"/produse/[slug]">) {
  return (
    <Suspense fallback={<div className={s.product} aria-busy="true" />}>
      <Product params={params} />
    </Suspense>
  );
}

async function Product({ params }: { params: PageProps<"/produse/[slug]">["params"] }) {
  const { slug } = await params;
  const p = bySlug(slug);
  if (!p) notFound();
  const related = inCategory(p.category).filter((x) => x.slug !== p.slug).slice(0, 3);
  const cat = categories[p.category];

  return (
    <>
      <article className={s.product}>
        <div className={s.pMedia}>
          {p.cutout ? (
            <div className={s.pCut}>
              <div className={s.fillBox}>
                <Image src={p.cutout} alt={p.alt} fill priority sizes="(max-width: 900px) 90vw, 50vw" />
              </div>
            </div>
          ) : p.photo ? (
            <div className={s.pPhoto}>
              <div className={s.fillBox}>
                <Image src={p.photo} alt={p.alt} fill priority sizes="(max-width: 900px) 100vw, 50vw" />
              </div>
            </div>
          ) : (
            <div className={s.pMono}>
              <span className="script">Meredith</span>
            </div>
          )}
          {p.cutout && p.photo && (
            <div className={s.pThumb}>
              <Image src={p.photo} alt={`${p.name} — fotografie`} fill sizes="200px" />
            </div>
          )}
        </div>
        <div className={s.pInfo}>
          <nav className={s.crumbs} aria-label="Breadcrumb">
            <Link href="/">Acasă</Link> / <Link href={`/produse#${p.category}`}>{cat.title}</Link>
          </nav>
          {p.badge && <p className="eyebrow">{p.badge}</p>}
          <h1>{p.name}</h1>
          <p className={s.pPrice}>
            {formatPrice(p)}
            {p.weight && !p.variants && <small> · {p.weight}</small>}
          </p>
          <p className={s.pPrep}>Timp de pregătire: {prepTime[p.category]}</p>
          <p className={s.pDesc}>{p.description}</p>
          {p.contents && (
            <>
              <h2 className={s.pSub}>{p.category === "craciun" && p.slug === "bradut-de-ciocolata" ? "Variante" : "Conține"}</h2>
              <ul className={s.pList}>
                {p.contents.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </>
          )}
          <div className={s.pCtas}>
            {p.category === "evenimente" ? (
              <Link href="/evenimente#oferta" className="btn">
                Cere o ofertă
              </Link>
            ) : (
              <AddButton slug={p.slug} picker />
            )}
            <a className="btn btn--ghost" href={waLink(`Bună ziua! Sunt interesat(ă) de: ${p.name}.`)} target="_blank" rel="noopener">
              Întreabă pe WhatsApp
            </a>
          </div>
          <details className={s.allergens}>
            <summary>Ingrediente & alergeni</summary>
            <p>
              <strong>Alergeni specifici acestui produs:</strong> {p.allergens === "—" ? "doar cei din ciocolata aleasă (mai jos)." : p.allergens}
            </p>
            {p.category !== "evenimente" && (
              <ul>
                {chocolates.map((c) => (
                  <li key={c.name}>
                    <strong>{c.name}</strong> — Ingrediente: {c.ingredients} Alergeni: {c.allergens}
                  </li>
                ))}
              </ul>
            )}
            <p className={s.traces}>{traces}</p>
          </details>
          <ul className={s.pRules}>
            {orderRules.slice(0, 3).map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
          {p.more && (
            <div className={s.pMore}>
              {p.more.map((m) => (
                <div key={m.src} className={`${s.pMoreItem} ${m.src.includes("/cut/") ? s.pMoreCut : ""}`}>
                  <Image src={m.src} alt={m.alt} fill sizes="200px" />
                </div>
              ))}
            </div>
          )}
        </div>
      </article>

      {related.length > 0 && (
        <section className={s.related} aria-labelledby="rel-t">
          <div className="container">
            <h2 id="rel-t">Din aceeași colecție</h2>
            <div className={s.grid}>
              {related.map((r) => (
                <ProductCard key={r.slug} p={r} />
              ))}
            </div>
          </div>
        </section>
      )}
      <JsonLd data={productSchema(p)} />
      <JsonLd
        data={breadcrumbs([
          { name: "Acasă", path: "/" },
          { name: cat.title, path: `/produse#${p.category}` },
          { name: p.name, path: `/produse/${p.slug}` },
        ])}
      />
    </>
  );
}
