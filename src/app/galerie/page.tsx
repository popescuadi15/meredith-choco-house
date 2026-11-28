import type { Metadata } from "next";
import Gallery, { type Shot } from "@/components/Gallery";

export const metadata: Metadata = {
  title: "Galerie — creații din ciocolată pictate manual",
  description: "Fotografii cu tabletele, pralinele, brăduții de Crăciun și mărturiile Meredith Choco House, realizate manual în laboratorul din Caransebeș.",
  alternates: { canonical: "/galerie" },
};

const shots: Shot[] = [
  { src: "/images/photos/candybar-vertical.jpg", alt: "Deluxe Meredith Choco Bar la un eveniment", w: 1023, h: 1537 },
  { src: "/images/photos/laborator-amurg.jpg", alt: "Laboratorul Meredith din Caransebeș, la lăsarea serii", w: 2400, h: 1500 },
  { src: "/images/photos/candybar-ciocolata.jpg", alt: "Praline de ciocolată pe treptele aurii ale Choco Bar-ului", w: 1600, h: 1064 },
  { src: "/images/photos/tablete-dubai-pictate.jpg", alt: "Tablete Dubai pictate manual cu auriu", w: 1200, h: 1600 },
  { src: "/images/photos/eveniment-cutii-praline.jpg", alt: "Cutii cu praline pregătite pentru un eveniment", w: 1200, h: 1600 },
  { src: "/images/photos/candybar-randuri.jpg", alt: "Rânduri de praline și batoane pe Choco Bar", w: 1600, h: 1064 },
  { src: "/images/photos/cutie-tableta-praline.jpg", alt: "Cutie cadou cu tabletă și praline", w: 899, h: 1599 },
  { src: "/images/photos/candybar-batoane.jpg", alt: "Batoane și praline colorate la un eveniment", w: 1600, h: 1064 },
  { src: "/images/photos/laborator-noapte.jpg", alt: "Laboratorul Meredith seara, cu luminițele aprinse", w: 2400, h: 1500 },
  { src: "/images/photos/atelier-callebaut.jpg", alt: "Tablete pictate cu auriu și ciocolata Callebaut", w: 1362, h: 1761 },
  { src: "/images/photos/cutii-praline.jpg", alt: "Cutii Meredith Selection cu 12 praline pictate", w: 2400, h: 1635 },
  { src: "/images/photos/bradut-alb-globuri.jpg", alt: "Brăduț de ciocolată albă cu globuri", w: 2400, h: 1762 },
  { src: "/images/photos/marturii-zmeura.jpg", alt: "Tablete cu lapte și zmeură liofilizată", w: 2400, h: 1600 },
  { src: "/images/photos/cutie-praline-eveniment.jpg", alt: "Cutie cu praline asortate pentru eveniment", w: 1536, h: 2048 },
  { src: "/images/photos/bradut-lapte.jpg", alt: "Brăduț de ciocolată cu lapte pictat auriu", w: 2400, h: 1600 },
  { src: "/images/photos/tableta-biscoff.jpg", alt: "Tabletă cu biscuiți Biscoff", w: 2400, h: 1600 },
  { src: "/images/photos/marturii-mini-tablete.jpg", alt: "Mărturii — mini tablete colorate", w: 2400, h: 1600 },
  { src: "/images/photos/choco-bar-atelier.jpg", alt: "Praline pregătite pentru un Choco Bar", w: 2048, h: 1171 },
  { src: "/images/photos/bradut-verde.jpg", alt: "Brăduț de ciocolată verde pictat", w: 2400, h: 1600 },
  { src: "/images/photos/marturii-alba-fistic.jpg", alt: "Ciocolată albă cu fistic", w: 2400, h: 1600 },
  { src: "/images/photos/tableta-arahide.jpg", alt: "Tabletă cu arahide caramelizate", w: 2400, h: 1600 },
  { src: "/images/photos/batoane-nuci.jpg", alt: "Batoane de ciocolată cu mix de nuci", w: 2400, h: 1600 },
  { src: "/images/photos/bradut-lapte-globuri.jpg", alt: "Brăduț cu lapte și globuri de ciocolată", w: 2400, h: 1600 },
  { src: "/images/photos/tableta-alba.jpg", alt: "Tabletă de ciocolată albă „Love You”", w: 2400, h: 1600 },
  { src: "/images/photos/marturii-fistic-zmeura.jpg", alt: "Tablete cu fistic și zmeură", w: 2400, h: 2015 },
  { src: "/images/photos/bradut-alb.jpg", alt: "Brăduț alb pictat în culori", w: 2400, h: 1600 },
];

export default function GalleryPage() {
  return (
    <>
      <header className="page-hero">
        <p className="eyebrow">Galerie</p>
        <h1>
          Din <span className="script gold-text">laborator</span>
        </h1>
        <p>Fiecare bucată de aici a fost pictată, umplută și ambalată de mână.</p>
      </header>
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <Gallery shots={shots} />
        </div>
      </section>
    </>
  );
}
