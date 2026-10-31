import { z } from "zod";
export const serviceNames: Record<string, string> = {
  reseaux: "Réseaux de ventilation",
  vmc: "VMC & double flux",
  extraction: "Extraction professionnelle",
  autre: "Un autre besoin",
};
export const quoteSchema = z.object({
  id: z.string().uuid(),
  service: z.enum(["reseaux", "vmc", "extraction", "autre"]),
  profile: z.enum(["Professionnel", "Particulier"]),
  city: z.string().trim().min(2, "Indiquez la commune du chantier.").max(100),
  postcode: z
    .string()
    .regex(/^\d{5}$/, "Indiquez un code postal à 5 chiffres."),
  timing: z.enum([
    "Dès que possible",
    "Dans les 3 mois",
    "Dans les 6 mois",
    "Projet à définir",
  ]),
  description: z
    .string()
    .trim()
    .min(20, "Décrivez votre projet en 20 caractères minimum.")
    .max(3000),
  name: z.string().trim().min(2, "Indiquez votre nom.").max(100),
  company: z.string().trim().max(150).default(""),
  email: z.string().trim().email("Vérifiez votre adresse e-mail.").max(200),
  phone: z
    .string()
    .trim()
    .min(10, "Vérifiez votre numéro de téléphone.")
    .max(22)
    .refine(
      (v) => /^(?:\+33|0033|0)[1-9](?:[ .-]?\d{2}){4}$/.test(v),
      "Indiquez un numéro français valide.",
    ),
  consent: z.literal(true, {
    errorMap: () => ({
      message: "Votre accord est nécessaire pour traiter la demande.",
    }),
  }),
  website: z.string().max(0).default(""),
  startedAt: z.number().int().positive(),
});
export type QuoteInput = z.infer<typeof quoteSchema>;
