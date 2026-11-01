import { siteUrl } from "@/lib/site-url";
import type { Metadata } from "next";
import "./globals.css";
import { Header, Footer } from "@/components/site-shell";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "MK Aération — Réseaux aérauliques, CTA & VMC",
    template: "%s | MK Aération",
  },
  description:
    "Pose de réseaux aérauliques, gaines de ventilation, réseaux de soufflage et d’extraction, CTA et VMC. Chantiers tertiaires et industriels dans les départements 26, 38, 69 et 74.",
  openGraph: {
    title: "MK Aération — L’air sain. Le travail bien fait.",
    description:
      "Réseaux aérauliques, gaines de ventilation, CTA, VMC, soufflage et extraction en Auvergne-Rhône-Alpes.",
    locale: "fr_FR",
    type: "website",
    images: [
      { url: "/images/annecy-panorama.webp", width: 1800, height: 1350 },
    ],
  },
  icons: {
    icon: { url: "/favicon.png", sizes: "64x64", type: "image/png" },
    shortcut: "/favicon.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>
        <Header />
        {children}
        <Footer />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "HVACBusiness",
              name: "MK Aération",
              logo: `${siteUrl}/images/logo-mk-aeration.jpg`,
              telephone: "+33768476126",
              email: "mk.aeration@hotmail.com",
              url: siteUrl,
              address: {
                "@type": "PostalAddress",
                streetAddress: "2 route des Champs",
                postalCode: "26140",
                addressLocality: "Saint-Rambert-d’Albon",
                addressCountry: "FR",
              },
              areaServed: ["Drôme", "Isère", "Rhône", "Haute-Savoie"],
            }),
          }}
        />
      </body>
    </html>
  );
}
