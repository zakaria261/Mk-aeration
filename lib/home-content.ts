import { z } from "zod";

export const homePhotos = [
  {
    src: "/images/mk-aeration-hero-landscape.webp",
    label: "L’expertise des réseaux aérauliques — composition paysage",
    alt: "Installations de ventilation et gaines en toiture devant les Alpes, extraites du visuel fourni par MK Aération",
    width: 720,
    height: 470,
  },
  {
    src: "/images/mk-aeration-hero.webp",
    label: "La maîtrise de l’air, au service de vos projets",
    alt: "L’expertise des réseaux aérauliques — concevoir, fournir et installer des solutions de ventilation performantes. Visuel fourni par MK Aération.",
    width: 720,
    height: 1278,
  },
  {
    src: "/images/mont-blanc-presentation.webp",
    label: "Tunnel du Mont-Blanc · visuel de présentation",
    alt: "Tunnel du Mont-Blanc, visuel de présentation fourni par MK Aération",
    width: 1461,
    height: 720,
  },
  {
    src: "/images/annecy-panorama.webp",
    label: "FIER Annecy · CTA double flux",
    alt: "Installation de ventilation en toiture à Annecy",
    width: 1800,
    height: 1350,
  },
  {
    src: "/images/htc-la-boisse-reseaux.webp",
    label: "HTC La Boisse · réseaux aérauliques",
    alt: "Réseaux aérauliques sur le chantier HTC La Boisse",
    width: 1152,
    height: 1536,
  },
  {
    src: "/images/grenoble-gaines-rectangulaires.webp",
    label: "Forum Grenoble · gaines rectangulaires",
    alt: "Gaines rectangulaires posées au Forum de Grenoble",
    width: 800,
    height: 600,
  },
] as const;
export const homeContentSchema = z
  .object({
    heroTitle: z.string().trim().min(5).max(80),
    heroAccent: z.string().trim().min(5).max(80),
    heroDescription: z.string().trim().min(30).max(360),
    heroImage: z
      .string()
      .refine((value) => homePhotos.some((photo) => photo.src === value)),
    benefitsTitle: z.string().trim().min(5).max(100),
    benefitsIntro: z.string().trim().min(30).max(450),
    contactTitle: z.string().trim().min(5).max(100),
    contactDescription: z.string().trim().min(15).max(300),
  })
  .strict();
export type HomeContent = z.infer<typeof homeContentSchema>;
export type HomePageRecord = {
  draft: HomeContent;
  published: HomeContent | null;
  version: number;
  updated_at: string | null;
};
export const defaultHomeContent: HomeContent = {
  heroTitle: "L’expertise des réseaux",
  heroAccent: "aérauliques",
  heroDescription:
    "Concevoir, fournir et installer des solutions de ventilation performantes.",
  heroImage: "/images/mk-aeration-hero-landscape.webp",
  benefitsTitle: "Le savoir-faire de terrain. L’exigence du détail.",
  benefitsIntro:
    "Depuis 2021, MK AÉRATION met son expertise au service des professionnels pour concevoir, fournir et réaliser des installations de ventilation adaptées aux exigences de chaque projet.",
  contactTitle: "Parlons de votre projet.",
  contactDescription:
    "Quelques lignes sur votre chantier et vos coordonnées pour vous recontacter.",
};
export const companyPresentation = [
  "Depuis 2021, MK AÉRATION met son expertise au service des professionnels pour concevoir, fournir et réaliser des installations de ventilation adaptées aux exigences de chaque projet.",
  "Spécialisés dans la fourniture et la pose de réseaux aérauliques, nous intervenons sur l’installation de gaines rectangulaires et circulaires, le raccordement de centrales de traitement d’air (CTA) ainsi que les systèmes de ventilation mécanique contrôlée (VMC).",
  "Nous accompagnons nos clients dans leurs projets de bâtiments tertiaires, industriels et de logements collectifs, en apportant des solutions techniques fiables, durables et performantes.",
  "De la préparation à la réalisation, notre engagement repose sur la qualité d’exécution, la précision technique et le respect des exigences de chaque chantier.",
];
// Secteurs d’activité de l’accueil : un titre, un texte (mots clés entre **),
// une photo et sa légende. Les légendes avec lien renvoient à la réalisation.
export const homeSectors = [
  {
    id: "grande-distribution",
    title: "Ventilation pour la grande distribution",
    paragraphs: [
      "Dans une surface de vente, l’air se renouvelle au-dessus des **rayons**, des **clients** et des **produits frais**.",
      "MK Aération pose les **réseaux de soufflage et d’extraction** en charpente, au-dessus des allées : **gaines circulaires de grande section**, diffusion dans les surfaces de vente et les réserves, **rejets en toiture**, en coordination avec les autres corps d’état.",
    ],
    image: {
      src: "/images/grande-distribution-gaines.webp",
      alt: "Gaines de ventilation circulaires suspendues sous la charpente, au-dessus des rayons d’une grande surface",
      width: 960,
      height: 720,
    },
    caption: { label: "Surface de vente", href: "/expertises/extraction" },
  },
  {
    id: "agroalimentaire",
    title: "Ventilation pour l’agroalimentaire",
    paragraphs: [
      "Dans les ateliers de transformation et les légumeries, la ventilation participe à l’**hygiène des locaux** et au **confort de travail**.",
      "Nous raccordons les **centrales de traitement d’air double flux** et adaptons les réseaux à chaque bâtiment, avec des **transitions entre gaines rectangulaires et circulaires** en partie haute des zones techniques.",
    ],
    image: {
      src: "/images/legumerie-ventilation.webp",
      alt: "Centrale double flux raccordée aux gaines circulaires dans une légumerie",
      width: 1200,
      height: 1200,
    },
    caption: {
      label: "Légumerie de Vourney",
      href: "/realisations/legumerie-vourney",
    },
  },
  {
    id: "tertiaire",
    title: "Ventilation pour le tertiaire",
    paragraphs: [
      "Bureaux, équipements publics, bâtiments recevant du public : MK Aération installe les **colonnes circulaires et rectangulaires**, les **réseaux de ventilation en toiture** et prépare les **raccordements aux CTA**.",
      "Un travail coordonné avec les intervenants du chantier pour distribuer l’air à **chaque niveau du bâtiment**.",
    ],
    image: {
      src: "/images/grenoble-toiture.webp",
      alt: "Réseaux de ventilation en toiture du Forum de la Métropole à Grenoble, face aux montagnes",
      width: 800,
      height: 600,
    },
    caption: {
      label: "Le Forum de la Métropole – Grenoble",
      href: "/realisations/forum-metropole-grenoble",
    },
  },
  {
    id: "logement-collectif",
    title: "Ventilation pour le logement collectif",
    paragraphs: [
      "En construction neuve comme en réhabilitation, la **VMC** assure le renouvellement de l’air de chaque logement.",
      "Nous **déposons les anciens réseaux**, préparons les passages et installons les **nouveaux réseaux VMC** jusqu’aux **bouches d’extraction**, bâtiment par bâtiment.",
    ],
    image: {
      src: "/images/vmc-cheminements.webp",
      alt: "Cheminement des gaines de ventilation en partie haute sur un chantier de réhabilitation VMC",
      width: 1440,
      height: 2560,
    },
    caption: {
      label: "Réhabilitation VMC – logement collectif",
      href: "/realisations/rehabilitation-vmc-21-appartements",
    },
  },
] as const;
export const companySignature =
  "MK AÉRATION, la maîtrise de l’air et le savoir-faire au service de vos projets.";
export function readHomeContent(value: unknown): HomeContent {
  const parsed = homeContentSchema.safeParse(value);
  if (!parsed.success) return defaultHomeContent;
  const content = parsed.data;
  // Actualiser les anciens textes de départ sans écraser les textes personnalisés.
  // Les données du CMS ne sont pas modifiées par cette compatibilité de lecture.
  const legacyHero =
    (content.heroTitle === "Ventilation &" &&
      content.heroAccent === "réseaux aérauliques.") ||
    (content.heroTitle === "La maîtrise" && content.heroAccent === "de l’air.");
  return {
    ...content,
    ...(legacyHero
      ? {
          heroTitle: defaultHomeContent.heroTitle,
          heroAccent: defaultHomeContent.heroAccent,
          heroImage: [
            "/images/annecy-panorama.webp",
            "/images/mk-aeration-hero.webp",
          ].includes(content.heroImage)
            ? defaultHomeContent.heroImage
            : content.heroImage,
          heroDescription: [
            "Pose de gaines de ventilation, CTA et VMC pour les bâtiments tertiaires, industriels et les logements collectifs.",
            "Concevoir, fournir et installer des solutions de ventilation à la hauteur de vos projets. Depuis 2021, le savoir-faire MK Aération accompagne les professionnels, de la préparation à la réalisation.",
          ].includes(content.heroDescription)
            ? defaultHomeContent.heroDescription
            : content.heroDescription,
        }
      : {}),
    benefitsTitle:
      content.benefitsTitle === "Une équipe de terrain."
        ? defaultHomeContent.benefitsTitle
        : content.benefitsTitle,
    benefitsIntro:
      content.benefitsIntro ===
      "Basés à Saint-Rambert-d’Albon, nous posons vos réseaux de ventilation dans la Drôme, l’Isère, le Rhône et la Haute-Savoie."
        ? defaultHomeContent.benefitsIntro
        : content.benefitsIntro,
  };
}
