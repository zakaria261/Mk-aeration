import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "MK Aération",
    short_name: "MK Aération",
    description:
      "Réseaux aérauliques, CTA et VMC. Les chantiers, les nouvelles de l’équipe et l’espace de publication des collaborateurs.",
    lang: "fr",
    dir: "ltr",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#f4f3ef",
    theme_color: "#f4f3ef",
    categories: ["business", "productivity"],
    icons: [
      { src: "/brand/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/brand/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      {
        src: "/brand/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "Publier un chantier",
        short_name: "Publier",
        description: "Ouvrir l’espace équipe pour ajouter une réalisation",
        url: "/equipe?nouveau=realisation",
        icons: [{ src: "/brand/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "Demander un devis",
        short_name: "Devis",
        url: "/devis",
        icons: [{ src: "/brand/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "Les réalisations",
        short_name: "Chantiers",
        url: "/realisations",
        icons: [{ src: "/brand/icon-192.png", sizes: "192x192" }],
      },
    ],
  };
}
