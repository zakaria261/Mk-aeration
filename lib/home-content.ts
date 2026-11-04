import { z } from "zod";

export const homePhotos = [
  { src: "/images/mont-blanc-presentation.webp", label: "Tunnel du Mont-Blanc · visuel de présentation", alt: "Tunnel du Mont-Blanc, visuel de présentation fourni par MK Aération", width: 1461, height: 720 },
  { src: "/images/annecy-panorama.webp", label: "FIER Annecy · CTA double flux", alt: "Installation de ventilation en toiture à Annecy", width: 1800, height: 1350 },
  { src: "/images/htc-la-boisse-reseaux.webp", label: "HTC La Boisse · réseaux aérauliques", alt: "Réseaux aérauliques sur le chantier HTC La Boisse", width: 1152, height: 1536 },
  { src: "/images/grenoble-gaines-rectangulaires.webp", label: "Forum Grenoble · gaines rectangulaires", alt: "Gaines rectangulaires posées au Forum de Grenoble", width: 800, height: 600 },
] as const;
export const homeContentSchema = z.object({
  heroTitle: z.string().trim().min(5).max(80),
  heroAccent: z.string().trim().min(5).max(80),
  heroDescription: z.string().trim().min(30).max(360),
  heroImage: z.string().refine(value => homePhotos.some(photo => photo.src === value)),
  benefitsTitle: z.string().trim().min(5).max(100),
  benefitsIntro: z.string().trim().min(30).max(450),
  contactTitle: z.string().trim().min(5).max(100),
  contactDescription: z.string().trim().min(15).max(300),
}).strict();
export type HomeContent = z.infer<typeof homeContentSchema>;
export type HomePageRecord = { draft: HomeContent; published: HomeContent | null; version: number; updated_at: string | null };
export const defaultHomeContent: HomeContent = {
  heroTitle: "La ventilation,",
  heroAccent: "dans les règles du métier.",
  heroDescription: "Du logement collectif aux infrastructures d’envergure, MK Aération installe vos réseaux aérauliques, CTA et VMC. Une équipe de terrain, attentive à chaque détail de pose.",
  heroImage: "/images/annecy-panorama.webp",
  benefitsTitle: "Des gens de métier. Le goût du travail bien fait.",
  benefitsIntro: "Un passage à anticiper, une gaine à ajuster, un raccordement à soigner. La qualité d’une installation se joue dans les détails. Nous y prêtons attention à chaque chantier.",
  contactTitle: "Un besoin en ventilation ? Parlons-en simplement.",
  contactDescription: "Décrivez-nous votre chantier. Nous étudierons ensemble votre besoin et les contraintes de votre bâtiment.",
};
export function readHomeContent(value: unknown): HomeContent {
  const parsed = homeContentSchema.safeParse(value);
  return parsed.success ? parsed.data : defaultHomeContent;
}
