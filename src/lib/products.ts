export type Category = "tablete" | "cutii-cadou" | "craciun" | "evenimente";

export type Product = {
  slug: string;
  name: string;
  category: Category;
  /** Price in RON. `null` = la cerere. */
  price: number | null;
  priceFrom?: boolean;
  priceUnit?: string;
  weight?: string;
  short: string;
  description: string;
  contents?: string[];
  /** Transparent cut-out (used on coloured backgrounds). */
  cutout?: string;
  /** Regular photograph. */
  photo?: string;
  alt: string;
  featured?: boolean;
  badge?: string;
  /** Slider styling (collection section). */
  tone?: { bg: string; word: string; ink: string };
  word?: string;
};

export const categories: Record<Category, { title: string; lead: string; seo: string }> = {
  tablete: {
    title: "Tablete de ciocolată",
    lead: "100 g de ciocolată belgiană Callebaut, pictată manual, tabletă cu tabletă. Albă 28%, cu lapte 33,6%, neagră 54,5% sau fără zahăr (maltitol).",
    seo: "Tablete de ciocolată artizanală pictate manual, din ciocolată belgiană Callebaut — Caransebeș.",
  },
  "cutii-cadou": {
    title: "Cutii cadou",
    lead: "Praline pictate manual, umplute cu creme fine, așezate în cutii pentru oamenii la care ții.",
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

const TABLET =
  "Tabletă de 100 g din ciocolată belgiană Callebaut — albă 28%, cu lapte 33,6%, neagră 54,5% sau fără zahăr (maltitol) — pictată manual, individual. O poți comanda simplă sau cu ingredientele dorite. Precomandă 24–36 de ore.";

const tablet = (p: Omit<Product, "category" | "price" | "weight" | "description"> & { extra?: string }): Product => ({
  category: "tablete",
  price: 25,
  weight: "100 g",
  description: `${p.extra ? p.extra + " " : ""}${TABLET}`,
  ...p,
});

export const products: Product[] = [
  // ——— Tablete ———
  {
    ...tablet({
    slug: "tableta-dubai",
    name: "Tableta Dubai",
    short: "Celebra tabletă Dubai, cu fistic și kataifi — cel mai iubit produs al nostru.",
    extra: "Cea mai cerută tabletă din atelier, realizată în toate gramajele dorite.",
    alt: "Tabletă de ciocolată Dubai Meredith",
    badge: "Cea mai iubită",
    featured: true,
    }),
    price: null,
    weight: "Gramaj la alegere",
  },
  tablet({
    slug: "tableta-biscoff",
    name: "Ciocolată cu biscuiți Biscoff",
    word: "BISCOFF",
    short: "Biscuiți Biscoff caramelizați, în ciocolată belgiană.",
    cutout: "/images/cut/tableta-biscoff.webp",
    photo: "/images/photos/tableta-biscoff.jpg",
    alt: "Tabletă de ciocolată cu lapte și biscuiți Biscoff, pictată manual",
    featured: true,
    tone: { bg: "#c9a47e", word: "#f6ead9", ink: "#2b1a10" },
  }),
  tablet({
    slug: "tableta-zmeura-liofilizata",
    name: "Ciocolată cu zmeură liofilizată",
    word: "ZMEURĂ",
    short: "Zmeură liofilizată, acidulată, pe ciocolată cu lapte.",
    cutout: "/images/cut/tableta-zmeura.webp",
    photo: "/images/photos/marturii-zmeura.jpg",
    alt: "Tablete de ciocolată cu lapte cu zmeură liofilizată",
    featured: true,
    badge: "Preferata clienților",
    tone: { bg: "#c99f9a", word: "#f7e7e2", ink: "#2b1414" },
  }),
  tablet({
    slug: "tableta-fistic-macadamia-merisoare",
    name: "Ciocolată cu fistic, nuci macadamia și merișoare",
    word: "FISTIC",
    short: "Fistic, macadamia și merișoare — crocant și fructat.",
    cutout: "/images/cut/tableta-fistic-zmeura.webp",
    photo: "/images/photos/marturii-fistic-zmeura.jpg",
    alt: "Tabletă de ciocolată cu fistic, nuci macadamia și merișoare",
    featured: true,
    tone: { bg: "#b4b593", word: "#f1f0e2", ink: "#1f2414" },
  }),
  tablet({
    slug: "tableta-arahide-caramelizate",
    name: "Ciocolată cu arahide caramelizate",
    word: "ARAHIDE",
    short: "Arahide caramelizate în casă, pe ciocolată cu lapte.",
    cutout: "/images/cut/tableta-arahide.webp",
    photo: "/images/photos/tableta-arahide.jpg",
    alt: "Tabletă de ciocolată cu lapte cu arahide caramelizate",
    featured: true,
    tone: { bg: "#8c6a52", word: "#e9d6c0", ink: "#fbf3e8" },
  }),
  tablet({
    slug: "tableta-crema-fistic",
    name: "Ciocolată cu cremă de fistic",
    word: "PISTACHIO",
    short: "Ciocolată albă cu cremă și bucăți de fistic.",
    cutout: "/images/cut/tableta-alba-fistic.webp",
    photo: "/images/photos/marturii-alba-fistic.jpg",
    alt: "Tabletă de ciocolată albă cu fistic",
    featured: true,
    tone: { bg: "#d9d3bd", word: "#f8f5ea", ink: "#2a2615" },
  }),
  tablet({
    slug: "tableta-crema-ciocolata-alba",
    name: "Ciocolată cu cremă de ciocolată albă",
    word: "ALBĂ",
    short: "Pentru iubitorii de ciocolată albă — fină, cremoasă, cu mesaj.",
    cutout: "/images/cut/tableta-alba.webp",
    photo: "/images/photos/tableta-alba.jpg",
    alt: "Tabletă de ciocolată albă cu mesajul Love You",
    featured: true,
    tone: { bg: "#b39770", word: "#f4e8d2", ink: "#20160b" },
  }),
  tablet({ slug: "tableta-oreo", name: "Ciocolată cu biscuiți Oreo", short: "Biscuiți Oreo, în ciocolată belgiană.", alt: "Tabletă de ciocolată cu biscuiți Oreo" }),
  tablet({ slug: "tableta-crema-caramel", name: "Ciocolată cu cremă caramel", short: "Umplută cu cremă fină de caramel.", alt: "Tabletă de ciocolată cu cremă caramel" }),
  tablet({ slug: "tableta-crema-nocciola", name: "Ciocolată cu cremă nocciola", short: "Umplută cu cremă de alune de pădure.", alt: "Tabletă de ciocolată cu cremă nocciola" }),
  tablet({ slug: "tableta-crema-cocos", name: "Ciocolată cu cremă de cocos", short: "Umplută cu cremă delicată de cocos.", alt: "Tabletă de ciocolată cu cremă de cocos" }),

  // ——— Cutii cadou ———
  {
    slug: "cutie-meredith-selection",
    name: "Meredith Selection",
    category: "cutii-cadou",
    price: 50,
    weight: "145 g",
    short: "12 praline pictate manual, cu patru creme fine.",
    description:
      "Douăsprezece praline pictate manual, individual, umplute cu cremă de fistic, caramel, nocciola și cocos. La precomandă alegem împreună tipul de ciocolată și crema.",
    contents: ["Pralină cu cremă de fistic", "Pralină cu cremă caramel", "Pralină cu cremă nocciola", "Pralină cu cremă de cocos"],
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
    description: "Cutia semnătură a atelierului: praline umplute, batoane cu mix de nuci și mini tablete cu zmeură liofilizată, toate pictate manual.",
    contents: [
      "Praline umplute cu fistic",
      "Praline umplute cu caramel",
      "Praline umplute cu nocciola",
      "Batoane cu mix de nuci",
      "Mini tabletă cu zmeură liofilizată și fistic",
      "Mini tabletă albă cu zmeură liofilizată",
    ],
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
    description: "Cutia Gold adună tot ce iubim: patru tipuri de praline, mini tablete cu zmeură și batoane cu nuci și merișoare.",
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
    cutout: "/images/cut/bradut-alb.webp",
    photo: "/images/photos/bradut-alb-globuri.jpg",
    alt: "Brăduț de ciocolată albă pictat colorat, înconjurat de globuri din ciocolată",
    badge: "Ediție de sezon",
  },
  {
    slug: "meredith-little-christmas-200",
    name: "Meredith Little Christmas Deluxe",
    category: "craciun",
    price: 100,
    weight: "200 g",
    short: "Brăduț, globuri umplute și mini tablete cu zmeură.",
    description: "Varianta generoasă: brăduț și globuri din ciocolată decorate manual și umplute cu cremă, plus mini tablete cu zmeură liofilizată.",
    contents: ["Brăduț din ciocolată cu lapte sau albă, umplut", "Globuri din ciocolată, umplute", "Mini tablete cu zmeură liofilizată"],
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
    weight: "8 g / bucată",
    short: "Pentru logodnă, cununie, nuntă, gender reveal și botez.",
    description:
      "Mărturii de bun venit într-o gamă foarte mare de forme, culori și umpluturi, realizate după tematica evenimentului. Ambalare individuală sau în cutii de 2, 4, 6, 8 sau 12 bucăți. Prețul final se stabilește după o ședință de degustare. 20% reducere dacă alegi și Deluxe Meredith Choco Bar.",
    photo: "/images/photos/marturii-mini-tablete.jpg",
    cutout: "/images/cut/mini-tablete.webp",
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
    photo: "/images/photos/choco-bar-atelier.jpg",
    alt: "Praline colorate și cutii Meredith pregătite pentru un Choco Bar",
    featured: true,
  },
];

export const bySlug = (slug: string) => products.find((p) => p.slug === slug);
export const inCategory = (c: Category) => products.filter((p) => p.category === c);
export const sliderTablets = products.filter((p) => p.tone && p.cutout);

export function formatPrice(p: Pick<Product, "price" | "priceFrom" | "priceUnit">) {
  if (p.price === null) return "Preț la cerere";
  return `${p.priceFrom ? "de la " : ""}${p.price} lei${p.priceUnit ? ` / ${p.priceUnit}` : ""}`;
}
