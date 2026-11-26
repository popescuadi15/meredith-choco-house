export const site = {
  name: "Meredith Choco House",
  shortName: "Meredith",
  legalName: "MEREDITH CHOCO HOUSE SRL",
  cui: "54887476",
  url: "https://meredithchoco.ro",
  tagline: "Fiecare creație are propria poveste, fiecare detaliu poartă semnătura noastră.",
  description:
    "Ciocolaterie artizanală în Caransebeș. Tablete din ciocolată belgiană Callebaut, tableta Dubai, cutii cadou cu praline pictate manual, brăduți de Crăciun, mărturii de nuntă și botez și Deluxe Choco Bar pentru evenimente — din ciocolată belgiană Callebaut.",
  phone: "0728 997 053",
  phoneE164: "+40728997053",
  whatsapp: "40728997053",
  email: "banatmonika@gmail.com",
  address: {
    street: "Strada Pajiștei nr. 14",
    city: "Caransebeș",
    county: "Caraș-Severin",
    country: "RO",
    label: "Atelier",
  },
  hours: [{ days: "Sâmbătă", time: "10:00 – 18:00", schema: { day: "Saturday", opens: "10:00", closes: "18:00" } }],
  social: {
    instagram: "https://www.instagram.com/meredith_chocohouse/",
    tiktok: "https://www.tiktok.com/@meredith_chocohouse",
  },
  launch: "2026-12-01T19:00:00+02:00",
  mapsQuery: "Strada Pajiștei 14, Caransebeș",
} as const;

export const nav = [
  { href: "/produse", label: "Colecții" },
  { href: "/evenimente", label: "Evenimente" },
  { href: "/degustari", label: "Degustări" },
  { href: "/povestea", label: "Povestea" },
  { href: "/galerie", label: "Galerie" },
  { href: "/contact", label: "Contact" },
] as const;

export const orderRules = [
  "Comenzile se fac telefonic sau pe WhatsApp: tablete cu 24–48 h înainte, cutii cadou cu minimum 48 h, restul produselor cu 48–72 h.",
  "Degustările pentru evenimente se programează telefonic cu 24 de ore înainte.",
  "Momentan nu livrăm prin curier — comenzile se ridică din atelier, în Caransebeș.",
  "Realizăm și alte produse la cerere și ne adaptăm fiecărui buget.",
];

export function waLink(text?: string) {
  return `https://wa.me/${site.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}
