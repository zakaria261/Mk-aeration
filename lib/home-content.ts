import { z } from "zod";

export const homePhotos = [
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
  heroTitle: "Ventilation &",
  heroAccent: "réseaux aérauliques.",
  heroDescription:
    "Pose de gaines de ventilation, CTA et VMC pour les bâtiments tertiaires, industriels et les logements collectifs.",
  heroImage: "/images/annecy-panorama.webp",
  benefitsTitle: "Une équipe de terrain.",
  benefitsIntro:
    "Basés à Saint-Rambert-d’Albon, nous posons vos réseaux de ventilation dans la Drôme, l’Isère, le Rhône et la Haute-Savoie.",
  contactTitle: "Parlons de votre projet.",
  contactDescription:
    "Quelques lignes sur votre chantier et vos coordonnées pour vous recontacter.",
};
export function readHomeContent(value: unknown): HomeContent {
  const parsed = homeContentSchema.safeParse(value);
  return parsed.success ? parsed.data : defaultHomeContent;
}
