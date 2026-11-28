import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope, Pinyon_Script } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import OrderDrawer from "@/components/OrderDrawer";
import WhatsAppFab from "@/components/WhatsAppFab";
import Motion from "@/components/Motion";
import BackButton from "@/components/BackButton";
import JsonLd from "@/components/JsonLd";
import { OrderProvider } from "@/lib/order";
import { businessSchema } from "@/lib/schema";
import { site } from "@/lib/site";
import "./globals.css";

const serif = Cormorant_Garamond({ subsets: ["latin", "latin-ext"], weight: ["300", "400", "500", "600"], style: ["normal", "italic"], variable: "--font-serif", display: "swap" });
const sans = Manrope({ subsets: ["latin", "latin-ext"], variable: "--font-sans", display: "swap" });
const script = Pinyon_Script({ subsets: ["latin", "latin-ext"], weight: "400", variable: "--font-script", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Meredith Choco House — Ciocolaterie artizanală în Caransebeș",
    template: "%s · Meredith Choco House",
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "ciocolaterie Caransebeș",
    "ciocolată artizanală",
    "ciocolată Caraș-Severin",
    "tabletă Dubai Caransebeș",
    "praline pictate manual",
    "cutii cadou ciocolată",
    "mărturii nuntă ciocolată",
    "mărturii botez",
    "candy bar ciocolată nuntă",
    "brăduț de ciocolată",
    "Callebaut",
  ],
  authors: [{ name: site.name }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ro_RO",
    url: site.url,
    siteName: site.name,
    title: "Meredith Choco House — Ciocolaterie artizanală",
    description: site.tagline,
  },
  twitter: { card: "summary_large_image" },
  robots: process.env.NEXT_PUBLIC_PREVIEW
    ? { index: false, follow: false }
    : { index: true, follow: true, googleBot: { "max-image-preview": "large" } },
  formatDetection: { telephone: true },
};

export const viewport: Viewport = {
  themeColor: "#1c130f",
  colorScheme: "light",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ro" className={`${serif.variable} ${sans.variable} ${script.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        <OrderProvider>
          <a href="#main" className="visually-hidden">
            Sari la conținut
          </a>
          <Header />
          <BackButton />
          <main id="main">{children}</main>
          <Footer />
          <OrderDrawer />
          <WhatsAppFab />
          <Motion />
        </OrderProvider>
        <JsonLd data={businessSchema} />
      </body>
    </html>
  );
}
