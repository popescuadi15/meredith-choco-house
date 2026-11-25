import Link from "next/link";

export default function NotFound() {
  return (
    <section className="page-hero" style={{ minHeight: "80vh" }}>
      <p className="eyebrow">404</p>
      <h1>
        Această pagină <span className="script gold-text">s-a topit</span>
      </h1>
      <p>Poate o găsești printre colecțiile noastre.</p>
      <p style={{ marginTop: "2rem" }}>
        <Link href="/produse" className="btn">
          Vezi colecțiile
        </Link>
      </p>
    </section>
  );
}
