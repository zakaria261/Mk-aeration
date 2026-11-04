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
