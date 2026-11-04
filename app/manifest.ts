import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "MK Aération — Gestion",
    short_name: "MK Gestion",
    description:
      "Application privée de gestion du site MK Aération : réalisations, photos et actualités.",
    lang: "fr",
    dir: "ltr",
    start_url: "/equipe",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#f2f2f7",
    theme_color: "#f2f2f7",
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
        name: "Ajouter une actualité",
        short_name: "Actualité",
        url: "/equipe?nouveau=actualite",
        icons: [{ src: "/brand/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "Gérer les publications",
        short_name: "Publications",
        url: "/equipe/publications",
        icons: [{ src: "/brand/icon-192.png", sizes: "192x192" }],
      },
    ],
  };
}
