export type Category = "tablete" | "cutii-cadou" | "craciun" | "evenimente";

export type Variant = { id: string; label: string; price: number };

export type Product = {
  slug: string;
  name: string;
  category: Category;
  /** Price in RON. `null` = la cerere. With variants: the lowest variant price. */
  price: number | null;
  priceFrom?: boolean;
  priceUnit?: string;
  weight?: string;
  /** Weight/price options; the customer picks one before adding to the order. */
  variants?: Variant[];
  short: string;
  description: string;
  contents?: string[];
  /** Product-specific allergens, upper case as on the label (chocolate base is added on the product page). */
  allergens: string;
  /** Transparent cut-out (used on coloured backgrounds). */
  cutout?: string;
  /** Regular photograph. */
  photo?: string;
  /** Extra photographs shown on the product page. */
  more?: { src: string; alt: string }[];
  alt: string;
  featured?: boolean;
  badge?: string;
  /** Slider styling (collection section). */
  tone?: { bg: string; word: string; ink: string };
  word?: string;
};

/** Preparation time per category (client, Nov 2026). */
export const prepTime: Record<Category, string> = {
  tablete: "24–48 h",
  "cutii-cadou": "minimum 48 h",
  craciun: "48–72 h",
  evenimente: "48–72 h",
};

/** The 10 creams used for tablets and pralines. */
export const fillings = ["fistic", "caramel", "crunchy cocos", "nocciola", "Biscoff", "migdale", "ciocolată neagră", "căpșună", "zmeură", "portocală"];

/** Callebaut chocolates used in the atelier — ingredients & allergens as supplied by the client. */
export const chocolates = [
  {
    name: "Ciocolată neagră Callebaut (54,5% cacao)",
    ingredients: "masă de cacao, zahăr, unt de cacao, emulsifiant: lecitină din SOIA, aromă naturală de vanilie.",
    allergens: "SOIA.",
  },
  {
    name: "Ciocolată cu lapte Callebaut",
    ingredients: "zahăr, unt de cacao, LAPTE praf integral, masă de cacao, emulsifiant: lecitină din SOIA, aromă naturală de vanilie.",
    allergens: "LAPTE, SOIA.",
  },
  {
    name: "Ciocolată albă Callebaut",
    ingredients: "zahăr, unt de cacao, LAPTE praf integral, emulsifiant: lecitină din SOIA, aromă naturală de vanilie.",
    allergens: "LAPTE, SOIA.",
  },
  {
    name: "Callebaut MALCHOC-D — ciocolată neagră cu maltitol (fără zahăr)",
    ingredients: "masă de cacao (43,5%), maltitol (43,5%), unt de cacao (12%), emulsifiant: lecitină din SOIA, aromă naturală de vanilie.",
    allergens: "SOIA. Poate conține urme de LAPTE. Consumul excesiv poate avea efect laxativ.",
  },
];

/** General traces notice (client's wording). */
export const traces =
  "În funcție de sortiment, produsele noastre pot conține: LAPTE, SOIA, ALUNE DE PĂDURE, FISTIC, MIGDALE, NUCI MACADAMIA, CAJU, MERIȘOARE și alte FRUCTE CU COAJĂ LEMNOASĂ. Pentru informații exacte despre un anumit produs, te rugăm să ne contactezi înainte de comandă.";

export const categories: Record<Category, { title: string; lead: string; seo: string }> = {
  tablete: {
    title: "Tablete de ciocolată",
    lead: "Tablete de 100 g și tablete umplute de 80 g, din ciocolată belgiană Callebaut: albă 28%, cu lapte 33,6%, neagră 54,5% sau fără zahăr (maltitol). Plus celebra tabletă Dubai, pictată manual.",
    seo: "Tablete de ciocolată belgiană Callebaut și tableta Dubai pictată manual — Caransebeș.",
  },
  "cutii-cadou": {
    title: "Cutii cadou",
    lead: "Praline pictate manual, umplute cu creme fine, așezate în cutii premium pentru oamenii la care ții.",
    seo: "Cutii cadou cu praline pictate manual — Meredith Selection, Signature, Gold și Family Moments.",
  },
  craciun: {
    title: "Colecția de Crăciun",
    lead: "Brăduți și globuri din ciocolată, decorați manual și umpluți cu cremă. Ediție de sezon.",
    seo: "Brăduți de ciocolată pictați manual și cadouri de Crăciun din ciocolată belgiană.",
  },
  evenimente: {
    title: "Evenimente private",
    lead: "Mărturii și Deluxe Meredith Choco Bar pentru logodne, cununii, nunți, botezuri și gender reveal.",
    seo: "Mărturii de nuntă și botez din ciocolată și candy bar cu praline pentru evenimente.",
  },
};

const CHOCO = "albă 28%, cu lapte 33,6%, neagră 54,5% sau fără zahăr (maltitol)";

/** 100 g tablet (6 × 4 squares mould). */
const tablet100 = (p: Omit<Product, "category" | "price" | "weight" | "description"> & { extra?: string }): Product => ({
  category: "tablete",
  price: 25,
  weight: "100 g",
  description: `${p.extra ? p.extra + " " : ""}Tabletă de 100 g din ciocolată belgiană Callebaut — ${CHOCO}. O poți comanda simplă sau cu ingredientele dorite.`,
  ...p,
});

/** 80 g filled tablet ("I Love You" mould). */
const tablet80 = (cream: string, p: Omit<Product, "category" | "price" | "weight" | "description" | "name" | "alt" | "photo" | "cutout">): Product => ({
  category: "tablete",
  price: 25,
  weight: "80 g",
  name: `Tabletă „I Love You” cu cremă ${cream}`,
  description: `Tabletă de 80 g în forma „I Love You”, umplută cu cremă ${cream}. Din ciocolată belgiană Callebaut albă sau cu lapte.`,
  photo: "/images/photos/tableta-alba.jpg",
  cutout: "/images/cut/tableta-alba.webp",
  alt: `Tabletă de ciocolată „I Love You” umplută cu cremă ${cream}`,
  ...p,
});

export const products: Product[] = [
  // ——— Tablete ———
  {
    slug: "tableta-dubai",
    name: "Tableta Dubai",
    category: "tablete",
    price: 15,
    priceFrom: true,
    weight: "50 g · 100 g · 200 g",
    variants: [
      { id: "50g", label: "50 g", price: 15 },
      { id: "100g", label: "100 g", price: 30 },
      { id: "200g", label: "200 g", price: 55 },
    ],
    short: "Celebra tabletă Dubai, cu kataif și tahini — singura tabletă pictată manual.",
    description:
      "Cea mai cerută tabletă din atelier: ciocolată belgiană Callebaut umplută cu kataif și tahini, pictată manual, individual. O găsești în trei gramaje — 50 g, 100 g și 200 g.",
    allergens: "LAPTE, SOIA, GLUTEN (kataif), SUSAN (tahini)",
    alt: "Tabletă de ciocolată Dubai Meredith, pictată manual",
    badge: "Cea mai iubită",
    featured: true,
  },
  tablet100({
    slug: "tableta-biscoff",
    name: "Ciocolată cu biscuiți Biscoff",
    word: "BISCOFF",
    short: "Biscuiți Biscoff caramelizați, în ciocolată belgiană.",
    allergens: "GLUTEN (biscuiți), SOIA",
    cutout: "/images/cut/tableta-biscoff.webp",
    photo: "/images/photos/tableta-biscoff.jpg",
    alt: "Tabletă de ciocolată cu lapte și biscuiți Biscoff",
    featured: true,
    tone: { bg: "#c9a47e", word: "#f6ead9", ink: "#2b1a10" },
  }),
  tablet100({
    slug: "tableta-arahide-caramelizate",
    name: "Ciocolată cu arahide caramelizate",
    word: "ARAHIDE",
    short: "Arahide caramelizate, pe ciocolată cu lapte.",
    allergens: "ARAHIDE",
    cutout: "/images/cut/tableta-arahide.webp",
    photo: "/images/photos/tableta-arahide.jpg",
    alt: "Tabletă de ciocolată cu lapte cu arahide caramelizate",
    featured: true,
    tone: { bg: "#8c6a52", word: "#e9d6c0", ink: "#fbf3e8" },
  }),
  tablet100({
    slug: "tableta-oreo",
    name: "Ciocolată cu biscuiți Oreo",
    short: "Biscuiți Oreo, în ciocolată belgiană.",
    allergens: "GLUTEN (biscuiți), SOIA",
    alt: "Tabletă de ciocolată cu biscuiți Oreo",
  }),
  tablet100({
    slug: "tableta-zmeura-liofilizata",
    name: "Ciocolată cu zmeură liofilizată",
    short: "Zmeură liofilizată, acidulată, pe ciocolată cu lapte.",
    allergens: "—",
    alt: "Tabletă de ciocolată cu zmeură liofilizată",
    badge: "Preferata clienților",
  }),
  tablet100({
    slug: "tableta-fistic-macadamia-merisoare",
    name: "Ciocolată cu fistic, nuci macadamia și merișoare",
    short: "Fistic, macadamia și merișoare — crocant și fructat.",
    allergens: "FISTIC, NUCI MACADAMIA",
    alt: "Tabletă de ciocolată cu fistic, nuci macadamia și merișoare",
  }),
  tablet80("crunchy cocos", {
    slug: "tableta-crema-crunchy-cocos",
    word: "COCOS",
    short: "Tabletă umplută cu cremă crunchy de cocos.",
    allergens: "—",
    featured: true,
    tone: { bg: "#b39770", word: "#f4e8d2", ink: "#20160b" },
  }),
  tablet80("nocciola", {
    slug: "tableta-crema-nocciola",
    short: "Tabletă umplută cu cremă de alune de pădure.",
    allergens: "ALUNE DE PĂDURE",
  }),
  tablet80("caramel", {
    slug: "tableta-crema-caramel",
    short: "Tabletă umplută cu cremă fină de caramel.",
    allergens: "—",
  }),
  tablet80("de fistic", {
    slug: "tableta-crema-fistic",
    short: "Tabletă umplută cu cremă de fistic.",
    allergens: "FISTIC",
  }),

  // ——— Cutii cadou ———
  {
    slug: "cutie-meredith-selection",
    name: "Meredith Selection",
    category: "cutii-cadou",
    price: 50,
    weight: "145 g",
    short: "12 praline pictate manual — cu una sau două creme, la alegere.",
    description:
      "Douăsprezece praline pictate manual, individual. Alegi una sau două dintre cele patru creme — fistic, caramel, nocciola sau cocos. Le putem face și în alte culori și din orice tip de ciocolată; în acest caz prețul poate varia ușor.",
    contents: ["Pralină cu cremă de fistic", "Pralină cu cremă caramel", "Pralină cu cremă nocciola", "Pralină cu cremă de cocos"],
    allergens: "FISTIC, ALUNE DE PĂDURE (în funcție de cremele alese)",
    cutout: "/images/cut/cutii-praline.webp",
    photo: "/images/photos/cutii-praline.jpg",
    alt: "Cutii albe Meredith Selection cu câte 12 praline pictate manual",
    featured: true,
  },
  {
    slug: "cutie-meredith-signature",
    name: "Meredith Signature",
    category: "cutii-cadou",
    price: 100,
    weight: "375 g",
    short: "Praline, batoane cu nuci și mini tablete cu zmeură.",
    description: "Cutia semnătură a atelierului: praline umplute, batoane cu mix de nuci și mini tablete de 10 g cu zmeură liofilizată și fistic.",
    contents: [
      "Praline umplute cu fistic",
      "Praline umplute cu caramel",
      "Praline umplute cu nocciola",
      "Batoane cu mix de nuci",
      "Mini tabletă cu zmeură liofilizată și fistic",
      "Mini tabletă albă cu zmeură liofilizată",
    ],
    allergens: "FISTIC, ALUNE DE PĂDURE, NUCI și alte FRUCTE CU COAJĂ LEMNOASĂ",
    photo: "/images/photos/batoane-nuci.jpg",
    cutout: "/images/cut/batoane-nuci.webp",
    alt: "Batoane de ciocolată cu mix de nuci din cutia Meredith Signature",
  },
  {
    slug: "cutie-meredith-gold",
    name: "Meredith Gold",
    category: "cutii-cadou",
    price: 150,
    weight: "450 g",
    short: "Patru tipuri de praline, mini tablete și batoane.",
    description:
      "Cutia Gold adună tot ce iubim: patru tipuri de praline, mini tablete de 10 g — cu bucăți de fistic și zmeură liofilizată sau doar cu fistic — și batoane cu nuci și merișoare.",
    contents: [
      "Praline umplute cu fistic",
      "Praline umplute cu caramel",
      "Praline umplute cu nocciola",
      "Praline umplute cu cocos",
      "Mini tabletă cu zmeură liofilizată și fistic",
      "Mini tabletă albă cu zmeură liofilizată",
      "Batoane cu mix de nuci",
      "Batoane cu merișoare",
    ],
    allergens: "FISTIC, ALUNE DE PĂDURE, NUCI și alte FRUCTE CU COAJĂ LEMNOASĂ",
    photo: "/images/photos/marturii-mini-tablete.jpg",
    cutout: "/images/cut/mini-tablete.webp",
    alt: "Mini tablete de ciocolată colorate din cutia Meredith Gold",
    badge: "Cadoul perfect",
  },
  {
    slug: "cutie-meredith-family-moments",
    name: "Meredith Family Moments",
    category: "cutii-cadou",
    price: 200,
    weight: "500 g",
    short: "Cea mai generoasă cutie — de împărțit cu toată familia.",
    description: "Douăsprezece feluri de bucurie într-o singură cutie: praline cu șapte umpluturi, mini tablete, batoane și curmale umplute cu migdale trase în ciocolată.",
    contents: [
      "Praline cu fistic, caramel, nocciola și cocos",
      "Praline cu Biscoff",
      "Praline cu ciocolată și căpșuni",
      "Praline cu ciocolată și zmeură",
      "Mini tabletă dark 54,5% cu zmeură liofilizată",
      "Batoane cu mix de nuci și cu merișoare",
      "Mini tabletă cu zmeură liofilizată și fistic",
      "Curmale umplute cu migdale, trase în ciocolată",
    ],
    allergens: "FISTIC, ALUNE DE PĂDURE, MIGDALE, NUCI și alte FRUCTE CU COAJĂ LEMNOASĂ, GLUTEN (Biscoff)",
    photo: "/images/photos/cutie-praline-eveniment.jpg",
    alt: "Cutie Meredith Family Moments cu praline, mini tablete și curmale în ciocolată",
  },

  // ——— Crăciun ———
  {
    slug: "bradut-de-ciocolata",
    name: "Brăduț de ciocolată",
    category: "craciun",
    price: 25,
    weight: "85 g",
    short: "Pictat manual, individual — umplut sau integral din ciocolată.",
    description: "Brăduț din ciocolată belgiană, pictat manual. La precomandă alegem împreună tipul de ciocolată și crema.",
    contents: [
      "Cu lapte, umplut cu cremă caramel",
      "Cu lapte, umplut cu cremă nocciola",
      "Alb, umplut cu cremă de fistic",
      "Alb, cu arahide caramelizate",
      "Integral din ciocolată albă",
      "Integral din ciocolată dark 54,5%",
      "Integral din ciocolată cu lapte",
    ],
    allergens: "În funcție de variantă: ALUNE DE PĂDURE, FISTIC, ARAHIDE",
    cutout: "/images/cut/bradut-lapte.webp",
    photo: "/images/photos/bradut-lapte.jpg",
    alt: "Brăduț din ciocolată cu lapte pictat manual cu auriu",
    featured: true,
  },
  {
    slug: "meredith-little-christmas-150",
    name: "Meredith Little Christmas",
    category: "craciun",
    price: 70,
    weight: "150 g",
    short: "Brăduț și globuri din ciocolată, decorate manual și umplute.",
    description: "Un brăduț și globuri din ciocolată cu lapte sau albă, decorate manual și umplute cu cremă de caramel, nocciola, fistic, Biscoff sau cocos.",
    contents: ["Brăduț din ciocolată cu lapte sau albă, umplut", "Globuri din ciocolată, umplute"],
    allergens: "În funcție de cremă: ALUNE DE PĂDURE, FISTIC, GLUTEN (Biscoff)",
    cutout: "/images/cut/bradut-alb.webp",
    photo: "/images/photos/bradut-alb-globuri.jpg",
    alt: "Brăduț de ciocolată albă pictat colorat, înconjurat de globuri din ciocolată",
    badge: "Ediție de sezon",
  },
  {
    slug: "meredith-christmas",
    name: "Meredith Christmas",
    category: "craciun",
    price: 100,
    weight: "200 g",
    short: "Brăduț, globuri umplute și mini tablete cu zmeură.",
    description: "Varianta generoasă: brăduț și globuri din ciocolată decorate manual și umplute cu cremă, plus mini tablete cu zmeură liofilizată.",
    contents: ["Brăduț din ciocolată cu lapte sau albă, umplut", "Globuri din ciocolată, umplute", "Mini tablete cu zmeură liofilizată"],
    allergens: "În funcție de cremă: ALUNE DE PĂDURE, FISTIC, GLUTEN (Biscoff)",
    cutout: "/images/cut/bradut-lapte-2.webp",
    photo: "/images/photos/bradut-lapte-globuri.jpg",
    alt: "Brăduț de ciocolată cu lapte cu globuri de ciocolată pictate",
  },

  // ——— Evenimente ———
  {
    slug: "marturii-nunta-botez",
    name: "Mărturii din ciocolată",
    category: "evenimente",
    price: 5,
    priceFrom: true,
    priceUnit: "buc.",
    weight: "în jur de 10 g / bucată, în funcție de model",
    short: "Mini tablete și alte modele pentru logodnă, cununie, nuntă, gender reveal și botez.",
    description:
      "Mărturii de bun venit într-o gamă foarte mare de forme, culori și umpluturi, realizate după tematica evenimentului — de exemplu mini tabletele de 10 g cu bucăți de fistic și zmeură liofilizată sau doar cu fistic. Se vând la bucată și se regăsesc și în cutiile noastre cadou. Ambalare individuală sau în cutii de 2, 4, 6, 8 sau 12 bucăți. Prețul final se stabilește după o ședință de degustare. 20% reducere dacă alegi și Deluxe Meredith Choco Bar.",
    allergens: "În funcție de model: FISTIC",
    photo: "/images/photos/marturii-mini-tablete.jpg",
    cutout: "/images/cut/mini-tablete.webp",
    more: [
      { src: "/images/photos/marturii-zmeura.jpg", alt: "Mini tablete cu zmeură liofilizată" },
      { src: "/images/photos/marturii-fistic-zmeura.jpg", alt: "Mini tablete cu fistic și zmeură liofilizată" },
      { src: "/images/photos/marturii-alba-fistic.jpg", alt: "Mini tablete albe cu fistic" },
    ],
    alt: "Mărturii de nuntă — mini tablete de ciocolată colorate",
    featured: true,
  },
  {
    slug: "deluxe-meredith-choco-bar",
    name: "Deluxe Meredith Choco Bar",
    category: "evenimente",
    price: 10,
    priceFrom: true,
    priceUnit: "persoană",
    short: "Bar de ciocolată pentru aniversări, nunți, botezuri și evenimente corporate.",
    description:
      "Machete, fructe trase în ciocolată și praline în culorile și umpluturile alese pentru tematica evenimentului tău. Stabilim împreună, după o degustare de praline, meniul și prețul final.",
    allergens: "În funcție de meniul ales — îți comunicăm lista exactă la degustare",
    photo: "/images/photos/choco-bar-atelier.jpg",
    alt: "Praline colorate și cutii Meredith pregătite pentru un Choco Bar",
    featured: true,
  },
];

export const bySlug = (slug: string) => products.find((p) => p.slug === slug);
export const inCategory = (c: Category) => products.filter((p) => p.category === c);
export const sliderTablets = products.filter((p) => p.tone && p.cutout);

/** Unit price of an order line (variant price when one is chosen). */
export function linePrice(p: Product, variantId?: string) {
  return p.variants?.find((v) => v.id === variantId)?.price ?? p.price ?? 0;
}

export function formatPrice(p: Pick<Product, "price" | "priceFrom" | "priceUnit">) {
  if (p.price === null) return "Preț la cerere";
  return `${p.priceFrom ? "de la " : ""}${p.price} lei${p.priceUnit ? ` / ${p.priceUnit}` : ""}`;
}
