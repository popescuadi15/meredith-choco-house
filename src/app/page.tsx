import Hero from "@/components/home/Hero";
import Collection from "@/components/home/Collection";
import AtelierDay from "@/components/home/AtelierDay";
import BoxReveal from "@/components/home/BoxReveal";
import GiftBoxes from "@/components/home/GiftBoxes";
import Christmas from "@/components/home/Christmas";
import Events from "@/components/home/Events";
import Story from "@/components/home/Story";
import HowToOrder from "@/components/home/HowToOrder";
import FinalCta from "@/components/home/FinalCta";
import JsonLd from "@/components/JsonLd";
import { faq } from "@/lib/faq";
import { faqSchema } from "@/lib/schema";

export default function Home() {
  return (
    <>
      <Hero />
      <Collection />
      <Christmas />
      <BoxReveal />
      <GiftBoxes />
      <Events />
      <FinalCta />
      <AtelierDay />
      <Story />
      <HowToOrder />
      <JsonLd data={faqSchema(faq)} />
    </>
  );
}
