import { site } from "./site";
import { type Product } from "./products";

export const businessId = `${site.url}/#business`;

export const businessSchema = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "FoodEstablishment"],
  "@id": businessId,
  name: site.name,
  legalName: site.legalName,
  description: site.description,
  url: site.url,
  telephone: site.phoneE164,
  email: site.email,
  image: `${site.url}/images/photos/atelier-callebaut.jpg`,
  logo: `${site.url}/images/logo-gold-dark.png`,
  priceRange: "5–200 RON",
  currenciesAccepted: "RON",
  servesCuisine: "Ciocolată artizanală",
  slogan: site.tagline,
  address: {
    "@type": "PostalAddress",
    streetAddress: site.address.street,
    addressLocality: site.address.city,
    addressRegion: site.address.county,
    addressCountry: site.address.country,
  },
  areaServed: ["Caransebeș", "Reșița", "Caraș-Severin", "Timiș"],
  openingHoursSpecification: site.hours.map((h) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: `https://schema.org/${h.schema.day}`,
    opens: h.schema.opens,
    closes: h.schema.closes,
  })),
  sameAs: Object.values(site.social),
};

export function productSchema(p: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.description,
    image: [`${site.url}${p.photo ?? p.cutout ?? "/images/photos/atelier-callebaut.jpg"}`],
    brand: { "@type": "Brand", name: site.name },
    ...(p.weight ? { weight: p.weight } : {}),
    offers: {
      "@type": "Offer",
      priceCurrency: "RON",
      ...(p.price !== null ? { price: p.price } : {}),
      availability: "https://schema.org/PreOrder",
      url: `${site.url}/produse/${p.slug}`,
      seller: { "@id": businessId },
    },
  };
}

export function breadcrumbs(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: `${site.url}${it.path}` })),
  };
}

export function faqSchema(faq: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}
