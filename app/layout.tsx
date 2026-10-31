import { siteUrl } from "@/lib/site-url";
import type { Metadata } from "next";
import "./globals.css";
import { Header, Footer } from "@/components/site-shell";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "MK Aération — Ventilation, VMC & extraction",
    template: "%s | MK Aération",
  },
  description:
    "Installation de réseaux de ventilation, VMC double flux et extraction professionnelle. MK Aération intervient dans la Drôme, l’Isère, le Rhône et la Haute-Savoie.",
  openGraph: {
    title: "MK Aération — L’air sain. Le travail bien fait.",
    description:
      "Votre spécialiste ventilation, VMC et extraction en Auvergne-Rhône-Alpes.",
    locale: "fr_FR",
    type: "website",
    images: [
      { url: "/images/annecy-panorama.webp", width: 1800, height: 1350 },
    ],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
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
