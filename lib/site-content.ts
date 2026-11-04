import { z } from "zod";
import { company, services, projects, type Project } from "./content.ts";
import { homePhotos } from "./home-content.ts";

export const staticImages = [
  ...new Set([
    ...homePhotos.map((p) => p.src),
    ...services.map((s) => s.image),
    ...projects.map((p) => p.image),
    ...projects.flatMap((p) => p.media.map((m) => m.src)),
    "/brand/lockup.webp",
    "/brand/emblem.webp",
  ]),
];
export const imageSchema = z
  .object({
    src: z
      .string()
      .refine(
        (s) => staticImages.includes(s) || /^\/media\/[a-f0-9-]{36}$/.test(s),
        "Choisissez une image de la médiathèque.",
      ),
    alt: z.string().trim().min(3).max(220),
    width: z.number().int().positive().max(10000),
    height: z.number().int().positive().max(10000),
  })
  .strict();
const text = (max: number) => z.string().trim().min(3).max(max);
const page = z.object({ title: text(110), description: text(500) }).strict();
export const sectionKeys = [
  "proof",
  "flagship",
  "services",
  "projects",
  "about",
  "news",
  "faq",
  "contact",
] as const;
export const siteContentSchema = z
  .object({
    company: z
      .object({
        legalName: z
          .string()
          .trim()
          .min(3)
          .max(180)
          .default("Murat KAYA — MK AÉRATION"),
        legalForm: z
          .string()
          .trim()
          .min(3)
          .max(100)
          .default("Entrepreneur individuel"),
        siren: z
          .string()
          .regex(/^\d{9}$/)
          .default("907692313"),
        siret: z
          .string()
          .regex(/^\d{14}$/)
          .default("90769231300014"),
        vat: z
          .string()
          .regex(/^FR[A-Z0-9]{2}\d{9}$/)
          .default("FR25907692313"),
        publisher: z.string().trim().min(3).max(100).default("Murat KAYA"),
        phone: z
          .string()
          .regex(
            /^(?:\+33|0033|0)[1-9](?:[ .-]?\d{2}){4}$/,
            "Numéro français invalide.",
          ),
        email: z.string().email().max(200),
        address: text(200),
        city: text(160),
        hours: z.string().trim().max(300),
        areas: z.array(text(80)).min(1).max(12),
        socials: z
          .array(
            z
              .object({
                label: text(40),
                url: z
                  .string()
                  .url()
                  .refine((s) => s.startsWith("https://")),
              })
              .strict(),
          )
          .max(5),
      })
      .strict(),
    logo: imageSchema,
    home: z
      .object({
        heroImage: imageSchema.nullable().default(null),
        primaryLabel: text(40),
        secondaryLabel: text(50),
        sections: z
          .array(z.enum(sectionKeys))
          .min(2)
          .max(8)
          .refine(
            (a) =>
              new Set(a).size === a.length &&
              a.includes("contact") &&
              a.includes("services"),
            "Conservez les prestations et le contact, sans doublon.",
          ),
      })
      .strict(),
    pages: z
      .object({
        expertises: page,
        realisations: page,
        entreprise: page,
        actualites: page,
        contact: page,
      })
      .strict(),
    services: z
      .array(
        z
          .object({
            id: z.string().regex(/^[a-z][a-z0-9-]{1,59}$/),
            title: text(80),
            short: text(150),
            description: text(1600),
            details: z.array(text(220)).max(10),
            image: imageSchema,
            published: z.boolean(),
          })
          .strict(),
      )
      .min(1)
      .max(12)
      .refine(
        (a) => new Set(a.map((s) => s.id)).size === a.length,
        "Identifiants de prestations en double.",
      ),
    credibility: z
      .array(
        z
          .object({
            value: z.string().trim().min(1).max(25),
            label: text(120),
            evidence: z.string().trim().max(500),
            confirmed: z.boolean(),
            published: z.boolean(),
          })
          .strict(),
      )
      .max(8),
    credentials: z
      .array(
        z
          .object({
            title: text(120),
            source: z.string().trim().max(500),
            confirmed: z.boolean(),
            published: z.boolean(),
          })
          .strict(),
      )
      .max(10),
    projectEdits: z
      .array(
        z
          .object({
            slug: z.string().refine((v) => projects.some((p) => p.slug === v)),
            title: text(110),
            description: text(2400),
            image: imageSchema,
            published: z.boolean(),
          })
          .strict(),
      )
      .max(30)
      .refine((a) => new Set(a.map((p) => p.slug)).size === a.length),
    testimonials: z
      .array(
        z
          .object({
            quote: text(700),
            author: text(100),
            source: z.string().trim().max(500),
            authorized: z.boolean(),
            published: z.boolean(),
          })
          .strict(),
      )
      .max(10),
  })
  .strict();
export type SiteContent = z.infer<typeof siteContentSchema>;
export type SiteCompany = SiteContent["company"] & {
  tel: string;
  maps: string;
};
export type SiteRecord = {
  draft: SiteContent;
  published: SiteContent | null;
  version: number;
  updatedAt: string | null;
};
export function companyLinks(c: SiteContent["company"]): SiteCompany {
  return {
    ...c,
    tel: `tel:${c.phone.replace(/[ .-]/g, "")}`,
    maps: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${c.address} ${c.city}`)}`,
  };
}
export const defaultSiteContent: SiteContent = {
  company: {
    legalName: "Murat KAYA — MK AÉRATION",
    legalForm: "Entrepreneur individuel",
    siren: "907692313",
    siret: "90769231300014",
    vat: "FR25907692313",
    publisher: "Murat KAYA",
    phone: company.phone,
    email: company.email,
    address: company.address,
    city: company.city,
    hours: "",
    areas: ["Drôme", "Isère", "Rhône", "Haute-Savoie"],
    socials: [],
  },
  logo: {
    src: "/brand/lockup.webp",
    alt: "MK Aération",
    width: 552,
    height: 168,
  },
  home: {
    heroImage: null,
    primaryLabel: "Demander un devis",
    secondaryLabel: "Voir les réalisations",
    sections: [
      "about",
      "proof",
      "flagship",
      "projects",
      "services",
      "news",
      "faq",
      "contact",
    ],
  },
  pages: {
    expertises: {
      title: "Installation de ventilation",
      description:
        "Réseaux aérauliques, CTA, VMC, soufflage et extraction : découvrez nos prestations et les contraintes de pose que nous prenons en compte.",
    },
    realisations: {
      title: "Nos chantiers en images",
      description:
        "Ventilation de bâtiments tertiaires, installations industrielles et réhabilitation de logements collectifs. Découvrez nos interventions.",
    },
    entreprise: {
      title: "La maîtrise de l’air depuis 2021",
      description:
        "Concevoir, fournir et réaliser des installations de ventilation adaptées aux exigences de chaque projet : le savoir-faire MK Aération au service des professionnels.",
    },
    actualites: {
      title: "Le carnet de chantier",
      description:
        "Avancement des travaux et nouvelles de l’équipe, publiés directement depuis le terrain.",
    },
    contact: {
      title: "Parlons de votre chantier",
      description:
        "Décrivez votre besoin en quelques lignes. Nous vous recontacterons à partir des coordonnées indiquées.",
    },
  },
  services: services.map((s) => ({
    id: s.id,
    title: s.title,
    short: s.short,
    description: s.description,
    details: s.details,
    image: { src: s.image, alt: s.alt, width: 800, height: 600 },
    published: true,
  })),
  credibility: [
    {
      value: "2021",
      label: "création de MK Aération",
      evidence:
        "API Recherche d’entreprises / SIRENE : https://recherche-entreprises.api.gouv.fr/search?q=907692313 — création le 02/11/2021",
      confirmed: true,
      published: true,
    },
    {
      value: "8 mois",
      label: "au tunnel du Mont-Blanc",
      evidence:
        "/realisations/tunnel-du-mont-blanc — intervention documentée par MK Aération",
      confirmed: true,
      published: true,
    },
    {
      value: "21",
      label: "appartements en réhabilitation VMC",
      evidence: "/realisations/rehabilitation-vmc-21-appartements",
      confirmed: true,
      published: true,
    },
    {
      value: "4",
      label: "départements d’intervention",
      evidence:
        "Drôme, Isère, Rhône et Haute-Savoie : périmètre déclaré par l’entreprise.",
      confirmed: true,
      published: true,
    },
  ],
  credentials: [],
  testimonials: [],
  projectEdits: [],
};
export function publicationProblems(c: SiteContent): string[] {
  const issues: string[] = [];
  if (!c.services.some((s) => s.published))
    issues.push("Publiez au moins une prestation.");
  if (
    c.credibility.some(
      (s) => s.published && (!s.confirmed || s.evidence.length < 8),
    )
  )
    issues.push(
      "Chaque chiffre publié doit être confirmé et accompagné de sa source.",
    );
  if (
    c.credentials.some(
      (s) => s.published && (!s.confirmed || s.source.length < 8),
    )
  )
    issues.push(
      "Chaque qualification publiée doit être confirmée et documentée.",
    );
  if (
    c.testimonials.some(
      (s) => s.published && (!s.authorized || s.source.length < 8),
    )
  )
    issues.push(
      "Chaque témoignage publié exige une autorisation et une source.",
    );
  return issues;
}
export function publishedMedia(c: SiteContent): string[] {
  return [
    ...new Set(
      [
        c.logo,
        ...(c.home.heroImage ? [c.home.heroImage] : []),
        ...c.services.filter((s) => s.published).map((s) => s.image),
        ...c.projectEdits.filter((p) => p.published).map((p) => p.image),
      ]
        .map((i) => i.src)
        .filter((s) => s.startsWith("/media/"))
        .map((s) => s.slice(7)),
    ),
  ];
}
/** Retire les contenus masqués et les justificatifs privés avant toute sérialisation publique. */
export function publicSnapshot(c: SiteContent): SiteContent {
  return {
    ...c,
    projectEdits: c.projectEdits.map((p) =>
      p.published
        ? { ...p }
        : {
            slug: p.slug,
            title: "Fiche masquée",
            description: "Fiche masquée",
            image: defaultSiteContent.logo,
            published: false,
          },
    ),
    services: c.services.filter((s) => s.published),
    credibility: c.credibility
      .filter((v) => v.published && v.confirmed)
      .map((v) => ({ ...v, evidence: "" })),
    credentials: c.credentials
      .filter((v) => v.published && v.confirmed)
      .map((v) => ({ ...v, source: "" })),
    testimonials: c.testimonials
      .filter((v) => v.published && v.authorized)
      .map((v) => ({ ...v, source: "" })),
  };
}

export function historicalEdit(
  p: Project,
): SiteContent["projectEdits"][number] {
  return {
    slug: p.slug,
    title: p.title,
    description: p.description,
    image: {
      src: p.image,
      alt: p.alt,
      width: p.imageWidth || p.media[0]?.width || p.video?.width || 900,
      height: p.imageHeight || p.media[0]?.height || p.video?.height || 900,
    },
    published: true,
  };
}
