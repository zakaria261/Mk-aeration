import { siteUrl } from "@/lib/site-url";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./styles/shell.css";
import "./styles/home.css";
import "./styles/pages.css";
import "./styles/quote.css";
import "./styles/public-site.css";
import "./styles/landing.css";
import "./styles/contact.css";
import { Header, Footer } from "@/components/site-shell";
import { SiteProvider } from "@/components/site-provider";
import { ConversionListener } from "@/components/conversion-controls";
import { publicSite } from "@/lib/site-content-server";
import { companyLinks } from "@/lib/site-content";
import { AppRuntime } from "@/components/app-runtime";

export const dynamic = "force-dynamic";

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
      { url: "/images/annecy-panorama.webp", width: 1800, height: 1350 },
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
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0b263a",
  colorScheme: "light",
};

/** Marque le mode application avant le premier rendu, pour éviter tout saut. */
const standaloneScript = `try{if(matchMedia('(display-mode: standalone)').matches||navigator.standalone===true){document.documentElement.classList.add('is-standalone');if(location.pathname==='/')location.replace('/equipe')}}catch(e){}`;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await publicSite();
  const company = companyLinks(settings.company);
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: standaloneScript }} />
      </head>
      <body>
        <SiteProvider content={settings}>
          <Header />
          {children}
          <Footer />
          <AppRuntime />
          <ConversionListener />
        </SiteProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "HVACBusiness",
              name: "MK Aération",
              logo: `${siteUrl}${settings.logo.src}`,
              image: `${siteUrl}/images/annecy-panorama.webp`,
              telephone: company.phone,
              email: company.email,
              url: siteUrl,
              address: {
                "@type": "PostalAddress",
                streetAddress: company.address,
                postalCode: company.city.match(/\b\d{5}\b/)?.[0],
                addressLocality: company.city.replace(/\b\d{5}\b/, "").trim(),
                addressCountry: "FR",
              },
              areaServed: company.areas,
            }).replace(/</g, "\\u003c"),
          }}
        />
      </body>
    </html>
  );
}
