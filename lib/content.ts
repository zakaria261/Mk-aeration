export const company = {
  phone: "07 68 47 61 26",
  tel: "tel:+33768476126",
  email: "mk.aeration@hotmail.com",
  address: "2 route des Champs",
  city: "26140 Saint-Rambert-d’Albon",
  maps: "https://www.google.com/maps/search/?api=1&query=MK+Aeration+2+route+des+Champs+26140+Saint-Rambert-d%27Albon",
};

export const services = [
  {
    id: "reseaux",
    number: "01",
    title: "Réseaux aérauliques",
    short: "Gaines circulaires et rectangulaires.",
    description:
      "Nous réalisons la pose de gaines de ventilation et de réseaux aérauliques pour les bâtiments tertiaires, industriels et professionnels. Cheminements, changements de section, colonnes et raccordements : chaque élément est posé en tenant compte des contraintes du chantier.",
    image: "/images/grenoble-gaines-rectangulaires.webp",
    alt: "Gaines de ventilation rectangulaires posées à travers les réservations en toiture à Grenoble",
    details: [
      "Pose de gaines de ventilation circulaires et rectangulaires",
      "Réseaux de soufflage et d’extraction",
      "Colonnes aérauliques et traversées de niveaux",
      "Transitions, changements de section et raccordements",
    ],
  },
  {
    id: "vmc",
    number: "02",
    title: "CTA & VMC",
    short: "Traitement d’air et ventilation mécanique.",
    description:
      "Du raccordement d’une centrale de traitement d’air (CTA) à la pose de réseaux de ventilation mécanique contrôlée (VMC), nous réalisons les liaisons qui assurent le renouvellement de l’air. Notre savoir-faire comprend les installations double flux et les transitions entre gaines rectangulaires et circulaires.",
    image: "/images/legumerie-ventilation.webp",
    alt: "Raccordement d’une CTA double flux aux gaines circulaires dans une légumerie",
    details: [
      "Raccordement des centrales de traitement d’air — CTA",
      "Installation de VMC et réseaux double flux",
      "Liaisons entre équipements et réseaux aérauliques",
      "Adaptation des départs rectangulaires aux gaines circulaires",
    ],
  },
  {
    id: "extraction",
    number: "03",
    title: "Soufflage & extraction",
    short: "De la diffusion de l’air jusqu’au rejet.",
    description:
      "Pose de grilles de soufflage, réseaux d’extraction, hottes de cuisines professionnelles et rejets en toiture. Nous soignons l’intégration des éléments de diffusion et coordonnons leur pose avec les autres corps d’état, jusque dans les réservations de la chape.",
    image: "/images/yottacity-soufflage.webp",
    alt: "Grilles de soufflage au sol positionnées dans les réservations de la chape sur le chantier Yottacity",
    details: [
      "Grilles de soufflage et diffusion d’air",
      "Intégration des grilles au sol et préparation des finitions",
      "Hottes et réseaux d’extraction professionnels",
      "Rejets d’extracteurs et sorties en toiture",
    ],
  },
];

export type ProjectMedia = {
  src: string;
  alt: string;
  caption: string;
  kind: "chantier" | "projet" | "presentation";
  width: number;
  height: number;
};
export type Project = {
  slug: string;
  title: string;
  place: string;
  sector: string;
  category: string;
  image: string;
  alt: string;
  coverKind: ProjectMedia["kind"];
  imagePosition?: string;
  intro: string;
  description: string;
  scope: string[];
  media: ProjectMedia[];
};

export const projectMediaLabels: Record<ProjectMedia["kind"], string> = {
  chantier: "PHOTO DE CHANTIER",
  projet: "VUE DU PROJET",
  presentation: "VISUEL DE PRÉSENTATION",
};

export const projects: Project[] = [
  {
    slug: "forum-metropole-grenoble",
    title: "Forum de la Métropole",
    place: "Grenoble",
    sector: "Tertiaire",
    category: "Réseaux aérauliques",
    image: "/images/forum-grenoble-projet.webp",
    alt: "Vue architecturale du projet du Forum de la Métropole de Grenoble",
    coverKind: "projet",
    intro: "Des colonnes aérauliques à l’échelle du bâtiment.",
    description:
      "Fourniture et pose des systèmes de ventilation pour le projet du Forum de la Métropole de Grenoble. Les travaux présentés comprennent la mise en place de 13 colonnes circulaires et rectangulaires, du R+2 jusqu’à la terrasse, ainsi que la préparation des raccordements aux centrales de traitement d’air.",
    scope: [
      "Fourniture et pose des systèmes de ventilation",
      "13 colonnes circulaires et rectangulaires",
      "Passage des réseaux du R+2 à la terrasse",
      "Gaines de ventilation en toiture",
      "Préparation des raccordements aux CTA",
    ],
    media: [
      {
        src: "/images/forum-grenoble-chantier.webp",
        alt: "Façade du chantier Forum Grenoble et colonnes de ventilation en cours de pose à l’intérieur du bâtiment",
        caption:
          "Sur le chantier : façade, traversées de niveaux et colonnes aérauliques.",
        kind: "chantier",
        width: 1280,
        height: 1024,
      },
      {
        src: "/images/forum-grenoble-projet.webp",
        alt: "Vue architecturale du Forum de la Métropole de Grenoble",
        caption:
          "Vue architecturale du projet, fournie pour présenter le bâtiment.",
        kind: "projet",
        width: 1200,
        height: 899,
      },
      {
        src: "/images/grenoble-toiture.webp",
        alt: "Vue de la terrasse du chantier de Grenoble et des réservations des réseaux de ventilation",
        caption: "En toiture : les réservations et les passages des réseaux.",
        kind: "chantier",
        width: 800,
        height: 600,
      },
      {
        src: "/images/grenoble-gaines-circulaires.webp",
        alt: "Départs circulaires des gaines de ventilation au niveau de la toiture à Grenoble",
        caption: "Départs circulaires et traversées de paroi.",
        kind: "chantier",
        width: 800,
        height: 600,
      },
      {
        src: "/images/grenoble-raccordement.webp",
        alt: "Détail de deux gaines rectangulaires et de leurs raccordements sur le chantier de Grenoble",
        caption: "Détail de pose : gaines rectangulaires et raccordements.",
        kind: "chantier",
        width: 800,
        height: 576,
      },
      {
        src: "/images/grenoble-gaines-rectangulaires.webp",
        alt: "Gaines aérauliques rectangulaires installées à travers les réservations de la terrasse à Grenoble",
        caption:
          "Les gaines rectangulaires prennent place dans les réservations du bâtiment.",
        kind: "chantier",
        width: 800,
        height: 600,
      },
    ],
  },
  {
    slug: "htc-la-boisse",
    title: "HTC La Boisse",
    place: "La Boisse · Ain",
    sector: "Industrie",
    category: "Réseaux aérauliques",
    image: "/images/htc-la-boisse-reseaux.webp",
    alt: "Pose des gaines de ventilation circulaires sous la charpente sur le chantier HTC La Boisse",
    coverKind: "chantier",
    imagePosition: "50% 30%",
    intro: "Les réseaux prennent place sous la charpente.",
    description:
      "Sur le chantier HTC La Boisse, dans l’Ain, MK Aération intervient dans le cadre de la construction d’un entrepôt. Les photographies montrent la pose des gaines de ventilation circulaires sous la charpente métallique, les dérivations du réseau et les descentes verticales. Un travail de cheminement et de raccordement réalisé en coordination avec les autres corps de métier.",
    scope: [
      "Pose de gaines de ventilation circulaires",
      "Cheminement des réseaux sous charpente métallique",
      "Dérivations, coudes et descentes verticales",
      "Coordination des interventions sur le chantier",
    ],
    media: [
      {
        src: "/images/htc-la-boisse-reseaux.webp",
        alt: "L’équipe MK Aération intervient sous les réseaux aérauliques circulaires du chantier HTC La Boisse",
        caption: "Vue d’ensemble de la pose des gaines de ventilation sous la charpente métallique.",
        kind: "chantier",
        width: 1152,
        height: 1536,
      },
      {
        src: "/images/htc-la-boisse-descentes.webp",
        alt: "Descentes verticales et coudes des gaines circulaires à La Boisse",
        caption: "Descentes verticales et changements de direction du réseau aéraulique.",
        kind: "chantier",
        width: 1152,
        height: 1536,
      },
      {
        src: "/images/htc-la-boisse-derivations.webp",
        alt: "Dérivations du réseau de gaines circulaires dans les locaux du chantier HTC La Boisse",
        caption: "Les dérivations distribuent le réseau à travers les différents volumes du bâtiment.",
        kind: "chantier",
        width: 1152,
        height: 1536,
      },
      {
        src: "/images/htc-la-boisse-raccordements.webp",
        alt: "Détail des raccordements et du cheminement des conduits de ventilation à La Boisse",
        caption: "Détail des raccordements et du cheminement des gaines en partie haute.",
        kind: "chantier",
        width: 1152,
        height: 1536,
      },
      {
        src: "/images/htc-la-boisse-projet.webp",
        alt: "Perspective aérienne du programme industriel HTC La Boisse",
        caption:
          "Vue architecturale du programme HTC La Boisse. Visuel du projet fourni ; il ne s’agit pas d’une photographie des installations.",
        kind: "projet",
        width: 1550,
        height: 720,
      },
    ],
  },
  {
    slug: "tunnel-du-mont-blanc",
    title: "Tunnel du Mont-Blanc",
    place: "France · Italie",
    sector: "Infrastructures",
    category: "Ventilation & hydraulique",
    image: "/images/mont-blanc-presentation.webp",
    alt: "Visuel MK Aération présentant l’entrée du tunnel du Mont-Blanc dans un paysage alpin",
    coverKind: "presentation",
    intro: "Huit mois de travaux au cœur des Alpes.",
    description:
      "MK Aération a participé au chantier du tunnel du Mont-Blanc pendant huit mois. Notre intervention comprend la pose d’une gaine de ventilation de 1 000 × 1 000 mm pour l’amenée d’air d’un local électrique. Les équipes ont également installé des conduites PVC Ø125 pour la récupération des eaux de la cascade située au milieu du tunnel, avec un réseau distribué sur plus de 11,6 km à travers les zones techniques. Des interventions nocturnes et la préparation du supportage ont accompagné ces travaux entre la France et l’Italie.",
    scope: [
      "Amenée d’air d’un local électrique",
      "Gaine de ventilation de 1 000 × 1 000 mm",
      "Pose de conduites PVC Ø125 pour la récupération des eaux",
      "Réseau distribué sur plus de 11,6 km",
      "Supportage et interventions nocturnes",
    ],
    media: [
      {
        src: "/images/mont-blanc-presentation.webp",
        alt: "Entrée du tunnel du Mont-Blanc et montagnes, sur le visuel de présentation fourni par MK Aération",
        caption: "Tunnel du Mont-Blanc — visuel de présentation fourni par MK Aération.",
        kind: "presentation",
        width: 1461,
        height: 720,
      },
    ],
  },
  {
    slug: "yottacity",
    title: "Yottacity",
    place: "Grilles intégrées dans la chape",
    sector: "Soufflage au sol",
    category: "Soufflage",
    image: "/images/yottacity-soufflage.webp",
    alt: "Grilles de soufflage au sol posées dans les réservations sur le chantier Yottacity",
    coverKind: "chantier",
    imagePosition: "35% 65%",
    intro: "La précision se joue aussi au niveau du sol.",
    description:
      "Pose de grilles de soufflage au sol sur le chantier Yottacity. Les grilles sont intégrées dans les réservations de la chape afin de préparer une finition affleurante avec le carrelage. L’intervention est coordonnée avec le chapiste pour conserver l’espace nécessaire à la découpe et à la pose, avant la reprise de la chape autour des grilles.",
    scope: [
      "Pose de grilles de soufflage au sol",
      "Implantation dans les réservations de la chape",
      "Coordination avec le chapiste",
      "Préparation d’une finition affleurante au carrelage",
    ],
    media: [
      {
        src: "/images/yottacity-soufflage.webp",
        alt: "Vue des grilles de soufflage alignées le long du mur et intégrées dans les réservations de la chape à Yottacity",
        caption:
          "Sur le chantier Yottacity : implantation des grilles de soufflage avant la reprise de la chape.",
        kind: "chantier",
        width: 800,
        height: 1066,
      },
    ],
  },
  {
    slug: "fier-annecy",
    title: "FIER Annecy",
    place: "Annecy · Haute-Savoie",
    sector: "Traitement d’air",
    category: "CTA & double flux",
    image: "/images/annecy-cta.webp",
    alt: "Centrale de traitement d’air et réseaux aérauliques en toiture sur le chantier FIER à Annecy",
    coverKind: "chantier",
    intro: "La ventilation prend de la hauteur.",
    description:
      "Raccordement d’une centrale de traitement d’air double flux, avec des départs rectangulaires en toiture. Les gaines de ventilation relient la CTA aux réseaux aérauliques circulaires pour distribuer l’air dans le bâtiment.",
    scope: [
      "Raccordement CTA double flux",
      "Départs rectangulaires en toiture",
      "Gaines de ventilation circulaires",
    ],
    media: [
      {
        src: "/images/annecy-panorama.webp",
        alt: "Vue d’ensemble de la CTA double flux et des gaines de ventilation en toiture à Annecy",
        caption:
          "Vue d’ensemble des réseaux aérauliques et de la centrale double flux en toiture.",
        kind: "chantier",
        width: 1800,
        height: 1350,
      },
      {
        src: "/images/annecy-cta.webp",
        alt: "Détail des gaines circulaires et des raccordements à la CTA sur le chantier FIER Annecy",
        caption: "Raccordements et cheminement des gaines circulaires.",
        kind: "chantier",
        width: 1200,
        height: 1200,
      },
    ],
  },
  {
    slug: "legumerie-vourney",
    title: "Légumerie de Vourney",
    place: "Bâtiment professionnel",
    sector: "Double flux",
    category: "CTA & double flux",
    image: "/images/legumerie-ventilation.webp",
    alt: "Centrale double flux et gaines circulaires à la légumerie de Vourney",
    coverKind: "chantier",
    intro: "Du rectangulaire au circulaire.",
    description:
      "Raccordement d’une CTA double flux au sein de la légumerie. Le départ rectangulaire se transforme en réseau circulaire de diamètre 400 mm pour adapter les gaines de ventilation à la configuration du bâtiment.",
    scope: [
      "Raccordement CTA double flux",
      "Transition rectangulaire / circulaire",
      "Réseau circulaire Ø 400 mm",
    ],
    media: [
      {
        src: "/images/legumerie-ventilation.webp",
        alt: "CTA double flux raccordée aux gaines circulaires dans la légumerie de Vourney",
        caption:
          "Raccordement de la CTA et transition vers les gaines circulaires Ø 400 mm.",
        kind: "chantier",
        width: 1200,
        height: 1200,
      },
    ],
  },
  {
    slug: "plateforme-lidl",
    title: "Plateforme Lidl",
    place: "Plateforme logistique",
    sector: "Logistique",
    category: "Extraction",
    image: "/images/lidl-extraction.webp",
    alt: "Rejet d’extraction vertical en toiture sur la plateforme Lidl",
    coverKind: "chantier",
    intro: "Une extraction qui prend de la hauteur.",
    description:
      "Installation des rejets d’extracteurs en toiture de la plateforme logistique. Les réseaux d’extraction se prolongent par des sorties à trois mètres au-dessus du niveau de la toiture.",
    scope: [
      "Réseaux d’extraction",
      "Rejets des extracteurs en toiture",
      "Sorties à 3 mètres de hauteur",
    ],
    media: [
      {
        src: "/images/lidl-extraction.webp",
        alt: "Conduit métallique et rejet d’extraction de trois mètres en toiture sur la plateforme Lidl",
        caption: "Rejet du réseau d’extraction en toiture de la plateforme.",
        kind: "chantier",
        width: 922,
        height: 922,
      },
    ],
  },
];
export const faqs = [
  {
    q: "Dans quels départements intervenez-vous ?",
    a: "MK Aération est basée à Saint-Rambert-d’Albon, dans la Drôme. Nous intervenons dans la Drôme (26), l’Isère (38), le Rhône (69) et la Haute-Savoie (74). Indiquez la commune de votre chantier dans votre demande pour que nous puissions étudier votre projet.",
  },
  {
    q: "Quels travaux aérauliques pouvez-vous réaliser ?",
    a: "Nous réalisons la pose de gaines de ventilation et de réseaux aérauliques circulaires et rectangulaires, les réseaux de soufflage et d’extraction, le raccordement de CTA et l’installation de VMC. Nous intervenons aussi sur les grilles de soufflage, les hottes professionnelles et les rejets en toiture.",
  },
  {
    q: "Que faut-il prévoir pour une demande de devis ?",
    a: "Une description de votre besoin, la commune du chantier et vos coordonnées suffisent pour commencer. Si vous disposez de plans, vous pourrez nous les transmettre par e-mail après le premier échange.",
  },
  {
    q: "Sur quels types de bâtiments travaillez-vous ?",
    a: "Nos références comprennent des bâtiments tertiaires, des bâtiments industriels, des locaux professionnels et des plateformes logistiques. Nos interventions couvrent aussi les cuisines professionnelles et les projets de ventilation des particuliers.",
  },
];
