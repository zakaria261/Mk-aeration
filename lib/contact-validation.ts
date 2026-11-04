import { z } from "zod";
export const contactSchema = z
  .object({
    id: z.string().uuid(),
    name: z.string().trim().min(2, "Indiquez votre nom.").max(100),
    email: z.string().trim().email("Vérifiez votre e-mail.").max(200),
    phone: z
      .string()
      .trim()
      .max(22)
      .refine(
        (v) => !v || /^(?:\+33|0033|0)[1-9](?:[ .-]?\d{2}){4}$/.test(v),
        "Vérifiez votre téléphone.",
      ),
    message: z
      .string()
      .trim()
      .min(20, "Décrivez votre projet en au moins 20 caractères.")
      .max(2000),
    consent: z.literal(true),
    website: z.string().max(0),
    startedAt: z.number().int().positive(),
  })
  .strict();
