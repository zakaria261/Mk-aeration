import { siteUrl } from "@/lib/site-url";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./styles/shell.css";
import "./styles/home.css";
import "./styles/pages.css";
import "./styles/quote.css";
import "./styles/landing.css";
import { Header, Footer } from "@/components/site-shell";
import { AppRuntime } from "@/components/app-runtime";
import { startupImages } from "@/lib/pwa";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "MK Aération",
  title: {
    default: "MK Aération — Réseaux aérauliques, CTA & VMC",
    template: "%s | MK Aération",
  },
  description:
    "Pose de réseaux aérauliques, gaines de ventilation, réseaux de soufflage et d’extraction, CTA et VMC. Chantiers tertiaires et industriels dans les départements 26, 38, 69 et 74.",
  openGraph: {
    title: "MK Aération — La qualité de l’air commence ici",
    description:
      "Réseaux aérauliques, gaines de ventilation, CTA, VMC, soufflage et extraction en Auvergne-Rhône-Alpes.",
    locale: "fr_FR",
    type: "website",
    images: [
      { url: "/images/mont-blanc-presentation.webp", width: 1461, height: 720 },
    ],
  },
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "64x64", type: "image/png" },
      { url: "/brand/favicon-32.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/favicon.png",
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  appleWebApp: {
    capable: true,
    title: "MK Aération",
    statusBarStyle: "default",
    startupImage: startupImages,
  },
  formatDetection: { telephone: false, email: false, address: false },
  other: { "apple-mobile-web-app-capable": "yes" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#f4f3ef",
  colorScheme: "light",
};

/** Marque le mode application avant le premier rendu, pour éviter tout saut. */
const standaloneScript = `try{if(matchMedia('(display-mode: standalone)').matches||navigator.standalone===true){document.documentElement.classList.add('is-standalone')}}catch(e){}`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: standaloneScript }} />
        <link
          rel="preload"
          href="/fonts/archivo-var.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <Header />
        {children}
        <Footer />
        <AppRuntime />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "HVACBusiness",
              name: "MK Aération",
              logo: `${siteUrl}/brand/logo-mk-aeration.png`,
              image: `${siteUrl}/images/mont-blanc-presentation.webp`,
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
